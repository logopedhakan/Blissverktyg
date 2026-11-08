#!/usr/bin/env node
/* Blissverktyget — tests for writing text as Bliss. No dependencies:
     node tests/run.js
   Loads the real page scripts (data, sv-morph.js, blisstext.js and Skriv's
   lookup from app.js) into a sandbox, the way the pages load them, and checks
   the results against a hand-written key. Not published (only workbench/ is). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WB = path.join(__dirname, '..', 'workbench');
const read = (f) => fs.readFileSync(path.join(WB, f), 'utf8');
// top-level const/let in a classic script is not a property of the sandbox: make the globals the tests need visible
const globalize = (src, names) => src.replace(new RegExp(`^(const|let) (${names.join('|')})\\b`, 'gm'), 'var $2');

let pass = 0, fail = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++;
  else { fail++; console.log(`✗ ${name}\n    want ${JSON.stringify(want)}\n    got  ${JSON.stringify(got)}`); }
}

function sandbox(lang) {
  const store = {};
  const ctx = vm.createContext({
    console, window: {},
    wbLang: () => lang,
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
  });
  vm.runInContext(globalize(read('js/data/bliss-data.js'), ['BLISS_DATA']), ctx, { filename: 'bliss-data.js' });
  vm.runInContext(globalize(read('js/data/glosses.js'), ['BLISS_GLOSSES', 'GLOSS_LANGS']), ctx, { filename: 'glosses.js' });
  vm.runInContext(globalize(read('js/shared/sv-morph.js'), ['SvMorph']), ctx, { filename: 'sv-morph.js' });
  return ctx;
}

/* ---------- 1. morphology: inflected Swedish word -> BCI-AV base form + form ----------
   Key written from Swedish grammar (not derived from the rules), ported from
   the Bliss-glosor trainer's tests.html. null = not in BCI-AV: stays text. */
{
  const ctx = sandbox('sv');
  const M = ctx.SvMorph;
  const D = 'definite_form', P = 'plural', PR = 'present_action', PA = 'past_action';
  // exact gloss first (as the pages do), else the best analysis in context
  const resolveWord = (tok, prev) => {
    if (M.senses(tok).length) return [tok, []];
    let an = M.analyze(tok, M.senses);
    const want = an.length > 1 ? M.contextPrefers(prev) : null;
    if (want) an = [...an.filter(a => a.pos === want), ...an.filter(a => a.pos !== want)];
    return an.length ? [an[0].lemma, an[0].keys] : [null, []];
  };
  const CASES = [
    ['barnen', 'barn', [P, D]], ['sjunger', 'sjunga', [PR]], ['glatt', 'glad', []], ['sällan', null, []],
    // nouns
    ['barnet', 'barn', [D]], ['bilen', 'bil', [D]], ['bilarna', 'bil', [P, D]], ['bilar', 'bil', [P]],
    ['flickorna', 'flicka', [P, D]], ['flickan', 'flicka', [D]], ['flickor', 'flicka', [P]],
    ['hundarna', 'hund', [P, D]], ['hundar', 'hund', [P]], ['huset', 'hus', [D]], ['husen', 'hus', [P, D]],
    ['böckerna', 'bok', [P, D]], ['mamman', 'mamma', [D]], ['tjejerna', 'tjej', [P, D]],
    ['händerna', 'hand', [P, D]], ['fötter', 'fot', [P]], ['ögonen', 'öga', [P, D]],
    ['katterna', 'katt', [P, D]], ['parken', 'park', [D]], ['äpplen', 'äpple', [P]],
    // verbs: present / past / irregular
    ['äter', 'äta', [PR]], ['åt', 'äta', [PA]], ['är', 'vara', [PR]], ['var', 'var', []],
    ['sprang', 'springa', [PA]], ['springer', 'springa', [PR]], ['sjöng', 'sjunga', [PA]],
    ['gick', 'gå', [PA]], ['går', 'gå', [PR]], ['vill', 'vilja', [PR]], ['ville', 'vilja', [PA]],
    ['kan', 'kunna', [PR]], ['sover', 'sova', [PR]], ['sov', 'sova', [PA]], ['leker', 'leka', [PR]], ['bor', 'bo', [PR]],
    ['trodde', 'tro', [PA]], ['läste', 'läsa', [PA]], ['köpte', 'köpa', [PA]], ['läser', 'läsa', [PR]],
    ['arbetar', 'arbeta', [PR]], ['arbetade', 'arbeta', [PA]], ['hoppade', 'hoppa', [PA]], ['tittar', 'titta', [PR]],
    ['står', 'stå', [PR]], ['har', 'ha', [PR]],
    // adjectives / adverbs
    ['stora', 'stor', []], ['stort', 'stor', []], ['större', 'stor', []], ['störst', 'stor', []],
    ['snabbt', 'snabb', []], ['högt', 'hög', []], ['gladare', 'glad', []],
    ['små', 'liten', []], ['gamla', 'gammal', []], ['gröna', 'grön', []],
    // found in running text
    ['läraren', 'lärare', [D]], ['fåglarna', 'fågel', [P, D]], ['fönstret', 'fönster', [D]],
    ['cykeln', 'cykel', [D]], ['cyklar', 'cykla', [PR]],            // no context: the verb (the noun stays an option)
    ['cyklar', 'cykel', [P], 'två'], ['cyklar', 'cykla', [PR], 'han'], ['hela', 'hel', []], ['alla', 'alla', []],
    ['mannen', 'man', [D]],
    // exact words stay exact (no analysis)
    ['mat', 'mat', []], ['hus', 'hus', []], ['sol', 'sol', []], ['barn', 'barn', []], ['ofta', 'ofta', []],
  ];
  for (const [tok, lemma, keys, prev] of CASES)
    check(`morphology: ${prev ? prev + ' ' : ''}${tok}`, resolveWord(tok, prev), [lemma, lemma === null ? [] : keys]);
}

