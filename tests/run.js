#!/usr/bin/env node
/* Blissverktyget — tests for writing text as Bliss, and for opening shared files safely. No dependencies:
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
  // Bliss-glosor's writing rules (2026-11-19), loaded the way the pages load them
  for (const f of ['js/shared/bliss-grammar.js', 'js/data/bliss-skriv-data.js', 'js/data/bliss-synonymer.js',
    'js/data/bliss-harledda.js', 'js/shared/bliss-skriv.js', 'js/shared/skriv-glosor.js'])
    vm.runInContext(globalize(read(f), ['SkrivGlosor']), ctx, { filename: f });
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
    // gå = 18031 (walk): Bliss-glosor names 12343 "gå framåt" (advance), so plain "gå" is the walking one
    ['jag', 14916, ''], ['åt', 13906, 'past_action'], ['och', 12374, ''], ['gick', 18031, 'past_action'], ['hem', 14885, ''],
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

/* ---------- 4. files from elsewhere: nothing in them may become markup or a script link ----------
   Shows, symbol lists, settings and almanacs are shared by mail and USB sticks.
   The checks run on the real functions, cut out of the pages. */
{
  const cut = (file, start, end) => {
    const t = read(file), i = t.indexOf(start);
    if (i < 0) throw new Error(`${file}: not found: ${start}`);
    const j = t.indexOf(end, i);
    if (j < 0) throw new Error(`${file}: not found: ${end}`);
    return t.slice(i, j);
  };
  const run = (src, file, names) => {
    const ctx = vm.createContext({ console, URL });
    vm.runInContext(globalize(src, names), ctx, { filename: file });
    return ctx;
  };
  const X = '"/><img src=x onerror=alert(1)>';

  // Bildspel: colours, numbers and pictures in an opened show
  const bs = run(cut('bildspel.html', 'const HEX_COLOR', 'function load('), 'bildspel.html (cleanShow)', ['HEX_COLOR', 'IMG_DATA', 'clampNum']);
  const PNG = 'data:image/png;base64,iVBORw0KGgo=';
  const bad = bs.cleanShow({ bg: '#fff' + X, textBg: X, pen: '35' + X, gap: 'x', imgPct: 999, title: {}, slides: [{ img: 'x" onload="alert(1)', text: 5, words: 'x' }] });
  check('Bildspel: bad values fall back', [bad.bg, bad.textBg, bad.pen, bad.gap, bad.imgPct, bad.title, bad.slides[0].img, bad.slides[0].text, bad.slides[0].words],
    ['#ffffff', null, 35, 8, 85, '', null, '', []]);
  const good = bs.cleanShow({ bg: '#12233d', textBg: '#fff6c2', pen: 50, gap: 12, imgPct: 40, title: 'Glass', slides: [{ img: PNG, text: 'hej', words: [] }] });
  check('Bildspel: good values stay', [good.bg, good.textBg, good.pen, good.gap, good.imgPct, good.title, good.slides[0].img],
    ['#12233d', '#fff6c2', 50, 12, 40, 'Glass', PNG]);

  // Bildspel: each slide has its own look (2026-11-19); a slide from an older file takes the show's
  const own = bs.cleanShow({ bg: '#112233', textBg: '#fff6c2', imgPct: 50, slides: [
    { bg: '#ffeecc', textBg: null, imgPct: 40 },            // its own look, no tile
    { bg: 'red' + X, textBg: X, imgPct: 999 },              // bad values: the show's look
  ] });
  check('Bildspel: a slide keeps its own look', [own.slides[0].bg, own.slides[0].textBg, own.slides[0].imgPct], ['#ffeecc', null, 40]);
  check('Bildspel: bad values on a slide fall back to the show', [own.slides[1].bg, own.slides[1].textBg, own.slides[1].imgPct], ['#112233', '#fff6c2', 85]);
  const look = run(cut('bildspel.html', 'const LOOK_DEFAULT', 'let show ='), 'bildspel.html (newSlide)', ['LOOK_DEFAULT', 'lookOf', 'newSlide']);
  const next = look.newSlide({ text: 'x', bg: '#000000', textBg: '#ffffff', imgPct: 70, img: 'data:' });
  check('Bildspel: a new slide starts with the look of the one before, nothing else', [next.bg, next.textBg, next.imgPct, next.text, next.img],
    ['#000000', '#ffffff', 70, '', null]);

  // Editera: ink and background from a settings file (.wbx) or the saved settings
  const ed = run(cut('js/editor/app.js', 'const HEX_COLOR', 'function resolvedBg'), 'app.js (okInk, okBg)', ['HEX_COLOR', 'okInk', 'okBg']);
  check('Editera: settings colours', [ed.okInk('#aa0000'), ed.okInk('#000' + X), ed.okBg('class'), ed.okBg('#ffeecc'), ed.okBg('red' + X)],
    ['#aa0000', null, 'class', '#ffeecc', 'transparent']);
  const app = read('js/editor/app.js');
  check('Editera: list rows escape the symbol name', /<span class="g">\$\{escXml\(displayGloss\(s\)\)\}/.test(app), true);

  // Almanacka: bookings in an opened almanac, and what a link counts as
  const al = run(cut('almanacka.html', 'function cleanLink', 'const MEET_SYM') + cut('almanacka.html', 'function cleanBookings', "$('btnOpenFile')"),
    'almanacka.html (cleanLink, meetKind, cleanBookings)', []);
  const list = al.cleanBookings([
    { id: 'a', date: '2026-11-09', time: '10:00', end: '11:00', link: 'javascript:alert(1)' },
    { id: 'b', date: '2026-11-09', time: '12:00' + X, link: 'https://meet.jit.si/Bliss-abc' },
    { id: 'c"><img', date: '2026-11-09', link: 'msteams:/l/meetup-join/x' },
    { id: 'd', date: 'not a date' },
    null,
  ]);
  check('Almanacka: opened bookings', list.map(b => [b.id, b.time, b.end, b.link]),
    [['a', '10:00', '11:00', ''], ['b', '', '', 'https://meet.jit.si/Bliss-abc'], ['cimg', '', '', 'msteams:/l/meetup-join/x']]);
  check('Almanacka: meeting kind by host', ['https://meet.jit.si/x', 'https://8x8.vc/a/b', 'https://teams.microsoft.com/l/x', 'msteams:/l/x',
    'https://evil.example/jitsi', 'https://jit.si.evil.example/x', 'not a link'].map(al.meetKind),
    ['Jitsi', 'Jitsi', 'Teams', 'Teams', '', '', '']);

  // the editor's escXml goes into attributes (aria-label) too: quotes must not end the attribute
  const esc = run(cut('js/editor/app.js', 'const escXml', '/* Composite the caption'), 'app.js (escXml)', ['escXml']);
  check('Editera: escXml escapes quotes', esc.escXml('x" onfocus="alert(1)'), 'x&quot; onfocus=&quot;alert(1)');
}

