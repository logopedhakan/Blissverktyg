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
    ? { B: { run: () => (window.wbStyr ? window.wbStyr.open() : window.wbSwitch.open()),
             desc: () => T('steering, switches, eye control and shortcuts — the settings', 'styrning, brytare, ögonstyrning och kortkommandon — inställningarna') } } : {});
  let armed = 0;
  const STYR = () => (typeof window !== 'undefined' && window.wbStyr) || null;
  const help = () => (cfg.onHelp || openList)();

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
    // an own key or joystick button for it (installningar.html) is shown beside the $ key
    const also = (id) => { const S = STYR(), o = S && S.own('alla', id); return o ? ' · ' + S.label(o) : ''; };
    for (const k of FN_KEYS) if (A[k]) fn.push(['$ ' + k + also(k), A[k].desc()]);
    fn.push(['$ ?' + also('help'), T('show this list', 'visa den här listan')]);
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
      (STYR() ? '<button type="button" data-switch style="' + BTN + '">' + esc(T('Steering and shortcuts…', 'Styrning och kortkommandon…')) + '</button>' : '') +
      '<button style="' + BTN + '">' + T('Close', 'Stäng') + '</button></form>';
    const sw = dlg.querySelector('[data-switch]');
    if (sw) sw.onclick = () => { dlg.close(); STYR().open(); };
    dlg.showModal();
    // the close button gets the focus; the list is read from the top
    dlg.querySelector('form button:last-child').focus({ preventScroll: true });
    dlg.scrollTop = 0;
  }

  // own keys for the $ functions and the list, and joystick buttons for them
  if (STYR()) {
    for (const k of FN_KEYS) STYR().onPad('alla', k, () => { const a = acts()[k]; if (a && !document.querySelector('dialog[open]')) { toast(a.desc()); a.run(); } });
    STYR().onPad('alla', 'help', () => { if (!dlg.open) help(); });
  }
  document.addEventListener('keydown', (ev) => {
    const S = STYR();
    if (S && !ev.defaultPrevented && !document.querySelector('dialog[open]')) {
      for (const k of [...FN_KEYS, 'help']) {
        const x = S.extraKey('alla', k);
        if (!x || !S.matches(x, ev)) continue;
        const a = k === 'help' ? { run: help, desc: () => '' } : acts()[k];
        if (!a) continue;
        ev.preventDefault();
        if (a.desc()) toast(a.desc());
        a.run();
        return;
      }
    }
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
  const S = (typeof window !== 'undefined' && window.wbStyr) || null;
  const tool = opts.tool || null;
  const label = (key) => {
    if (S) return S.keyLabel(key);
    const p = key.split('+'), k = p.pop(), last = SIGN[k] || k;
    if (MAC) return p.map(m => ({ Alt: '⌥', Ctrl: '⌘', Shift: '⇧' }[m])).join('') + last;
    return [...p.map(m => (m === 'Shift' ? T('Shift', 'Skift') : m)), last].join('+');
  };
  const aria = (key) => key.split('+').map(m => (m === 'Ctrl' ? (MAC ? 'Meta' : 'Control') : m === 'Escape' ? 'Escape' : m)).join('+');
  const typing = (t) => !!t && (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
    (t.tagName === 'INPUT' && !/^(button|submit|reset|checkbox|radio|range|color|file|image)$/i.test(t.type)));
  // a shortcut the settings know (WB_KEYMAP): its default key and name come from there
  // of: 'alla:speak' — a button that shows a shared key, handled elsewhere (speak.js)
  const known = (it) => (S && (tool || it.of) ? S.item(...(it.of ? it.of.split(':') : [tool, it.id])) : null);
  const items = list.map(it => {
    const k = known(it), [kt, kid] = it.of ? it.of.split(':') : [tool, it.id];
    return Object.assign({}, it, k ? { key: it.key || k.key, name: it.name || (() => (L === 'sv' ? k.sv : k.en)),
      fixed: !!k.fixed, always: !!k.always, reg: true, kt, kid, elsewhere: !!it.of } : {});
  }).filter(it => it.key);
  /* the keys that work now: [the key the page handles itself or we handle, …]
     handled: the ones this function presses the button for */
  const handled = (it) => {
    if (it.elsewhere) return [];
    if (it.reg) return it.fixed ? [S.extraKey(it.kt, it.kid)].filter(Boolean) : [S.keyFor(it.kt, it.kid)];
    return it.shown ? [] : [it.key];
  };
  const keys = (it) => {
    if (!it.reg) return [it.key];
    const out = it.fixed ? [it.key, S.extraKey(it.kt, it.kid)] : [S.keyFor(it.kt, it.kid)];
    const o = S.own(it.kt, it.kid);
    if (o && o.pad) out.push(o);
    return out.filter(Boolean);
  };
  const keysText = (it) => keys(it).map(k => (typeof k === 'string' ? label(k) : S.label(k))).join(' / ');
  const hit = (key, ev) => {
    if (S) return S.matches(key, ev);
    const p = key.split('+'), k = { alt: p.includes('Alt'), ctrl: p.includes('Ctrl'), shift: p.includes('Shift'), key: p[p.length - 1] };
    const ctrl = MAC ? ev.metaKey : ev.ctrlKey;
    if (ev.altKey !== k.alt || ctrl !== k.ctrl) return false;
    return /^[A-Z]$/.test(k.key) ? ev.code === 'Key' + k.key && ev.shiftKey === k.shift : ev.key === k.key;
  };
  // the button's own words: its text, not the Bliss symbol drawn in it
  const words = (el) => {
    let t = '';
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) if (!n.parentElement.closest('svg, style')) t += n.textContent;
    return t;
  };
  // the tooltip keeps its key when the page changes it (a file name, another language) and
  // follows a key changed on the settings page
  const tips = [];
  const tip = (el, it) => {
    let fromWords = !el.title && !el.getAttribute('aria-label');
    let applied = '';                                   // the ending this function put on
    const strip = (t) => (applied && t.endsWith(applied) ? t.slice(0, -applied.length) : t);
    const set = (base) => {
      const suffix = ` (${keysText(it)})`;
      // a key the page already put in the tooltip ("Läs upp (Alt+P)") is replaced, not repeated
      base = strip(base).trim().replace(/\s+/g, ' ').replace(/\s*\(([^()]*)\)$/, (all, k) => (k === it.key || k === label(it.key) ? '' : all))
        .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}…)]+$/gu, '');
      // a tooltip that already names the key ("… or Alt+P, to stop") keeps its own words
      const own = !it.reg || keys(it).length === 1;
      const t = own && base.includes(it.key) ? base : (base || it.name()) + suffix;
      applied = t.endsWith(suffix) ? suffix : '';
      if (el.title !== t) el.title = t;
    };
    const fix = () => {
      if (applied && el.title.endsWith(applied)) return;
      if (el.title.includes(it.key) && !it.reg) return;
      if (el.title) fromWords = false;                 // the page gave it a tooltip of its own
      set(el.title || el.getAttribute('aria-label') || words(el));
    };
    const ariaSet = () => {
      const ks = keys(it).filter(k => typeof k === 'string' && !/^\$ /.test(k));
      if (ks.length) el.setAttribute('aria-keyshortcuts', ks.map(aria).join(' ')); else el.removeAttribute('aria-keyshortcuts');
    };
    fix(); ariaSet();
    new MutationObserver(fix).observe(el, { attributes: true, attributeFilter: ['title'] });
    new MutationObserver(() => { if (fromWords) set(words(el)); }).observe(el, { childList: true, subtree: true, characterData: true });
    tips.push(() => { set(fromWords ? words(el) : el.title); ariaSet(); });
  };
  for (const it of items) { const el = document.getElementById(it.id); if (el) tip(el, it); }
  if (S) S.onChange(() => { for (const f of tips) f(); });
  // what a key or a joystick button does: the button, if it can be pressed now
  const fire = (it) => {
    if (!it.always && opts.paused && opts.paused()) return false;
    if (document.querySelector('dialog[open]')) return false;
    const el = document.getElementById(it.id);
    if (!el || el.disabled || !el.getClientRects().length) return false;
    if (it.run) it.run(); else el.click();
    return true;
  };
  if (S) for (const it of items) if (it.reg && !it.elsewhere) S.onPad(it.kt, it.kid, () => fire(it));
  document.addEventListener('keydown', (ev) => {
    if (ev.defaultPrevented || ev.repeat || ev.isComposing) return;
    for (const it of items) {
      const key = handled(it).find(k => hit(k, ev));
      if (!key) continue;
      const p = key.split('+'), last = p[p.length - 1], mod = p.includes('Alt') || p.includes('Ctrl');
      if ((last.startsWith('Arrow') || (!mod && (last.length === 1 || last === 'Space'))) && typing(ev.target)) return;
      if (!it.always && opts.paused && opts.paused()) return;
      if (document.querySelector('dialog[open]')) return;
      const el = document.getElementById(it.id);
      if (!el || el.disabled || !el.getClientRects().length) return;
      ev.preventDefault();
      if (it.run) it.run(); else el.click();
      return;
    }
  });
  return {
    // rows for the shortcut list: [key, what it does]
    rows: () => items.filter(it => it.inList !== false && document.getElementById(it.id)).map(it => [keysText(it), it.name()]),
    label,
  };
}
