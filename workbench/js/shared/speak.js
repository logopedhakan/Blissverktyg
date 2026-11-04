/* WinBliss² — reading aloud with the browser's own speech synthesis
   (Håkan, 2026-11-04). Shared by Skriv, Bildspel and Formfamiljer. It uses
   the voices installed on the device (on Windows e.g. "Microsoft Bengt",
   in Edge also the natural online voices), so it works offline wherever
   such a voice exists. A Swedish voice is chosen for Swedish, an English one
   for English; the voice and the speed can be changed and are remembered
   ('wb-tal'). One utterance at a time: a new one stops the one before. */
'use strict';
const WB_SPEECH = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let wbTal = {};
try { wbTal = JSON.parse(localStorage.getItem('wb-tal') || '{}') || {}; } catch (_) {}
function wbTalSave() { try { localStorage.setItem('wb-tal', JSON.stringify(wbTal)); } catch (_) {} }

/* the voices for a language, the best first (natural/neural voices sound far better) */
function wbVoices(lang) {
  if (!WB_SPEECH) return [];
  const want = (lang || wbLang()) === 'sv' ? 'sv' : 'en';
  return speechSynthesis.getVoices()
    .filter(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith(want))
    .sort((a, b) => (/natural|neural|online/i.test(b.name) - /natural|neural|online/i.test(a.name)) || (b.localService - a.localService));
}
function wbVoice(lang) {
  const vs = wbVoices(lang);
  const key = (lang || wbLang()) === 'sv' ? 'sv' : 'en';
  return vs.find(v => v.name === wbTal['voice-' + key]) || vs[0] || null;
}
/* Speaks `text`. Returns false when the browser cannot speak, 'empty' when
   there is nothing to say, 'novoice' when it speaks but has no voice for the
   language (it then reads with its default voice — the caller says so once),
   true otherwise. */
function wbSpeak(text, opts = {}) {
  if (!WB_SPEECH) return false;
  speechSynthesis.cancel();
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return 'empty';
  const lang = opts.lang || wbLang();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = lang === 'sv' ? 'sv-SE' : 'en-GB';
  const v = wbVoice(lang);
  if (v) u.voice = v;
  u.rate = opts.rate || wbTal.rate || 0.9;
  if (opts.onend) { u.onend = opts.onend; u.onerror = opts.onend; }
  speechSynthesis.speak(u);
  return v ? true : 'novoice';
}
function wbStopSpeaking() { if (WB_SPEECH) speechSynthesis.cancel(); }
function wbSpeaking() { return WB_SPEECH && (speechSynthesis.speaking || speechSynthesis.pending); }
/* the message shown when wbSpeak() answered false or 'novoice' */
function wbSpeakProblem(res) {
  const sv = wbLang() === 'sv';
  if (res === false) return sv ? 'Den här webbläsaren kan inte läsa upp text.' : 'This browser cannot read text aloud.';
  if (res === 'empty') return sv ? 'Det finns inget att läsa upp.' : 'There is nothing to read aloud.';
  if (res === 'novoice') return sv
    ? 'Ingen svensk röst hittades — texten läses med standardrösten. Lägg till svenska under Windows-inställningar → Tid och språk → Tal.'
    : 'No English voice found — the default voice reads instead.';
  return '';
}
/* a button that reads aloud: click = read, click while reading = stop */
function wbSpeakButton(btn, getText, onProblem) {
  if (!WB_SPEECH) { btn.hidden = true; return; }
  let warned = false, idle = '';
  // the label is read at click time: a page may translate the button after setup
  const done = () => { if (btn.classList.contains('speaking')) btn.textContent = idle; btn.classList.remove('speaking'); };
  btn.addEventListener('click', () => {
    if (btn.classList.contains('speaking')) { wbStopSpeaking(); done(); return; }
    const res = wbSpeak(getText(), { onend: done });
    if (res === false || res === 'empty') { if (onProblem) onProblem(wbSpeakProblem(res)); return; }
    idle = btn.textContent;
    btn.textContent = wbLang() === 'sv' ? '■ Stoppa' : '■ Stop'; btn.classList.add('speaking');
    if (res === 'novoice' && !warned && onProblem) { warned = true; onProblem(wbSpeakProblem(res)); }
  });
}
// Chrome loads its voice list lazily: ask early so it is ready at the first click
if (WB_SPEECH) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
