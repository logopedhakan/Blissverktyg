/* WinBliss² — shared sequential shortcuts (Håkans blissanvändare, 2026-09-25).
   Pattern: press the PREFIX, then one key — no chording, so it works from
   remote control, scanning and external keyboards (same rationale as #A for
   form families). Two prefixes:
     #  + letter  = form family (registered by the page where it applies)
     $  + letter  = function: C copy · S save/download · O open · H home
     $  + ?       = show the shortcut list (Esc or click closes)
   Chorded Ctrl/Cmd shortcuts stay wherever they already exist — the $ layer
   is an addition, never a replacement. One module so every part stays in sync. */
'use strict';
function wbShortcuts(cfg) {
  const L = wbLang();
  const T = (en, sv) => L === 'sv' ? sv : en;
  // cfg.actions: { C: {run, desc: () => string}, ... }  (desc lazy: language can switch)
  // cfg.extra:   () => [[keys, desc], ...]  — page-specific rows for the list
  // cfg.title:   () => string  — page name in the list header
  const FN_KEYS = ['C', 'S', 'O', 'H'];
  let armed = 0;

  const toastEl = document.createElement('div');
  toastEl.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);' +
    'background:var(--ink,#1b1b1d);color:var(--bg,#fff);padding:8px 16px;border-radius:10px;' +
    'font-size:13px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:80';
  document.body.appendChild(toastEl);
  let toastT = null;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.style.opacity = '.95';
    clearTimeout(toastT); toastT = setTimeout(() => { toastEl.style.opacity = '0'; }, 2600);
  }

  const dlg = document.createElement('dialog');
  dlg.style.cssText = 'border:1px solid var(--rule,#ccc);border-radius:14px;padding:18px 22px;' +
    'background:var(--panel,#fff);color:var(--ink,#1b1b1d);max-width:440px;font-size:13.5px';
  dlg.setAttribute('aria-label', T('Keyboard shortcuts', 'Kortkommandon'));
  document.body.appendChild(dlg);
  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });
  function openList() {
    const rows = [];
    for (const k of FN_KEYS) if (cfg.actions[k]) rows.push(['$ ' + k, cfg.actions[k].desc()]);
    rows.push(['$ ?', T('show this list', 'visa den här listan')]);
    for (const r of (cfg.extra ? cfg.extra() : [])) rows.push(r);
    dlg.innerHTML = '<h2 style="margin:0 0 4px;font-size:16px">' + T('Keyboard shortcuts', 'Kortkommandon') + '</h2>' +
      '<p style="margin:0 0 10px;color:var(--dim,#666)">' + (cfg.title ? cfg.title() : '') +
      T(' — press the character, release, then press the key (nothing is held down)', ' — tryck tecknet, släpp, tryck sedan tangenten (inget behöver hållas ner)') + '</p>' +
      '<table style="border-collapse:collapse">' + rows.map(([k, d]) =>
        `<tr><td style="padding:3px 14px 3px 0;white-space:nowrap"><b>${k}</b></td>` +
        `<td style="padding:3px 0">${d}</td></tr>`).join('') + '</table>' +
      '<form method="dialog" style="margin-top:12px;text-align:right"><button ' +
      'style="font:inherit;padding:6px 12px;border:1px solid var(--rule,#ccc);border-radius:9px;' +
      'background:var(--panel-2,#f4f3ef);color:inherit;cursor:pointer">' + T('Close', 'Stäng') + '</button></form>';
    dlg.showModal();
  }

  document.addEventListener('keydown', (ev) => {
    const t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
              t.isContentEditable)) return;
    if (dlg.open) return;
    if (ev.key === '$') {
      armed = Date.now(); ev.preventDefault();
      const avail = FN_KEYS.filter(k => cfg.actions[k]).join('/');
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
    const a = cfg.actions[ev.key.toUpperCase()];
    if (!a) { toast(T('No shortcut on $' + ev.key.toUpperCase() + ' — $? shows the list.', 'Ingen genväg på $' + ev.key.toUpperCase() + ' — $? visar listan.')); return; }
    ev.preventDefault();
    toast(a.desc());
    a.run();
  });
  return { openList };
}
