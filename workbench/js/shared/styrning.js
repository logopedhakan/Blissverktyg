/* WinBliss² — styrning: how the person steers every part (2026-11-20).
   One place for it all, kept in this browser ('wb-styrning') and read by every
   part, so a change on the settings page (installningar.html) holds everywhere
   at once — open tabs included (the 'storage' event).
     mode     standard  mouse, touch and keyboard (learned switches work too)
              brytare2  two switches: Step and Confirm (js/shared/switch.js)
              brytare1  one switch: the buttons are stepped through by themselves
                        (scanning) and the switch chooses
              oga       eye control: look at a button and rest there (dwell)
     scan     the one-switch stepping: time per button, rounds before it rests,
              and where it goes on after a choice
     dwell    the resting time, the ring that fills, the pause button
     strong   a thick yellow-and-black ring on the button in focus
     keys     the person's own keys for the shortcuts: { 'tool:id': input }
   The shortcuts themselves are listed here (WB_KEYMAP), the same list the
   settings page shows; a page gives only what a key does (shortcuts.js). */
'use strict';

/* every shortcut that can be set: per part, the default key and its name.
   fixed: the page handles the default key itself (it keeps working); an own
   key or joystick button is then an addition, never a replacement.
   always: works while the page's own keys rest (the slideshow being shown). */
const WB_KEYMAP = [
  { tool: 'alla', sv: 'I alla delar', en: 'In every part', keys: [
    { id: 'speak', key: 'Alt+P', fixed: true, sv: 'läs upp / stoppa uppläsningen', en: 'read aloud / stop reading' },
    { id: 'help', key: '?', fixed: true, sv: 'alla kortkommandon för delen', en: "all of the part's keyboard shortcuts" },
    { id: 'C', key: '$ C', fixed: true, sv: 'kopiera', en: 'copy' },
    { id: 'S', key: '$ S', fixed: true, sv: 'spara', en: 'save' },
    { id: 'O', key: '$ O', fixed: true, sv: 'öppna', en: 'open' },
    { id: 'H', key: '$ H', fixed: true, sv: 'till startsidan', en: 'to the start page' },
    { id: 'B', key: '$ B', fixed: true, sv: 'styrning och kortkommandon (inställningarna)', en: 'steering and shortcuts (the settings)' },
  ] },
  { tool: 'skriv', sv: 'Skriv', en: 'Write', keys: [
    { id: 'wMic', key: 'Alt+M', sv: 'diktera', en: 'dictate' },
    { id: 'wFam', key: 'Alt+O', sv: 'hämta ett ord ur Formfamiljer', en: 'fetch a word from Form families' },
    { id: 'wOpenDoc', key: 'Ctrl+O', sv: 'öppna ett dokument', en: 'open a document' },
    { id: 'wSaveDoc', key: 'Ctrl+S', sv: 'spara dokumentet', en: 'save the document' },
    { id: 'wPrint', key: 'Ctrl+P', sv: 'skriv ut eller spara som PDF', en: 'print, or save as PDF' },
    { id: 'wClip', key: 'Alt+C', sv: 'kopiera texten till urklipp', en: 'copy the text to the clipboard' },
    { id: 'wToShow', key: 'Alt+B', sv: 'texten som en ny sida i Bildspel', en: 'the text as a new slide in Slideshow' },
    { id: 'wToTag', key: 'Alt+G', sv: 'symbolerna på ett gravyrkort', en: 'the symbols onto an engraving tag' },
  ] },
  { tool: 'bildspel', sv: 'Bildspel', en: 'Slideshow', keys: [
    { id: 'btnPlay', key: 'F5', fixed: true, sv: 'visa från första sidan (Skift+F5: från den här)', en: 'show from the first slide (Shift+F5: from this one)' },
    { id: 'btnAdd', key: 'Alt+N', sv: 'ny sida', en: 'new slide' },
    { id: 'btnDup', key: 'Alt+K', sv: 'kopiera sidan', en: 'copy the slide' },
    { id: 'btnDel', key: 'Alt+R', sv: 'ta bort sidan', en: 'remove the slide' },
    { id: 'btnUp', key: 'Alt+ArrowUp', sv: 'flytta upp sidan', en: 'move the slide up' },
    { id: 'btnDown', key: 'Alt+ArrowDown', sv: 'flytta ner sidan', en: 'move the slide down' },
    { id: 'btnImg', key: 'Alt+B', sv: 'välj bild', en: 'choose a picture' },
    { id: 'btnOpen', key: 'Ctrl+O', sv: 'öppna ett bildspel', en: 'open a slideshow' },
    { id: 'btnSave', key: 'Ctrl+S', sv: 'spara bildspelet', en: 'save the slideshow' },
    { id: 'btnSaveAs', key: 'Ctrl+Shift+S', sv: 'spara som…', en: 'save as…' },
    { id: 'showNext', key: 'ArrowRight', fixed: true, always: true, sv: 'under visning: nästa sida', en: 'while showing: next slide' },
    { id: 'showPrev', key: 'ArrowLeft', fixed: true, always: true, sv: 'under visning: sidan före', en: 'while showing: the slide before' },
    { id: 'showSpeak', key: 'L', fixed: true, always: true, sv: 'under visning: läs upp sidan', en: 'while showing: read the slide aloud' },
    { id: 'showExit', key: 'Escape', fixed: true, always: true, sv: 'under visning: avsluta visningen', en: 'while showing: end the show' },
  ] },
  { tool: 'memory', sv: 'Memory', en: 'Memory', keys: [
    { id: 'btnNew', key: 'Alt+N', sv: 'nytt spel', en: 'new game' },
  ] },
  { tool: 'gissa', sv: 'Hänga gubbe', en: 'Hangman', keys: [
    { id: 'btnNext', key: 'Alt+N', sv: 'nytt ord', en: 'new word' },
    { id: 'btnHint', key: 'Alt+L', sv: 'ledtråd', en: 'hint' },
  ] },
];

