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
    for (const w of W) {
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

  return { on, optionOf, take, defaultOption, pickValue, redefault, resolve, describe };
})();
if (typeof window !== 'undefined') window.SkrivGlosor = SkrivGlosor;
