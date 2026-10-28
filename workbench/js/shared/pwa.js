/* Blissverktyget as an installable app (PWA). Loaded by every part:
   registers the service worker (sw.js, beside the pages) and, on a page that
   has an #installApp button, shows it while the browser offers installing.
   Never runs from file:// (service workers need http(s)) nor inside a frame
   such as a claude.ai artifact. */
'use strict';
(() => {
  let inFrame = true;
  try { inFrame = window.self !== window.top; } catch (_) {}
  if (inFrame || !('serviceWorker' in navigator) || location.protocol === 'file:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
  let offer = null;
  window.addEventListener('beforeinstallprompt', (ev) => {
    ev.preventDefault();
    offer = ev;
    const b = document.getElementById('installApp');
    if (!b) return;
    b.hidden = false;
    b.onclick = async () => {
      if (!offer) return;
      offer.prompt();
      await offer.userChoice.catch(() => {});
      offer = null; b.hidden = true;
    };
  });
  window.addEventListener('appinstalled', () => {
    const b = document.getElementById('installApp');
    if (b) b.hidden = true;
  });
})();