// 5. Accessibility (2026-11-12)
{
  const win = read('js/shared/window.js');
  const ty = vm.createContext({});
  vm.runInContext(win.slice(win.indexOf('const typing'), win.indexOf('  document.addEventListener', win.indexOf('const typing'))).replace(/^\s*const typing/, 'var typing'), ty);
  const el = (tagName, type, isContentEditable = false) => ({ tagName, type, isContentEditable });
  check('Fönster: Alt keys leave text fields alone (⌥2 = @ on a Swedish Mac)',
    [el('TEXTAREA'), el('INPUT', 'text'), el('INPUT', 'search'), el('INPUT', 'url'), el('DIV', '', true), el('SELECT'),
     el('INPUT', 'checkbox'), el('BUTTON', 'button'), el('BODY'), null].map(ty.typing),
    [true, true, true, true, true, true, false, false, false, false]);
  check('Fönster: the key handler asks typing() first', /if \(typing\(e\.target\)\) return;/.test(win), true);

  // contrast of the shared palette (WCAG 2.2 AA: 4.5:1 for text)
  const css = read('css/wb-base.css');
  const block = (re) => css.match(re)[1];
  const v = (b, n) => b.match(new RegExp('--' + n + ':(#[0-9A-Fa-f]{6})'))[1];
  const lum = (h) => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const light = block(/:root\{([^}]*)\}/), dark = block(/:root\[data-theme="dark"\]\{([^}]*)\}/);
  check('Palett: grey text on the background, light and dark (≥ 4.5)',
    [ratio(v(light, 'dim'), v(light, 'bg')) >= 4.5, ratio(v(light, 'dim'), v(light, 'panel-2')) >= 4.5, ratio(v(dark, 'dim'), v(dark, 'bg')) >= 4.5], [true, true, true]);
  check('Palett: text on an accent button, light and dark (≥ 4.5)',
    [ratio(v(light, 'on-accent'), v(light, 'accent')) >= 4.5, ratio(v(dark, 'on-accent'), v(dark, 'accent')) >= 4.5], [true, true]);
  const whiteOnAccent = ['start.html', 'bildspel.html', 'almanacka.html', 'gissa.html', 'former.html', 'gravyr.html', 'css/wb-blisstext.css', 'js/shared/window.js']
    .filter(f => /var\(--accent\)[^}]*?color:#fff/i.test(read(f)));
  check('Palett: no white text on the accent colour', whiteOnAccent, []);
  check('Palett: a visible focus ring for every part', /:focus-visible\{outline:3px solid var\(--accent\)/.test(css), true);

  // Skriv: what a screen reader says for a word chip
  const app = read('js/editor/app.js');
  const chip = vm.createContext({});
  vm.runInContext(`var tr = (en, sv) => sv; var wIndKeys = (ind) => (ind || '').split('+').filter(Boolean);
    var W_IND_CHOICES = [['', () => 'ingen'], ['past_action', () => 'dåtid'], ['plural', () => 'plural']];
    var lang = 'sv', BLISS_GLOSSES = { sv: { 1: 'vilja,önska' } };
    var wSymById = (id) => ({ 1: { n: 'want,wish' }, 2: { n: 'ice_cream' } })[id];` +
    app.slice(app.indexOf('function wChipName'), app.indexOf("$('wChooser').addEventListener")), chip);
  check('Skriv: chip names say the symbol and the form', [
    chip.wChipName({ token: 'ville', ids: [1], pick: 0, ind: 'past_action' }),
    chip.wChipName({ token: 'glassar', label: 'glass', ids: [2], pick: 0, ind: 'plural' }),
    chip.wChipName({ token: 'Lisa', ids: [], pick: 0 }),
    chip.wChipName({ token: 'vill', ids: [1], pick: 0, asText: true }),
  ], ['ville – vilja, dåtid', 'glass – ice cream, plural', 'Lisa – som text', 'vill – som text']);
  check('Skriv: focus is put back after a redraw', /const spot = wFocusSpot\(\);[\s\S]*?wFocusBack\(spot\);/.test(app), true);
  check('Skriv: preview lines are images with the sentence as text', /role="img" aria-label="\$\{said\(x\.l\)\}"/.test(app), true);

  // Formfamiljer: a form is named by its key and count, and says whether it is chosen
  const fm = read('former.html');
  check('Formfamiljer: forms have a name and a pressed state',
    [/chip\.setAttribute\('aria-label', key \+/.test(fm), /chip\.setAttribute\('aria-pressed', String\(on\)\)/.test(fm)], [true, true]);
}

/* ---------- 6. Skriv writes by Bliss-glosor's rules (js/shared/bliss-skriv.js), 2026-11-19 ----------
   Skriv's real parser (wParse in app.js) on Bliss-glosor's approved sentences
   (tests/fixtures/meningar.json): with the articles and "ska" left out it must
   give exactly the key, as Bliss-glosor's own test does. */
{
  const app = read('js/editor/app.js');
  const grab = (a, b) => { const i = app.indexOf(a); if (i < 0) throw new Error('app.js: not found: ' + a); return app.slice(i, app.indexOf(b, i)); };
  const ctx = sandbox('sv');
  const input = { value: '', selectionStart: 0 };
  ctx.__input = input;
  vm.runInContext(`var lang = 'sv', glossLang = '', lists = { A: { syms: [] } };
    var $ = (id) => (id === 'wInput' ? __input : {}); var tr = (e, s) => s; var toast = () => {}; var wRender = () => {};
    function firstGloss(s) { return (s.n || '').split(',')[0]; }\n` +
    globalize([grab('function wWriteLang()', 'function translatedGloss'), grab('function translatedGloss', '/* ================= wbs'),
      grab('const W_INDICATORS', 'function wWordEls')].join('\n'),
      ['W', 'W_INDEX', 'W_INDEX_LANG', 'W_LIST_REV', 'W_PICKS', 'W_INDICATORS', 'W_IND_CHOICES', 'W_GRAMMAR', 'wOpen']), ctx, { filename: 'app.js (Skriv)' });
  const parse = (text) => { input.value = text; input.selectionStart = text.length; ctx.wParse(); return ctx.W; };
  const one = (w) => (w.skip ? 'skip' : w.asText ? 'TEXT' : w.ids[w.pick] + (w.ind ? '+' + w.ind : ''));
  const shown = (W) => W.filter(w => !w.br && !w.punct && !w.skip).map(one);
  // as in the sentence exercise: articles and "ska" left out (one click each)
  const leaveOut = (W) => {
    for (const w of W) if (w.opts && w.opts.some(o => o.skip)) { ctx.wTakeOption(w, w.opts.find(o => o.skip)); w.manual = true; }
    ctx.wRedefault();
    return W;
  };
  const key = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'meningar.json'), 'utf8')).meningar;
  const OTHER = new Set([23, 34, 37]);   // the exercise picked another of the options (fisk (mat), tänka om, gå framåt)
  const bad = [];
  for (const m of key) {
    const W = leaveOut(parse(m.sv));
    const want = m.ord.map(o => o.id + (o.form && o.form.length ? '+' + o.form[0] : ''));
    if (OTHER.has(m.nr)) {
      const words = W.filter(w => !w.br && !w.punct && !w.skip);
      m.ord.forEach((o, i) => { if (!words[i] || !words[i].ids.includes(o.id)) bad.push(`${m.nr}: ${o.id} not among the options`); });
    } else if (JSON.stringify(shown(W)) !== JSON.stringify(want)) bad.push(`${m.nr} ${m.sv}: ${JSON.stringify(shown(W))}`);
  }
  check(`Skriv: the ${key.length} approved Bliss-glosor sentences`, bad, []);

  check('Skriv: a phrase is one symbol, "ska" is BCI\'s skall', shown(parse('Vi tycker om katter.')), ['18212', '15210', '12383+plural']);
  const ska = parse('Barnet ska läsa en bok');
  check('Skriv: "ska" and the article can be left out', ska.filter(w => !w.punct).map(w => !!(w.opts && w.opts.some(o => o.skip))), [false, true, false, true, false]);
  check('Skriv: "ska" left out = the verb in the future', shown(leaveOut(ska)), ['13166', '16465+future_action', '12875']);
  check('Skriv: ... and the word under it says so', ska[2].label, 'ska läsa');
  check('Skriv: "såg" after an article is the saw, otherwise see in the past',
    [shown(parse('jag köpte en såg'))[3], shown(parse('Hunden såg katten'))[1]], ['16727', '16747+past_action']);
  check('Skriv: BCI\'s proper names only with a capital mid-sentence', [shown(parse('Solen är på himlen'))[3], shown(parse('de kom till Himlen'))[3]], ['17006', '24149']);
  check('Skriv: an inflected noun is not the pronoun', shown(parse('Mannen ser månen'))[0], '15416');
  const brand = parse('branden')[0];
  check('Skriv: a synonym (Swesaurus) is marked', [one(brand), brand.via], ['14183', 'eld']);
  check('Skriv: a derived verb gets the action indicator', one(parse('tystnar')[0]), '16981+action');
  const kalle = parse('Kalle')[0];
  check('Skriv: an unknown word stays text, with suggestions', [kalle.asText, kalle.guess], [true, true]);
  // "gå #2": the form code is put on the word before once the sentence is resolved, and survives the re-parse
  const ga = parse('jag gå #2 ');
  check('Skriv: "gå #2" gives the present', [input.value, ga.filter(w => !w.punct).map(one)], ['jag gå  ', ['14916', '18031+present_action']]);
  check('Skriv: ... and keeps it while writing on', parse('jag gå  hem').filter(w => !w.punct).map(one), ['14916', '18031+present_action', '14885']);
  // a word chosen by hand keeps its choice when the sentence changes around it
  const W2 = parse('Barnet ska läsa');
  ctx.wTakeOption(W2[1], W2[1].opts.find(o => o.skip)); W2[1].manual = true; ctx.wRedefault();
  check('Skriv: a left-out word stays left out while writing on', shown(parse('Barnet ska läsa en bok')), ['13166', '16465+future_action', '12321', '12875']);
}

