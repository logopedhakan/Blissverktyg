/* WinBliss² — shared sequential shortcuts (Håkans blissanvändare, 2026-09-25).
   Pattern: press the PREFIX, then one key — no chording, so it works from
   remote control, scanning and external keyboards (same rationale as #A for
   form families). Two prefixes:
     #  + letter  = form family (registered by the page where it applies)
     $  + letter  = function: C copy · S save/download · O open · H home
     $  + ?       = show the shortcut list (Esc or click closes)
   Chorded Ctrl/Cmd shortcuts stay wherever they already exist — the $ layer
   is an addition, never a replacement. One module so every part stays in sync.
   wbButtonKeys (2026-11-19): a key on a page's important buttons, shown in
   the button's tooltip; the page puts its rows in the list. */
'use strict';
function wbShortcuts(cfg) {
  const L = wbLang();
  const T = (en, sv) => L === 'sv' ? sv : en;
  // cfg.actions: { C: {run, desc: () => string}, ... }  (desc lazy: language can switch)
  // cfg.extra:   () => [[keys, desc], ...]  — page-specific rows for the list
  // cfg.title:   () => string  — page name in the list header
  const FN_KEYS = ['C', 'S', 'O', 'H', 'B'];
  // $ B: switches and joystick (js/shared/switch.js), in every part that has it
  const acts = () => Object.assign({}, cfg.actions, window.wbSwitch
    ? { B: { run: () => window.wbSwitch.open(), desc: () => T('switches and joystick — learn their keys', 'brytare och joystick — lär in deras tangenter') } } : {});
  let armed = 0;

  const toastEl = document.createElement('div');
  toastEl.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);' +
    'background:var(--ink,#1b1b1d);color:var(--bg,#fff);padding:8px 16px;border-radius:10px;' +
    'font-size:13px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:80';
  toastEl.setAttribute('role', 'status');      // read out by screen readers too
  document.body.appendChild(toastEl);
  let toastT = null;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.style.opacity = '.95';
    clearTimeout(toastT); toastT = setTimeout(() => { toastEl.style.opacity = '0'; }, 2600);
  }

  const dlg = document.createElement('dialog');
  dlg.style.cssText = 'border:1px solid var(--rule,#ccc);border-radius:14px;padding:18px 22px;' +
    'background:var(--panel,#fff);color:var(--ink,#1b1b1d);max-width:min(480px,calc(100vw - 32px));font-size:13.5px;' +
    // the pages reset every margin: centred again, and scrolling inside when the list is long
    'margin:auto;max-height:calc(100vh - 32px);overflow:auto';
  dlg.setAttribute('aria-label', T('Keyboard shortcuts', 'Kortkommandon'));
  document.body.appendChild(dlg);
  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });
  const BTN = 'font:inherit;padding:6px 12px;border:1px solid var(--rule,#ccc);border-radius:9px;background:var(--panel-2,#f4f3ef);color:inherit;cursor:pointer';
  function openList() {
    const rows = [], fn = [];
    const A = acts();
    for (const k of FN_KEYS) if (A[k]) fn.push(['$ ' + k, A[k].desc()]);
    fn.push(['$ ?', T('show this list', 'visa den här listan')]);
    const extra = cfg.extra ? cfg.extra() : [];
    // a page that sorts its keys under headings gets the $ keys under one of their own, after its own
    if (extra.some(r => r.length === 1)) rows.push(...extra, [T('Step by step: $, then a key', 'Steg för steg: $ och sedan en tangent')], ...fn);
    else rows.push(...fn, ...extra);
    // the window size and place (js/shared/window.js), the same in every part
    if (typeof window.wbWindowKeyRows === 'function') {
      if (rows.some(r => r.length === 1)) rows.push([T('Window', 'Fönster')]);
      for (const r of window.wbWindowKeyRows()) rows.push(r);
    }
    // a row of one cell is a heading
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    dlg.innerHTML = '<h2 style="margin:0 0 4px;font-size:16px">' + T('Keyboard shortcuts', 'Kortkommandon') + '</h2>' +
      '<p style="margin:0 0 10px;color:var(--dim,#666)">' + esc(cfg.title ? cfg.title() : '') +
      T(' — $ and #: press the character, release, then press the key (nothing is held down)', ' — $ och #: tryck tecknet, släpp, tryck sedan tangenten (inget behöver hållas ner)') + '</p>' +
      '<table style="border-collapse:collapse;width:100%">' + rows.map(([k, d]) => d === undefined
        ? `<tr><th colspan="2" style="text-align:left;padding:10px 0 2px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--dim,#666)">${esc(k)}</th></tr>`
        : `<tr><td style="padding:3px 14px 3px 0;white-space:nowrap"><b>${esc(k)}</b></td>` +
          `<td style="padding:3px 0;overflow-wrap:anywhere">${esc(d)}</td></tr>`).join('') + '</table>' +
      '<form method="dialog" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">' +
      (window.wbSwitch ? '<button type="button" data-switch style="' + BTN + '">' + esc(T('Switches and joystick…', 'Brytare och joystick…')) + '</button>' : '') +
      '<button style="' + BTN + '">' + T('Close', 'Stäng') + '</button></form>';
    const sw = dlg.querySelector('[data-switch]');
    if (sw) sw.onclick = () => { dlg.close(); window.wbSwitch.open(); };
    dlg.showModal();
    // the close button gets the focus; the list is read from the top
    dlg.querySelector('form button:last-child').focus({ preventScroll: true });
    dlg.scrollTop = 0;
  }

  document.addEventListener('keydown', (ev) => {
    const t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
              t.isContentEditable)) return;
    if (dlg.open) return;
    if (ev.key === '$') {
      armed = Date.now(); ev.preventDefault();
      const avail = FN_KEYS.filter(k => acts()[k]).join('/');
      toast(T('$ — press ' + avail + ', or ? for the list', '$ — tryck ' + avail + ', eller ? för listan')); return;
    }
    if (!armed) return;
    if (ev.key.length !== 1) return;                     // Shift/Alt etc: keep waiting
    if (Date.now() - armed > 4000) { armed = 0; return; }
    armed = 0;
    if (ev.key === '?') {
      // a page with a full help dialog of its own (WinBliss) shows THAT instead,
      // so there is one list to maintain; ours never doubles behind it
      ev.preventDefault(); ev.stopImmediatePropagation();
      (cfg.onHelp || openList)(); return;
    }
    const a = acts()[ev.key.toUpperCase()];
    if (!a) { toast(T('No shortcut on $' + ev.key.toUpperCase() + ' — $? shows the list.', 'Ingen genväg på $' + ev.key.toUpperCase() + ' — $? visar listan.')); return; }
    ev.preventDefault();
    toast(a.desc());
    a.run();
  });
  return { openList };
}

