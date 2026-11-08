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
    if (!w) {
      tell(tr('The browser stopped the window — allow pop-ups for Blissverktyget, or install it as an app.',
              'Webbläsaren stoppade fönstret — tillåt popup-fönster för Blissverktyget, eller installera det som app.'));
      return;
    }
    // the first one closes (Håkan, 2026-11-08): only one Blissverktyget open.
    // A browser lets a page close its tab only now and then — otherwise the tab
    // says where Blissverktyget went, so nothing is worked on in two places.
    setTimeout(() => {
      try { window.close(); } catch (_) {}
      setTimeout(() => { if (!window.closed) movedAway(); }, 250);
    }, 400);
  }
  function movedAway() {
    // this tab rests: no timer here may write over what the new window saves
    let id = setTimeout(() => {}, 0);
    while (id > 0) { clearTimeout(id); clearInterval(id); id--; }
    try { if (typeof wbStopSpeaking === 'function') wbStopSpeaking(); } catch (_) {}
    document.title = tr('Blissverktyget — moved', 'Blissverktyget — flyttat');
    document.body.innerHTML = `<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
      font-family:'Atkinson Hyperlegible Next','Atkinson Hyperlegible',system-ui,sans-serif;background:var(--bg);color:var(--ink);text-align:center;padding:20px">
      <p style="font-size:20px;font-weight:700">${tr('Blissverktyget is now open in a window of its own.', 'Blissverktyget är nu öppet i ett eget fönster.')}</p>
      <p style="font-size:15px;color:var(--dim)">${tr('You can close this tab.', 'Du kan stänga den här fliken.')}</p></div>`;
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
  /* ---- the whole program in a narrow window (Håkan, 2026-11-08): below the
     width a part is laid out for, everything is drawn smaller (CSS zoom) — the
     same picture as in a big window, not columns squeezed or cut off. The
     part's own narrow-screen rules are judged by the width it is drawn at. ---- */
  const BASE = { 'index.html': 1100, 'bildspel.html': 1000, 'almanacka.html': 900, 'gissa.html': 960,
    'former.html': 1000, 'gravyr.html': 960 };
  const page = (location.pathname.split('/').pop() || 'start.html').toLowerCase();
  const base = BASE[page] || 0;
  let rules = null;                     // [CSSMediaRule, original media text]
  function mediaRules() {
    if (rules) return rules;
    rules = [];
    const walk = (list) => { for (const r of list) {
      if (r.media && r.cssRules && /(max|min)-width/.test(r.media.mediaText)) rules.push([r, r.media.mediaText]);
      if (r.cssRules) walk(r.cssRules);
    } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch (_) {} }
    return rules;
  }
  function judgeAt(width) {
    for (const [r, text] of mediaRules()) {
      const t = width ? text.replace(/\((max|min)-width:\s*(\d+(?:\.\d+)?)px\)/g, (_, k, n) =>
        (k === 'max' ? width <= +n : width >= +n) ? '(min-width:0px)' : '(max-width:0px)') : text;
      if (r.media.mediaText !== t) r.media.mediaText = t;
    }
  }
  let fitted = false;
  function fit() {
    if (!base || matchMedia('(pointer:coarse) and (hover:none)').matches) return;
    const z = Math.min(1, window.innerWidth / base);
    const root = document.documentElement, body = document.body;
    if (z >= 0.999) {
      if (!fitted) return;
      root.style.zoom = ''; root.style.height = ''; body.style.height = ''; judgeAt(0); fitted = false; return;
    }
    fitted = true;
    root.style.zoom = String(z);
    judgeAt(base);
    // the parts that fill the window keep filling it at the smaller size
    const h = (window.innerHeight / z) + 'px';
    root.style.height = h; body.style.height = h;
  }
  /* ---- the start page: every choice on the screen, whatever its size
     (Håkan, 2026-11-08). The cards go in 2, 3 or 4 columns — whichever lets
     them be drawn largest — and the page is drawn just small enough to fit. ---- */
  function fitStart() {
    const cards = document.getElementById('cards');
    const head = document.querySelector('body > header'), foot = document.querySelector('body > footer');
    if (!cards || !head) return;
    const root = document.documentElement, body = document.body;
    // the visible page area (on phones innerWidth/innerHeight follow the zoom)
    const H = Math.min(window.innerHeight, root.clientHeight || 1e9), W = Math.min(window.innerWidth, root.clientWidth || 1e9);
    body.style.minHeight = '0px';                  // measure the content itself
    // measured where the page really ends: the bottom of the footer (or the cards)
    const fits = (z) => {
      root.style.zoom = String(z);
      const end = (foot || cards).getBoundingClientRect().bottom + window.scrollY;
      return end <= H && cards.getBoundingClientRect().width + 36 * z <= W;
    };
    const best = (cols) => {
      cards.style.maxWidth = 'none';
      cards.style.gridTemplateColumns = `repeat(${cols}, minmax(200px, 260px))`;
      if (fits(1)) return 1;
      let lo = 0.2, hi = 1;
      for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; }
      return lo;
    };
    const n = cards.children.length;
    let pick = null;
    for (const cols of [3, 4, 2]) {               // 3 first: the usual look wins a tie
      if (cols > n) continue;
      const z = best(cols);
      if (!pick || z > pick.z + 0.02) pick = { cols, z };
    }
    if (!pick) return;
    cards.style.gridTemplateColumns = `repeat(${pick.cols}, minmax(200px, 260px))`;
    if (pick.z >= 0.999) { root.style.zoom = ''; body.style.minHeight = ''; return; }
    root.style.zoom = String(pick.z);
    // then fill the window again (the cards centred, the footer at the bottom):
    // a height in page units, corrected by what it really measures on the screen
    let mh = H / pick.z;
    for (let i = 0; i < 3; i++) {
      body.style.minHeight = mh + 'px';
      const seen = body.getBoundingClientRect().height;
      if (Math.abs(seen - H) < 1) break;
      mh = mh * H / seen;
    }
    if (body.getBoundingClientRect().height > H + 1) body.style.minHeight = '0px';
  }
  const refit = () => { if (page === 'start.html' || page === '') fitStart(); else fit(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { build(); refit(); }); else { build(); refit(); }
  window.addEventListener('load', refit);           // the card symbols and fonts are in place
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  let rT = null;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(refit, 60); });
  // the app starts in the size last chosen
  if (own() && st.chosen) { if (document.readyState === 'complete') apply(); else window.addEventListener('load', apply); }
})();
