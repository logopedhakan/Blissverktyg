/* WinBliss² — the suite's language, shared by every part (PeO, 2026-09-25).
   The start page's switch sets 'wb-lang'; with nothing set, the browser's own
   language decides. Storage may be blocked (private window, an artifact
   frame), so reads and writes never throw. */
'use strict';
function wbLang() {
  let v = null;
  try { v = localStorage.getItem('wb-lang'); } catch (_) {}
  return v || ((navigator.language || '').startsWith('sv') ? 'sv' : 'en');
}
function wbSetLang(l) {
  try { localStorage.setItem('wb-lang', l); } catch (_) {}
}