/* Keys on a page's important buttons (2026-11-19), shown where the mouse rests:
   the tooltip ends with the key ("Ny sida (Alt+N)") and screen readers get it as
   aria-keyshortcuts. list: [{ id, key, name: () => string, run?, shown? }]
     key   'Alt+N' · 'Alt+ArrowUp' · 'Ctrl+S' · 'Ctrl+Shift+S' · 'F5' · 'Escape' · '?'
     run   what the key does (default: the button's click — a click with detail 0,
           as from a key or a switch)
     shown the page handles the key itself; here it is only shown
     inList false: not in rows() (the page lists it elsewhere)
   Alt+letter is matched on the physical key (Option+N on a Mac types a sign), and
   works while writing, like Alt+P. Ctrl is ⌘ on a Mac. Alt+arrows and keys without
   a modifier are left to text fields. Nothing happens while opts.paused() (the
   show is running), while a dialog is open, or on a hidden or disabled button. */
function wbButtonKeys(list, opts = {}) {
  const L = wbLang(), T = (en, sv) => (L === 'sv' ? sv : en);
  const MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  const SIGN = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Escape: 'Esc' };
  const label = (key) => {
    const p = key.split('+'), k = p.pop(), last = SIGN[k] || k;
    if (MAC) return p.map(m => ({ Alt: '⌥', Ctrl: '⌘', Shift: '⇧' }[m])).join('') + last;
    return [...p.map(m => (m === 'Shift' ? T('Shift', 'Skift') : m)), last].join('+');
  };
  const aria = (key) => key.split('+').map(m => (m === 'Ctrl' ? (MAC ? 'Meta' : 'Control') : m === 'Escape' ? 'Escape' : m)).join('+');
  const typing = (t) => !!t && (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
    (t.tagName === 'INPUT' && !/^(button|submit|reset|checkbox|radio|range|color|file|image)$/i.test(t.type)));
  const items = list.map(it => {
    const p = it.key.split('+');
    return Object.assign({ k: { alt: p.includes('Alt'), ctrl: p.includes('Ctrl'), shift: p.includes('Shift'), key: p[p.length - 1] } }, it);
  });
  // the button's own words: its text, not the Bliss symbol drawn in it
  const words = (el) => {
    let t = '';
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) if (!n.parentElement.closest('svg, style')) t += n.textContent;
    return t;
  };
  // the tooltip keeps its key when the page changes it (a file name, another language)
  const tip = (el, it) => {
    const suffix = ` (${label(it.key)})`;
    // a button without a tooltip of its own shows its words: they follow a change of language
    let fromWords = !el.title && !el.getAttribute('aria-label');
    const set = (base) => {
      // a key the page already put in the tooltip ("Läs upp (Alt+P)") is replaced, not repeated
      base = base.trim().replace(/\s+/g, ' ').replace(/\s*\(([^()]*)\)$/, (all, k) => (k === it.key || k === label(it.key) ? '' : all))
        .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}…)]+$/gu, '');
      // a tooltip that already names the key ("… or Alt+P, to stop") keeps its own words
      const t = base.includes(it.key) ? base : (base || it.name()) + suffix;
      if (el.title !== t) el.title = t;
    };
    const fix = () => {
      if (el.title.endsWith(suffix) || el.title.includes(it.key)) return;
      if (el.title) fromWords = false;                 // the page gave it a tooltip of its own
      set(el.title || el.getAttribute('aria-label') || words(el));
    };
    fix();
    new MutationObserver(fix).observe(el, { attributes: true, attributeFilter: ['title'] });
    new MutationObserver(() => { if (fromWords) set(words(el)); }).observe(el, { childList: true, subtree: true, characterData: true });
    el.setAttribute('aria-keyshortcuts', aria(it.key));
  };
  for (const it of items) { const el = document.getElementById(it.id); if (el) tip(el, it); }
  document.addEventListener('keydown', (ev) => {
    if (ev.defaultPrevented || ev.repeat || ev.isComposing) return;
    if (opts.paused && opts.paused()) return;
    if (document.querySelector('dialog[open]')) return;
    const ctrl = MAC ? ev.metaKey : ev.ctrlKey;
    for (const it of items) {
      const k = it.k;
      if (it.shown || ev.altKey !== k.alt || ctrl !== k.ctrl) continue;
      const hit = /^[A-Z]$/.test(k.key) ? ev.code === 'Key' + k.key && ev.shiftKey === k.shift : ev.key === k.key;
      if (!hit) continue;
      if ((k.key.startsWith('Arrow') || (!k.alt && !k.ctrl && k.key.length === 1)) && typing(ev.target)) return;
      const el = document.getElementById(it.id);
      if (!el || el.disabled || !el.getClientRects().length) return;
      ev.preventDefault();
      if (it.run) it.run(); else el.click();
      return;
    }
  });
  return {
    // rows for the shortcut list: [key, what it does]
    rows: () => items.filter(it => it.inList !== false && document.getElementById(it.id)).map(it => [label(it.key), it.name()]),
    label,
  };
}
