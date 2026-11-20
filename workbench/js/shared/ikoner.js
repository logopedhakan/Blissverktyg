/* WinBliss² — a Bliss symbol beside every setting and button (2026-11-20).
   wbIcons.put({ '#optGap': '25996', '#btnHint': '25278', … }) puts the symbol
   (BCI-AV ids, drawn by the engine in the text colour) first in the setting's
   label — after a checkbox that comes first — or first in the button. Call it
   at the end of the page's script, when the page has its words in place.
   When the page changes a button's words later (Stop while reading, a file
   name), the symbol is put back. The symbol holds no text of its own, so a
   button's textContent is still only its words. */
'use strict';
const wbIcons = (() => {
  const cache = new Map();
  let byId = null;
  function svg(ids) {
    if (cache.has(ids)) return cache.get(ids);
    if (!byId && typeof BLISS_DATA !== 'undefined') byId = new Map(BLISS_DATA.map(s => [s.id, s]));
    let out = '';
    for (const id of String(ids).split(',')) {
      const sy = byId && byId.get(+id);
      // the engine's <style> would be text in the button: the colour comes from the CSS below instead
      if (sy) try { out += blissSVG(sy, { unit: 3, strokeUnits: 0.75, color: 'currentColor' }).replace(/<style>[\s\S]*?<\/style>/g, '').replace(/>\s+</g, '><').trim(); } catch (_) {}
    }
    cache.set(ids, out);
    return out;
  }
  function css() {
    if (document.getElementById('wbIconsCss')) return;
    const st = document.createElement('style');
    st.id = 'wbIconsCss';
    st.textContent = '.wbi{display:inline-flex;align-items:center;gap:2px;line-height:0;flex:none;vertical-align:middle;margin-right:.4em}' +
      '.wbi svg{height:1.5em;width:auto;display:block}.wbi .bfill{fill:currentColor}' +
      '.wbiw{display:inline-flex;align-items:center;gap:.4em}.wbiw > .wbi{margin-right:0}label > input + .wbi{margin-left:.1em}';
    (document.head || document.documentElement).appendChild(st);
  }
  function make(ids) {
    const s = document.createElement('span');
    s.className = 'wbi';
    s.dataset.ids = ids;
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = svg(ids);
    return s;
  }
  const CONTROL = /^(INPUT|SELECT|TEXTAREA)$/;
  function place(target, ids) {
    if (target.querySelector(':scope > .wbi, :scope > .wbiw > .wbi')) return;
    const icon = make(ids);
    // a checkbox or radio that comes first keeps its place: [x] symbol words
    const first = [...target.childNodes].find(n => n.nodeType === 1 || n.textContent.trim());
    if (first && first.nodeType === 1 && CONTROL.test(first.tagName) && /^(checkbox|radio)$/.test(first.type)) { first.after(icon); return; }
    // a label's words go with their symbol, so a row laid out as "words … setting" stays two parts
    if (!/^(BUTTON|SUMMARY|H[1-6])$/.test(target.tagName) && first && (first.nodeType === 3 || /^(SPAN|B|STRONG)$/.test(first.tagName)) &&
        !(first.querySelector && first.querySelector('input,select,textarea,button'))) {
      const w = document.createElement('span');
      w.className = 'wbiw';
      first.before(w);
      w.append(icon, first);
      return;
    }
    target.prepend(icon);
  }
  /** { selector: 'BCI-AV ids' } — a setting (its label gets the symbol) or a button, summary, heading. */
  function put(map) {
    if (typeof document === 'undefined') return;
    css();
    for (const [sel, ids] of Object.entries(map)) {
      for (const el of document.querySelectorAll(sel)) {
        const target = CONTROL.test(el.tagName) ? (el.closest('label') || null) : el;
        if (!target) continue;
        place(target, ids);
        // the page rewrites the button's words: the symbol comes back
        new MutationObserver(() => place(target, ids)).observe(target, { childList: true });
      }
    }
  }
  return { put, svg };
})();
if (typeof window !== 'undefined') window.wbIcons = wbIcons;
