/* WinBliss Web — interface language (EN/SV).
   Static elements are translated by selector; English originals are captured
   from the DOM on first switch so toggling back restores them exactly.
   Dynamic strings are handled by tr() in app.js. */
'use strict';

const SV = [
  // header
  ['#btnOpen', 'Öppna…'],
  ['#btnSaveList', 'Spara'],
  ['#btnManager', 'Listhantering'],
  ['#btnExportList', 'Exportera lista…'],
  ['#btnWrite', '✎ Skriv'],
  ['#wtList', 'Lista'],
  ['#wtChips', 'Ordval'],
  ['#wtChooser', 'Böjning'],
  ['#wClear', 'Rensa'],
  ['#wFam', '⬡ Formfamiljer…'],
  ['#famTitle', 'Formfamiljer'],
  ['#famSub', 'välj ett ord och tryck ”Skicka till Skriv” — det hamnar sist i texten'],
  ['#famClose', '✕ Stäng'],
  ['#wAI', '✨ Tolka'],
  ['#wClip', 'Urklipp ↓'],
  ['#wOpenDoc', 'Öppna…'],
  ['#wSaveDoc', 'Spara ↓'],
  ['#wHint', 'varje ord kan justeras — klicka på det · omatchade ord blir text, eller egna nya symboler'],
  ['#colophon span:first-child', 'WinBliss² · 1997–2026 · AnyCom AB · CC BY 4.0'],
  ['#homeLink', '⌂ Start'],
  ['#aboutLink', 'Om & licens'],
  ['#aboutA', 'WinBliss² · Blissverktyget 1997–2026 · © 2026 AnyCom AB · CC BY 4.0.'],
  ['#aboutB', 'Blissymbolics © C.K. Bliss 1949, 1965 · symbolerna © Blissymbolics Communication International (BCI), ' +
   'distribuerade under CC BY-SA 4.0 — följer BCI:s auktoriserade ordförråd (BCI Authorized Vocabulary),'],
  // list panes
  ['#btnResetStd', 'BCI-AV'],
  ['#btnNewList', 'Ny'],
  ['#btnOpenB', 'Öppna…'],
  ['#btnNewB', 'Ny'],
  ['#btnSaveB', 'Spara'],
  ['#wAddA', '→ meningen'],
  ['#wAddB', '→ meningen'],
  // editor meta
  ['label[for] , #edMeta label:nth-of-type(1)', null],   // handled below by explicit pairs
  // tools
  ['#edBackWrite', '← Skriv'],
  ['#btnRotate', '⟳ Rotera'],
  ['#btnDelete', '🗑 Ta bort'],
  ['#btnDup', '⧉ Duplicera'],
  ['#btnUndo', '↩ Ångra'],
  ['#btnNewSym', 'Ny symbol'],
  ['#btnCopyClip', 'Urklipp ↓'],
  ['#btnGravyr', 'Gravyr →'],
  ['#hint', 'dra former från paletten · Shift = fint rutnät · dubbelklicka en rad i listan för att redigera den'],
  // settings dialog
  ['#settingsDlg h2', 'Inställningar'],
  ['#settingsDlg h3:nth-of-type(1)', 'Gränssnitt'],
  ['#settingsDlg h3:nth-of-type(2)', 'Export'],
  ['#settingsDlg h3:nth-of-type(3)', 'Skriv-vyn'],
  ['#settingsDlg h3:nth-of-type(4)', 'Om & licens'],
  ['#btnWbxSave', 'Spara inställningar'],
  ['#btnWbxOpen', 'Ladda inställningar'],
  ['#btnInkReset', 'auto'],
  ['#settingsDlg form button', 'Klar'],
  // dirty dialog
  ['#dirtyDlg p:nth-of-type(2)', 'Spara den till listan innan nästa symbol öppnas?'],
  ['#dirtyDlg button[value="cancel"]', 'Avbryt'],
  ['#dirtyDlg button[value="discard"]', 'Spara inte'],
  ['#dirtyDlg button[value="save"]', 'Spara'],
];

const SV_LABELED = [
  // [label-text-en-prefix, sv]  — longer keys FIRST so startsWith can't mis-hit
  ['Show the word list', 'Visa ordlistan'],
  ['Show word alternatives', 'Visa ordalternativen'],
  ['Show the form row', 'Visa böjningsraden'],
  ['Symbol size (px per square)', 'Symbolstorlek (px per ruta)'],
  ['Text size (%)', 'Textstorlek (%)'],
  ['Word spacing (squares)', 'Ordavstånd (rutor)'],
  ['Line thickness', 'Linjetjocklek'],
  ['Gloss', 'Benämning'],
  ['BCI id', 'BCI-id'],
  ['Word class', 'Ordklass'],
  ['Language', 'Språk'],
  ['Symbol glosses', 'Symbolbenämningar'],
  ['Theme', 'Tema'],
  ['Ink colour', 'Bläckfärg'],
  ['Background', 'Bakgrund'],
  ['Size (px per unit)', 'Storlek (px per enhet)'],
];

