/* WinBliss² — a small PDF reader for drawn pages (2026-11-26).
   Reads what a page DRAWS — lines, curves and filled shapes — not its text:
   enough for PDFs where everything is drawn, like BlissOnline's (where even
   the words are outlines). No library: the browser (and Node) inflates the
   compressed streams itself (DecompressionStream), the rest is plain parsing.
     wbPdf.read(bytes) -> Promise<[{ width, height, items: [
       { paint: 'fill' | 'stroke', color: [r, g, b], lineWidth, subpaths: [[[x, y], …], …] } ] }]>
   Coordinates are the page's, in points, y upwards; curves are flattened to
   short lines. Text operators are skipped (there is no text in such PDFs). */
'use strict';
const wbPdf = (() => {
  const latin1 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return s; };

  async function inflate(bytes) {
    const ds = new DecompressionStream('deflate');
    const out = new Response(new Blob([bytes]).stream().pipeThrough(ds));
    return new Uint8Array(await out.arrayBuffer());
  }

  /* ---- objects: a tokenizer for dictionaries, arrays, names, numbers, references ---- */
  function lexer(s, i = 0) {
    const WS = /[\0\t\n\f\r ]/, DELIM = /[()<>\[\]{}\/%]/;
    function skip() {
      for (;;) {
        while (i < s.length && WS.test(s[i])) i++;
        if (s[i] === '%') { while (i < s.length && s[i] !== '\n' && s[i] !== '\r') i++; continue; }
        return;
      }
    }
    function next() {
      skip();
      if (i >= s.length) return null;
      const c = s[i];
      if (c === '<' && s[i + 1] === '<') { i += 2; return { t: '<<' }; }
      if (c === '>' && s[i + 1] === '>') { i += 2; return { t: '>>' }; }
      if (c === '[' || c === ']' || c === '{' || c === '}') { i++; return { t: c }; }
      if (c === '/') {
        let j = i + 1; while (j < s.length && !WS.test(s[j]) && !DELIM.test(s[j])) j++;
        const v = s.slice(i + 1, j).replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
        i = j; return { t: 'name', v };
      }
      if (c === '(') {
        let depth = 1, j = i + 1, out = '';
        while (j < s.length && depth) {
          const d = s[j];
          if (d === '\\') { out += s[j + 1] || ''; j += 2; continue; }
          if (d === '(') depth++; else if (d === ')') { depth--; if (!depth) break; }
          out += d; j++;
        }
        i = j + 1; return { t: 'str', v: out };
      }
      if (c === '<') { const j = s.indexOf('>', i); const v = s.slice(i + 1, j); i = j + 1; return { t: 'hex', v }; }
      let j = i; while (j < s.length && !WS.test(s[j]) && !DELIM.test(s[j])) j++;
      if (j === i) { i++; return { t: 'op', v: c }; }
      const w = s.slice(i, j); i = j;
      if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(w)) return { t: 'num', v: parseFloat(w) };
      return { t: 'op', v: w };
    }
    return { next, get pos() { return i; }, set pos(p) { i = p; } };
  }
  // one value: numbers followed by "g R" become references
  function value(lx, tok) {
    tok = tok || lx.next();
    if (!tok) return null;
    if (tok.t === '<<') {
      const d = {};
      for (;;) {
        const k = lx.next();
        if (!k || k.t === '>>') return d;
        d[k.v] = value(lx);
      }
    }
    if (tok.t === '[') {
      const a = [];
      for (;;) {
        const t = lx.next();
        if (!t || t.t === ']') return a;
        a.push(value(lx, t));
      }
    }
    if (tok.t === 'num') {
      const save = lx.pos, t2 = lx.next(), t3 = t2 && t2.t === 'num' ? lx.next() : null;
      if (t2 && t2.t === 'num' && t3 && t3.t === 'op' && t3.v === 'R') return { ref: tok.v };
      lx.pos = save;
      return tok.v;
    }
    if (tok.t === 'name') return { name: tok.v };
    if (tok.t === 'op') return tok.v === 'true' ? true : tok.v === 'false' ? false : tok.v === 'null' ? null : { op: tok.v };
    return tok.v;
  }

  function objects(s) {
    const objs = new Map();
    const re = /(\d+)\s+(\d+)\s+obj\b/g;
    let m;
    while ((m = re.exec(s))) {
      const lx = lexer(s, re.lastIndex);
      const v = value(lx);
      const after = lx.pos;
      let stream = null;
      const sm = /^\s*stream\r?\n/.exec(s.slice(after, after + 20));
      if (sm && v && typeof v === 'object') stream = { start: after + sm[0].length };
      objs.set(+m[1], { v, stream });
      if (stream) re.lastIndex = stream.start;
    }
    return objs;
  }

  async function read(bytes) {
    if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
    const s = latin1(bytes);
    if (!s.startsWith('%PDF')) throw new Error('not a PDF');
    const objs = objects(s);
    const get = (x) => (x && typeof x === 'object' && 'ref' in x ? (objs.get(x.ref) || {}).v : x);
    const streamCache = new Map();
    async function streamOf(id) {
      if (streamCache.has(id)) return streamCache.get(id);
      const o = objs.get(id);
      let len = get(o.v.Length);
      if (typeof len !== 'number') len = s.indexOf('endstream', o.stream.start) - o.stream.start;
      let data = bytes.subarray(o.stream.start, o.stream.start + len);
      const f = get(o.v.Filter);
      const filters = Array.isArray(f) ? f.map(x => x.name) : f ? [f.name] : [];
      for (const name of filters) {
        if (name === 'FlateDecode') data = await inflate(data);
        else throw new Error('unsupported PDF filter: ' + name);
      }
      const text = latin1(data);
      streamCache.set(id, text);
      return text;
    }
    // the pages, in order
    const trailerRoot = (() => {
      for (const [, o] of objs) if (o.v && o.v.Type && o.v.Type.name === 'Catalog') return o.v;
      return null;
    })();
    const pageList = [];
    (function walk(node) {
      node = get(node);
      if (!node) return;
      if (node.Type && node.Type.name === 'Pages') for (const k of get(node.Kids) || []) walk(k);
      else if (node.Type && node.Type.name === 'Page') pageList.push(node);
    })(trailerRoot ? trailerRoot.Pages : null);

    const out = [];
    for (const page of pageList) {
      const box = get(page.MediaBox) || [0, 0, 595, 842];
      const items = [];
      const contents = get(page.Contents);
      const ids = Array.isArray(contents) ? contents.map(c => c.ref) : [page.Contents && page.Contents.ref];
      let text = '';
      for (const id of ids) if (id != null) text += (await streamOf(id)) + '\n';
      await run(text, get(page.Resources) || {}, [1, 0, 0, 1, 0, 0], items, 0);
      out.push({ width: box[2] - box[0], height: box[3] - box[1], items });
    }
    return out;

    /* ---- the drawing: the path operators with the current matrix ---- */
    async function run(src, res, ctm0, items, depth) {
      if (depth > 8) return;
      const lx = lexer(src);
      const stack = [];
      let gs = { ctm: ctm0.slice(), fill: [0, 0, 0], stroke: [0, 0, 0], lw: 1 };
      const saved = [];
      let path = [], cur = null, start = null;
      const tf = (x, y) => { const m = gs.ctm; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; };
      const scale = () => Math.sqrt(Math.abs(gs.ctm[0] * gs.ctm[3] - gs.ctm[1] * gs.ctm[2]));
      const sub = () => path[path.length - 1];
      const bez = (p0, p1, p2, p3) => {
        const n = 8;
        for (let k = 1; k <= n; k++) {
          const t = k / n, u = 1 - t;
          sub().push(tf(u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
                        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]));
        }
      };
      const paint = (kind) => {
        const subs = path.filter(p => p.length > 1);
        if (subs.length) {
          if (kind === 'fill' || kind === 'both') items.push({ paint: 'fill', color: gs.fill.slice(), lineWidth: 0, subpaths: subs });
          if (kind === 'stroke' || kind === 'both') items.push({ paint: 'stroke', color: gs.stroke.slice(), lineWidth: gs.lw * scale(), subpaths: subs });
        }
        path = []; cur = null;
      };
      const nums = (n) => stack.splice(-n).map(Number);
      for (let tok = lx.next(); tok; tok = lx.next()) {
        if (tok.t !== 'op') {
          if (tok.t === '[' ) stack.push(value(lx, tok)); else if (tok.t === '<<') stack.push(value(lx, tok));
          else stack.push(tok.t === 'name' ? { name: tok.v } : tok.v);
          continue;
        }
        const op = tok.v;
        switch (op) {
          case 'q': saved.push({ ...gs, ctm: gs.ctm.slice() }); break;
          case 'Q': if (saved.length) gs = saved.pop(); break;
          case 'cm': {
            const [a, b, c, d, e, f] = nums(6), m = gs.ctm;
            gs.ctm = [a * m[0] + b * m[2], a * m[1] + b * m[3], c * m[0] + d * m[2], c * m[1] + d * m[3], e * m[0] + f * m[2] + m[4], e * m[1] + f * m[3] + m[5]];
            break;
          }
          case 'm': { const [x, y] = nums(2); cur = [x, y]; start = cur; path.push([tf(x, y)]); break; }
          case 'l': { const [x, y] = nums(2); if (!sub()) path.push([tf(...(cur || [x, y]))]); cur = [x, y]; sub().push(tf(x, y)); break; }
          case 'c': { const [x1, y1, x2, y2, x3, y3] = nums(6); if (!sub()) path.push([tf(...cur)]); bez(cur, [x1, y1], [x2, y2], [x3, y3]); cur = [x3, y3]; break; }
          case 'v': { const [x2, y2, x3, y3] = nums(4); if (!sub()) path.push([tf(...cur)]); bez(cur, cur, [x2, y2], [x3, y3]); cur = [x3, y3]; break; }
          case 'y': { const [x1, y1, x3, y3] = nums(4); if (!sub()) path.push([tf(...cur)]); bez(cur, [x1, y1], [x3, y3], [x3, y3]); cur = [x3, y3]; break; }
          case 'h': if (sub() && start) { sub().push(tf(...start)); cur = start; } break;
          case 're': {
            const [x, y, w, h] = nums(4);
            path.push([tf(x, y), tf(x + w, y), tf(x + w, y + h), tf(x, y + h), tf(x, y)]);
            cur = start = [x, y];
            break;
          }
          case 'f': case 'F': case 'f*': paint('fill'); break;
          case 'S': paint('stroke'); break;
          case 's': if (sub() && start) sub().push(tf(...start)); paint('stroke'); break;
          case 'B': case 'B*': paint('both'); break;
          case 'b': case 'b*': if (sub() && start) sub().push(tf(...start)); paint('both'); break;
          case 'n': path = []; cur = null; break;
          case 'W': case 'W*': break;                       // clipping: ignored
          case 'w': gs.lw = nums(1)[0]; break;
          case 'g': { const [v] = nums(1); gs.fill = [v, v, v]; break; }
          case 'G': { const [v] = nums(1); gs.stroke = [v, v, v]; break; }
          case 'rg': gs.fill = nums(3); break;
          case 'RG': gs.stroke = nums(3); break;
          case 'k': { const [c, m, y, k] = nums(4); gs.fill = [(1 - c) * (1 - k), (1 - m) * (1 - k), (1 - y) * (1 - k)]; break; }
          case 'K': { const [c, m, y, k] = nums(4); gs.stroke = [(1 - c) * (1 - k), (1 - m) * (1 - k), (1 - y) * (1 - k)]; break; }
          case 'sc': case 'scn': { const v = stack.filter(x => typeof x === 'number'); if (v.length === 3) gs.fill = v; else if (v.length === 1) gs.fill = [v[0], v[0], v[0]]; break; }
          case 'SC': case 'SCN': { const v = stack.filter(x => typeof x === 'number'); if (v.length === 3) gs.stroke = v; else if (v.length === 1) gs.stroke = [v[0], v[0], v[0]]; break; }
          case 'Do': {
            const n = stack.pop();
            const xo = get((get(res.XObject) || {})[n && n.name]);
            const ref = (get(res.XObject) || {})[n && n.name];
            if (xo && xo.Subtype && xo.Subtype.name === 'Form' && ref && ref.ref != null) {
              const m = get(xo.Matrix) || [1, 0, 0, 1, 0, 0], c = gs.ctm;
              const ctm = [m[0] * c[0] + m[1] * c[2], m[0] * c[1] + m[1] * c[3], m[2] * c[0] + m[3] * c[2], m[2] * c[1] + m[3] * c[3],
                m[4] * c[0] + m[5] * c[2] + c[4], m[4] * c[1] + m[5] * c[3] + c[5]];
              await run(await streamOf(ref.ref), get(xo.Resources) || res, ctm, items, depth + 1);
            }
            break;
          }
          default: break;                                    // text, images, shading: not in drawn pages
        }
        stack.length = 0;
      }
    }
  }
  return { read };
})();
if (typeof window !== 'undefined') window.wbPdf = wbPdf;
if (typeof module !== 'undefined') module.exports = wbPdf;
