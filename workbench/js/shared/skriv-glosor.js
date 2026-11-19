/* WinBliss² — text written by Bliss-glosor's writing rules, for every part
   that writes text as Bliss: Skriv (js/editor/app.js) and the shared word
   machine of Bildspel, Gravyrkort and Almanacka (js/shared/blisstext.js).
   2026-11-19.

   The rules themselves are Bliss-glosor's, unchanged (js/shared/bliss-skriv.js,
   built by tools/build-skriv.js): the honesty rule (a word only gets a symbol
   that IS its BCI word, or a checked inflection of one; similar spellings are
   only suggestions), phrases that are one symbol ("tycker om"), "ska" + verb =
   the verb in the future when "ska" is left out, articles that can be left
   out, BCI's proper names only when written with a capital, synonyms
   (Swesaurus) and derived verbs (SUC 3.0).

   This file joins them to the word lists both machines keep:
     { token, ids, pick, ind, asText, punct, br, label, … }
   Each written word gets opts (Bliss-glosor's options, best first) and the
   chosen one is spread onto those fields, plus skip (left out of the Bliss
   text). A word typed while another part of the sentence changes keeps what
   was chosen for it; a word chosen by hand (manual) is never re-defaulted.
   Needs BlissSkriv (js/shared/bliss-skriv.js). */