/* ---------- 2. Bildspel/Gravyrkort: the shared word machine (blisstext.js) ---------- */
function bt(lang) {
  const ctx = sandbox(lang);
  vm.runInContext(globalize(read('js/shared/blisstext.js'), ['BT']), ctx, { filename: 'blisstext.js' });
  return ctx;
}
// one word per entry: [token, symbol id or 'TEXT', indicator]
const words = (W) => W.filter(w => !w.br && !w.punct).map(w => [w.token, w.asText ? 'TEXT' : w.ids[w.pick], w.ind || '']);
{
  const ctx = bt('sv');
  const parse = (text) => { const s = { text, words: [] }; ctx.BT.parse(s); return words(s.words); };
  check('blisstext: inflected nouns and verbs', parse('barnen leker i parken och katterna sov'), [
    ['barnen', 13166, 'plural'], ['leker', 16200, ''], ['i', 14932, ''], ['parken', 15969, ''],
    ['och', 12374, ''], ['katterna', 12383, 'plural'], ['sov', 17009, 'past_action'],
  ]);
  check('blisstext: irregular verbs', parse('jag åt och gick hem'), [
    ['jag', 14916, ''], ['åt', 13906, 'past_action'], ['och', 12374, ''], ['gick', 12343, 'past_action'], ['hem', 14885, ''],
  ]);
  check('blisstext: the word before decides', parse('han cyklar men två cyklar står där'), [
    ['han', 14687, ''], ['cyklar', 21832, ''], ['men', 13094, ''], ['två', 8498, ''], ['cyklar', 12834, 'plural'],
    ['står', 17249, ''], ['där', 17707, ''],
  ]);
  check('blisstext: an inflected noun is not the pronoun', parse('mannen')[0][1] !== 14688, true);
  check('blisstext: no analysis stays text', parse('sällan')[0][1], 'TEXT');
  // the word under the symbol follows the base form when the form is changed
  const s = { text: 'gick', words: [] }; ctx.BT.parse(s);
  const w = s.words[0];
  w.ind = 'present_action'; ctx.BT.autoLabel(w);
  check('blisstext: label follows the base form', w.label, 'går');
}

/* ---------- 3. Skriv (js/editor/app.js): the lookup ranks the writing language first (#1) ---------- */
{
  const app = read('js/editor/app.js');
  const grab = (start, end) => {
    const i = app.indexOf(start);
    if (i < 0) throw new Error('app.js: not found: ' + start);
    return app.slice(i, app.indexOf(end, i));
  };
  const src = [grab('function wWriteLang()', 'function translatedGloss'), grab('let W_INDEX = null', '// Last pick per written word')].join('\n');
  for (const [lang, gloss, want] of [
    ['sv', '', { barn: 13166, gift: 16215, i: 14932 }],     // #1: Swedish interface, list showing the BCI names
    ['sv', 'sv', { barn: 13166, gift: 16215, i: 14932 }],
    ['en', '', { barn: 25658, gift: 14437, i: 14916 }],     // English stays English
  ]) {
    const ctx = sandbox(lang);
    ctx.lists = { A: { syms: [] } };
    vm.runInContext(`var lang = ${JSON.stringify(lang)}, glossLang = ${JSON.stringify(gloss)};\n` +
      globalize(src, ['W_INDEX', 'W_INDEX_LANG', 'W_LIST_REV', 'wListChanged']), ctx, { filename: 'app.js (Skriv lookup)' });
    ctx.wBuildIndex();
    const got = {};
    for (const k of Object.keys(want)) got[k] = ctx.W_INDEX.get(k)[0];
    check(`Skriv lookup, interface ${lang}, list gloss '${gloss}'`, got, want);
  }
}

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