const SV_OPTIONS = {
  bgMode: { transparent: 'Transparent', white: 'Vit', class: 'Ordklassfärg', custom: 'Egen…' },
  setTheme: { auto: 'Följ systemet', light: 'Ljust', dark: 'Mörkt' },
  expText: { none: 'Utan text', top: 'Ovanför symbolen', bottom: 'Nedanför symbolen' },
};

const SV_PLACEHOLDERS = [['#search', 'Sök benämning eller BCI-id…'], ['#searchB', 'Sök benämning eller BCI-id…'], ['#gloss', 'ny_symbol'], ['#wInput', 'Skriv en mening — varje ord blir Bliss…']];

const HELP_SV = `
  <h2 style="margin:0 0 4px;font-size:16px">Tangentbordsgenvägar</h2>
  <p style="margin:0 0 14px;color:var(--dim);font-size:12.5px">WinBliss kan användas helt via tangentbordet.</p>
  <div class="helpCols">
    <section>
      <h3>Rityta (redigering)</h3>
      <table class="keys">
        <tr><td><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd></td><td>flytta markerade element</td></tr>
        <tr><td><kbd>Shift</kbd>+pilar / dra</td><td>fint rutnät (1 enhet)</td></tr>
        <tr><td><kbd>R</kbd></td><td>rotera (växlar de fyra riktningarna)</td></tr>
        <tr><td><kbd>D</kbd></td><td>duplicera</td></tr>
        <tr><td><kbd>Delete</kbd></td><td>ta bort markerade</td></tr>
        <tr><td><kbd>⌘/Ctrl</kbd>+<kbd>Z</kbd></td><td>ångra</td></tr>
        <tr><td><kbd>⌘/Ctrl</kbd>+<kbd>A</kbd></td><td>markera alla element</td></tr>
        <tr><td><kbd>⌘/Ctrl</kbd>+klick</td><td>lägg till/ta bort ur markeringen</td></tr>
        <tr><td>dubbelklicka textelement</td><td>redigera dess text</td></tr>
      </table>
    </section>
    <section>
      <h3>Formpaletten</h3>
      <table class="keys">
        <tr><td><kbd>Tab</kbd> → grupp, <kbd>Enter</kbd></td><td>öppna gruppen; fokus hoppar till dess första form</td></tr>
        <tr><td><kbd>←</kbd><kbd>→</kbd></td><td>bläddra bland formerna</td></tr>
        <tr><td><kbd>Enter</kbd>/<kbd>Mellanslag</kbd></td><td>lägg till formen på ritytan</td></tr>
      </table>
      <h3>Symbollistorna</h3>
      <table class="keys">
        <tr><td>klick</td><td>öppna symbolen i editorn</td></tr>
        <tr><td><kbd>⌘/Ctrl</kbd>+klick, <kbd>Shift</kbd>+klick</td><td>flerval, intervallval</td></tr>
        <tr><td><kbd>F2</kbd></td><td>redigera benämning &amp; synonymer (<kbd>Enter</kbd> sparar, <kbd>Esc</kbd> avbryter)</td></tr>
        <tr><td>dra en rad</td><td>ändra ordning · dra till andra listan kopierar (<kbd>Shift</kbd> flyttar) · släpp på ritytan för att slå ihop</td></tr>
      </table>
      <h3>Överallt</h3>
      <table class="keys">
        <tr><td><kbd>?</kbd></td><td>den här hjälpen</td></tr>
        <tr><td><kbd>Esc</kbd></td><td>stäng alla dialogrutor</td></tr>
        <tr><td><kbd>$</kbd> sedan <kbd>C</kbd>/<kbd>S</kbd>/<kbd>O</kbd>/<kbd>H</kbd></td>
          <td>kopiera · spara · öppna · startsidan — en tangent i taget, inget hålls ner;
          samma tangenter i alla WinBliss-delar (<kbd>$</kbd><kbd>?</kbd> visar listan)</td></tr>
      </table>
    </section>
  </div>
  <form method="dialog" style="display:flex;justify-content:flex-end;margin-top:16px">
    <button value="done" class="primary" autofocus>Klar</button>
  </form>`;

/* Icon-aware text access: buttons may carry a leading .bIcon span that
   translation must never destroy. */
