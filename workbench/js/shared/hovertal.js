/* WinBliss² — read aloud what the mouse points at, in every part (Håkan, 2026-11-26).
   "Läs vid muspekare" is one setting for all parts: wbStyr's `hover` ('wb-styrning'),
   so turning it on in one part turns it on everywhere — in other open tabs at once.
   Each part gets the same button in its top bar to turn it on and off, and the
   settings page has it under Hjälpmedel. With eye control the pointer follows the
   eyes, so it reads what the eyes rest on.
   What is read, after a short pause (passing over things stays quiet): a button's,
   link's or setting's words (its aria-label first), a picture's text, a heading.
   A part that has something better to say marks the element data-hover-own and
   calls wbHover.say(text) itself (Formfamiljer, Almanacka).
   Needs speak.js and styrning.js. */
'use strict';
const wbHover = (() => {
  const can = typeof WB_SPEECH !== 'undefined' && WB_SPEECH && typeof wbStyr !== 'undefined';
  const on = () => can && !!wbStyr.settings.hover;
  const sv = () => (typeof wbLang === 'function' ? wbLang() : (document.documentElement.lang || 'sv')) !== 'en';
  const tr = (en, s) => (sv() ? s : en);
  const WAIT = 350;

  // what is said: no pictographs or arrows ("🔊", "◀", "↓"), one line, not too long
  const clean = (s) => String(s || '')
    .replace(/[\p{Extended_Pictographic}←-⇿⌀-⏿■-◿✀-➿️]/gu, ' ')
    .replace(/\s+/g, ' ').trim().slice(0, 240);

  let t = null, last = null;
  /** Reads `text` after the pause, once: the same thing is not read again while it is being read. */
  function say(text, key) {
    clearTimeout(t);
    if (!on()) return;
    const s = clean(text);
    if (!s) return;
    const k = key || s;
    t = setTimeout(() => {
      if (k === last && wbSpeaking()) return;
      last = k;
      wbSpeak(s, { onend: () => { if (last === k) last = null; } });
    }, WAIT);
  }
  const stop = () => clearTimeout(t);

  /* ---- what the pointer is over ---- */
  const SEL = 'button, a[href], summary, label, [role="button"], [role="img"][aria-label], img[alt], select, ' +
    'input:not([type="hidden"]), h1, h2, h3, [data-speak]';
  function textOf(el) {
    const own = el.getAttribute('data-speak') || el.getAttribute('aria-label');
    if (own) return own;
    if (/^(INPUT|SELECT)$/.test(el.tagName)) {
      const lab = el.labels && el.labels[0];
      return (lab && lab.innerText) || el.placeholder || el.title || '';
    }
    if (el.tagName === 'IMG') return el.alt;
    return el.innerText || el.title || '';
  }
  let current = null;
  function over(ev) {
    if (!on() || ev.pointerType === 'touch') return;
    const el = ev.target && ev.target.closest ? ev.target.closest(SEL) : null;
    if (el === current) return;
    current = el;
    if (!el || el.closest('[data-hover-own], [aria-hidden="true"], [hidden]')) { stop(); return; }
    say(textOf(el), el);
  }
  function out(ev) {
    if (current && !(ev.relatedTarget && current.contains(ev.relatedTarget))) { current = null; stop(); }
  }

  /* ---- the button in the top bar ---- */
  const CSS = '.wbHoverBtn{font:inherit;font-size:13px;line-height:1.15;display:inline-flex;align-items:center;gap:6px;flex:none;' +
    'min-height:32px;padding:4px 10px;border:1px solid var(--rule,#ccc);border-radius:8px;background:var(--panel,#fff);color:var(--ink,#111);cursor:pointer}' +
    '.wbHoverBtn:hover{border-color:var(--accent,#28558C)}' +
    '.wbHoverBtn[aria-pressed="true"]{background:var(--accent,#28558C);border-color:var(--accent,#28558C);color:var(--on-accent,#fff)}' +
    '.wbHoverBtn .wbHoverSym svg{height:1.5em;width:auto;display:block}.wbHoverBtn .wbHoverSym .bfill{fill:currentColor}' +
    '.wbHoverBtn:focus-visible{outline:3px solid var(--sel,#B4436C);outline-offset:2px}' +
    '@media print{.wbHoverBtn{display:none}}';
  let btn = null;
  function sync() {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(on()));
    btn.title = on() ? tr('Read on mouse-over is on — click to turn it off', 'Läs vid muspekare är på — klicka för att stänga av')
                     : tr('Read aloud what the mouse points at', 'Läs upp det som muspekaren pekar på');
  }
  /** Turns it on or off for every part. */
  function set(v) {
    if (!can) return;
    wbStyr.save(Object.assign({}, wbStyr.settings, { hover: !!v }));
    clearTimeout(t); last = null;
    wbSpeak(v ? tr('Read on mouse-over: on', 'Läs vid muspekare: på') : tr('Read on mouse-over: off', 'Läs vid muspekare: av'));
  }
  function build() {
    if (btn || !can) return;
    const head = document.querySelector('body > header');
    if (!head || head.querySelector('.wbHoverBtn')) return;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'wbHoverBtn'; btn.id = 'wbHoverBtn';
    let sym = '';
    try { if (typeof wbIcons !== 'undefined') sym = wbIcons.svg('23593,16728'); } catch (_) {}
    btn.innerHTML = (sym ? `<span class="wbHoverSym" aria-hidden="true">${sym}</span>` : '<span aria-hidden="true">🔊</span>') +
      `<span class="lbl">${tr('Read on mouse-over', 'Läs vid muspekare')}</span>`;
    btn.onclick = () => set(!on());
    // beside the window buttons, right after the part's name — the same place in every part
    const win = head.querySelector('#wbWin:not(.float)'), h1 = head.querySelector('h1');
    if (win) win.after(btn);
    else if (h1 && getComputedStyle(head).display.includes('flex')) h1.after(btn);
    else { const row = document.createElement('div'); row.appendChild(btn); head.appendChild(row); }
    sync();
  }

  if (can) {
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerout', out, { passive: true });
    wbStyr.onChange(() => { sync(); if (!on()) stop(); });
    // after the part has built its top bar (and window.js its buttons)
    const later = () => setTimeout(build, 0);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', later); else later();
  }
  return { say, stop, on, set, clean, textOf };
})();
if (typeof window !== 'undefined') window.wbHover = wbHover;
