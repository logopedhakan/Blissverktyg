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

  /* in the top bar, right after the title — no row of its own (Håkan, 2026-11-08),
     and small enough to stay in a window a third of the screen wide */
  const CSS = `
#wbWin{display:inline-flex;align-items:center;gap:4px;flex:none;font-family:inherit;font-size:13px;
  vertical-align:middle;margin:0 2px}
#wbWin.float{position:absolute;top:14px;left:16px}
#wbWin .grp{display:inline-flex;border:1px solid var(--rule);border-radius:8px;overflow:hidden;background:var(--panel)}
#wbWin button{font:inherit;font-size:13px;line-height:1.15;padding:3px 7px;border:none;border-right:1px solid var(--rule);
  background:var(--panel);color:var(--ink);cursor:pointer;border-radius:0;min-height:0;min-width:0;margin:0}
#wbWin button:last-child{border-right:none}
#wbWin button:hover{background:var(--accent-soft)}
#wbWin button[aria-pressed="true"]{background:var(--accent);color:#fff}
#wbWinNote{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:999;max-width:92vw;
  background:var(--ink);color:var(--bg);padding:7px 14px;border-radius:10px;font-size:13px;font-family:inherit}
#wbWinNote[hidden]{display:none}
@media (pointer:coarse) and (hover:none), (display-mode: fullscreen){ #wbWin{display:none} }
@media print{ #wbWin,#wbWinNote{display:none} }`;

  const SIZES = [['third', '⅓', tr('A third of the screen, full height', 'En tredjedel av skärmen, full höjd')],
                 ['twothirds', '⅔', tr('Two thirds of the screen, full height', 'Två tredjedelar av skärmen, full höjd')],
                 ['full', '▣', tr('The whole screen', 'Hela skärmen')]];
  const SIDES = [['left', '◀', tr('At the left of the screen', 'Till vänster på skärmen')],
                 ['right', '▶', tr('At the right of the screen', 'Till höger på skärmen')]];
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
    const btn = (attr, [v, label, title]) => `<button type="button" data-${attr}="${v}" title="${title}" aria-label="${title}">${label}</button>`;
    bar.innerHTML = `<span class="grp">${SIZES.map(s => btn('w', s)).join('')}</span>
      <span class="grp">${SIDES.map(s => btn('side', s)).join('')}</span>`;
    note = document.createElement('div'); note.id = 'wbWinNote'; note.setAttribute('role', 'status'); note.hidden = true;
    document.body.appendChild(note);
    for (const b of bar.querySelectorAll('[data-w]')) b.onclick = () => choose({ w: b.dataset.w });
    for (const b of bar.querySelectorAll('[data-side]')) b.onclick = () => choose({ side: b.dataset.side });
    // right after the part's name in the top bar ("Bildspel · Bliss" ▣ ◀ ▶)
    const head = document.querySelector('body > header');
    const title = head && head.querySelector('h1');
    if (head && title && getComputedStyle(head).display.includes('flex')) title.after(bar);
    else if (head) {
      // the start page: a centred title — the buttons sit in the top left corner
      if (getComputedStyle(head).position === 'static') head.style.position = 'relative';
      bar.classList.add('float'); head.prepend(bar);
    } else document.body.prepend(bar);
    mark();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  // the app starts in the size last chosen
  if (own() && st.chosen) { if (document.readyState === 'complete') apply(); else window.addEventListener('load', apply); }
})();
