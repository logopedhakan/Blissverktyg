/* Window size and place, the same in every part (Håkan, 2026-11-08):
   always the full height of the screen; a third, two thirds or the whole width;
   at the left or the right. The buttons sit in the middle, under the top bar.
   A page may only size a window that is its own: the installed app's window
   (Blissverktyget as an app) or a window it opened. In an ordinary browser tab
   the first click therefore opens Blissverktyget in a window of its own, placed
   as asked. The choice is remembered and used each time the app starts.
   (A web page cannot keep itself in front of or behind other programs.) */
'use strict';
(() => {
  let inFrame = true;
  try { inFrame = window.self !== window.top; } catch (_) {}
  if (inFrame) return;                         // e.g. Skriv inside another part
  const KEY = 'wb-fonster';
  const st = { w: 'full', side: 'left', chosen: false };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (_) {} };
  const sv = (typeof wbLang === 'function' ? wbLang() : (document.documentElement.lang || 'sv')) !== 'en';
  const tr = (en, s) => sv ? s : en;
  const NAME = 'blissverktyget';
  const own = () => window.name === NAME ||
    ['standalone', 'window-controls-overlay', 'minimal-ui'].some(m => matchMedia(`(display-mode: ${m})`).matches);

  function geometry() {
    const L = screen.availLeft || 0, T = screen.availTop || 0, W = screen.availWidth, H = screen.availHeight;
    const w = Math.round(W * ({ third: 1 / 3, twothirds: 2 / 3 }[st.w] || 1));
    return [st.side === 'right' ? L + W - w : L, T, w, H];
  }
  function apply() {
    const g = geometry();
    try { window.moveTo(g[0], g[1]); window.resizeTo(g[2], g[3]); } catch (_) {}
  }
  let note = null, noteT = null;
  function tell(m) {
    if (!note) return;
    note.textContent = m; note.hidden = false;
    clearTimeout(noteT); noteT = setTimeout(() => { note.hidden = true; }, 4500);
  }
  function choose(patch) {
    Object.assign(st, patch, { chosen: true }); save(); mark();
    if (own()) { apply(); return; }
    const g = geometry();
    const w = window.open(location.href, NAME, `popup=yes,left=${g[0]},top=${g[1]},width=${g[2]},height=${g[3]}`);
    tell(w ? tr('Blissverktyget opened in a window of its own — the buttons size that window.',
                 'Blissverktyget öppnades i ett eget fönster — där ändrar knapparna fönstret.')
           : tr('The browser stopped the window — allow pop-ups for Blissverktyget, or install it as an app.',
                'Webbläsaren stoppade fönstret — tillåt popup-fönster för Blissverktyget, eller installera det som app.'));
  }

  const CSS = `
#wbWin{display:flex;justify-content:center;align-items:center;gap:6px;flex-wrap:wrap;flex:none;
  padding:2px 10px 6px;font-family:inherit;font-size:13px;color:var(--dim)}
#wbWin .grp{display:inline-flex;border:1px solid var(--rule);border-radius:9px;overflow:hidden;background:var(--panel)}
#wbWin button{font:inherit;font-size:13px;line-height:1.2;padding:4px 10px;border:none;border-right:1px solid var(--rule);
  background:var(--panel);color:var(--ink);cursor:pointer;border-radius:0;min-height:0}
#wbWin button:last-child{border-right:none}
#wbWin button:hover{background:var(--accent-soft)}
#wbWin button[aria-pressed="true"]{background:var(--accent);color:#fff}
#wbWin .lbl{font-weight:600}
#wbWin .note{flex-basis:100%;text-align:center;font-size:12.5px;color:var(--ink)}
#wbWin .note[hidden]{display:none}
@media (max-width:640px), (pointer:coarse) and (hover:none), (display-mode: fullscreen){ #wbWin{display:none} }
@media print{ #wbWin{display:none} }`;

  const SIZES = [['third', '⅓', tr('A third of the screen', 'En tredjedel av skärmen')],
                 ['twothirds', '⅔', tr('Two thirds of the screen', 'Två tredjedelar av skärmen')],
                 ['full', tr('Full', 'Hela'), tr('The whole screen', 'Hela skärmen')]];
  const SIDES = [['left', tr('◀ Left', '◀ Vänster'), tr('At the left of the screen', 'Till vänster på skärmen')],
                 ['right', tr('Right ▶', 'Höger ▶'), tr('At the right of the screen', 'Till höger på skärmen')]];
  let bar = null;
  function mark() {
    if (!bar) return;
    for (const b of bar.querySelectorAll('[data-w]')) b.setAttribute('aria-pressed', String(st.chosen && b.dataset.w === st.w));
    for (const b of bar.querySelectorAll('[data-side]')) b.setAttribute('aria-pressed', String(st.chosen && st.w !== 'full' && b.dataset.side === st.side));
  }
  function build() {
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    bar = document.createElement('div');
    bar.id = 'wbWin'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', tr('Window size and place', 'Fönsterstorlek och placering'));
    const btn = (attr, [v, label, title]) => `<button type="button" data-${attr}="${v}" title="${title}">${label}</button>`;
    bar.innerHTML = `<span class="lbl">${tr('Window:', 'Fönster:')}</span>
      <span class="grp">${SIZES.map(s => btn('w', s)).join('')}</span>
      <span class="grp">${SIDES.map(s => btn('side', s)).join('')}</span>
      <span class="note" hidden></span>`;
    note = bar.querySelector('.note');
    for (const b of bar.querySelectorAll('[data-w]')) b.onclick = () => choose({ w: b.dataset.w });
    for (const b of bar.querySelectorAll('[data-side]')) b.onclick = () => choose({ side: b.dataset.side });
    const head = document.querySelector('body > header');
    if (head) head.after(bar); else document.body.prepend(bar);
    mark();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  // the app starts in the size last chosen
  if (own() && st.chosen) { if (document.readyState === 'complete') apply(); else window.addEventListener('load', apply); }
})();
