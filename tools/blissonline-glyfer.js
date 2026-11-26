/* Builds workbench/js/data/blissonline-glyfer.js — the letter shapes of
   BlissOnline's PDFs — from sample PDFs and what they say (2026-11-26).
     node tools/blissonline-glyfer.js prov.json [more.json …]
   Each .json: { "pdf": "path/to/file.pdf", "rows": [["Frågor", "till", …], …] }
   — the words row by row, as BlissOnline wrote them (a box with two words,
   like "för att", is one entry). New samples add letters; the ones already
   in the table stay. The samples themselves are not kept: only the shapes. */
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
  for (const f of process.argv.slice(2)) {
    const spec = JSON.parse(fs.readFileSync(f, 'utf8'));
    const pages = await wbPdf.read(fs.readFileSync(path.resolve(path.dirname(f), spec.pdf)));
    const r = wbBlissOnline.learn(pages, spec.rows, table);
    for (const p of r.problems) { console.log(f + ': ' + p); problems++; }
  }
  const chars = Object.keys(table).sort();
  fs.writeFileSync(OUT, '/* BlissOnline\'s letters by their shape — made by tools/blissonline-glyfer.js from sample PDFs\n' +
    '   (each letter: its outlines, 16 points each, in Bliss units from its left edge and the baseline). */\n' +
    'const WB_BO_GLYPHS = ' + JSON.stringify(table) + ';\nif (typeof module !== \'undefined\') module.exports = WB_BO_GLYPHS;\n');
  console.log(chars.length + ' letters: ' + chars.join('') + (problems ? `  (${problems} problems)` : ''));
})().catch(e => { console.error(e); process.exit(1); });