'use strict';
const SkrivGlosor = (() => {
  const EDGE = /^[\s"'«»“”‘’.,!?;:()[\]…–—-]+|[\s"'«»“”‘’.,!?;:()[\]…–—-]+$/g;
  const S = () => (typeof window !== 'undefined' && window.BlissSkriv) || null;
  /** Bliss-glosor writes Swedish and English. */
  const on = (lang) => (lang === 'sv' || lang === 'en') && !!(S() && S().writeWords);

  const optionOf = (w) => (w.opts && w.oKey != null ? w.opts.find(o => o.key === w.oKey) || null : null);

  /** Spread option o onto the word. autoLabel(w): the part's own "word under the symbol". */
  function take(w, o, autoLabel) {
    w.skip = !!(o && o.skip);
    w.asText = !o || !!o.text;
    w.via = (o && o.via) || null;
    w.derived = !!(o && o.derived);
    w.oKey = o ? o.key : null;
    w.fuzzy = false;
    if (o && o.id != null) {
      w.pick = Math.max(0, w.ids.indexOf(o.id));
      w.ind = o.form || '';
      w.lemma = S().optionLabel(o) || null;     // the base form, for the word under the symbol
    } else w.ind = '';
    if (w.autoLabel) { w.label = null; w.autoLabel = false; }
    if (!w.asText && !w.skip && autoLabel) autoLabel(w);
  }

  /** The option a word starts with: the future form after a left-out "ska", else
      what was chosen for the same word before (pickOf), else the first. */
  function defaultOption(w, pickOf) {
    const opts = w.opts || [];
    if (w.futureOf && w.futureOf.skip && w.futureAt != null && opts[w.futureAt]) return opts[w.futureAt];
    const mem = pickOf ? pickOf(w.token) : undefined;
    if (mem != null) {
      const hit = mem === 'text' ? opts.find(o => o.text) || { text: true, key: 'text' }
        : mem === 'skip' ? opts.find(o => o.skip)
        : typeof mem === 'number' ? opts.find(o => o.id === mem)
        : opts.find(o => o.key === mem);
      if (hit) return hit;
    }
    return opts[0] || null;
  }

  /** What the shared store of picks ('wb-picks') remembers for a word: 'skip', 'text',
      the option (symbol + form), or the symbol alone when its future form only
      came from a left-out "ska". */
  function pickValue(w) {
    if (w.skip) return 'skip';
    if (w.asText) return 'text';
    const o = optionOf(w);
    return o && o.id != null && !(o.form === 'future_action' && w.futureOf) ? o.key : w.ids[w.pick];
  }

  /** After a choice: words whose default hangs on another ("ska" left out) follow it. */
  function redefault(W, cfg) {
    for (const w of W) if (w.opts && w.opts.length && !w.manual) take(w, defaultOption(w, cfg.pickOf), cfg.autoLabel);
  }

  /**
   * Resolve the words marked pending ({ token, raw, pending: true }) in W, a run
   * of written words at a time (a line break or another kind of entry ends a run).
   * prev: the word list before this edit. Returns the new list (a phrase's
   * second word is folded into its first). cfg: { lang, pickOf, autoLabel, indToggle }.
   * A pending word may carry formCodes: forms typed after it ("gå #2").
   */
  function resolve(W, prev, cfg) {
    const B = S();
    B.setLang(cfg.lang);
    const asText = (w) => { delete w.pending; Object.assign(w, { ids: [], pick: 0, ind: '', asText: true }); };
    const runs = []; let run = null;
    const usedOld = new Set();
    for (const w of W) {
      if (w.pending && splitCompound(w.token)) {                        // "fisk+pinne": one word of its own
        resolveCompound(w, prev, usedOld, cfg);
        run = null;
        continue;
      }
      const fixed = w.pending && fixedCompound(w.token, cfg.lang);
      if (fixed) {                                                      // "Blisshuset": a fixed exception
        resolveCompound(w, prev, usedOld, cfg, fixed.parts, fixed.label);
        run = null;
        continue;
      }
      if (w.pending) {
        if (!w.token.replace(EDGE, '')) { asText(w); continue; }      // only quotes or dashes
        if (!run) runs.push(run = []);
        run.push(w);
      } else if (!w.punct) run = null;
    }
    const oldWords = (prev || []).filter(w => w && !w.br && !w.punct);
    const items = [];
    for (const r of runs) {
      const entries = B.writeWords(r.map(w => w.raw || w.token).join(' '), cfg.lang);
      const base = items.length;
      let k = 0;
      for (const e of entries) {
        const n = Math.max(1, e.text.split(' ').length);              // a phrase is several written words
        const w = r[k];
        if (!w) break;
        if (n > 1) {
          w.token = r.slice(k, k + n).map(x => x.token).join(' ');
          for (let j = 1; j < n; j++) if (r[k + j]) r[k + j].dropped = true;
        }
        items.push({ w, e, codes: w.formCodes, futureFrom: e.futureFrom != null ? base + e.futureFrom : null });
        delete w.formCodes;
        k += n;
      }
      for (; k < r.length; k++) asText(r[k]);
    }
    W = W.filter(w => !w.dropped);
    const words = W.filter(w => !w.br && !w.punct);
    for (const it of items) {
      const { e } = it;
      let w = it.w;
      const old = oldWords[words.indexOf(w)];
      const keys = JSON.stringify(e.options.map(o => o.key));
      // the same word at the same place keeps what was chosen for it: with the same
      // options, or — a word saved before these rules (no options) — as it was saved
      if (old && old !== w && old.token === w.token && (!old.opts || JSON.stringify(old.opts.map(o => o.key)) === keys)) {
        if (!old.opts) old.manual = true;
        old.off = w.off; old.raw = w.raw;
        W[W.indexOf(w)] = old; w = it.w = old;
      }
      delete w.pending;
      w.opts = e.options; w.guess = !!e.guess; w.future = !!e.future; w.futureAt = e.futureAt ?? null;
      const had = w.manual && !w.asText && w.ids ? w.ids[w.pick] : null;
      w.ids = [...new Set(e.options.filter(o => o.id != null).map(o => o.id))];
      // a symbol chosen before (a saved word, the AI's pick) stays among the symbols
      if (w.manual && had != null && !w.ids.includes(had)) w.ids.unshift(had);
      if (w.manual && had != null) w.pick = w.ids.indexOf(had);
    }
    for (const it of items) it.w.futureOf = it.futureFrom != null && items[it.futureFrom] ? items[it.futureFrom].w : null;
    for (const it of items) {
      const w = it.w;
      if (!w.manual) {
        if (!w.opts.length) Object.assign(w, { pick: 0, ind: '', asText: true, skip: false, oKey: null });
        else take(w, defaultOption(w, cfg.pickOf), cfg.autoLabel);
      }
      // "gå #2": a form code typed after the word is the writer's own choice
      if (it.codes && cfg.indToggle && !w.asText && !w.skip && w.ids.length) {
        for (const k of it.codes) w.ind = cfg.indToggle(w.ind, k);
        w.manual = true;
        if (cfg.autoLabel) cfg.autoLabel(w);
      }
    }
    return W;
  }

  /* ---- compound words (2026-11-19): "fisk+pinne", "dum+skalle" ----
     Written with a + between the parts, the parts become ONE Bliss word, as
     BCI's own compounds are drawn: the characters side by side with a quarter
     square of air (2 half-units — what 22 of the 27 measurable two-part
     compounds in BCI-AV have), the parts' own indicators left out
     (Fundamental Rules 7.0: the whole word takes one), and the written word
     under it ("fiskpinne"). Each part keeps its options, so another symbol
     can be chosen for "fisk" or for "pinne". */
  const COMPOUND = /^[^+\s]+(\+[^+\s]+)+$/;
  function splitCompound(token) {
    if (!COMPOUND.test(token || '')) return null;
    const parts = token.split('+').map(t => t.replace(EDGE, '')).filter(Boolean);
    return parts.length >= 2 ? parts : null;
  }
  /* Fixed exceptions (Håkan's tool, 2026-11-19): words written as a given compound,
     whatever the general rules say. "Blisshuset" is the house symbol and the Bliss
     symbol (classifier first), with "Blisshuset" under it. Only these words, only
     in this language; the parts are written words, each keeping its options. */
  const FIXED = { sv: { blisshuset: { parts: ['hus', 'bliss'], label: 'Blisshuset' } } };
  function fixedCompound(token, lang) {
    const t = FIXED[lang], key = String(token || '').replace(EDGE, '').toLowerCase();
    return t && Object.prototype.hasOwnProperty.call(t, key) ? t[key] : null;
  }
  /** tokens: the parts in drawing order (default: the parts written with +); label: the word under it. */
  function resolveCompound(w, prev, usedOld, cfg, tokens, label) {
    const B = S();
    delete w.pending;
    // the same compound written before keeps its choices
    const old = (prev || []).find(o => o && o.parts && o.token === w.token && !usedOld.has(o));
    const parts = (tokens || splitCompound(w.token)).map((t, k) => {
      const e = B.writeWords(t, cfg.lang)[0];
      const ids = [...new Set(((e && e.options) || []).filter(o => o.id != null).map(o => o.id))];
      const was = old && old.parts[k] && old.parts[k].token === t ? old.parts[k] : null;
      const pick = was && ids.includes(was.ids[was.pick]) ? ids.indexOf(was.ids[was.pick]) : 0;
      return { token: t, ids, pick };
    });
    if (old) usedOld.add(old);
    Object.assign(w, {
      parts, opts: null, oKey: null, skip: false, fuzzy: false, via: null, derived: false,
      ids: parts.map(p => p.ids[p.pick]).filter(id => id != null),
      pick: 0,
      ind: old ? old.ind || '' : '',
      manual: !!(old && old.manual),
      // a part BCI does not have makes the whole word text: no half a symbol
      asText: parts.some(p => !p.ids.length) || (old ? !!old.asText && parts.every(p => p.ids.length) : false),
      label: old && old.label && !old.autoLabel ? old.label : label || parts.map(p => p.token).join(''),
      autoLabel: false,
    });
  }
  /** The word for a symbol in the writing language (Bliss-glosor's head word), or BCI's name. */
  function headOf(id) {
    const c = S() && S().deck.get(id);
    if (c) return c.word;
    const sym = typeof BLISS_DATA !== 'undefined' ? BLISS_DATA.find(s => s.id === id) : null;
    return sym ? (sym.n || '').split(',')[0].replace(/_/g, ' ') : String(id);
  }
  /** The ids a compound is drawn from, in order. */
  const partIds = (w) => (w.parts || []).map(p => p.ids[p.pick]).filter(id => id != null);
  let GRAMMAR = null;
  const grammar = () => GRAMMAR || (GRAMMAR = new window.BlissGrammar.Grammar());
  /** Geometric extent in half-units, without the pen (the same measure as the grammar engine). */
  function extent(els) {
    const m = blissSVG({ e: els }, { unit: 1, strokeUnits: 0, color: '#000' }).match(/viewBox="([-\d.]+) [-\d.]+ ([-\d.]+)/);
    return m ? { x0: +m[1] / 100, x1: (+m[1] + +m[2]) / 100 } : { x0: 0, x1: 0 };
  }
  /** The compound's elements: the parts side by side, a quarter square apart, without their
      indicators; ind = the whole word's form, placed by the grammar engine. symById(id) -> symbol. */
  function compoundEls(w, symById, ind) {
    const G = window.BlissGrammar ? grammar() : null;
    const out = [];
    let right = null;
    for (const id of partIds(w)) {
      const sym = symById(id); if (!sym) continue;
      const els = G ? sym.e.filter(e => !G.isIndicatorElement(e)) : sym.e;
      const use = els.length ? els : sym.e;
      const b = extent(use);
      const dx = right === null ? 0 : Math.round((right + 2 - b.x0) * 2) / 2;
      for (const e of use) { const f = e.slice(); f[4] += dx; if (f[0] === 'X') f[6] += dx; out.push(f); }
      right = b.x1 + dx;
    }
    if (ind && G && out.length) {
      const { words: [one] } = window.BlissGrammar.composeSentence({ byId: { get: () => ({ id: 0, name: w.token, e: out }) } },
        G, [{ id: 0, indicators: String(ind).split('+').filter(Boolean) }]);
      if (one) return one.e;
    }
    return out;
  }

  /** Labels for the chooser: what each option is called, and why it is there. */
  function describe(w, o, lang) {
    const B = S(), tr = (en, sv) => (lang === 'en' ? en : sv);
    const label = o.skip ? (w.future ? tr('leave out – future on the verb', 'utelämna – framtid på verbet') : tr('leave out', 'utelämna'))
      : o.text ? tr('as text', 'som text') : B.optionLabel(o);
    let note = o.via ? '≈ ' + o.via : o.derived ? tr('derived', 'härlett') + (o.form && o.form !== 'action' ? ', ' + B.formName(o.form) : '')
      : o.form ? B.formName(o.form) : '';
    if (!note && o.id != null) {
      const same = (w.opts || []).filter(x => x.id != null && B.optionLabel(x) === label);
      const c = B.deck.get(o.id);
      if (same.length > 1 && c) note = (lang === 'en' ? c.synsEn : c.synsSv).filter(x => x !== label).slice(0, 2).join(', ');
    }
    return { label, note };
  }

  return { on, optionOf, take, defaultOption, pickValue, redefault, resolve, describe, splitCompound, fixedCompound, partIds, compoundEls, headOf };
})();
if (typeof window !== 'undefined') window.SkrivGlosor = SkrivGlosor;
