/* WinBliss² — switches and joysticks, the same in every part (2026-11-19).
   A switch interface sends keys (Space and Enter, F7/F8, 1/2 …) or shows up
   as a joystick (a game controller). On the settings page (installningar.html)
   the person, or whoever helps, teaches the app which key or button is which:
     Stega        (step)    moves to the next button, like Tab
     Bekräfta     (confirm) presses it, like Enter
     Stega bakåt  (back)    the button before (optional)
   The choice is kept in this browser ('wb-brytare') and works in every part —
   a change reaches open tabs at once.
   A joystick works without learning: the stick and the cross step (right/down
   forward, left/up back) and its first button confirms; learned buttons win,
   and a joystick button given to a shortcut (js/shared/styrning.js) does that.
   One switch (2026-11-20, styrning 'brytare1'): the buttons are stepped through
   by themselves, a while on each, and the switch chooses; after some rounds
   without a press it rests until the next press.
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
  addEventListener('storage', (e) => {
    if (e.key !== STORE && e.key !== null) return;
    try { cfg = clean(JSON.parse(localStorage.getItem(STORE) || 'null')); } catch (_) {}
  });
  const styr = () => (typeof window !== 'undefined' && window.wbStyr) || null;
  const scanOn = () => !!styr() && styr().settings.mode === 'brytare1';

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
  // checkVisibility: what is in a closed <details> still has boxes, but cannot take focus —
  // without it the stepping stood still on a folded part's heading (2026-11-26)
  const shown = (el) => !el.disabled && el.tabIndex >= 0 && !el.closest('[inert]') && el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== 'hidden' && (!el.checkVisibility || el.checkVisibility());
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
    if (scanOn()) {
      // one switch: it chooses; a second switch learned as Step still steps by hand
      if (role === 'confirm' || !cfg.confirm) scanSwitch(); else { move(role === 'back' ? -1 : 1); scanBegin(); }
      return;
    }
    if (role === 'confirm') press(); else move(role === 'back' ? -1 : 1);
  }

  /* ---- one switch: stepping by itself (scanning) ---- */
  let scanT = null, scanLeft = 0, scanResting = false;
  function scanSchedule(ms) { clearTimeout(scanT); scanT = scanOn() ? setTimeout(scanTick, ms) : null; }
  function scanTick() {
    if (!scanOn()) return;
    const st = styr().settings.scan;
    // another window in use, a key being learned, or writing in a text field: wait
    if (document.hidden || !document.hasFocus() || learning || typing(document.activeElement)) { scanSchedule(st.ms); return; }
    if (scanLeft <= 0) {
      if (!scanResting) { scanResting = true; styr().say(T('Resting — press the switch to step again', 'Vilar — tryck på brytaren för att stega igen')); }
      return;
    }
    move(1); scanLeft--;
    scanSchedule(st.ms);
  }
  function scanBegin() {
    if (!scanOn()) { clearTimeout(scanT); return; }
    scanResting = false;
    scanLeft = styr().settings.scan.rounds * Math.max(1, stops().length);
    scanSchedule(styr().settings.scan.ms);
  }
  function scanSwitch() {
    const a = document.activeElement;
    if (scanResting || !a || a === document.body || typing(a)) { move(1); scanBegin(); return; }
    press();
    // where it goes on: from the button chosen, or from the first one again
    if (styr().settings.scan.restart && document.activeElement && document.activeElement.blur) document.activeElement.blur();
    scanBegin();
  }
  if (typeof document !== 'undefined') {
    const go = () => scanBegin();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else setTimeout(go, 0);
    setTimeout(() => { if (styr()) styr().onChange(() => scanBegin()); }, 0);
  }

  /* ---- learning: the next key or joystick input goes to whoever asked (the settings page) ---- */
  let learning = null;                              // { chord, done(input | null) }
  let swallowUp = null;                             // the code whose keyup must not reach the page
  let learnT = null;
  function learned(x) {
    const l = learning; learning = null;
    clearTimeout(learnT);
    if (l) l.done(x);
  }
  /** The next input: a key { code, key } (chord: { key: 'Alt+N' }) or a joystick input; null after Esc or 15 s. */
  function capture(done, opts = {}) {
    clearTimeout(learnT);
    learning = { chord: !!opts.chord, done };
    learnT = setTimeout(() => learned(null), opts.ms || 15000);
    startPolling();
  }
  const cancelCapture = () => { if (learning) learned(null); };
  /** Learn a switch: the input becomes the role's (and no longer any other role's). */
  function setRole(role, x) {
    if (!ROLES.includes(role)) return;
    if (x) for (const r of ROLES) if (r !== role && cfg[r] && (x.pad ? samePad(cfg[r], x) : !cfg[r].pad && cfg[r].key === x.key && cfg[r].code === x.code)) delete cfg[r];
    if (x) cfg[role] = cleanInput(x); else delete cfg[role];
    save();
  }
  function forget() { cfg = clean({ stick: cfg.stick }); save(); }
  function setStick(on) { cfg.stick = !!on; save(); }

  /* ---- keys ---- */
  addEventListener('keydown', (ev) => {
    if (learning) {
      if (MODIFIERS.includes(ev.key)) return;       // wait for the key itself
      ev.preventDefault(); ev.stopImmediatePropagation();
      swallowUp = ev.code || ev.key;
      if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) { learned(null); return; }
      if (learning.chord) { const k = styr() ? styr().keyOf(ev) : null; if (k) learned({ key: k }); return; }
      learned({ code: ev.code || '', key: ev.key });
      return;
    }
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return; // a chord is another key
    // one switch that sends Enter or Space: while resting it only starts the stepping again
    if (scanOn() && (ev.key === 'Enter' || ev.key === ' ') && !typing(ev.target) && !ROLES.some(r => sameKey(cfg[r], ev))) {
      if (scanResting) { ev.preventDefault(); move(1); scanBegin(); return; }
      setTimeout(() => {
        if (styr().settings.scan.restart && document.activeElement && document.activeElement.blur) document.activeElement.blur();
        scanBegin();
      }, 0);
      return;
    }
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
    if (styr() && styr().padAction(x)) return;      // a joystick button given to a shortcut
    const role = ROLES.find(r => samePad(cfg[r], x));
    if (role) { act(role); return; }
    // not learned: the first button confirms, until Confirm is learned on the joystick
    if (x.pad === 'button' && x.i === 0 && !(cfg.confirm && cfg.confirm.pad)) { act('confirm'); return; }
    if (!cfg.stick) return;
    // the stick and the cross step by hand (with one switch too: the stepping goes on from there)
    const d = x.pad === 'axis' && x.i < 2 ? x.dir : std && x.pad === 'button' && x.i >= 12 && x.i <= 15 ? (x.i === 13 || x.i === 15 ? 1 : -1) : 0;
    if (!d) return;
    if (scanOn()) { move(d); scanBegin(); } else act(d > 0 ? 'step' : 'back');
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
  const padListeners = [];
  function padStatus() { for (const f of padListeners) try { f(padName()); } catch (_) {} }

  /** The settings page (all of steering lives there). */
  function open() { if (styr()) styr().open(); }

  const api = { open, nameOf, clean, get config() { return cfg; }, scope: null, hook: null,
    ROLES, ROLE_NAME, capture, cancelCapture, setRole, forget, setStick, padName, onPadChange: (f) => padListeners.push(f),
    native, typesChar, move, press };
  return api;
})();
if (typeof window !== 'undefined') window.wbSwitch = wbSwitch;