/* ---------- 7. Bildspel, Gravyrkort, Almanacka: the same rules (blisstext.js) ---------- */
{
  const ctx = bt('sv');
  const st = (text, words) => { const s = { text, words: words || [] }; ctx.BT.parse(s); return s; };
  const one = (w) => (w.skip ? 'skip' : w.asText ? 'TEXT' : w.ids[w.pick] + (w.ind ? '+' + w.ind : ''));
  check('blisstext: Bliss-glosor\'s rules too', st('Vi tycker om katter och branden tystnar').words.filter(w => !w.punct).map(one),
    ['18212', '15210', '12383+plural', '12374', '14183', '16981+action']);
  // Skriv hands its words over (left-out words and the options included): the choices are kept
  const s1 = st('Barnet ska läsa en bok');
  for (const w of s1.words) if (w.opts && w.opts.some(o => o.skip)) { ctx.SkrivGlosor.take(w, w.opts.find(o => o.skip)); w.manual = true; }
  ctx.SkrivGlosor.redefault(s1.words, { pickOf: () => undefined });
  const handed = JSON.parse(JSON.stringify(s1.words, (k, v) => (k === 'futureOf' ? undefined : v)));
  check('blisstext: words handed over from Skriv keep their choices', st('Barnet ska läsa en bok', handed).words.map(one),
    ['13166', 'skip', '16465+future_action', 'skip', '12875']);
  check('blisstext: a left-out word draws nothing', ctx.BT.wordEls(st('ska läsa', handed.slice(1, 3)).words[0]).length, 0);
}

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