const wbStyr = (() => {
  const lang = () => (typeof wbLang === 'function' ? wbLang() : 'sv');
  const T = (en, sv) => (lang() === 'sv' ? sv : en);
  const STORE = 'wb-styrning';
  const MODES = ['standard', 'brytare2', 'brytare1', 'oga'];
  const MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  const num = (v, lo, hi, d) => (Number.isFinite(+v) && v !== null && v !== '' ? Math.min(hi, Math.max(lo, Math.round(+v))) : d);

  /* ---- key strings: 'Alt+N', 'Ctrl+Shift+S', 'F5', 'Alt+ArrowUp', '?' ---- */
  const NAMED = /^(F([1-9]|1[0-9]|2[0-4])|Arrow(Up|Down|Left|Right)|Escape|Enter|Tab|Backspace|Delete|Insert|Home|End|PageUp|PageDown|Pause|ContextMenu|MediaPlayPause|MediaTrackNext|MediaTrackPrevious|AudioVolumeUp|AudioVolumeDown|AudioVolumeMute)$/;
  function parse(key) {
    const p = String(key).split('+');
    let k = p.pop();
    if (k === '' && p.length) { p.pop(); k = '+'; }                // 'Ctrl++'
    return { alt: p.includes('Alt'), ctrl: p.includes('Ctrl'), shift: p.includes('Shift'), key: k };
  }
  const okKey = (s) => typeof s === 'string' && s.length <= 40 && (() => {
    const p = parse(s);
    return /^[A-Z0-9]$/.test(p.key) || NAMED.test(p.key) || (p.key.length === 1 && p.key !== ' ' && !p.shift);
  })();
  /** A key press as a key string (null while only a modifier is down). */
  function keyOf(ev) {
    if (['Shift', 'Control', 'Alt', 'Meta', 'AltGraph', 'CapsLock', 'Fn', 'OS', 'Dead', 'Process', 'Unidentified'].includes(ev.key)) return null;
    let k = null;
    const m = /^(Key([A-Z])|Digit([0-9])|Numpad([0-9]))$/.exec(ev.code || '');
    if (m) k = m[2] || m[3] || m[4];
    else if (NAMED.test(ev.key)) k = ev.key;
    else if (ev.key && ev.key.length === 1 && ev.key !== ' ') k = ev.key;
    else if (ev.key === ' ') k = 'Space';
    if (!k) return null;
    const ctrl = MAC ? ev.metaKey : ev.ctrlKey;
    // a printed sign carries its Shift in itself ('?' is Shift+/ on some keyboards)
    const shift = ev.shiftKey && (/^[A-Z0-9]$/.test(k) || NAMED.test(k) || k === 'Space');
    return [ctrl && 'Ctrl', ev.altKey && 'Alt', shift && 'Shift', k].filter(Boolean).join('+');
  }
  function matches(key, ev) {
    if (!key || /^\$ /.test(key)) return false;
    const p = parse(key), ctrl = MAC ? ev.metaKey : ev.ctrlKey;
    if (ev.altKey !== p.alt || ctrl !== p.ctrl) return false;
    if (/^[A-Z]$/.test(p.key)) return ev.code === 'Key' + p.key && ev.shiftKey === p.shift;
    if (/^[0-9]$/.test(p.key)) return (ev.code === 'Digit' + p.key || ev.code === 'Numpad' + p.key) && ev.shiftKey === p.shift;
    if (p.key === 'Space') return ev.key === ' ' && ev.shiftKey === p.shift;
    if (NAMED.test(p.key)) return ev.key === p.key && ev.shiftKey === p.shift;
    return ev.key === p.key;
  }
  const SIGN = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Escape: 'Esc' };
  function keyLabel(key) {
    if (/^\$ /.test(key)) return key;
    const p = parse(key), last = p.key === 'Space' ? T('Space', 'Mellanslag') : SIGN[p.key] || p.key;
    const mods = [p.ctrl && 'Ctrl', p.alt && 'Alt', p.shift && 'Shift'].filter(Boolean);
    if (MAC) return mods.map(m => ({ Alt: '⌥', Ctrl: '⌘', Shift: '⇧' }[m])).join('') + last;
    return [...mods.map(m => (m === 'Shift' ? T('Shift', 'Skift') : m)), last].join('+');
  }
  const ariaKey = (key) => key.split('+').map(m => (m === 'Ctrl' ? (MAC ? 'Meta' : 'Control') : m === 'Space' ? 'Space' : m)).join('+');

  /* ---- joystick inputs: a button { pad: 'button', i } or a stick direction { pad: 'axis', i, dir } ---- */
  function cleanPad(x) {
    if (!x || typeof x !== 'object') return null;
    if (x.pad === 'button') return Number.isInteger(x.i) && x.i >= 0 && x.i < 64 ? { pad: 'button', i: x.i } : null;
    if (x.pad === 'axis') return Number.isInteger(x.i) && x.i >= 0 && x.i < 16 && (x.dir === 1 || x.dir === -1) ? { pad: 'axis', i: x.i, dir: x.dir } : null;
    return null;
  }
  const samePad = (x, y) => !!x && !!y && x.pad === y.pad && x.i === y.i && (x.pad !== 'axis' || x.dir === y.dir);
  function padLabel(x) {
    if (x.pad === 'button') return T('joystick button ', 'joystickknapp ') + (x.i + 1);
    const d = x.i % 2 === 0 ? (x.dir > 0 ? T('right', 'höger') : T('left', 'vänster')) : (x.dir > 0 ? T('down', 'ner') : T('up', 'upp'));
    return 'joystick ' + d + (x.i > 1 ? ' (' + T('stick ', 'spak ') + (Math.floor(x.i / 2) + 1) + ')' : '');
  }
  /** An input in words: a key string, or a joystick button / direction. */
  const label = (b) => (!b ? '' : b.pad ? padLabel(b) : keyLabel(b.key || b));
  function cleanBinding(b) {
    if (!b || typeof b !== 'object') return null;
    if (b.pad) return cleanPad(b);
    return okKey(b.key) ? { key: b.key } : null;
  }

  /* ---- the settings ---- */
  const item = (tool, id) => { const g = WB_KEYMAP.find(x => x.tool === tool); return (g && g.keys.find(k => k.id === id)) || null; };
  function clean(o) {
    o = o && typeof o === 'object' ? o : {};
    const sc = o.scan || {}, dw = o.dwell || {};
    const keys = {};
    for (const [k, v] of Object.entries(o.keys && typeof o.keys === 'object' ? o.keys : {})) {
      const [tool, id] = k.split(':');
      const b = item(tool, id) && cleanBinding(v);
      if (b) keys[tool + ':' + id] = b;
    }
    return {
      mode: MODES.includes(o.mode) ? o.mode : 'standard',
      scan: { ms: num(sc.ms, 500, 6000, 1500), rounds: num(sc.rounds, 1, 9, 3), restart: sc.restart === true },
      dwell: { ms: num(dw.ms, 400, 4000, 1000), ring: dw.ring !== false, pause: dw.pause !== false },
      strong: o.strong === true,
      keys,
    };
  }
  const read = () => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (_) { return null; } };
  let S = clean(read());
  const listeners = [];
  function changed() { look(); for (const f of listeners) try { f(S); } catch (_) {} }
  function save(next) {
    S = clean(next);
    try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (_) {}
    changed();
  }
  if (typeof addEventListener === 'function')
    addEventListener('storage', (e) => { if (e.key === STORE || e.key === null) { S = clean(read()); changed(); } });

  /* ---- bindings ---- */
  const own = (tool, id) => S.keys[tool + ':' + id] || null;
  /** The key that works now: the own key, else the default (a fixed default always works). */
  function keyFor(tool, id, fallback) {
    const it = item(tool, id), o = own(tool, id);
    const def = it ? it.key : fallback;
    if (o && !o.pad && !(it && it.fixed)) return o.key;
    return def || null;
  }
  /** The own key that works besides a fixed default (or null). */
  function extraKey(tool, id) {
    const it = item(tool, id), o = own(tool, id);
    return it && it.fixed && o && !o.pad ? o.key : null;
  }
  function setOwn(tool, id, b) {
    const keys = Object.assign({}, S.keys);
    if (b) keys[tool + ':' + id] = b; else delete keys[tool + ':' + id];
    save(Object.assign({}, S, { keys }));
  }
  /** What else already uses this input: the actions in the same part or in every part,
      and the switches. [{ tool, id, name }] — empty when it is free. */
  function conflicts(tool, id, b, roles) {
    const out = [];
    const sameInput = (x) => !!x && (b.pad ? samePad(x, b) : !x.pad && (x.key || x) === b.key);
    for (const g of WB_KEYMAP) {
      if (!(g.tool === tool || g.tool === 'alla' || tool === 'alla')) continue;
      for (const k of g.keys) {
        if (g.tool === tool && k.id === id) continue;
        const o = own(g.tool, k.id);
        const uses = [o];
        if (!o || o.pad || k.fixed) uses.push({ key: k.key });        // the default still works
        if (uses.some(sameInput)) out.push({ tool: g.tool, id: k.id, name: lang() === 'sv' ? k.sv : k.en, part: lang() === 'sv' ? g.sv : g.en });
      }
    }
    for (const [r, x] of Object.entries(roles || {})) if (x && typeof x === 'object' && (b.pad ? samePad(x, b) : !x.pad && keyOf(Object.assign({ altKey: false, ctrlKey: false, metaKey: false, shiftKey: false }, x)) === b.key))
      out.push({ role: r, name: r });
    return out;
  }
  /** Keys that must stay what they are: moving, pressing, typing the $ and # keys, the window's own keys. */
  function reserved(key) {
    const p = parse(key);
    if (!p.alt && !p.ctrl && ['Tab', 'Enter', 'Space', 'Escape', 'Backspace', '$', '#'].includes(p.key)) return true;
    if (!p.alt && !p.ctrl && !p.shift && /^Arrow/.test(p.key)) return true;
    if (p.alt && !p.ctrl && !p.shift && /^[123VH]$/.test(p.key)) return true;    // the window's keys (window.js)
    if (p.ctrl && !p.alt && /^[CVXZAY]$/.test(p.key)) return true;                // copy, paste, cut, undo, select all, redo
    return false;
  }

  /* ---- joystick buttons for actions: the page registers what each does ---- */
  const padActs = [];
  function onPad(tool, id, run) { padActs.push({ tool, id, run }); }
  function padAction(x) {
    for (const a of padActs) { const o = own(a.tool, a.id); if (o && o.pad && samePad(o, x)) { a.run(); return true; } }
    return false;
  }

  /* ---- a word on the screen, read by screen readers too ---- */
  let sayEl = null, sayT = null;
  function say(msg) {
    if (typeof document === 'undefined' || !document.body) return;
    if (!sayEl) {
      sayEl = document.createElement('div');
      sayEl.setAttribute('role', 'status');
      sayEl.style.cssText = 'position:fixed;left:50%;top:14px;transform:translateX(-50%);background:var(--ink,#1b1b1d);color:var(--bg,#fff);' +
        'padding:9px 18px;border-radius:10px;font-size:15px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:2147483001;max-width:calc(100vw - 32px)';
      document.body.appendChild(sayEl);
    }
    sayEl.textContent = msg; sayEl.style.opacity = '.95';
    clearTimeout(sayT); sayT = setTimeout(() => { sayEl.style.opacity = '0'; }, 3200);
  }

  /* ---- the look: a ring nobody can miss on the button in focus ---- */
  function look() {
    if (typeof document === 'undefined' || !document.documentElement || !document.createElement) return;
    const html = document.documentElement;
    if (!document.getElementById('wbStyrCss')) {
      const st = document.createElement('style');
      st.id = 'wbStyrCss';
      st.textContent =
        'html.wb-strong :focus-visible,html.wb-scan :focus{outline:5px solid #FFD400 !important;outline-offset:2px !important;' +
          'box-shadow:0 0 0 9px #1B1B1D !important;position:relative;z-index:1}' +
        'html.wb-oga .wb-looking{outline:4px dashed var(--accent,#28558C) !important;outline-offset:2px !important}' +
        '#wbDwellRing{position:fixed;width:54px;height:54px;margin:-27px 0 0 -27px;pointer-events:none;z-index:2147483000;display:none}' +
        '#wbDwellRing circle{fill:none;stroke-width:7}' +
        '#wbDwellRing .bg{stroke:rgba(0,0,0,.25)}#wbDwellRing .fg{stroke:#FFD400;stroke-linecap:round;' +
          'stroke-dasharray:132;stroke-dashoffset:132;transform:rotate(-90deg);transform-origin:50% 50%}' +
        '@keyframes wbDwellFill{to{stroke-dashoffset:0}}' +
        '#wbDwellPause{position:fixed;left:10px;bottom:10px;z-index:2147482999;min-width:96px;min-height:64px;font:600 17px system-ui,sans-serif;' +
          'border-radius:14px;border:3px solid #1B1B1D;background:#FFD400;color:#1B1B1D;cursor:pointer;padding:6px 14px}' +
        '#wbDwellPause[aria-pressed="true"]{background:#1B1B1D;color:#FFD400;border-color:#FFD400}' +
        '@media (prefers-reduced-motion: reduce){#wbDwellRing .fg{animation-duration:0s !important}}';
      (document.head || html).appendChild(st);
    }
    html.classList.toggle('wb-strong', S.strong);
    html.classList.toggle('wb-scan', S.mode === 'brytare1' || S.mode === 'brytare2');
    html.classList.toggle('wb-oga', S.mode === 'oga');
    dwellSetup();
  }

  /* ---- eye control: look at a button and rest there; the ring fills, then it is pressed.
     The same button again only after looking away from it. The pause button
     (bottom left) stops it while reading — and starts it again. ---- */
  const DWELL_SEL = 'button,a[href],summary,select,textarea,input:not([type=hidden]),label,[role="button"],[role="tab"],[role="option"],[role="checkbox"],[tabindex="0"]';
  let dw = { el: null, timer: null, lock: null, paused: false, wired: false };
  let ring = null, pauseBtn = null;
  const typingEl = (t) => !!t && (t.isContentEditable || t.tagName === 'TEXTAREA' ||
    (t.tagName === 'INPUT' && !/^(button|submit|reset|checkbox|radio|range|color|file|image)$/i.test(t.type)));
  function dwellTarget(node) {
    const el = node && node.closest ? node.closest(DWELL_SEL) : null;
    if (!el || el.disabled || el.closest('[inert]') || el === ring) return null;
    // a large area that only holds focus (a board, a list) is not a button
    if (!/^(BUTTON|A|SUMMARY|SELECT|TEXTAREA|INPUT|LABEL)$/.test(el.tagName) && !el.getAttribute('role')) {
      const r = el.getBoundingClientRect();
      if (r.width * r.height > innerWidth * innerHeight * 0.2) return null;
    }
    return el;
  }
  function dwellCancel() {
    clearTimeout(dw.timer); dw.timer = null;
    if (dw.el) dw.el.classList.remove('wb-looking');
    dw.el = null;
    if (ring) ring.style.display = 'none';
  }
  function activate(el) {
    if (el.tagName === 'SELECT') { el.focus(); try { el.showPicker(); } catch (_) {} return; }
    if (typingEl(el)) { el.focus(); return; }
    try { el.focus({ preventScroll: true }); } catch (_) {}
    el.click();
  }
  function dwellMove(ev) {
    if (S.mode !== 'oga' || ev.pointerType === 'touch') return;
    const el = dwellTarget(ev.target);
    if (el !== dw.lock) dw.lock = null;                 // looked away: the same button may be pressed again
    if (dw.paused && el !== pauseBtn) { dwellCancel(); return; }
    if (ring && dw.el) { ring.style.left = ev.clientX + 'px'; ring.style.top = ev.clientY + 'px'; }
    if (el === dw.el) return;
    dwellCancel();
    if (!el || el === dw.lock) return;
    dw.el = el;
    el.classList.add('wb-looking');
    if (S.dwell.ring && ring) {
      ring.style.left = ev.clientX + 'px'; ring.style.top = ev.clientY + 'px'; ring.style.display = 'block';
      const fg = ring.querySelector('.fg');
      fg.style.animation = 'none'; void fg.getBoundingClientRect();
      fg.style.animation = `wbDwellFill ${S.dwell.ms}ms linear forwards`;
    }
    dw.timer = setTimeout(() => { const t = dw.el; dwellCancel(); if (t && t.isConnected) { dw.lock = t; activate(t); } }, S.dwell.ms);
  }
  function dwellSetup() {
    if (typeof document === 'undefined' || !document.body) return;
    if (!dw.wired) {
      dw.wired = true;
      document.addEventListener('pointermove', dwellMove, { passive: true });
      document.addEventListener('pointerover', dwellMove, { passive: true });
      document.addEventListener('pointerleave', dwellCancel);
      addEventListener('blur', dwellCancel);
    }
    const on = S.mode === 'oga';
    if (on && !ring) {
      ring = document.createElement('div');
      ring.id = 'wbDwellRing'; ring.setAttribute('aria-hidden', 'true');
      ring.innerHTML = '<svg viewBox="0 0 54 54" width="54" height="54"><circle class="bg" cx="27" cy="27" r="21"/><circle class="fg" cx="27" cy="27" r="21"/></svg>';
      document.body.appendChild(ring);
    }
    if (on && S.dwell.pause && !pauseBtn) {
      pauseBtn = document.createElement('button');
      pauseBtn.id = 'wbDwellPause'; pauseBtn.type = 'button';
      pauseBtn.onclick = () => { dw.paused = !dw.paused; paintPause(); say(dw.paused ? T('Eye control paused — look at Go on to start again', 'Ögonstyrningen pausad — titta på Fortsätt för att starta igen') : T('Eye control is on', 'Ögonstyrningen är på')); };
      document.body.appendChild(pauseBtn);
    }
    if (pauseBtn) { pauseBtn.hidden = !(on && S.dwell.pause); if (pauseBtn.hidden) dw.paused = false; paintPause(); }
    if (!on) dwellCancel();
  }
  function paintPause() {
    if (!pauseBtn) return;
    pauseBtn.textContent = dw.paused ? T('▶ Go on', '▶ Fortsätt') : T('❚❚ Pause', '❚❚ Paus');
    pauseBtn.setAttribute('aria-pressed', dw.paused ? 'true' : 'false');
    pauseBtn.title = T('Pause or start eye control (resting on a button presses it)', 'Pausa eller starta ögonstyrningen (att vila på en knapp trycker på den)');
  }

  /** The settings page, in its own tab: the part stays as it is, and follows the change at once. */
  function open() {
    let w = null;
    try { w = window.open('installningar.html', 'wb-installningar'); } catch (_) {}
    if (w) { try { w.focus(); } catch (_) {} } else location.href = 'installningar.html';
  }

  if (typeof document !== 'undefined') {
    if (document.body) look(); else document.addEventListener('DOMContentLoaded', look);
  }
  return {
    get settings() { return S; }, save, clean, MODES, onChange: (f) => listeners.push(f),
    keyOf, matches, keyLabel, ariaKey, label, parse, okKey, reserved, samePad, cleanPad,
    item, own, keyFor, extraKey, setOwn, conflicts, onPad, padAction, say, open,
    _dwellTarget: dwellTarget,
  };
})();
if (typeof window !== 'undefined') { window.wbStyr = wbStyr; window.WB_KEYMAP = WB_KEYMAP; }
