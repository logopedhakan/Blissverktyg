/* Blissverktyget (WinBliss²) — service worker.
   "Online med cache" (Håkan, 2026-10-28): with a network, every request goes
   to the network first so the newest version is always what you get; the
   answer is kept, and without a network the kept copy is served. CORE is
   cached up front at install, so the whole app also works offline right
   after the first visit.
   When you add a file the app needs, add it to CORE and bump VERSION — the
   new version then replaces the old cache on the next visit. */
'use strict';
const VERSION = '2026-10-28.1';
const CACHE = 'blissverktyget-' + VERSION;
const CORE = [
  'start.html', 'index.html', 'skriv.html', 'bildspel.html', 'gissa.html', 'former.html', 'gravyr.html',
  'manifest.webmanifest', 'css/wb-base.css',
  'js/shared/lang.js', 'js/shared/wbs.js', 'js/shared/shortcuts.js', 'js/shared/pwa.js',
  'js/engine/bliss-shapes.js', 'js/engine/bliss-engine.js',
  'js/data/bliss-data.js', 'js/data/glosses.js',
  'js/editor/app.js', 'js/editor/i18n.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png', 'icons/favicon.svg',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (ev) => {
  ev.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('blissverktyget-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  // the editor's typeface comes from Google Fonts: keep it too, so offline looks the same
  const font = /^https:\/\/fonts\.(googleapis|gstatic)\.com$/.test(url.origin);
  if (!sameOrigin && !font) return;
  ev.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    } catch (err) {
      // offline: the kept copy; "?vy=skriv" and other parameters share one copy of their page
      const hit = await cache.match(req, { ignoreSearch: sameOrigin });
      if (hit) return hit;
      if (req.mode === 'navigate') return (await cache.match('start.html')) || Response.error();
      throw err;
    }
  })());
});
