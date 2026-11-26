#!/usr/bin/env node
/* Builds workbench/js/data/glosses-sv.js — the Swedish glosses alone — from
   workbench/js/data/glosses.js (all 18 languages, 2.5 MB). Every tool but
   Skriv/Editera needs only Swedish, so it loads this file (160 kB) instead
   (2026-11-26, "the program feels slow"). Run it again whenever glosses.js
   is regenerated:   node tools/glosor-sv.js   (tests/run.js checks they agree) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'workbench', 'js', 'data');
const src = fs.readFileSync(path.join(dir, 'glosses.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src.replace(/^const (BLISS_GLOSSES|GLOSS_LANGS)\b/gm, 'var $1'), ctx);
const sv = ctx.GLOSS_LANGS.find(([c]) => c === 'sv');
const out = '/* BCI-AV glosses, Swedish only: made from glosses.js by tools/glosor-sv.js.\n' +
  '   Auto-generated - do not hand-edit. Skriv/Editera load glosses.js (all languages). */\n' +
  `const GLOSS_LANGS = ${JSON.stringify([sv])};\n` +
  `const BLISS_GLOSSES = ${JSON.stringify({ sv: ctx.BLISS_GLOSSES.sv })};\n`;
fs.writeFileSync(path.join(dir, 'glosses-sv.js'), out);
console.log(`wrote glosses-sv.js (${out.length} bytes)`);