function getBtnText(el) {
  const icon = el.querySelector(':scope > .bIcon');
  return icon ? [...el.childNodes].filter(n => n !== icon).map(n => n.textContent).join('') : el.textContent;
}
function setBtnText(el, txt) {
  const icon = el.querySelector(':scope > .bIcon');
  if (!icon) { el.textContent = txt; return; }
  [...el.childNodes].forEach(n => { if (n !== icon) n.remove(); });
  el.appendChild(document.createTextNode(txt));
}

let EN_CACHE = null;
function captureEnglish() {
  if (EN_CACHE) return;
  EN_CACHE = { sel: new Map(), labels: new Map(), opts: {}, ph: new Map(), help: $('helpDlg').innerHTML };
  for (const [sel] of SV) {
    if (!sel) continue;
    const el = document.querySelector(sel);
    if (el) EN_CACHE.sel.set(sel, getBtnText(el));
  }
  for (const lab of document.querySelectorAll('#edMeta label, .dlgRow')) {
    const t = lab.childNodes[0];
    // key the *text node* (or a text-only span), never the label element itself —
    // setting textContent on the label would destroy the input inside it
    if (t && t.nodeType === 3 && t.textContent.trim()) EN_CACHE.labels.set(t, t.textContent);
    const span = lab.querySelector(':scope > span:first-child');
    if (span && !span.querySelector('input,select,button')) EN_CACHE.labels.set(span, span.textContent);
  }
  for (const [id] of Object.entries(SV_OPTIONS)) {
    EN_CACHE.opts[id] = [...$(id).options].map(o => o.textContent);
  }
  for (const [sel] of SV_PLACEHOLDERS) {
    const el = document.querySelector(sel);
    if (el) EN_CACHE.ph.set(sel, el.placeholder);
  }
}

function applyLang() {
  captureEnglish();
  const sv = lang === 'sv';
  document.documentElement.lang = sv ? 'sv' : 'en';
  for (const [sel, svText] of SV) {
    if (!sel || svText === null) continue;
    const el = document.querySelector(sel);
    if (el) setBtnText(el, sv ? svText : EN_CACHE.sel.get(sel));
  }
  // labels whose leading text node names the field
  for (const [node, enText] of EN_CACHE.labels) {
    const enTrim = enText.trim();
    const pair = SV_LABELED.find(([en]) => enTrim.startsWith(en));
    if (!pair) continue;
    const txt = sv ? pair[1] : pair[0];
    if (node.nodeType === 3) node.textContent = enText.replace(pair[0], txt);
    else node.textContent = sv ? pair[1] : enText;
  }
  for (const [id, map] of Object.entries(SV_OPTIONS)) {
    [...$(id).options].forEach((o, k) => {
      o.textContent = sv ? map[o.value] : EN_CACHE.opts[id][k];
    });
  }
  for (const [sel, svPh] of SV_PLACEHOLDERS) {
    const el = document.querySelector(sel);
    if (el) el.placeholder = sv ? svPh : EN_CACHE.ph.get(sel);
  }
  $('helpDlg').innerHTML = sv ? HELP_SV : EN_CACHE.help;
  // header icon buttons
  const setL = sv ? 'Inställningar' : 'Settings';
  $('btnSettings').title = setL; $('btnSettings').setAttribute('aria-label', setL);
  $('wSettings').title = setL; $('wSettings').setAttribute('aria-label', setL);
  const addL = sv ? 'Lägg till de markerade symbolerna i meningen' : 'Append the selected symbols to the sentence';
  $('wAddA').title = addL; $('wAddB').title = addL;
  $('wtList').title = sv ? 'Visa eller dölj ordlistan' : 'Show or hide the word list';
  $('wtChips').title = sv ? 'Visa eller dölj ordalternativen' : 'Show or hide the word alternatives';
  $('wtChooser').title = sv ? 'Visa eller dölj böjningsraden' : 'Show or hide the form row';
  $('homeLink').title = sv ? 'Till startsidan' : 'To the start page';
  const helpL = sv ? 'Hjälp & tangentbordsgenvägar (?)' : 'Help & keyboard shortcuts (?)';
  $('btnHelp').title = helpL;
  $('btnHelp').setAttribute('aria-label', sv ? 'Hjälp och tangentbordsgenvägar' : 'Help and keyboard shortcuts');
  $('setLang').value = lang;
  // refresh dynamic surfaces
  renderListPane('A'); renderListPane('B');
  updateSaveTarget(); renderStage();
  renderFamRow(); renderVariantRow(false);
  populateGlossSelect(); updateMoveBtnTitles(); updateCaptionBar();
  applyTheme(localStorage.getItem('wb-theme') || 'auto');
}

$('setLang').onchange = () => {
  lang = $('setLang').value;
  wbSetLang(lang);
  applyLang();
};
applyLang();
