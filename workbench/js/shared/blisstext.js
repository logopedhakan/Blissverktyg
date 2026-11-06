/* WinBliss² — text to Bliss, shared by Bildspel and Gravyrkort (Håkan,
   2026-11-05: Gravyrkort's text input should work and sit as in Bildspel).
   Skriv's word machinery as ported for Bildspel: lookup in the writing
   language first, function words first, inflected forms offered as guesses,
   "gå #2" puts form 2 on the word before, "#12345" is that BCI symbol,
   remembered picks shared with Skriv ('wb-picks'). Plus the word chips and the
   chooser (symbol · show as text · form · word under the symbol).
   A "state" is { text, words }: parse() fills words from text and keeps each
   word's choices while the text is edited. Needs lang.js, the engine and the
   data (BLISS_DATA, BLISS_GLOSSES). Everything lives under BT. */
'use strict';
const BT = (() => {
  const LNG = wbLang();
  const tr = (en, sv) => LNG === 'sv' ? sv : en;
  const GL = LNG === 'sv' ? 'sv' : 'en';            // the language words are written in
  const SV = (BLISS_GLOSSES && BLISS_GLOSSES.sv) || {};
  const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---- symbols: the own list first, then BCI-AV (same order as Skriv) ---- */
  const BY_ID = new Map(BLISS_DATA.map(s => [s.id, s]));
  const custom = new Map();                       // id -> sym from an opened .wbs (or the editor)
  const symById = (id) => custom.get(+id) || BY_ID.get(+id);
  const glossOf = (s) => (GL === 'sv' ? (SV[s.id] || s.n || '') : (s.n || SV[s.id] || ''))
    .split(',')[0].replace(/_/g, ' ').trim();
  /* add own symbols; replace = true forgets the ones from before (a new list) */
  function useCustom(syms, replace) {
    if (replace) custom.clear();
    for (const s of syms || []) if (s && s.e && s.e.length) custom.set(s.id, s);
    INDEX = null;
  }

  /* ---- indicators (forms) ---- */
  const IND = (() => {
    const map = new Map(), sigs = new Set();
    for (const sy of BLISS_DATA) {
      const m = (sy.n || '').match(/^indicator_\(([^)]+)\)(.*)$/);
      if (!m || /OLD/.test(m[2])) continue;
      map.set(m[1], sy);
      for (const e of sy.e) sigs.add(e[0] + e[1]);
    }
    return { map, sigs };
  })();
  const IND_CHOICES = [
    ['', tr('none', 'ingen')], ['action', tr('verb', 'verb')], ['present_action', tr('present', 'presens')],
    ['past_action', tr('past', 'dåtid')], ['future_action', tr('future', 'futurum')], ['plural', tr('plural', 'plural')],
    ['imperative_form', tr('imperative', 'uppmaning')], ['definite_form', tr('definite', 'bestämd')],
  ];
  function isInd(e) {
    if (!IND.sigs.has(e[0] + e[1])) return false;
    return e[5] === 4 || (e[5] === 0 && e[0] + e[1] !== 'W1');
  }
  function svgBox(els) {
    const svg = blissSVG({ e: els }, { unit: 4, color: 'currentColor' });
    const m = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/);
    return { svg, vx: +m[1], vy: +m[2], vw: +m[3], vh: +m[4] };
  }
  /* an eighth of a square of air between an indicator's parts (Håkan, 2026-09-24) */
  function indParts(rec) {
    const parts = rec.e.map(e => e.slice());
    const pad = 0.35 * 100, want = 100 + pad;
    for (let i = 1; i < parts.length; i++) {
      const a = svgBox([parts[i - 1]]), b = svgBox([parts[i]]);
      const gapNow = (b.vx + pad) - (a.vx + a.vw - pad);
      if (gapNow < want) {
        const dx = (want - gapNow) / 100;
        for (let j = i; j < parts.length; j++) parts[j][4] += dx;
      }
    }
    return parts;
  }
  const IND_TENSE = new Set(['action', 'present_action', 'past_action', 'future_action', 'imperative_form']);
  const IND_ORDER = ['action', 'present_action', 'past_action', 'future_action', 'imperative_form', 'plural', 'definite_form'];
  const indKeys = (ind) => (ind || '').split('+').filter(Boolean);
  const indJoin = (keys) => IND_ORDER.filter(k => keys.includes(k)).join('+');
  function indToggle(ind, key) {
    if (!key) return '';
    let keys = indKeys(ind);
    if (keys.includes(key)) keys = keys.filter(k => k !== key);
    else {
      if (IND_TENSE.has(key)) keys = keys.filter(k => !IND_TENSE.has(k));
      keys.push(key);
    }
    return indJoin(keys);
  }
  /* Swedish surface forms under the symbol — same honesty rule as Skriv: a wrong
     form is worse than the base form, so only the table and two safe rules. */
  const SV_VERBS = {   // base: [presens, dåtid, uppmaning]
    'vara': ['är', 'var', 'var'], 'ha': ['har', 'hade', 'ha'], 'bli': ['blir', 'blev', 'bli'],
    'gå': ['går', 'gick', 'gå'], 'stå': ['står', 'stod', 'stå'], 'få': ['får', 'fick', 'få'],
    'förstå': ['förstår', 'förstod', 'förstå'], 'se': ['ser', 'såg', 'se'], 'ge': ['ger', 'gav', 'ge'],
    'ta': ['tar', 'tog', 'ta'], 'dra': ['drar', 'drog', 'dra'], 'dö': ['dör', 'dog', 'dö'],
    'le': ['ler', 'log', 'le'], 'slå': ['slår', 'slog', 'slå'],
    'komma': ['kommer', 'kom', 'kom'], 'äta': ['äter', 'åt', 'ät'], 'dricka': ['dricker', 'drack', 'drick'],
    'sova': ['sover', 'sov', 'sov'], 'springa': ['springer', 'sprang', 'spring'],
    'sitta': ['sitter', 'satt', 'sitt'], 'ligga': ['ligger', 'låg', 'ligg'],
    'lägga': ['lägger', 'la', 'lägg'], 'sätta': ['sätter', 'satte', 'sätt'],
    'säga': ['säger', 'sa', 'säg'], 'göra': ['gör', 'gjorde', 'gör'], 'veta': ['vet', 'visste', 'vet'],
    'vilja': ['vill', 'ville'], 'kunna': ['kan', 'kunde'], 'finnas': ['finns', 'fanns'],
    'heta': ['heter', 'hette'], 'betyda': ['betyder', 'betydde'],
    'läsa': ['läser', 'läste', 'läs'], 'skriva': ['skriver', 'skrev', 'skriv'],
    'åka': ['åker', 'åkte', 'åk'], 'köra': ['kör', 'körde', 'kör'], 'ringa': ['ringer', 'ringde', 'ring'],
    'köpa': ['köper', 'köpte', 'köp'], 'tycka': ['tycker', 'tyckte', 'tyck'],
    'tänka': ['tänker', 'tänkte', 'tänk'], 'känna': ['känner', 'kände', 'känn'],
    'höra': ['hör', 'hörde', 'hör'], 'hjälpa': ['hjälper', 'hjälpte', 'hjälp'],
    'leka': ['leker', 'lekte', 'lek'], 'söka': ['söker', 'sökte', 'sök'], 'byta': ['byter', 'bytte', 'byt'],
    'stänga': ['stänger', 'stängde', 'stäng'], 'möta': ['möter', 'mötte', 'möt'],
    'leva': ['lever', 'levde', 'lev'], 'välja': ['väljer', 'valde', 'välj'],
    'sälja': ['säljer', 'sålde', 'sälj'], 'falla': ['faller', 'föll', 'fall'],
    'hålla': ['håller', 'höll', 'håll'], 'bjuda': ['bjuder', 'bjöd', 'bjud'],
    'sjunga': ['sjunger', 'sjöng', 'sjung'], 'gråta': ['gråter', 'grät', 'gråt'],
    'vinna': ['vinner', 'vann', 'vinn'], 'brinna': ['brinner', 'brann', 'brinn'],
    'flyga': ['flyger', 'flög', 'flyg'], 'rida': ['rider', 'red', 'rid'],
    'krypa': ['kryper', 'kröp', 'kryp'], 'bita': ['biter', 'bet', 'bit'],
    'blåsa': ['blåser', 'blåste', 'blås'], 'frysa': ['fryser', 'frös', 'frys'],
    'växa': ['växer', 'växte', 'väx'], 'behöva': ['behöver', 'behövde', 'behöv'],
    'följa': ['följer', 'följde', 'följ'], 'glömma': ['glömmer', 'glömde', 'glöm'],
    'gömma': ['gömmer', 'gömde', 'göm'], 'resa': ['reser', 'reste', 'res'],
    'bära': ['bär', 'bar', 'bär'], 'skära': ['skär', 'skar', 'skär'], 'stiga': ['stiger', 'steg', 'stig'],
    'lyfta': ['lyfter', 'lyfte', 'lyft'], 'trycka': ['trycker', 'tryckte', 'tryck'],
    'släppa': ['släpper', 'släppte', 'släpp'], 'klippa': ['klipper', 'klippte', 'klipp'],
    'bygga': ['bygger', 'byggde', 'bygg'], 'riva': ['river', 'rev', 'riv'],
    'skjuta': ['skjuter', 'sköt', 'skjut'], 'steka': ['steker', 'stekte', 'stek'],
    'skölja': ['sköljer', 'sköljde', 'skölj'], 'gräva': ['gräver', 'grävde', 'gräv'],
    'drömma': ['drömmer', 'drömde', 'dröm'], 'svälja': ['sväljer', 'svalde', 'svälj'],
    'räcka': ['räcker', 'räckte', 'räck'], 'väga': ['väger', 'vägde', 'väg'],
    'mäta': ['mäter', 'mätte', 'mät'], 'lära': ['lär', 'lärde', 'lär'],
    'skrika': ['skriker', 'skrek', 'skrik'], 'kyssa': ['kysser', 'kysste', 'kyss'],
    'störa': ['stör', 'störde', 'stör'], 'böja': ['böjer', 'böjde', 'böj'],
    'stryka': ['stryker', 'strök', 'stryk'], 'hänga': ['hänger', 'hängde', 'häng'],
  };
  function svInflect(base, keys, sym) {
    if (GL !== 'sv') return null;
    const tense = keys.includes('past_action') ? 1 : keys.includes('present_action') ? 0
                : keys.includes('future_action') ? 2 : keys.includes('imperative_form') ? 3 : -1;
    if (tense < 0) return null;
    const b = base.toLowerCase();
    if (tense === 2) return 'ska ' + b;
    const t = SV_VERBS[b];
    if (t) return t[tense === 3 ? 2 : tense] || null;
    if (b.endsWith('s')) return null;
    if (!sym || sym.c !== 'RED') return null;
    if (b.endsWith('a') && b.length > 2) return tense === 0 ? b + 'r' : tense === 1 ? b + 'de' : b;
    if (/[åäöoueiy]$/.test(b)) return tense === 0 ? b + 'r' : tense === 1 ? b + 'dde' : b;
    return null;
  }
  function autoLabel(w) {
    if (w.label && !w.autoLabel) return;
    const inf = svInflect(w.lemma || w.token, indKeys(w.ind), symById(w.ids[w.pick]));
    w.label = inf || null;
    w.autoLabel = !!inf;
  }
  function indRecord(ind) {
    const recs = indKeys(ind).map(k => IND.map.get(k)).filter(Boolean);
    if (!recs.length) return null;
    const e = [];
    let xNext = 0;
    for (const rec of recs) {
      const x0 = Math.min(...rec.e.map(el => el[4]));
      const parts = rec.e.map(el => { const c = el.slice(); c[4] += xNext - x0; return c; });
      e.push(...parts);
      xNext = Math.max(...parts.map(el => el[4])) + 1;
    }
    return { e };
  }
  function composeEls(id, indKey) {
    const base = symById(id);
    if (!base) return [];
    let els = base.e.map(e => e.slice());
    if (indKey) {
      const rec = indRecord(indKey);
      if (rec) {
        const olds = els.filter(isInd);
        els = els.filter(e => !isInd(e));
        const inds = indParts(rec);
        const iw = svgBox(inds).vw / 100;
        const x0 = Math.min(...inds.map(e => e[4])), y0 = Math.min(...inds.map(e => e[5]));
        let cx, iy;
        if (olds.length) { cx = Math.min(...olds.map(e => e[4])) + svgBox(olds).vw / 200; iy = Math.min(...olds.map(e => e[5])); }
        else {
          const bb = svgBox(els.length ? els : base.e);
          cx = bb.vx / 100 + Math.min(bb.vw / 100, 8) / 2;
          iy = Math.min(...(els.length ? els : base.e).filter(e => !isInd(e)).map(e => e[5])) < 4 ? 0 : 4;
        }
        const dx = Math.round((cx - iw / 2 - x0) * 2) / 2, dy = iy - y0;
        for (const e of inds) { e[4] += dx; e[5] += dy; els.push(e); }
      }
    }
    return els;
  }

  /* ---- word index: writing language first, then English; function words first ---- */
  let INDEX = null;
  function buildIndex() {
    if (INDEX) return;
    INDEX = new Map();
    const tierOf = new Map();
    const put = (word, id, tier) => {
      const w = word.trim().toLowerCase(); if (!w) return;
      if (!INDEX.has(w)) INDEX.set(w, []);
      if (!INDEX.get(w).includes(id)) INDEX.get(w).push(id);
      const k = w + '|' + id;
      if (!tierOf.has(k) || tier < tierOf.get(k)) tierOf.set(k, tier);
    };
    if (GL === 'sv')
      for (const [id, g] of Object.entries(SV))
        for (const syn of g.split(',')) { put(syn, +id, 1); put(syn.replace(/\s*\([^)]*\)/g, ''), +id, 1); }
    const enTier = GL === 'en' ? 1 : 3;
    for (const sy of BLISS_DATA)
      for (const syn of (sy.n || '').split(',')) {
        put(syn, sy.id, enTier);
        put(syn.replace(/_/g, ' ').replace(/-\(to\)$/, '').replace(/\s*\([^)]*\)/g, ''), sy.id, enTier);
      }
    for (const sy of custom.values())
      if (BY_ID.get(sy.id)?.n !== sy.n)
        for (const syn of (sy.n || '').split(',')) {
          put(syn, sy.id, 0);
          put(syn.replace(/_/g, ' ').replace(/-\(to\)$/, '').replace(/\s*\([^)]*\)/g, ''), sy.id, 0);
        }
    const rank = new Map(BLISS_DATA.map(s => [s.id,
      /_\((lower|upper)case\)/.test(s.n || '') ? 2 : s.c === 'WHITE' ? 0 : 1]));
    for (const [w, arr] of INDEX)
      if (arr.length > 1) arr.sort((a, b) =>
        (tierOf.get(w + '|' + a) ?? 9) - (tierOf.get(w + '|' + b) ?? 9) ||
        (rank.get(a) ?? 0) - (rank.get(b) ?? 0));
  }
  /* last pick per word — the SAME store as Skriv ('wb-picks'), so a choice made
     in either place carries over */
  let PICKS = {};
  try { PICKS = JSON.parse(localStorage.getItem('wb-picks') || '{}') || {}; } catch (_) {}
  const pickKey = (tok) => GL + '|' + tok.toLowerCase();
  function rememberPick(w) {
    if (!w || w.br || w.punct || !w.token) return;
    PICKS[pickKey(w.token)] = w.asText ? 'text' : w.ids[w.pick];
    try { localStorage.setItem('wb-picks', JSON.stringify(PICKS)); } catch (_) {}
  }
  /* an inflected word resolved by the morphology (js/shared/sv-morph.js):
     the picked symbol's base form and its starting form */
  function applyAnalysis(w) {
    const a = w.an && w.an[w.ids[w.pick]];
    if (!a) return;
    w.lemma = a.lemma; w.ind = a.ind;
  }
  function editDist(a, b) {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 4) return 99;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++)
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const PUNCT = { '?': 8485, '!': 8483, '.': 8486, ',': 8487 };

  /* parse a state's text into words. Typing "gå #2" puts form 2 on the word
     before and removes the code; "#12345" becomes that BCI symbol — as in Skriv.
     Words already resolved keep their choices while the text is edited.
     `inp`, when given, is the text box: substitutions keep its caret. */
  function parse(s, inp) {
    buildIndex();
    const text = s.text;
    const prev = s.words || [];
    const W = [];
    const toks = [];
    let base = 0;
    text.split('\n').forEach((ln, li) => {
      if (li > 0) toks.push({ raw: '↵', off: base - 1 });
      const re = /\S+/g; let m;
      while ((m = re.exec(ln))) toks.push({ raw: m[0], off: base + m.index });
      base += ln.length + 1;
    });
    const subs = [];
    const pushPunct = (punct) => { for (const p of punct) if (PUNCT[p]) W.push({ token: p, ids: [PUNCT[p]], pick: 0, ind: '', asText: false, punct: true }); };
    for (const { raw, off } of toks) {
      if (raw === '↵') { W.push({ br: true }); continue; }
      const m = raw.match(/^(.*?)([?!.,]*)$/);
      const word = m[1], punct = m[2];
      const mform = word.match(/^#([0-7])$/);
      if (mform && (punct || off + raw.length < text.length)) {
        const key = IND_CHOICES[+mform[1]][0];
        for (let i = W.length - 1; i >= 0; i--) {
          const ww = W[i];
          if (ww.br || ww.punct) continue;
          if (!ww.asText && ww.ids.length) { ww.ind = indToggle(ww.ind, key); autoLabel(ww); }
          break;
        }
        subs.push({ off, raw: word, rep: '' });
        pushPunct(punct);
        continue;
      }
      const mcode = word.match(/^#(\d+)$/);
      if (mcode) {
        const sym = symById(+mcode[1]);
        if (sym) {
          const gw = glossOf(sym);
          if (!/\s/.test(gw)) subs.push({ off, raw: word, rep: gw });
          W.push({ token: gw, ids: [sym.id], pick: 0, ind: '', label: gw, asText: false });
        } else W.push({ token: word, ids: [], pick: 0, ind: '', asText: true });
        pushPunct(punct);
        continue;
      }
      if (word) {
        const old = prev[W.length];
        if (old && old.token === word) W.push(old);
        else {
          const lower = word.toLowerCase();
          let ids = (INDEX.get(lower) || []).slice();
          let fuzzy = false, keyOf = null, an = null;
          // an inflected form whose base form IS a Swedish BCI-AV gloss (with
          // the right word class) is not a guess: it gets that symbol
          if (!ids.length && GL === 'sv' && typeof SvMorph !== 'undefined') {
            const before = W.length && !W[W.length - 1].br && !W[W.length - 1].punct ? W[W.length - 1].token : '';
            const res = SvMorph.resolve(lower, before);
            if (res.length) { ids = res.map(r => r.id); an = {}; for (const r of res) an[r.id] = r; }
          }
          if (!ids.length && lower.length >= 3) {
            // inflected forms are a GUESS: offered in the chooser, shown as text
            const pre3 = lower.slice(0, 3), pre2 = lower.slice(0, 2);
            const hits = [];
            for (const [k, v] of INDEX) {
              if (!k.startsWith(pre2)) continue;
              const d = editDist(lower, k);
              if (k.startsWith(pre3) || d <= 2) hits.push({ d, k, v });
            }
            hits.sort((x, y) => x.d - y.d);
            keyOf = {};
            for (const h of hits) {
              for (const id of h.v) if (!ids.includes(id)) { ids.push(id); keyOf[id] = h.k; }
              if (ids.length >= 8) break;
            }
            fuzzy = ids.length > 0;
          }
          let pick = 0, asText = ids.length === 0 || fuzzy;
          const mem = PICKS[pickKey(word)];
          if (mem === 'text' && ids.length) asText = true;
          else if (typeof mem === 'number' && ids.includes(mem)) { pick = ids.indexOf(mem); asText = false; }
          const nw = { token: word, ids, pick, ind: '', asText, fuzzy: fuzzy && asText, keyOf, an };
          applyAnalysis(nw);
          W.push(nw);
        }
      }
      pushPunct(punct);
    }
    s.words = W;
    if (subs.length) {
      let v = text, caret = inp ? inp.selectionStart : v.length;
      for (const sb of subs.sort((a, b) => b.off - a.off)) {
        v = v.slice(0, sb.off) + sb.rep + v.slice(sb.off + sb.raw.length);
        if (caret > sb.off) caret = Math.max(sb.off + sb.rep.length, caret + sb.rep.length - sb.raw.length);
      }
      s.text = v;
      if (inp) { inp.value = v; inp.selectionStart = inp.selectionEnd = Math.min(caret, v.length); }
      parse(s, inp);
    }
  }

  function wordEls(w) {
    if (w.br) return [];
    if (w.asText) return [['Z', 1, 1, 0, 0, 10, 0, 0, w.token, 0, 6]];
    return composeEls(w.ids[w.pick], w.ind);
  }
  function chipSVG(w) { try { return blissSVG({ e: wordEls(w) }, { unit: 3.2, color: 'currentColor' }); } catch (_) { return '?'; } }

  /* ---- the word chips under the text box; click opens the chooser ---- */
  function renderChips(box, s, open, onToggle) {
    box.innerHTML = '';
    (s.words || []).forEach((w, i) => {
      if (w.br) { const d = document.createElement('div'); d.className = 'br'; box.appendChild(d); return; }
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'chip' + (w.asText ? ' text' : '') + (w.fuzzy ? ' fuzzy' : '') + (i === open ? ' on' : '');
      c.innerHTML = w.asText
        ? `<span class="tx">${escXml(w.token)}</span><span class="cap">${w.ids.length ? tr('text', 'text') : tr('no symbol', 'ingen symbol')}</span>`
        : `${chipSVG(w)}<span class="cap">${escXml(w.label || w.token)}${w.ind ? ' ·' : ''}</span>`;
      c.title = w.fuzzy ? tr('No exact match — click to see guesses', 'Ingen exakt träff — klicka för att se gissningar')
        : w.ids.length ? tr('Click to choose symbol, form or text', 'Klicka för att välja symbol, böjning eller text')
        : tr('No symbol matched — stays as text', 'Ingen symbol matchade — förblir text');
      c.onclick = () => onToggle(i);
      box.appendChild(c);
    });
  }
  /* ---- the chooser for word `open`: symbol · show as text · form · word under it.
     on.change() after a choice; on.label() while the word under it is typed;
     on.labelDone() when that field is left ---- */
  function renderChooser(ch, s, open, on) {
    const w = (s.words || [])[open];
    if (!w || w.br) { ch.hidden = true; return; }
    ch.hidden = false; ch.innerHTML = '';
    const sec = (label) => {
      const l = document.createElement('div'); l.className = 'lbl'; l.textContent = label; ch.appendChild(l);
      const r = document.createElement('div'); r.className = 'row'; ch.appendChild(r); return r;
    };
    if (w.ids.length) {
      const r = sec(w.fuzzy || w.keyOf ? tr('Guesses — pick the right one:', 'Gissningar — välj rätt:') : tr('Symbol:', 'Symbol:'));
      w.ids.forEach((id, k) => {
        const sy = symById(id);
        const b = document.createElement('button');
        b.className = 'cand' + (!w.asText && k === w.pick ? ' sel' : '');
        const cap = (w.keyOf && w.keyOf[id]) || (sy ? glossOf(sy) : String(id));
        b.innerHTML = `${chipSVG({ ids: [id], pick: 0, ind: w.punct ? '' : w.ind, asText: false })}<span class="cap">${escXml(cap)}</span>`;
        b.title = sy ? sy.n + ' · ' + sy.id : '';
        b.onclick = () => { w.pick = k; w.asText = false; w.fuzzy = false; applyAnalysis(w); autoLabel(w); rememberPick(w); on.change(); };
        r.appendChild(b);
      });
    }
    if (!w.punct) {
      const r = sec(tr('Show as:', 'Visa som:'));
      const tb = document.createElement('button');
      tb.textContent = tr('Text instead of symbol', 'Text i stället för symbol');
      tb.className = w.asText ? 'sel' : '';
      tb.onclick = () => {
        if (w.asText && w.ids.length) { w.asText = false; w.fuzzy = false; } else w.asText = true;
        rememberPick(w); on.change();
      };
      r.appendChild(tb);
    }
    if (!w.asText && !w.punct) {
      const r = sec(tr('Form:', 'Böjning:'));
      const have = indKeys(w.ind);
      IND_CHOICES.forEach(([key, label], n) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.title = '#' + n;
        b.className = (key ? have.includes(key) : !have.length) ? 'sel' : '';
        b.onclick = () => { w.ind = indToggle(w.ind, key); autoLabel(w); on.change(); };
        r.appendChild(b);
      });
      const l = document.createElement('div'); l.className = 'lbl';
      l.textContent = tr('Word under the symbol:', 'Ordet under symbolen:'); ch.appendChild(l);
      const inp = document.createElement('input');
      inp.value = w.label || w.token;
      inp.oninput = () => {
        const v = inp.value.trim();
        w.label = v && v !== w.token ? v : null; w.autoLabel = false;
        (on.label || on.change)();
      };
      inp.onchange = () => (on.labelDone || (() => {}))();
      ch.appendChild(inp);
    }
  }

  return {
    GL, symById, glossOf, useCustom, get custom() { return custom; },
    IND_CHOICES, indKeys, indToggle, autoLabel, svInflect, composeEls, svgBox,
    rememberPick, parse, wordEls, chipSVG, renderChips, renderChooser,
  };
})();
