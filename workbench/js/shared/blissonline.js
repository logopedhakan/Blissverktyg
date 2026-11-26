/* WinBliss² — reading a BlissOnline PDF (2026-11-26).
   BlissOnline (SPSM) draws everything: the words are letter outlines, the
   symbols lines. Only the TEXT is read back — Write gives it its own symbols
   from BCI-AV, by its own rules. BlissOnline draws in a steady way:
     · a row is a white band across the page;
     · each word's letters are ONE filled shape; the symbol's lines (and a
       dot's small filled shape) come right after its word, above it;
     · each symbol has a white box that is exactly the Bliss grid, 20 units
       high: the letters are measured in those units, so they are known
       whatever size the page was made in;
     · the letters are Arial, each known by its shape: WB_BO_GLYPHS
       (js/data/blissonline-glyfer.js), from sample PDFs and the font itself
       (tools/blissonline-glyfer.js).
   wbBlissOnline.layout(pages) -> { rows: [{ end, words: [{ text, unknown }] }] }  */
'use strict';
const wbBlissOnline = (() => {
  const ink = (c) => c[0] + c[1] + c[2] < 1.5;
  const white = (c) => c[0] > 0.95 && c[1] > 0.95 && c[2] > 0.95;
  function bbox(pts) {
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (const [x, y] of pts) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > d) d = y; }
    return { x0: a, y0: b, x1: c, y1: d, w: c - a, h: d - b };
  }
  const itemBox = (it) => bbox(it.subpaths.flat());

  /* ---- the letters of one word: subpaths that overlap sideways are one letter ---- */
  function letters(subpaths) {
    const subs = subpaths.map(p => ({ p, b: bbox(p) })).sort((a, b) => a.b.x0 - b.b.x0);
    const groups = [];
    for (const s of subs) {
      const g = groups[groups.length - 1];
      // a hole, a dot or a ring lies mostly within (or over) the letter before; letters that only
      // touch at an edge (the hook of a j under an s) stay two
      const overlap = g ? Math.min(g.b.x1, s.b.x1) - Math.max(g.b.x0, s.b.x0) : 0;
      if (g && overlap > 0.35 * Math.min(g.b.w, s.b.w)) {
        g.subs.push(s); g.b = bbox([[g.b.x0, g.b.y0], [g.b.x1, g.b.y1], [s.b.x0, s.b.y0], [s.b.x1, s.b.y1]]);
      } else groups.push({ subs: [s], b: { ...s.b } });
    }
    return groups;
  }
  // a letter as numbers: each outline resampled to N points, relative to the letter's
  // left edge and the row's baseline, in the row's Bliss units (the text grows with the symbols)
  const N = 16;
  function resample(pts, n) {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = L[L.length - 1] || 1, out = [];
    let j = 0;
    for (let k = 0; k < n; k++) {
      const t = (k / n) * total;
      while (j < L.length - 2 && L[j + 1] < t) j++;
      const seg = (L[j + 1] - L[j]) || 1, f = Math.max(0, Math.min(1, (t - L[j]) / seg));
      const a = pts[j], b = pts[Math.min(j + 1, pts.length - 1)];
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    }
    return out;
  }
  function describe(group, baseline, u) {
    const x0 = group.b.x0;
    return group.subs.map(s => s.p).sort((a, b) => bbox(a).y0 - bbox(b).y0 || bbox(a).x0 - bbox(b).x0)
      .map(p => resample(p, N).map(([x, y]) => [+((x - x0) / u).toFixed(3), +((y - baseline) / u).toFixed(3)]));
  }
  // how far apart two letters are (mean point distance, outline by outline); Infinity when not alike
  function distance(a, b) {
    if (a.length !== b.length) return Infinity;
    let sum = 0, n = 0;
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = b[i];
      // the same outline may start at another point: the best turn of it
      let best = Infinity;
      for (let shift = 0; shift < N; shift++) {
        let d = 0;
        for (let k = 0; k < N; k++) { const r = q[(k + shift) % N]; d += Math.hypot(p[k][0] - r[0], p[k][1] - r[1]); }
        if (d < best) best = d;
      }
      sum += best; n += N;
    }
    return sum / n;
  }
  // the nearest letter; 'l' and 'I' are all but the same bar in Arial: when both are about as
  // near, it says so (and the word around it decides)
  function readLetter(desc, table) {
    const near = new Map();
    for (const [ch, shapes] of Object.entries(table || {})) for (const s of shapes) {
      const d = distance(desc, s);
      if (d < (near.get(ch) ?? Infinity)) near.set(ch, d);
    }
    const [best, second] = [...near.entries()].sort((a, b) => a[1] - b[1]);
    if (!best || best[1] >= 0.12) return null;
    if (second && /^(lI|Il)$/.test(best[0] + second[0]) && second[1] - best[1] < 0.006) return 'lI';
    return best[0];
  }
  /* l or I by the word around it: a capital at the start of a sentence, in a word of capitals,
     or before a consonant at the start of a word (Ingrid, IKEA); else the small l */
  function settleLI(word, sentenceStart) {
    const chars = [...word];
    return chars.map((c, i) => {
      if (c !== '\u0001') return c;
      const rest = chars.filter((x, j) => j !== i && /\p{L}/u.test(x));
      if (rest.length && rest.every(x => x === x.toUpperCase() && x !== x.toLowerCase())) return 'I';
      if (i === 0 || chars[i - 1] === ' ') {
        if (sentenceStart && i === 0) return 'I';
        const next = chars[i + 1] || '';
        if (next && /\p{L}/u.test(next) && !/[aeiouyåäöéèü]/i.test(next)) return 'I';
      }
      return 'l';
    }).join('');
  }

  /* ---- the page: rows, words, symbols ---- */
  function layout(pages, table) {
    table = table || (typeof WB_BO_GLYPHS !== 'undefined' ? WB_BO_GLYPHS : {});
    const rows = [];
    for (const page of pages) {
      // the rows: white bands across (nearly) the whole page, top to bottom
      const bands = page.items.filter(it => it.paint === 'fill' && white(it.color)).map(itemBox)
        .filter(b => b.w > page.width * 0.6 && b.h > 10).sort((a, b) => b.y1 - a.y1);
      const textW = bands.length ? Math.max(...bands.map(b => b.x1)) : page.width;
      for (const band of bands) {
        const inBand = page.items.filter(it => { const b = itemBox(it); return b.y0 >= band.y0 - 0.5 && b.y1 <= band.y1 + 0.5; });
        // the symbols' boxes: white boxes inside the row (the Bliss grid)
        const cells = inBand.filter(it => it.paint === 'fill' && white(it.color)).map(itemBox).filter(b => b.w < band.w * 0.9);
        const u = cells.length ? cells.reduce((s, b) => s + b.h, 0) / cells.length / 20 : null;
        const symBottom = cells.length ? Math.min(...cells.map(b => b.y0)) : Infinity;
        const words = [];
        for (const it of inBand) {
          if (!ink(it.color)) continue;
          const b = itemBox(it);
          // a word: a filled shape down in the text; the rest (its symbol) is not read
          if (it.paint === 'fill' && b.y0 < symBottom - 0.2) words.push({ fill: it, box: b });
        }
        if (!words.length) continue;
        // the baseline: where most letters stand
        const bottoms = new Map();
        const groupsOf = new Map();
        for (const w of words) {
          const gs = letters(w.fill.subpaths);
          groupsOf.set(w, gs);
          for (const g of gs) { const k = Math.round(g.b.y0 * 4) / 4; bottoms.set(k, (bottoms.get(k) || 0) + 1); }
        }
        const baseline = [...bottoms.entries()].sort((a, b) => b[1] - a[1])[0][0];
        // the text's own unit when the row has no symbol: the height of a capital-ish letter
        const unit = u || (() => { const hs = [...groupsOf.values()].flat().map(g => g.b.y1 - baseline).sort((a, b) => b - a); return (hs[Math.floor(hs.length * 0.2)] || 6) / 2.2; })();
        const outWords = words.map(w => {
          const gs = groupsOf.get(w);
          let text = '', unknown = 0;
          gs.forEach((g, i) => {
            // a space inside the word's box ("för att"): 0.9 units, where letters stand at most 0.7 apart ("1" in "100")
            if (i && g.b.x0 - gs[i - 1].b.x1 > unit * 0.8) text += ' ';
            const ch = readLetter(describe(g, baseline, unit), table);
            if (ch == null) { unknown++; text += '\uFFFD'; } else text += ch === 'lI' ? '\u0001' : ch;
          });
          return { text, unknown, box: w.box };
        });
        const right = Math.max(...words.map(w => w.box.x1));
        rows.push({ words: outWords, right, textW, groups: words.map(w => groupsOf.get(w)), baseline, unit, wordsRaw: words });
      }
    }
    // a row much shorter than the page ends a paragraph (a title, the last line of one)
    rows.forEach((r, i) => { r.end = i === rows.length - 1 || r.right < r.textW * 0.72; });
    // l or I, now that it is known where the sentences start
    let start = true;
    for (const r of rows) {
      for (const w of r.words) { w.text = settleLI(w.text, start); start = /[.!?:]$/.test(w.text); }
      if (r.end) start = true;
    }
    return { rows: rows.map(r => ({ end: r.end, words: r.words })), _rows: rows };
  }

  /* ---- teaching it the letters (tools/blissonline-glyfer.js): rows of known words ---- */
  function learn(pages, transcript, table = {}) {
    const lay = layout(pages, {});
    const problems = [];
    lay._rows.forEach((row, ri) => {
      const want = transcript[ri];
      if (!want) return;
      if (want.length !== row.wordsRaw.length) { problems.push(`row ${ri + 1}: ${row.wordsRaw.length} words, transcript has ${want.length}`); return; }
      row.groups.forEach((gs, wi) => {
        const chars = [...want[wi].replace(/ /g, '')];
        if (chars.length !== gs.length) { problems.push(`row ${ri + 1} "${want[wi]}": ${gs.length} letter shapes for ${chars.length} letters`); return; }
        gs.forEach((g, k) => {
          const d = describe(g, row.baseline, row.unit);
          const have = table[chars[k]] || (table[chars[k]] = []);
          if (!have.some(s => distance(s, d) < 0.04)) have.push(d);
        });
      });
    });
    return { table, problems };
  }

  /** A letter from a font's outlines (tools/blissonline-glyfer.js --typsnitt): k = Bliss units per font unit. */
  function describeOutlines(outlines, k) {
    const subs = outlines.filter(p => p.length > 2).map(p => ({ p }));
    const x0 = Math.min(...subs.flatMap(s => s.p.map(q => q[0])));
    return describe({ subs, b: { x0 } }, 0, 1 / k);
  }
  return { layout, learn, letters, describe, describeOutlines, distance, settleLI };
})();
if (typeof window !== 'undefined') window.wbBlissOnline = wbBlissOnline;
if (typeof module !== 'undefined') module.exports = wbBlissOnline;
