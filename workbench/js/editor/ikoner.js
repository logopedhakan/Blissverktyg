/* Editera and Skriv: a Bliss symbol beside every setting and button
   (js/shared/ikoner.js, 2026-11-20). Loaded after i18n.js, which has read the
   English words by then; the symbols carry its 'bIcon' class, so a change of
   language (setBtnText) keeps them, and the words they sit beside are the same
   text nodes and spans the translation writes to. */
'use strict';
wbIcons.put({
  // the header
  '#wtList': '15220', '#wtChips': '18272', '#wtChooser': '16940', '#btnWrite': '18285',
  '#btnSettings': '25987', '#btnHelp': '14704',
  // the lists
  '#btnOpen': '15922,15220', '#btnSaveList': '15143,15220', '#btnNewList': '15710,15220',
  '#wAddA': '16760', '#wAddB': '16760', '#btnOpenB': '15922,15220', '#btnSaveB': '15143,15220', '#btnNewB': '15710,15220',
  // Write
  '#wMic': '23902', '#wSpeak': '16728', '#wFam': '16940,20572', '#wClear': '23864', '#wNoSymPrev': '12656,18272', '#wNoSymNext': '15714,18272', '#wSettings': '25987', '#wHelp': '14704',
  '#wOpenDoc': '15922,23479', '#wSaveDoc': '23648,23479', '#wSVG': '23490,16172', '#wPNG': '23490,16172',
  '#wDoc': '23490,23479', '#wPrint': '23624', '#wClip': '16487,29255', '#wToShow': '16172', '#wToTag': '29092',
  // the symbol editor
  '#gloss': '18272', '#symId': '15742', '#wclass': '17961,18272', '#btnNewSym': '15710,12857',
  '#btnAddToList': '15143,15220', '#btnSaveAsNew': '15143,15710', '#edBackWrite': '18285',
  '#btnRotate': '16690', '#btnDelete': '17498', '#btnDup': '13412', '#btnUndo': '23701',
  '#btnExportSVG': '23490,16172', '#btnExportPNG': '23490,16172', '#btnCopyClip': '16487,29255', '#btnGravyr': '29092',
  // the settings
  '#setLang': '15172', '#setGloss': '18272,15172', '#setTheme': '15208,23844',
  '.dlgRow:has(#inkColor)': '13377,15991', '.dlgRow:has(#bgMode)': '13377', '#expText': '29846', '#expUnit': '23214',
  '#wsList': '15220', '#wsChips': '18272', '#wsChooser': '16940', '#wsUnit': '12857,23214', '#wsText': '29846,23214',
  '#wsGap': '25996', '#wsPen': '15214,18250', '#setVoice': '23984', '.dlgRow:has(#setRate)': '23216',
  '#btnVoiceTest': '17787', '#btnWbxSave': '15143', '#btnWbxOpen': '15922', '#settingsDlg button[value=done]': '24844',
}, { cls: 'bIcon' });
