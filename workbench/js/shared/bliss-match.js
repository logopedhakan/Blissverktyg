/* WinBliss² — which Bliss symbol is this drawing? (2026-11-26)
   For drawings that are already in the engine's own units (x right, y down,
   sky = 8, earth = 16), like a symbol read from a BlissOnline PDF. Every
   BCI-AV symbol is drawn by the engine and turned into points; a drawing is
   compared with the ones of about its size: how far its points lie from the
   symbol's lines, and the symbol's from its (both ways, in Bliss units).
   Indicators above a symbol are found on their own.
     wbBlissMatch.match(strokes, { prefer: [ids] }) ->
       { id, ind: ['past_action', …], score, sure } */
'use strict';
const wbBlissMatch = (() => {
  const STEP = 0.2;                                   // points along the lines, in Bliss units
  /* ---- the engine's drawing as points ---- */
  function arcPoints(x1, y1, rx, ry, phi, fa, fs, x2, y2, out) {
    // SVG arc, endpoint form -> centre form (SVG spec F.6.5)
    if (!rx || !ry) { line(x1, y1, x2, y2, out); return; }
    rx = Math.abs(rx); ry = Math.abs(ry);
    const c = Math.cos(phi), s = Math.sin(phi);
    const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
    const xp = c * dx + s * dy, yp = -s * dx + c * dy;
    const lam = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
    if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
    const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
    let k = Math.sqrt(Math.max(0, num / (rx * rx * yp * yp + ry * ry * xp * xp)));
    if (fa === fs) k = -k;
    const cxp = k * rx * yp / ry, cyp = -k * ry * xp / rx;
    const cx = c * cxp - s * cyp + (x1 + x2) / 2, cy = s * cxp + c * cyp + (y1 + y2) / 2;
    const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    const t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry);
    let dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry);
    if (!fs && dt > 0) dt -= 2 * Math.PI; else if (fs && dt < 0) dt += 2 * Math.PI;
    const n = Math.max(2, Math.ceil(Math.abs(dt) * Math.max(rx, ry) / STEP));
    for (let i = 0; i <= n; i++) {
      const t = t1 + dt * i / n;
      out.push([cx + rx * Math.cos(t) * c - ry * Math.sin(t) * s, cy + rx * Math.cos(t) * s + ry * Math.sin(t) * c]);
    }
  }
  function line(x1, y1, x2, y2, out) {
    const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / STEP));
    for (let i = 0; i <= n; i++) out.push([x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n]);
  }
  /** The points of a symbol as the engine draws it (its body, 100 per unit). */
  function engineSampled(body) {
    const out = [];
    for (const m of body.matchAll(/<path[^>]*\sd="([^"]*)"/g)) {
      const tok = m[1].match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
      let i = 0, cx = 0, cy = 0, cmd = '';
      const num = () => parseFloat(tok[i++]) / 100;
      while (i < tok.length) {
        if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
        if (cmd === 'M') { cx = num(); cy = num(); out.push([cx, cy]); cmd = 'L'; }
        else if (cmd === 'L') { const x = num(), y = num(); line(cx, cy, x, y, out); cx = x; cy = y; }
        else if (cmd === 'A') {
          const rx = num(), ry = num(); const phi = parseFloat(tok[i++]) * Math.PI / 180, fa = +tok[i++], fs = +tok[i++];
          const x = num(), y = num(); arcPoints(cx, cy, rx, ry, phi, fa, fs, x, y, out); cx = x; cy = y;
        } else i++;                                   // a command the engine does not use
      }
    }
    for (const m of body.matchAll(/<ellipse([^>]*)>/g)) {
      const a = (k) => { const r = new RegExp('\\s' + k + '="([^"]*)"').exec(m[1]); return r ? parseFloat(r[1]) / 100 : 0; };
      const cx = a('cx'), cy = a('cy'), rx = a('rx'), ry = a('ry');
      if (rx < 0.6 && ry < 0.6) { out.push([cx, cy]); continue; }   // a dot
      const n = Math.max(8, Math.ceil(2 * Math.PI * Math.max(rx, ry) / STEP));
      for (let k = 0; k <= n; k++) out.push([cx + rx * Math.cos(2 * Math.PI * k / n), cy + ry * Math.sin(2 * Math.PI * k / n)]);
    }
    return out;
  }
  function resampleStrokes(strokes) {
    const out = [];
    for (const s of strokes) {
      if (s.length === 1) { out.push(s[0]); continue; }
      for (let i = 1; i < s.length; i++) line(s[i - 1][0], s[i - 1][1], s[i][0], s[i][1], out);
    }
    return out;
  }
  function box(pts) {
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (const [x, y] of pts) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > d) d = y; }
    return { x0: a, y0: b, x1: c, y1: d, w: c - a, h: d - b };
  }
  const leftAlign = (pts, b) => pts.map(([x, y]) => [x - b.x0, y]);

  /* ---- all of BCI-AV, once ---- */
  // a rough picture of the points: one bit per Bliss unit square (rows 0–23, columns 0–31),
  // and the same grown by one square — to pick the few worth comparing closely
  function mask(pts) {
    const m = new Uint32Array(24);
    for (const [x, y] of pts) {
      const cx = Math.max(0, Math.min(31, Math.floor(x))), cy = Math.max(0, Math.min(23, Math.floor(y)));
      m[cy] |= (1 << cx) >>> 0;
    }
    const g = new Uint32Array(24);
    for (let r = 0; r < 24; r++) {
      const row = m[r] | (m[r] << 1) | (m[r] >>> 1);
      g[r] |= row; if (r) g[r - 1] |= row; if (r < 23) g[r + 1] |= row;
    }
    return { m, g };
  }
  const bits = (v) => { v -= (v >>> 1) & 0x55555555; v = (v & 0x33333333) + ((v >>> 2) & 0x33333333); return (((v + (v >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24; };
  function rough(a, b) {
    let hit = 0, n = 0;
    for (let r = 0; r < 24; r++) { hit += bits(a.m[r] & b.g[r]) + bits(b.m[r] & a.g[r]); n += bits(a.m[r]) + bits(b.m[r]); }
    return n ? hit / n : 0;
  }
  function entryOf(id, n, body, extra) {
    const raw = engineSampled(body);
    if (!raw.length) return null;
    const b = box(raw), pts = leftAlign(raw, b);
    return Object.assign({ id, n, pts, b, mk: mask(pts) }, extra);
  }
  // the indicator parts of a symbol, as Skriv knows them (an indicator's shape at the indicator height)
  function indicatorSigs(data) {
    const sigs = new Set();
    for (const sy of data) if (/^indicator_\(/.test(sy.n || '')) for (const e of sy.e || []) sigs.add(e[0] + e[1]);
    return sigs;
  }
  let INDEX = null;
  function index() {
    if (INDEX) return INDEX;
    INDEX = { all: [], ind: [] };
    const data = typeof BLISS_DATA !== 'undefined' ? BLISS_DATA : [];
    const sigs = indicatorSigs(data);
    const isInd = (e) => sigs.has(e[0] + e[1]) && (e[5] === 4 || (e[5] === 0 && e[0] + e[1] !== 'W1'));
    for (const sy of data) {
      if (!sy.e || !sy.e.length || /\(OLD\)|_\(OLD/.test(sy.n || '')) continue;
      const m = (sy.n || '').match(/^indicator_\(([^)]+)\)(.*)$/);
      let body; try { body = renderBliss(sy).body; } catch (_) { continue; }
      if (m) { const en = !/OLD/.test(m[2]) && entryOf(sy.id, sy.n, body, { key: m[1] }); if (en) INDEX.ind.push(en); continue; }
      const en = entryOf(sy.id, sy.n, body, {});
      if (en) INDEX.all.push(en);
      // a verb carries its action indicator; BlissOnline draws the tense's in its place:
      // the symbol without it is matched too (and still means this symbol)
      const rest = sy.e.filter(e => !isInd(e));
      if (rest.length && rest.length < sy.e.length) {
        let b2; try { b2 = renderBliss(Object.assign({}, sy, { e: rest })).body; } catch (_) { b2 = null; }
        const en2 = b2 && entryOf(sy.id, sy.n, b2, { bare: true });
        if (en2) INDEX.all.push(en2);
      }
    }
    return INDEX;
  }

  /* ---- how alike: mean distance from each point to the other's nearest ---- */
  function grid(pts) {
    const G = 0.5, m = new Map();
    for (const p of pts) {
      const k = Math.floor(p[0] / G) * 4096 + Math.floor(p[1] / G);
      let c = m.get(k); if (!c) m.set(k, c = []); c.push(p);
    }
    return { m, G };
  }
  function nearest(g, x, y) {
    const gx = Math.floor(x / g.G), gy = Math.floor(y / g.G);
    let best = 9;
    for (let r = 0; r <= 4; r++) {
      for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) {
        if (i !== -r && i !== r && j !== -r && j !== r) continue;
        const cell = g.m.get((gx + i) * 4096 + gy + j);
        if (cell) for (const p of cell) { const dx = p[0] - x, dy = p[1] - y, d = dx * dx + dy * dy; if (d < best) best = d; }
      }
      if (best <= (r * g.G) * (r * g.G)) break;
    }
    return Math.min(Math.sqrt(best), 2);
  }
  function score(aPts, aGrid, bPts, bGrid) {
    let s1 = 0, s2 = 0;
    for (const p of aPts) s1 += nearest(bGrid, p[0], p[1]);
    for (const p of bPts) s2 += nearest(aGrid, p[0], p[1]);
    return Math.max(s1 / aPts.length, s2 / bPts.length);
  }
  function best(pts, list, prefer, bareBias = 0) {
    const b = box(pts), q = leftAlign(pts, b), qg = grid(q), qm = mask(q);
    const near = list.filter(e => Math.abs(e.b.w - b.w) < 1.2 && Math.abs(e.b.y0 - b.y0) < 1.2 && Math.abs(e.b.y1 - b.y1) < 1.2);
    // the closest by the rough picture, and the word's own choices always
    const short = near.map(e => ({ e, r: rough(qm, e.mk) })).sort((a, b) => b.r - a.r).slice(0, 30).map(x => x.e);
    if (prefer) for (const e of list) if (prefer.includes(e.id) && !short.includes(e)) short.push(e);
    let top = null;
    for (const e of short) {
      const sc = score(q, qg, e.pts, e.g || (e.g = grid(e.pts)));
      // a near tie: the word's own choices win; a verb with its indicator taken away wins under a tense
      // and loses under a noun's indicator (plural, definite)
      let adj = sc;
      if (prefer && prefer.includes(e.id)) adj -= 0.03;
      if (e.bare) adj += bareBias;
      if (!top || adj < top.adj) top = { e, sc, adj };
    }
    return top;
  }

  /** strokes: [[ [x, y], … ], …] in Bliss units. prefer: the word's own symbol ids. */
  function match(strokes, opts = {}) {
    if (!strokes || !strokes.length) return null;
    const X = index();
    const all = resampleStrokes(strokes);
    // indicators: small marks wholly above the sky line (y < 7.2), in clusters side by side
    const above = strokes.filter(s => box(s).y1 < 7.2);
    const main = strokes.filter(s => !above.includes(s));
    // the whole drawing is a symbol as BCI-AV has it (never one with its indicator taken away)
    const whole = best(all, X.full || (X.full = X.all.filter(e => !e.bare)), opts.prefer);
    let split = null;
    if (above.length && main.length) {
      // the marks above, cluster by cluster (left to right)
      const cl = [];
      for (const s of above.map(s => ({ s, b: box(s) })).sort((a, b) => a.b.x0 - b.b.x0)) {
        const c = cl[cl.length - 1];
        if (c && s.b.x0 - c.b.x1 < 0.6) { c.s.push(s.s); c.b = box([[c.b.x0, c.b.y0], [c.b.x1, c.b.y1], [s.b.x0, s.b.y0], [s.b.x1, s.b.y1]]); }
        else cl.push({ s: [s.s], b: s.b });
      }
      // one indicator of two marks (present: ")(") or two indicators side by side (plural + definite):
      // the reading where the worst mark fits best
      const readings = [[above]].concat(cl.length > 1 ? [cl.map(c => c.s)] : [])
        .map(groups => groups.map(g => best(resampleStrokes(g), X.ind)))
        .filter(r => r.every(Boolean))
        .map((r, k) => ({ r, worst: Math.max(...r.map(i => i.sc)) - (k === 0 ? 0.02 : 0) }))   // one indicator, on a near tie
        .sort((a, b) => a.worst - b.worst);
      if (readings.length) {
        const r = readings[0];
        let keys = r.r.map(i => i.e.key);
        // past ")" and future "(" side by side are one indicator: present ")("
        const k = keys.indexOf('past_action');
        if (k >= 0 && keys[k + 1] === 'future_action') keys.splice(k, 2, 'present_action');
        const verbish = keys.some(x => /action|conditional|imperative|passive|participle/.test(x));
        const m = best(resampleStrokes(main), X.all, opts.prefer, verbish ? -0.01 : 0.01);
        if (m) split = { id: m.e.id, ind: keys, score: Math.max(m.sc, r.worst) };
      }
    }
    const w = whole ? { id: whole.e.id, ind: [], score: whole.sc } : null;
    // the same verb either way: the mark above decides — its own action indicator, or a tense in its place
    const pick = !w ? split : !split ? w
      : split.id === w.id ? (split.ind.length === 1 && split.ind[0] === 'action' ? w : split)
      : (split.score + 0.02 < w.score ? split : w);
    if (!pick) return null;
    pick.sure = pick.score < 0.18;
    return pick;
  }
  return { match, index, engineSampled };
})();
if (typeof window !== 'undefined') window.wbBlissMatch = wbBlissMatch;
if (typeof module !== 'undefined') module.exports = wbBlissMatch;
