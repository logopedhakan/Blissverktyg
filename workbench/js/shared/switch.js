/* WinBliss² — switches and joysticks, the same in every part (2026-11-19).
   A switch interface sends keys (Space and Enter, F7/F8, 1/2 …) or shows up
   as a joystick (a game controller). Here the person, or whoever helps, teaches
   the app which key or button is which:
     Stega        (step)    moves to the next button, like Tab
     Bekräfta     (confirm) presses it, like Enter
     Stega bakåt  (back)    the button before (optional)
   The choice is kept in this browser ('wb-brytare') and works in every part.
   A joystick works without learning: the stick and the cross step (right/down
   forward, left/up back) and its first button confirms; learned buttons win.
   Tab, Enter and Space keep doing what they always do; a learned key that
   types a character is left to text fields, so writing still works.
   A page can steer it: wbSwitch.scope() -> the elements to step between (or
   null), wbSwitch.hook(role) -> true when the page handled it itself. */
'use strict';
const wbSwitch = (() => {
  const T = (en, sv) => ((typeof wbLang === 'function' ? wbLang() : 'sv') === 'sv' ? sv : en);
  const STORE = 'wb-brytare';
  const ROLES = ['step', 'confirm', 'back'];
  const ROLE_NAME = { step: () => T('Step', 'Stega'), confirm: () => T('Confirm', 'Bekräfta'), back: () => T('Step back', 'Stega bakåt') };
  const MODIFIERS = ['Shift', 'Control', 'Alt', 'Meta', 'AltGraph', 'CapsLock', 'Fn', 'OS'];

  /* ---- what was learned ---- */
  // a key { code, key }, a joystick button { pad: 'button', i } or a stick direction { pad: 'axis', i, dir }
  function cleanInput(x) {
    if (!x || typeof x !== 'object') return null;
    if (x.pad === 'button') return Number.isInteger(x.i) && x.i >= 0 && x.i < 64 ? { pad: 'button', i: x.i } : null;
    if (x.pad === 'axis') return Number.isInteger(x.i) && x.i >= 0 && x.i < 16 && (x.dir === 1 || x.dir === -1) ? { pad: 'axis', i: x.i, dir: x.dir } : null;
    if (typeof x.key === 'string' && x.key && x.key.length <= 30 && (x.code === undefined || (typeof x.code === 'string' && x.code.length <= 30)))
      return { code: x.code || '', key: x.key };
    return null;
  }
  function clean(o) {
    const out = { stick: !(o && o.stick === false) };
    for (const r of ROLES) { const v = cleanInput(o && o[r]); if (v) out[r] = v; }
    return out;
  }
  let cfg = clean((() => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (_) { return null; } })());
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch (_) {} };

  const KEY_NAME = { ' ': () => T('Space', 'Mellanslag'), Enter: () => 'Enter', Tab: () => 'Tab', Backspace: () => T('Backspace', 'Backsteg'),
    ArrowUp: () => '↑', ArrowDown: () => '↓', ArrowLeft: () => '←', ArrowRight: () => '→', Escape: () => 'Esc' };
  /** A learned input in words: "F8", "Mellanslag", "joystickknapp 2", "joystick höger". */
  function nameOf(x) {
    if (!x) return T('not learned', 'inte inlärd');
    if (x.pad === 'button') return T('joystick button ', 'joystickknapp ') + (x.i + 1);
    if (x.pad === 'axis') {
      const d = x.i % 2 === 0 ? (x.dir > 0 ? T('right', 'höger') : T('left', 'vänster')) : (x.dir > 0 ? T('down', 'ner') : T('up', 'upp'));
      return 'joystick ' + d + (x.i > 1 ? ' (' + T('stick ', 'spak ') + (Math.floor(x.i / 2) + 1) + ')' : '');
    }
    const n = KEY_NAME[x.key];
    return n ? n() : x.key.length === 1 ? x.key.toUpperCase() : x.key;
  }
  const sameKey = (x, ev) => !!x && !x.pad && (x.code && ev.code ? x.code === ev.code : x.key === ev.key);
  const samePad = (x, y) => !!x && x.pad === y.pad && x.i === y.i && (x.pad !== 'axis' || x.dir === y.dir);
  // what the key already does without any learning
  const native = (role, x) => !x.pad && ((role === 'step' && x.key === 'Tab') || (role === 'confirm' && (x.key === 'Enter' || x.key === ' ')));
  const typesChar = (x) => !x.pad && (x.key.length === 1 || x.key === 'Enter' || x.key === 'Backspace');
  const typing = (t) => !!t && (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
    (t.tagName === 'INPUT' && !/^(button|submit|reset|checkbox|radio|range|color|file|image)$/i.test(t.type)));

  /* ---- stepping and pressing ---- */
  const FOCUSABLE = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]';
  const shown = (el) => !el.disabled && el.tabIndex >= 0 && !el.closest('[inert]') && el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== 'hidden';
  function stops() {
    const s = api.scope ? api.scope() : null;
    if (s) return (Array.isArray(s) ? s : [...s.querySelectorAll(FOCUSABLE)]).filter(el => el && shown(el));
    let root = document;
    try { root = [...document.querySelectorAll('dialog[open]')].filter(d => d.matches(':modal')).pop() || document; } catch (_) {}
    return [...root.querySelectorAll(FOCUSABLE)].filter(shown);
  }
  function move(d) {
    const list = stops();
    if (!list.length) return;
    const a = document.activeElement;
    const i = list.findIndex(el => el === a || el.contains(a));
    const el = list[i < 0 ? (d > 0 ? 0 : list.length - 1) : (i + d + list.length) % list.length];
    el.focus();
    if (el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function press() {
    const el = document.activeElement;
    if (!el || el === document.body || el === document.documentElement) { move(1); return; }
    if (el.tagName === 'SELECT') { try { el.showPicker(); } catch (_) {} return; }
    if (typing(el)) return;
    el.click();                                     // detail 0: as from a key or a switch
  }
  function act(role) {
    if (api.hook && api.hook(role)) return;
    if (role === 'confirm') press(); else move(role === 'back' ? -1 : 1);
  }

  /* ---- learning ---- */
  let learning = null;                              // { role, done(input) }
  let swallowUp = null;                             // the code whose keyup must not reach the page
  function learned(x) {
    const l = learning; learning = null;
    clearTimeout(learnT);
    if (!l) return;
    for (const r of ROLES) if (r !== l.role && cfg[r] && (x.pad ? samePad(cfg[r], x) : !cfg[r].pad && cfg[r].key === x.key && cfg[r].code === x.code)) delete cfg[r];
    cfg[l.role] = x; save();
    l.done(x);
  }
  let learnT = null;

  /* ---- keys ---- */
  addEventListener('keydown', (ev) => {
    if (learning) {
      if (MODIFIERS.includes(ev.key)) return;       // wait for the key itself
      ev.preventDefault(); ev.stopImmediatePropagation();
      swallowUp = ev.code || ev.key;
      if (ev.key === 'Escape') { const l = learning; learning = null; clearTimeout(learnT); l.done(null); return; }
      learned({ code: ev.code || '', key: ev.key });
      return;
    }
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return; // a chord is another key
    const role = ROLES.find(r => sameKey(cfg[r], ev));
    if (!role || native(role, cfg[role])) return;
    if (typing(ev.target) && typesChar(cfg[role])) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    swallowUp = ev.code || ev.key;
    if (!ev.repeat) act(role);
  }, true);
  addEventListener('keyup', (ev) => {
    if (swallowUp && (ev.code || ev.key) === swallowUp) { swallowUp = null; ev.preventDefault(); ev.stopImmediatePropagation(); }
  }, true);

  /* ---- joysticks (the Gamepad API) ---- */
  const was = new Map();
  let polling = false;
  function padInput(x, std) {
    if (learning) { learned(x); return; }
    if (!document.hasFocus()) return;               // two windows side by side: only the one in use
    const role = ROLES.find(r => samePad(cfg[r], x));
    if (role) { act(role); return; }
    // not learned: the first button confirms, until Confirm is learned on the joystick
    if (x.pad === 'button' && x.i === 0 && !(cfg.confirm && cfg.confirm.pad)) { act('confirm'); return; }
    if (!cfg.stick) return;
    if (x.pad === 'axis' && x.i < 2) act(x.dir > 0 ? 'step' : 'back');
    else if (std && x.pad === 'button' && x.i >= 12 && x.i <= 15) act(x.i === 13 || x.i === 15 ? 'step' : 'back');
  }
  function poll() {
    const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : [];
    if (!pads.length) { polling = false; return; }
    for (const p of pads) {
      const before = was.get(p.index) || { b: [], a: [] };
      const now = { b: p.buttons.map(b => b.pressed || b.value > 0.5), a: p.axes.map(v => (v > 0.6 ? 1 : v < -0.6 ? -1 : 0)) };
      const std = p.mapping === 'standard';
      now.b.forEach((on, i) => { if (on && !before.b[i]) padInput({ pad: 'button', i }, std); });
      now.a.forEach((v, i) => { if (v && v !== before.a[i]) padInput({ pad: 'axis', i, dir: v }, std); });
      was.set(p.index, now);
    }
    setTimeout(poll, 30);
  }
  // a timer, not animation frames: a window that is not being drawn (side by side, behind
  // another) still hears its joystick
  const startPolling = () => { if (!polling && navigator.getGamepads) { polling = true; setTimeout(poll, 30); } };
  addEventListener('gamepadconnected', () => { startPolling(); padStatus(); });
  addEventListener('gamepaddisconnected', padStatus);
  startPolling();                                   // a joystick already known to this page
  function padName() {
    const p = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean)[0] : null;
    return p ? p.id.replace(/\s*\(.*$/, '').slice(0, 60) : null;
  }

  /* ---- the dialog ---- */
  let dlg = null;
  function padStatus() {
    if (!dlg || !dlg.open) return;
    const n = padName();
    dlg.querySelector('[data-pad]').textContent = n ? T('Joystick connected: ', 'Joystick ansluten: ') + n
      : T('No joystick found — connect it and press one of its buttons.', 'Ingen joystick hittad — anslut den och tryck på en av dess knappar.');
  }
  function build() {
    dlg = document.createElement('dialog');
    dlg.id = 'wbSwitchDlg';
    dlg.setAttribute('aria-labelledby', 'wbSwitchHead');
    dlg.style.cssText = 'border:1px solid var(--rule,#ccc);border-radius:14px;padding:18px 22px;margin:auto;' +
      'background:var(--panel,#fff);color:var(--ink,#1b1b1d);width:min(520px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;font-size:14px;line-height:1.45';
    document.body.appendChild(dlg);
    dlg.addEventListener('close', () => { if (learning) { learning = null; clearTimeout(learnT); } });
  }
  const BTN = 'font:inherit;padding:7px 13px;border:1px solid var(--rule,#ccc);border-radius:9px;background:var(--panel-2,#f4f3ef);color:inherit;cursor:pointer;min-height:40px';
  function render() {
    const note = (t) => { const n = dlg.querySelector('[data-note]'); n.textContent = t; };
    dlg.innerHTML = `<h2 id="wbSwitchHead" style="margin:0 0 6px;font-size:17px"></h2>
      <p data-intro style="margin:0 0 12px;color:var(--dim,#555)"></p>
      <table style="border-collapse:collapse;width:100%"></table>
      <p data-note role="status" aria-live="polite" style="min-height:1.45em;margin:10px 0;font-weight:600"></p>
      <fieldset style="border:1px solid var(--rule,#ccc);border-radius:10px;padding:8px 12px 12px;margin:0 0 12px">
        <legend data-try style="padding:0 6px"></legend>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button type="button" data-t="1" style="${BTN}">1</button><button type="button" data-t="2" style="${BTN}">2</button><button type="button" data-t="3" style="${BTN}">3</button>
          <span data-tried role="status" aria-live="polite"></span></div></fieldset>
      <p data-pad style="margin:0 0 6px;color:var(--dim,#555)"></p>
      <label style="display:flex;gap:8px;align-items:center;margin:0 0 14px"><input type="checkbox" data-stick><span data-stick-l></span></label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
        <button type="button" data-forget style="${BTN}"></button><span style="flex:1"></span>
        <button type="button" data-close style="${BTN};background:var(--accent,#28558C);color:var(--on-accent,#fff);border-color:var(--accent,#28558C)"></button></div>`;
    dlg.querySelector('#wbSwitchHead').textContent = T('Switches and joystick', 'Brytare och joystick');
    dlg.querySelector('[data-intro]').textContent = T(
      'Teach the app which keys or buttons your switches send. Step moves to the next button, Confirm presses it. Kept in this browser, in every part.',
      'Lär Blissverktyget vilka tangenter eller knappar dina brytare skickar. Stega flyttar till nästa knapp, Bekräfta trycker på den. Sparas i den här webbläsaren och gäller alla delar.');
    const table = dlg.querySelector('table');
    for (const r of ROLES) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<th scope="row" style="text-align:left;padding:5px 10px 5px 0;white-space:nowrap"></th>
        <td data-cur style="padding:5px 10px 5px 0;width:100%"></td>
        <td style="padding:5px 0;white-space:nowrap"><button type="button" data-learn style="${BTN}"></button></td>`;
      tr.querySelector('th').textContent = ROLE_NAME[r]() + (r === 'back' ? T(' (optional)', ' (valfri)') : '');
      const cur = tr.querySelector('[data-cur]'), b = tr.querySelector('[data-learn]');
      const show = () => { cur.textContent = nameOf(cfg[r]); b.textContent = T('Learn', 'Lär in'); b.setAttribute('aria-label', T('Learn ', 'Lär in ') + ROLE_NAME[r]()); };
      show();
      b.onclick = () => {
        b.textContent = T('Press now…', 'Tryck nu…');
        note(T(`Press the switch for ${ROLE_NAME[r]()} now. Esc cancels.`, `Tryck på brytaren för ${ROLE_NAME[r]()} nu. Esc avbryter.`));
        clearTimeout(learnT);
        learnT = setTimeout(() => { if (learning) { learning = null; show(); note(T('Nothing was pressed — try again.', 'Inget trycktes — försök igen.')); } }, 15000);
        learning = { role: r, done: (x) => {
          for (const row of table.rows) row.dispatchEvent(new Event('wb-refresh'));
          if (!x) { note(T('Cancelled.', 'Avbrutet.')); return; }
          note(native(r, x) ? T(`${nameOf(x)}: what that key always does — it works as before.`, `${nameOf(x)}: det tangenten alltid gör — det fungerar som förut.`)
            : typesChar(x) ? T(`${ROLE_NAME[r]()}: ${nameOf(x)}. It types a character, so in text fields it types as usual — an F key (F1–F12) works everywhere, if the switch can send one.`,
                               `${ROLE_NAME[r]()}: ${nameOf(x)}. Den skriver ett tecken, så i textrutor skriver den som vanligt — en F-tangent (F1–F12) fungerar överallt, om brytaren kan skicka det.`)
            : T(`${ROLE_NAME[r]()}: ${nameOf(x)}. Try it on 1 2 3 below.`, `${ROLE_NAME[r]()}: ${nameOf(x)}. Prova på 1 2 3 nedan.`));
        } };
      };
      tr.addEventListener('wb-refresh', show);
      table.appendChild(tr);
    }
    dlg.querySelector('[data-try]').textContent = T('Try it', 'Prova');
    for (const b of dlg.querySelectorAll('[data-t]'))
      b.onclick = () => { dlg.querySelector('[data-tried]').textContent = T('✓ Confirmed: ', '✓ Bekräftat: ') + b.dataset.t; };
    const stick = dlg.querySelector('[data-stick]');
    stick.checked = cfg.stick;
    dlg.querySelector('[data-stick-l]').textContent = T('The joystick\'s stick steps (right/down forward, left/up back)', 'Joystickens spak stegar (höger/ner framåt, vänster/upp bakåt)');
    stick.onchange = () => { cfg.stick = stick.checked; save(); };
    const forget = dlg.querySelector('[data-forget]');
    forget.textContent = T('Forget the switches', 'Glöm brytarna');
    forget.onclick = () => {
      cfg = clean({ stick: cfg.stick }); save();
      for (const row of table.rows) row.dispatchEvent(new Event('wb-refresh'));
      note(T('Forgotten — Tab and Enter work as always.', 'Glömt — Tab och Enter fungerar som vanligt.'));
    };
    const close = dlg.querySelector('[data-close]');
    close.textContent = T('Done', 'Klar');
    close.onclick = () => dlg.close();
    padStatus();
  }
  function open() {
    if (!dlg) build();
    render();
    if (!dlg.open) dlg.showModal();
    padStatus();
    startPolling();
    const first = dlg.querySelector('[data-learn]');
    if (first) first.focus();
  }

  const api = { open, nameOf, clean, get config() { return cfg; }, scope: null, hook: null };
  return api;
})();
if (typeof window !== 'undefined') window.wbSwitch = wbSwitch;
