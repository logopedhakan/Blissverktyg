/* Builds workbench/js/data/blissonline-glyfer.js — the letter shapes of
   BlissOnline's PDFs — from sample PDFs and what they say (2026-11-26).
     node tools/blissonline-glyfer.js prov.json [more.json …]
   Each .json: { "pdf": "path/to/file.pdf", "rows": [["Frågor", "till", …], …] }
   — the words row by row, as BlissOnline wrote them (a box with two words,
   like "för att", is one entry). New samples add letters; the ones already
   in the table stay. The samples themselves are not kept: only the shapes.
     node tools/blissonline-glyfer.js --typsnitt arial.json
   adds the letters no sample has from the font itself (BlissOnline writes in
   Arial): its outlines from tools/typsnitt-konturer.swift, scaled to the
   letters the samples gave. */
'use strict';
const fs = require('fs'), path = require('path');
const WB = path.join(__dirname, '..', 'workbench');
const wbPdf = require(path.join(WB, 'js/shared/pdf-vektor.js'));
const wbBlissOnline = require(path.join(WB, 'js/shared/blissonline.js'));
const OUT = path.join(WB, 'js/data/blissonline-glyfer.js');
(async () => {
  let table = {};
  if (fs.existsSync(OUT)) { const src = fs.readFileSync(OUT, 'utf8'); table = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1)); }
  let problems = 0;
  const args = process.argv.slice(2), fi = args.indexOf('--typsnitt');
  const fontFile = fi >= 0 ? args.splice(fi, 2)[1] : null;
  for (const f of args) {
    const spec = JSON.parse(fs.readFileSync(f, 'utf8'));
    const pages = await wbPdf.read(fs.readFileSync(path.resolve(path.dirname(f), spec.pdf)));
    const r = wbBlissOnline.learn(pages, spec.rows, table);
    for (const p of r.problems) { console.log(f + ': ' + p); problems++; }
  }
  if (fontFile) {
    const font = JSON.parse(fs.readFileSync(fontFile, 'utf8'));
    // the scale: the font's letters against the same letters from the samples (their heights)
    const h = (pts) => Math.max(...pts.map(p => p[1])) - Math.min(...pts.map(p => p[1]));
    const ratios = Object.keys(table).filter(c => font.glyphs[c] && font.glyphs[c].length && h(font.glyphs[c].flat()) > 300)
      .map(c => h(table[c][0].flat()) / h(font.glyphs[c].flat())).sort((a, b) => a - b);
    const k = ratios[Math.floor(ratios.length / 2)];
    const worst = Math.max(...Object.keys(table).filter(c => font.glyphs[c] && font.glyphs[c].length)
      .map(c => Math.min(...table[c].map(s => wbBlissOnline.distance(wbBlissOnline.describeOutlines(font.glyphs[c], k), s)))));
    const added = [];
    for (const [c, outlines] of Object.entries(font.glyphs)) {
      if (table[c] || !outlines.some(p => p.length > 2)) continue;
      table[c] = [wbBlissOnline.describeOutlines(outlines, k)];
      added.push(c);
    }
    console.log(`${font.name}: scale ${k.toFixed(6)}, the farthest sample letter ${worst.toFixed(3)} units from the font's; added ${added.join('')}`);
  }
  const chars = Object.keys(table).sort();
  fs.writeFileSync(OUT, '/* BlissOnline\'s letters by their shape — made by tools/blissonline-glyfer.js from sample PDFs\n' +
    '   (each letter: its outlines, 16 points each, in Bliss units from its left edge and the baseline). */\n' +
    'const WB_BO_GLYPHS = ' + JSON.stringify(table) + ';\nif (typeof module !== \'undefined\') module.exports = WB_BO_GLYPHS;\n');
  console.log(chars.length + ' letters: ' + chars.join('') + (problems ? `  (${problems} problems)` : ''));
})().catch(e => { console.error(e); process.exit(1); });
