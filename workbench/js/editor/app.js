/* WinBliss Web — browser workbench over the ported WinBliss engine.
   List window · two-pane list manager · symbol editor with handles · export.
   Element array form: [type, sub, clock, mirror, x, y, x2, y2, text, radius, zheight] */
'use strict';

/* ================= utilities ================= */
const $ = (id) => document.getElementById(id);
let lang = wbLang();
const tr = (en, sv) => (lang === 'sv' ? sv : en);
const toastEl = $('toast');
let toastT;
function toast(msg) {
  toastEl.textContent = msg; toastEl.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
const deep = (o) => JSON.parse(JSON.stringify(o));
const firstGloss = (s) => (s.n || '').split(',')[0] || '(unnamed)';

/* Gloss language for the lists (independent of the interface language).
   '' = the .wbs source glosses (English); otherwise a code from GLOSS_LANGS. */
let glossLang = localStorage.getItem('wb-gloss') || '';
if (glossLang && !(glossLang in BLISS_GLOSSES)) glossLang = '';
function translatedGloss(s) {
  return glossLang ? (BLISS_GLOSSES[glossLang][s.id] || '') : '';
}
function displayGloss(s) {
  const g = translatedGloss(s);
  return g ? g.split(',')[0] : firstGloss(s);
}

/* ================= wbs read/write ================= */
/* parseWbsText, encodeWbs, decodeWbsBuffer: js/shared/wbs.js */
function download(name, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}

/* ================= lists ================= */
/* Standardization flag — DERIVED, never declared (BCI is strict that only they
   mark what is standard, so the flag is computed from BCI's own published
   release and can't be set by hand): a symbol is BCI-AV iff its id exists in
   the shipped release AND word class + geometry match that record exactly.
   Editing a standard symbol demotes it to "modified"; own ids are "own". */
/* Identity is horizontal-translation-independent (the spec: X positions carry
   no meaning — the original editor centred symbols on load), but vertical
   position is meaningful (skyline anchoring) and is compared exactly. */
function stdKey(c, e) {
  if (!e || !e.length) return c + '|empty';
  const minX = Math.min(...e.map(el => el[4]));
  return JSON.stringify([c, e.map(el => {
    const f = el.slice(); f[4] = Math.round((f[4] - minX) * 1000) / 1000; return f;
  })]);
}
const STD = new Map(BLISS_DATA.map(s => [+s.id, stdKey(s.c, s.e)]));
function stdStatus(sym) {
  const ref = STD.get(+sym.id);
  if (!ref) return 'own';
  return ref === stdKey(sym.c, sym.e) ? 'std' : 'mod';
}
function stdBadgeHTML(sym) {
  const st = stdStatus(sym);
  const label = st === 'std' ? 'BCI-AV' : st === 'mod' ? tr('modified', 'ändrad') : tr('own', 'egen');
  const tip = st === 'std'
    ? tr('Standardized: identical to this BCI-AV release record', 'Standardiserad: identisk med posten i BCI-AV-releasen')
    : st === 'mod'
      ? tr('This BCI id exists in the release, but the symbol differs — not the standard symbol', 'BCI-id:t finns i releasen, men symbolen avviker — inte standardsymbolen')
      : tr('Own symbol: not part of the BCI Authorized Vocabulary', 'Egen symbol: ingår inte i BCI:s auktoriserade ordförråd');
  return `<span class="stdBadge ${st}" title="${tip}">${label}</span>`;
}

const lists = {
  // mod = unsaved changes since the list was loaded/saved (guards Open replacing work)
  A: { name: 'BCI-AV 2026-07-25.wbs', syms: BLISS_DATA.map(s => ({ ...s, k: s.k || 'SWE', e: s.e })), sel: new Set(), anchor: -1, mod: false },
  B: { name: 'untitled.wbs', syms: [], sel: new Set(), anchor: -1, mod: false },
};
const MAX_ROWS = 250;

/* List thumbnails: one fixed compact row box, one scale. Every symbol renders
   at the same unit (same stroke, size differences preserved — they are meaning:
   MOUTH vs SUN) and is centred in a fixed 96x50 box; only symbols too tall or
   too wide for the box shrink to fit (CSS contain), so the common case keeps
   identical scale and rows stay dense and uniform. */
const THUMB_UNIT = 3.2;
function thumbSVG(s) {
  return blissSVG(s, { unit: THUMB_UNIT, color: 'currentColor' });
}

function renderListPane(key) {
  const L = lists[key];
  const rows = $(key === 'A' ? 'rowsA' : 'rowsB');
  const q = $(key === 'A' ? 'search' : 'searchB').value.trim().toLowerCase();
  rows.innerHTML = '';
  let shown = 0;
  L.view = [];
  for (let i = 0; i < L.syms.length; i++) {
    const s = L.syms[i];
    if (q && !(s.n.toLowerCase().includes(q) || translatedGloss(s).toLowerCase().includes(q) || String(s.id).startsWith(q))) continue;
    L.view.push(i);
    if (shown++ >= MAX_ROWS) continue;
    const d = document.createElement('div');
    d.className = 'row' + (L.sel.has(i) ? ' sel' : '');
    d.dataset.i = i;
    d.draggable = true;
    let thumb = '';
    try { thumb = thumbSVG(s); } catch (_) {}
    d.innerHTML = `<span class="thumb">${thumb}</span>
      <span class="g">${displayGloss(s)}<br><span class="id mono">${s.id}</span></span>
      <button class="editG" title="${tr('Edit gloss & synonyms (F2)', 'Redigera benämning & synonymer (F2)')}" aria-label="${tr('Edit gloss for', 'Redigera benämning för')} ${firstGloss(s)}">✎</button>`;
    rows.appendChild(d);
  }
  $(key === 'A' ? 'countA' : 'countB').textContent =
    `${L.syms.length} ${tr('symbols', 'symboler')}` + (q ? ` · ${L.view.length} ${tr('match', 'träffar')}` : '') +
    (shown > MAX_ROWS ? ` · ${tr('showing', 'visar')} ${MAX_ROWS}` : '') +
    (L.sel.size ? ` · ${L.sel.size} ${tr('selected', 'markerade')}` : '');
  $(key === 'A' ? 'listAName' : 'listBName').textContent = L.name;
  updateExportTitle();
  if (typeof persistSoon === 'function') persistSoon();
}
/* inline gloss editing (the original's SHIFT+ENTER "Byt text") */
function startGlossEdit(key, i) {
  const rowsEl = $(key === 'A' ? 'rowsA' : 'rowsB');
  const row = rowsEl.querySelector(`.row[data-i="${i}"]`); if (!row) return;
  const L = lists[key], s = L.syms[i];
  const g = row.querySelector('.g');
  row.draggable = false;
  g.innerHTML = '';
  const inp = document.createElement('input');
  inp.className = 'glossInput'; inp.value = s.n;
  inp.setAttribute('aria-label', tr(`Gloss and synonyms for BCI ${s.id}`, `Benämning och synonymer för BCI ${s.id}`));
  inp.style.width = '100%'; inp.style.font = 'inherit';
  g.appendChild(inp);
  inp.focus(); inp.select();
  let done = false;
  const finish = (commit) => {
    if (done) return; done = true;
    if (commit && inp.value.trim()) {
      s.n = inp.value.trim();
      L.mod = true;
      // keep the open editor in sync if it holds this symbol untouched
      if (!ed.dirty && ed.srcKey === key && +ed.sym.id === s.id) {
        ed.sym.n = s.n; $('gloss').value = s.n;
      }
      toast(tr(`Gloss updated for ${s.id}`, `Benämning uppdaterad för ${s.id}`));
    }
    renderListPane(key);
  };
  inp.addEventListener('keydown', (kev) => {
    kev.stopPropagation();
    if (kev.key === 'Enter') finish(true);
    if (kev.key === 'Escape') finish(false);
  });
  inp.addEventListener('blur', () => finish(true));
  inp.addEventListener('click', (cev) => cev.stopPropagation());
}
for (const key of ['A', 'B']) {
  const rowsEl = $(key === 'A' ? 'rowsA' : 'rowsB');
  rowsEl.addEventListener('keydown', (ev) => {
    if (ev.key !== 'F2') return;
    const L = lists[key];
    if (L.sel.size === 1) { ev.preventDefault(); startGlossEdit(key, [...L.sel][0]); }
  });
}

function listClick(key, ev) {
  if (ev.target.closest('.glossInput')) return;
  const pencil = ev.target.closest('.editG');
  if (pencil) {
    ev.stopPropagation();
    startGlossEdit(key, +pencil.closest('.row').dataset.i);
    return;
  }
  const row = ev.target.closest('.row'); if (!row) return;
  // focus lives in one pane at a time: a click here clears the other pane's selection
  const otherKey = key === 'A' ? 'B' : 'A';
  if (lists[otherKey].sel.size) { lists[otherKey].sel.clear(); lists[otherKey].anchor = -1; renderListPane(otherKey); }
  const L = lists[key], i = +row.dataset.i;
  if (ev.shiftKey && L.anchor >= 0) {
    const a = L.view.indexOf(L.anchor), b = L.view.indexOf(i);
    if (a >= 0 && b >= 0) {
      if (!ev.ctrlKey && !ev.metaKey) L.sel.clear();
      for (let k = Math.min(a, b); k <= Math.max(a, b); k++) L.sel.add(L.view[k]);
    }
  } else if (ev.ctrlKey || ev.metaKey) {
    L.sel.has(i) ? L.sel.delete(i) : L.sel.add(i);
    L.anchor = i;
  } else if (document.body.classList.contains('writing')) {
    // in Write mode a list click appends the symbol to the sentence
    L.sel.clear(); L.sel.add(i); L.anchor = i; renderListPane(key);
    const word = displayGloss(L.syms[i]).split(' ')[0];
    $('wInput').value = ($('wInput').value + ' ' + word).trim();
    wParse();
  } else {
    // plain click: select AND open in the editor (guarding unsaved edits)
    L.sel.clear(); L.sel.add(i); L.anchor = i;
    guardedLoad(deep(L.syms[i]), key);
  }
  renderListPane(key);
}

/* In-app confirm (native confirm() shows a captionless browser dialog) */
function askConfirm(msg, okLabel) {
  return new Promise((res) => {
    const dlg = $('confirmDlg');
    $('confirmMsg').textContent = msg;
    $('confirmOk').textContent = okLabel || 'OK';
    $('confirmCancel').textContent = tr('Cancel', 'Avbryt');
    dlg.returnValue = '';
    dlg.onclose = () => res(dlg.returnValue === 'ok');
    dlg.showModal();
  });
}

/* Save/Don't save/Cancel guard before replacing an edited symbol */
function guardedLoad(sym, srcKey) {
  if (!ed.dirty) { loadIntoEditor(sym, srcKey); return; }
  const dlg = $('dirtyDlg');
  $('dirtyMsg').textContent = tr(
    `"${firstGloss(ed.sym) || 'the current symbol'}" has unsaved changes.`,
    `"${firstGloss(ed.sym) || 'den aktuella symbolen'}" har osparade ändringar.`);
  dlg.returnValue = '';
  dlg.showModal();
  dlg.onclose = () => {
    if (dlg.returnValue === 'save') {
      saveCurrentToList().then((ok) => { if (ok) loadIntoEditor(sym, srcKey); });
    } else if (dlg.returnValue === 'discard') {
      loadIntoEditor(sym, srcKey);
    } // cancel: stay put
  };
}
$('rowsA').addEventListener('click', (e) => listClick('A', e));
$('rowsB').addEventListener('click', (e) => listClick('B', e));
$('rowsA').addEventListener('dblclick', (ev) => {
  if (ev.target.closest('.editG, .glossInput')) return;
  const row = ev.target.closest('.row'); if (!row) return;
  guardedLoad(deep(lists.A.syms[+row.dataset.i]), 'A');
});
$('rowsB').addEventListener('dblclick', (ev) => {
  if (ev.target.closest('.editG, .glossInput')) return;
  const row = ev.target.closest('.row'); if (!row) return;
  guardedLoad(deep(lists.B.syms[+row.dataset.i]), 'B');
});
$('search').addEventListener('input', () => renderListPane('A'));
$('searchB').addEventListener('input', () => renderListPane('B'));

/* drag a list row into the editor = merge its elements (the hästvagn gesture).
   Rows are always draggable; delegated dragstart so clicks stay untouched. */
for (const key of ['A', 'B']) {
  $(key === 'A' ? 'rowsA' : 'rowsB').addEventListener('dragstart', (ev) => {
    const row = ev.target.closest('.row'); if (!row) return;
    ev.dataTransfer.setData('text/bliss-sym', JSON.stringify({ key, i: +row.dataset.i }));
    ev.dataTransfer.setData('text/bliss-src-' + key.toLowerCase(), '1');
    // In Write mode a drag also carries the WORDS (text/plain), so a row —
    // or a whole multi-selection, if the dragged row is part of one — can be
    // dropped straight into the sentence, at the exact drop point in the input.
    if (document.body.classList.contains('writing')) {
      const L = lists[key], i = +row.dataset.i;
      const idxs = L.sel.has(i) && L.sel.size > 1 ? [...L.sel].sort((a, b) => a - b) : [i];
      // padded with spaces so a drop in the middle of the input never glues words
      ev.dataTransfer.setData('text/plain', ' ' + idxs.map(k => displayGloss(L.syms[k]).split(' ')[0]).join(' ') + ' ');
    }
    ev.dataTransfer.effectAllowed = 'copyMove';
  });
}

/* Write mode: append the selected symbols of a pane to the sentence */
function wAppendWords(words) {
  if (!words) return;
  $('wInput').value = ($('wInput').value + ' ' + words).trim();
  wParse();
}
for (const [btn, key] of [['wAddA', 'A'], ['wAddB', 'B']]) {
  $(btn).onclick = () => {
    const L = lists[key];
    const idxs = [...L.sel].sort((a, b) => a - b);
    if (!idxs.length) return toast(tr('Select one or more symbols in the list first', 'Markera en eller flera symboler i listan först'));
    wAppendWords(idxs.map(k => displayGloss(L.syms[k]).split(' ')[0]).join(' '));
  };
}

/* Header icons, drawn by the Bliss engine itself from template elements —
   open = out of the container, save = into it, export = off the page, manager = two lists. */
const BLISS_ICONS = {
  btnOpen:       { e: [['O', 1, 3, 0, 2, 12, 0, 0, '', 0, 4], ['F', 1, 1, 0, 4, 5.5, 0, 0, '', 0, 4]] },
  btnSaveList:   { e: [['O', 1, 3, 0, 2, 12, 0, 0, '', 0, 4], ['F', 1, 3, 0, 4, 5.5, 0, 0, '', 0, 4]] },
  btnExportList: { e: [['M', 1, 1, 0, 2, 8, 0, 0, '', 0, 4], ['F', 1, 2, 0, 8.5, 10, 0, 0, '', 0, 4]] },
  btnManager:    { e: [['M', 1, 1, 0, 2, 8, 0, 0, '', 0, 4], ['M', 1, 1, 0, 9, 8, 0, 0, '', 0, 4]] },
};
for (const [id, sym] of Object.entries(BLISS_ICONS)) {
  const span = $(id) && $(id).querySelector('.bIcon');
  if (span) try {
    span.innerHTML = blissSVG(sym, { unit: 2.4, color: 'currentColor' })
      .replace(/stroke-width="(\d+(?:\.\d+)?)"/, (m, w) => `stroke-width="${Math.round(w * 1.8)}"`);
  } catch (_) {}
}

/* open / save / new */
function openFile(cb) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.wbs,.txt';
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    f.arrayBuffer().then(buf => cb(parseWbsText(decodeWbsBuffer(buf)), f.name));
  };
  inp.click();
}
/* The 1997 lesson: never let "open" (or anything else) silently replace a list
   someone has worked on. Saving itself is safe here — downloads never overwrite. */
async function confirmReplaceList(key) {
  const L = lists[key];
  if (!L.mod || !L.syms.length) return true;
  return askConfirm(
    tr(`"${L.name}" has unsaved changes that would be replaced. Open another list anyway? (Cancel and use Save list first to keep it.)`,
       `"${L.name}" har osparade ändringar som skulle ersättas. Öppna en annan lista ändå? (Avbryt och använd Spara lista först för att behålla den.)`),
    tr('Replace', 'Ersätt'));
}
$('btnOpen').onclick = async () => {
  if (!(await confirmReplaceList('A'))) return;
  openFile((syms, name) => {
    lists.A.syms = syms; lists.A.name = name; lists.A.sel.clear(); lists.A.mod = false;
    wListChanged();
    renderListPane('A'); updateSaveTarget(); toast(tr(`Opened ${name}: ${syms.length} symbols`, `Öppnade ${name}: ${syms.length} symboler`));
  });
};
$('btnNewB').onclick = async () => {
  if (lists.B.syms.length && !(await askConfirm(tr('Empty this list? (Unsaved changes are lost.)', 'Töm den här listan? (Osparade ändringar går förlorade.)'), tr('Empty the list', 'Töm listan')))) return;
  lists.B.syms = []; lists.B.name = 'untitled.wbs'; lists.B.sel.clear(); lists.B.mod = false;
  renderListPane('B'); updateSaveTarget();
};
$('btnOpenB').onclick = async () => {
  if (!(await confirmReplaceList('B'))) return;
  openFile((syms, name) => {
    lists.B.syms = syms; lists.B.name = name; lists.B.sel.clear(); lists.B.mod = false;
    renderListPane('B'); updateSaveTarget(); toast(tr(`Opened ${name}: ${syms.length} symbols`, `Öppnade ${name}: ${syms.length} symboler`));
  });
};
$('btnSaveList').onclick = () => {
  download(lists.A.name.replace(/\.wbs$/i, '') + '.wbs',
           new Blob([encodeWbs(lists.A.syms)], { type: 'application/octet-stream' }));
  lists.A.mod = false; persistSoon();
  toast(tr(`Saved ${lists.A.syms.length} symbols`, `Sparade ${lists.A.syms.length} symboler`));
};
$('btnSaveB').onclick = () => {
  download(lists.B.name.replace(/\.wbs$/i, '') + '.wbs',
           new Blob([encodeWbs(lists.B.syms)], { type: 'application/octet-stream' }));
  lists.B.mod = false; persistSoon();
};
$('btnNewList').onclick = async () => {
  if (!(await askConfirm(tr('Empty the main list? (Unsaved changes are lost.)', 'Töm huvudlistan? (Osparade ändringar går förlorade.)'), tr('Empty the list', 'Töm listan')))) return;
  lists.A.syms = []; lists.A.name = 'untitled.wbs'; lists.A.sel.clear(); lists.A.mod = false;
  wListChanged();
  renderListPane('A'); updateSaveTarget();
};

/* ---- list manager (pane B + move buttons) ---- */
$('btnManager').onclick = () => {
  document.body.classList.toggle('manager');
  $('paneB').classList.toggle('open');
  renderListPane('B'); updateSaveTarget();
  setTimeout(renderStage, 30);   // the editor viewport just changed size (timer, not rAF: fires even in background tabs)
};
$('btnCloseB').onclick = () => {
  document.body.classList.remove('manager');
  $('paneB').classList.remove('open');
  ed.srcKey = 'A'; updateSaveTarget();
  setTimeout(renderStage, 30);   // the editor viewport just changed size (timer, not rAF: fires even in background tabs)
};
function moveIndices(from, to, idx, copy = false) {
  const F = lists[from], T = lists[to];
  const have = new Set(T.syms.map(s => s.id));
  let moved = 0, dup = 0;
  const keep = new Set(idx);
  const moving = [];
  for (const i of idx) {
    const s = F.syms[i];
    if (!s) { keep.delete(i); continue; }
    if (have.has(s.id)) { dup++; keep.delete(i); continue; }
    moving.push(copy ? deep(s) : s); have.add(s.id); moved++;
  }
  T.syms.push(...moving);
  if (!copy) F.syms = F.syms.filter((_, i) => !keep.has(i));
  if (moved) { T.mod = true; if (!copy) F.mod = true; wListChanged(); }
  F.sel.clear(); T.sel.clear();
  renderListPane(from); renderListPane(to);
  const verb = copy ? tr('Copied', 'Kopierade') : tr('Moved', 'Flyttade');
  toast(`${verb} ${moved}${dup ? tr(` · skipped ${dup} duplicates`, ` · hoppade över ${dup} dubbletter`) : ''}`);
}
function moveSyms(from, to, onlySelected, copy = false) {
  const F = lists[from];
  moveIndices(from, to, onlySelected ? [...F.sel].sort((a, b) => a - b) : F.syms.map((_, i) => i), copy);
}

/* drag & drop between the two lists */
let insMark = null;
function clearInsMark() {
  if (insMark) { insMark.el.classList.remove('insBefore', 'insAfter'); insMark = null; }
}
function reorderWithin(key, moveIdx, anchorI, before) {
  const L = lists[key];
  const moving = moveIdx.map(i => L.syms[i]);
  const movingSet = new Set(moveIdx);
  const anchorSym = anchorI == null ? null : L.syms[anchorI];
  L.syms = L.syms.filter((_, i) => !movingSet.has(i));
  let at = anchorSym ? L.syms.indexOf(anchorSym) : L.syms.length;
  if (at < 0) at = L.syms.length;
  else if (!before) at += 1;
  L.syms.splice(at, 0, ...moving);
  L.sel = new Set(moving.map(s => L.syms.indexOf(s)));
  L.mod = true;
  renderListPane(key);
}
for (const targetKey of ['A', 'B']) {
  const rowsEl = $(targetKey === 'A' ? 'rowsA' : 'rowsB');
  const sameListType = 'text/bliss-src-' + targetKey.toLowerCase();
  rowsEl.addEventListener('dragover', (ev) => {
    const types = [...ev.dataTransfer.types];
    if (!types.includes('text/bliss-sym')) return;
    ev.preventDefault();
    if (types.includes(sameListType)) {
      // reorder within this list: show an insertion line
      rowsEl.classList.remove('dropping');
      clearInsMark();
      const row = ev.target.closest('.row');
      if (row) {
        const r = row.getBoundingClientRect();
        const before = (ev.clientY - r.top) < r.height / 2;
        row.classList.add(before ? 'insBefore' : 'insAfter');
        insMark = { el: row, before, i: +row.dataset.i };
      }
    } else {
      rowsEl.classList.add('dropping');
      ev.dataTransfer.dropEffect = ev.shiftKey ? 'move' : 'copy';
    }
  });
  rowsEl.addEventListener('dragleave', (ev) => {
    if (!rowsEl.contains(ev.relatedTarget)) { rowsEl.classList.remove('dropping'); clearInsMark(); }
  });
  rowsEl.addEventListener('drop', (ev) => {
    rowsEl.classList.remove('dropping');
    const d = ev.dataTransfer.getData('text/bliss-sym');
    const mark = insMark; clearInsMark();
    if (!d) return;
    ev.preventDefault();
    const { key, i } = JSON.parse(d);
    const src = lists[key];
    const idx = src.sel.has(i) ? [...src.sel].sort((a, b) => a - b) : [i];
    if (key === targetKey) {
      // reorder in place; drop on empty space = move to end
      reorderWithin(key, idx, mark ? mark.i : null, mark ? mark.before : false);
    } else {
      // cross-list drop: copy by default, Shift = move (the master list stays intact)
      moveIndices(key, targetKey, idx, !ev.shiftKey);
    }
  });
}
$('mvSelR').onclick = (ev) => moveSyms('A', 'B', true, !ev.shiftKey);
$('mvAllR').onclick = (ev) => moveSyms('A', 'B', false, !ev.shiftKey);
$('mvSelL').onclick = (ev) => moveSyms('B', 'A', true, !ev.shiftKey);
$('mvAllL').onclick = (ev) => moveSyms('B', 'A', false, !ev.shiftKey);
function updateMoveBtnTitles() {
  const pairs = [
    ['btnOpen', tr('Open a .wbs list', 'Öppna en .wbs-lista')],
    ['btnSaveList', tr('Save this list as .wbs', 'Spara listan som .wbs')],
    ['btnOpenB', tr('Open a .wbs list', 'Öppna en .wbs-lista')],
    ['btnSaveB', tr('Save this list as .wbs', 'Spara listan som .wbs')],
    ['mvSelR', tr('Copy selected right · Shift-click moves', 'Kopiera markerade åt höger · skift-klick flyttar')],
    ['mvAllR', tr('Copy all right · Shift-click moves', 'Kopiera alla åt höger · skift-klick flyttar')],
    ['mvSelL', tr('Copy selected left · Shift-click moves', 'Kopiera markerade åt vänster · skift-klick flyttar')],
    ['mvAllL', tr('Copy all left · Shift-click moves', 'Kopiera alla åt vänster · skift-klick flyttar')],
  ];
  for (const [id, t] of pairs) { $(id).title = t; $(id).setAttribute('aria-label', t); }
}
updateMoveBtnTitles();

/* ================= editor ================= */
const G = 100;                       // engine units → viewbox
const VB = { x: -300, y: -360, w: 3700, h: 2660 };   // headroom above the tall-indicator line for the caption band
let gridW = 3200;                    // grows on demand, whole squares
const stage = $('stage');
function fitStage() {
  // widen the grid when content approaches the right edge
  let els = [];
  try { els = (ed && ed.sym) ? ed.sym.e : []; } catch (_) { /* before ed exists at boot */ }
  const maxU = els.length ? Math.max(...els.map(e => e[4])) : 0;
  const need = Math.max(3200, Math.ceil((maxU + 14) * G / 800) * 800);
  gridW = need;
  VB.w = gridW + 500;
  stage.setAttribute('viewBox', `${VB.x} ${VB.y} ${VB.w} ${VB.h}`);
  // Fit the stage to the viewport HEIGHT (no vertical scrolling); the width
  // follows at the same scale and scrolls horizontally only when the grid has
  // grown wider than the viewport.
  const wrap = $('stageWrap');
  let pad = 36;
  if (wrap) {
    const cs = getComputedStyle(wrap);
    pad = (parseFloat(cs.paddingTop) || 18) + (parseFloat(cs.paddingBottom) || 18);
  }
  const availH = Math.max(210, (wrap ? wrap.clientHeight : 660) - pad);
  stage.setAttribute('height', String(Math.round(availH)));
  stage.setAttribute('width', String(Math.round(VB.w * availH / VB.h)));
}
fitStage();
/* Re-fit whenever the stage viewport itself changes size — window resizes,
   the list manager opening/closing, the meta row wrapping to more lines.
   rAF-debounced; only reacts to real height changes to avoid observe loops. */
let _fitRAF = 0, _lastWrapH = 0;
new ResizeObserver(() => {
  const wrapEl = $('stageWrap');
  if (!wrapEl || wrapEl.clientHeight === _lastWrapH) return;
  _lastWrapH = wrapEl.clientHeight;
  cancelAnimationFrame(_fitRAF);
  _fitRAF = requestAnimationFrame(() => { try { renderStage(); } catch (_) { fitStage(); } });
}).observe($('stageWrap'));

const ed = {
  sym: { id: '', n: '', c: 'YELLOW', k: 'SWE', e: [] },
  sel: new Set(),
  undo: [],
  step: 2,
  dirty: false,
  srcKey: 'A',       // which list the current symbol came from = default save target
  caption: null,     // export text override; null = follow the gloss (WBX TextLine1)
};

function managerOpen() { return document.body.classList.contains('manager'); }
const shortName = (key) => {
  const n = lists[key].name.replace(/\.wbs$/i, '');
  return n.length > 22 ? n.slice(0, 21) + '…' : n;
};
function updateSaveTarget() {
  // one save button per open list, each named for its list
  $('btnAddToList').textContent = `${tr('Save', 'Spara')} → ${shortName('A')}`;
  const bB = $('btnAddToListB');
  bB.textContent = `${tr('Save', 'Spara')} → ${shortName('B')}`;
  bB.style.display = managerOpen() ? '' : 'none';
}

function pushUndo() {
  ed.undo.push(deep({ e: ed.sym.e }));
  if (ed.undo.length > 80) ed.undo.shift();
  ed.dirty = true;
  if (typeof persistSoon === 'function') persistSoon();
}
function doUndo() {
  const u = ed.undo.pop();
  if (!u) { toast(tr('Nothing to undo', 'Inget att ångra')); return; }
  ed.sym.e = u.e; ed.sel.clear(); renderStage();
}

function loadIntoEditor(sym, srcKey) {
  ed.sym = { id: sym.id ?? '', n: sym.n || '', c: sym.c || 'YELLOW', k: sym.k || 'SWE', e: deep(sym.e || []) };
  // Centre the symbol in the editing grid, as the original did on load
  // (EditFormUnit: left := (BODYWIDTH - Body.Width) div 2; element.X += left)
  if (ed.sym.e.length) {
    try {
      const vb = blissSVG(ed.sym, { unit: 4 }).match(/viewBox="([-\d.]+) [-\d.]+ ([-\d.]+)/);
      if (vb) {
        const cx = (+vb[1] + +vb[2] / 2) / G;                 // symbol centre, in units
        let dx = Math.round((16 - cx) / 2) * 2;               // to grid centre, fine-grid steps
        const minX = Math.min(...ed.sym.e.map(el2 => el2[4]));
        if (minX + dx < 1) dx = Math.round((1 - minX) / 2) * 2;   // wide symbols: keep left edge in view
        if (dx) ed.sym.e.forEach(el2 => { el2[4] += dx; });
      }
    } catch (_) {}
  }
  ed.sel.clear(); ed.undo = []; ed.dirty = false;
  ed.caption = null;                 // caption follows the new symbol's gloss again
  if (srcKey) ed.srcKey = srcKey;
  updateSaveTarget();
  $('gloss').value = ed.sym.n;
  $('symId').value = ed.sym.id;
  $('wclass').value = ed.sym.c;
  $('country').value = ed.sym.k;
  updateCaptionBar();
  renderStage();
}

/* Caption above the grid (the original's TextLine1): follows the first gloss
   until edited; the edited text is what exports carry. Empty edit = follow again. */
function captionText() {
  if (ed.caption !== null) return ed.caption;
  // Follow the gloss in the CHOSEN DISPLAY LANGUAGE: the list says "båt",
  // so the editor caption — and text-bearing exports — say "båt" too
  // (PeO + Håkan Larsson, 2026-08-25). The Benämning field keeps showing the
  // .wbs source gloss, since that is the data being edited.
  const tg = translatedGloss(ed.sym);
  if (tg) return tg.split(',')[0].trim();
  const g = ($('gloss').value || ed.sym.n || '').split(',')[0].trim();
  return g;
}
function updateCaptionBar() {
  // small dim line beside Benämning: the same symbol in the display language
  const x = $('glossXl');
  if (x) {
    const tg = translatedGloss(ed.sym);
    x.textContent = tg || '';
    x.style.display = tg ? '' : 'none';
  }
  renderStage();                                 // caption lives inside the stage grid
}
/* The caption's standard place (per the original's editor): inside the grid,
   in the squares just above the sky line, centred over the symbol. */
function captionSVG() {
  const t = captionText();
  if (!t) return '';
  let cx = 1600;                       // empty canvas: over the grid centre
  if (ed.sym.e.length) {
    try {
      const vb = blissSVG(ed.sym, { unit: 4 }).match(/viewBox="([-\d.]+) [-\d.]+ ([-\d.]+)/);
      if (vb) cx = +vb[1] + +vb[2] / 2;   // true rendered centre of the symbol
    } catch (_) {}
  }
  const tip = ed.caption === null
    ? tr('Export text — follows the gloss. Click to edit.', 'Exporttext — följer benämningen. Klicka för att redigera.')
    : tr('Export text (edited). Click to change; empty follows the gloss again.', 'Exporttext (redigerad). Klicka för att ändra; tom följer benämningen igen.');
  // The caption's own band, ABOVE the tall-indicator line (y=0) — the original
  // put the text above the whole body incl. indicators (Symbol.SetDescrState),
  // so it can never collide with an indicator, tall or not.
  return `<text class="stageCap${ed.caption === null ? ' autoCap' : ''}" x="${cx}" y="-110"` +
    ` text-anchor="middle" font-size="200"><title>${escXml(tip)}</title>${escXml(t)}</text>`;
}
function startCaptionEdit() {
  if (document.querySelector('.capInput')) return;
  const wrap = $('stageWrap');
  const cap = stage.querySelector('.stageCap');
  const inp = document.createElement('input');
  inp.className = 'capInput';
  inp.value = captionText();
  inp.size = Math.max(10, inp.value.length + 2);
  // place the input where the caption sits (or top-centre of the view if none)
  const wr = wrap.getBoundingClientRect();
  if (cap) {
    const cr = cap.getBoundingClientRect();
    inp.style.left = Math.max(4, cr.left - wr.left + wrap.scrollLeft - 40) + 'px';
    inp.style.top = (cr.top - wr.top + wrap.scrollTop - 6) + 'px';
  } else { inp.style.left = '40px'; inp.style.top = '28px'; }
  wrap.appendChild(inp);
  inp.focus(); inp.select();
  let done = false;
  const finish = (commit) => {
    if (done) return; done = true;
    if (commit) { const v = inp.value.trim(); ed.caption = v || null; persistSoon(); }
    inp.remove(); renderStage();
  };
  inp.addEventListener('keydown', (kev) => {
    kev.stopPropagation();
    if (kev.key === 'Enter') finish(true);
    if (kev.key === 'Escape') finish(false);
  });
  inp.addEventListener('blur', () => finish(true));
}
$('stage').addEventListener('click', (ev) => {
  if (ev.target.closest && ev.target.closest('.stageCap')) { ev.stopPropagation(); startCaptionEdit(); }
});
$('gloss').addEventListener('input', updateCaptionBar);
$('btnNewSym').onclick = () => loadIntoEditor({ id: '', n: '', c: 'YELLOW', k: 'SWE', e: [] });

function gridSVG() {
  let g = '<g id="grid">';
  for (let x = 0; x <= gridW; x += 200) {
    const strong = x % 800 === 0;
    g += `<line x1="${x}" y1="0" x2="${x}" y2="2000" stroke="${strong ? 'var(--grid-a)' : 'var(--grid-b)'}" stroke-width="${strong ? 5 : 3}"/>`;
  }
  for (let y = 0; y <= 2000; y += 200) {
    const strong = y % 400 === 0;
    g += `<line x1="0" y1="${y}" x2="${gridW}" y2="${y}" stroke="${strong ? 'var(--grid-a)' : 'var(--grid-b)'}" stroke-width="${strong ? 4 : 3}"/>`;
  }
  // staff
  g += `<line x1="-160" y1="800" x2="${gridW + 160}" y2="800" stroke="var(--staff)" stroke-width="7"/>`;
  g += `<line x1="-160" y1="1600" x2="${gridW + 160}" y2="1600" stroke="var(--staff)" stroke-width="7"/>`;
  g += `<line x1="-160" y1="400" x2="${gridW + 160}" y2="400" stroke="var(--staff-dim)" stroke-width="5" stroke-dasharray="26 22"/>`;
  g += `<line x1="-160" y1="2000" x2="${gridW + 160}" y2="2000" stroke="var(--staff-dim)" stroke-width="5" stroke-dasharray="26 22"/>`;
  g += `<text class="staffLbl" x="-280" y="776" font-size="56" fill="var(--staff-text)">${tr('sky', 'himmel')}</text>`;
  g += `<text class="staffLbl" x="-280" y="1576" font-size="56" fill="var(--staff-text)">${tr('earth', 'jord')}</text>`;
  return g + '</g>';
}

/* Which element index holds keyboard focus on the canvas (null = none).
   Elements are tab-focusable (PeO + Håkan Larsson, 2026-08-25): Tab walks the
   shapes, focus = selection, arrows move immediately. renderStage rebuilds the
   SVG, so focus is restored to the same element after every rebuild. */
let stageFocusI = null;
function renderStage() {
  const hadFocus = document.activeElement === stage || stage.contains(document.activeElement);
  fitStage();
  const showHandles = true;
  let out = gridSVG();
  ed.sym.e.forEach((el, i) => {
    let body = '';
    try { body = renderBliss({ e: [el] }).body; } catch (_) {}
    const col = ed.sel.has(i) ? 'var(--sel)' : (ed.ink || 'var(--ink)');
    out += `<g class="el" data-i="${i}" tabindex="0" aria-label="${escXml(famName(el[0]))} ${el[0]}${el[1]}" stroke="${col}" stroke-width="35" stroke-linecap="round" stroke-linejoin="round" style="color:${col};cursor:move">` +
           `<style>.bfill{fill:${col}}</style>` + body + `</g>`;
    if (showHandles) {
      const hx = el[4] * G, hy = el[5] * G, HS = 62;
      out += `<rect class="handle" data-i="${i}" x="${hx - HS}" y="${hy - HS}" width="${2 * HS}" height="${2 * HS}"
        fill="color-mix(in srgb, var(--accent) 12%, transparent)" stroke="${ed.sel.has(i) ? 'var(--sel)' : 'var(--accent)'}" stroke-width="6" stroke-dasharray="18 14" style="cursor:move"/>`;
    }
  });
  out += captionSVG();
  stage.innerHTML = out;
  stage.style.background = resolvedBg() || '';
  // restore keyboard focus after the rebuild (focus lives in the DOM we just replaced)
  if (hadFocus) {
    if (stageFocusI != null && stageFocusI >= ed.sym.e.length) stageFocusI = null;
    const g = stageFocusI != null ? stage.querySelector(`.el[data-i="${stageFocusI}"]`) : null;
    (g || stage).focus({ preventScroll: true });
  }
  // live standardization badge: reflects the working copy as it is edited
  const bEl = $('edStdBadge');
  if (bEl) bEl.innerHTML = ed.sym.e.length ? stdBadgeHTML({ id: ed.sym.id, c: ed.sym.c, e: ed.sym.e }) : '';
  $('btnRotate').disabled = $('btnDelete').disabled = $('btnDup').disabled = ed.sel.size === 0;
}

/* word-class chart colours (WinBliss palette, softened for backgrounds) */
const WCLASS_RGB = { YELLOW:[255,255,0], RED:[255,0,0], GREEN:[0,255,0],
                     BLUE:[0,0,255], WHITE:[255,255,255], GRAY:[192,192,192] };
function softClassColor(cls, mix = 0.28) {
  const c = WCLASS_RGB[cls] || [255,255,255];
  const to = (v) => Math.round(255 - (255 - v) * mix);
  return `rgb(${to(c[0])},${to(c[1])},${to(c[2])})`;
}
function exportInk() { return ed.ink || '#111'; }
const escXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* Composite the caption into an export SVG per ed.textPlace (tpNone/tpTop/tpBottom). */
function withText(svg, caption) {
  if (ed.textPlace === 'none' || !caption) return svg;
  const vb = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/);
  const wh = svg.match(/width="([\d.]+)" height="([\d.]+)"/);
  if (!vb || !wh) return svg;
  let [, x, y, w, h] = vb.map(Number);
  const scale = +wh[1] / w;
  const fs = 300, pad = 160, band = fs * 1.3 + pad;
  let textY;
  if (ed.textPlace === 'top') { y -= band; h += band; textY = y + fs; }
  else { h += band; textY = y + h - fs * 0.35; }
  const t = `<text x="${x + w / 2}" y="${textY}" text-anchor="middle" font-size="${fs}"` +
    ` font-family="Atkinson Hyperlegible Next, Atkinson Hyperlegible, sans-serif"` +
    ` stroke="none" fill="${exportInk()}">${escXml(caption)}</text>`;
  return svg
    .replace(/viewBox="[^"]+"/, `viewBox="${x} ${y} ${w} ${h}"`)
    .replace(/width="[\d.]+" height="[\d.]+"/, `width="${(w * scale).toFixed(1)}" height="${(h * scale).toFixed(1)}"`)
    .replace('</svg>', t + '</svg>');
}
function withBg(svg, wclass) {
  const bg = resolvedBg(wclass);
  if (!bg) return svg;
  return svg.replace('</style>', `</style><rect x="-100000" y="-100000" width="200000" height="200000" fill="${bg}"/>`);
}

function stagePoint(ev) {
  const r = stage.getBoundingClientRect();
  return { x: VB.x + (ev.clientX - r.left) / r.width * VB.w,
           y: VB.y + (ev.clientY - r.top) / r.height * VB.h };
}
const snap = (v, step) => Math.round(v / step) * step;

/* selection + drag */
let drag = null;
stage.addEventListener('pointerdown', (ev) => {
  const t = ev.target.closest('.el, .handle');
  if (!t) { stageFocusI = null; stage.focus(); ed.sel.clear(); renderStage(); return; }
  const i = +t.dataset.i;
  stageFocusI = i;
  const g = t.classList.contains('el') ? t : stage.querySelector(`.el[data-i="${i}"]`);
  (g || stage).focus({ preventScroll: true });
  if (ev.ctrlKey || ev.metaKey) {
    ed.sel.has(i) ? ed.sel.delete(i) : ed.sel.add(i);
  } else if (!ed.sel.has(i)) {
    ed.sel.clear(); ed.sel.add(i);
  }
  renderStage();
  const p = stagePoint(ev);
  drag = { start: p, orig: deep(ed.sym.e), moved: false };
  stage.setPointerCapture(ev.pointerId);
});
stage.addEventListener('pointermove', (ev) => {
  if (!drag) return;
  const p = stagePoint(ev);
  const step = ev.shiftKey ? 1 : ed.step;
  const dx = snap((p.x - drag.start.x) / G, step), dy = snap((p.y - drag.start.y) / G, step);
  if (!dx && !dy) return;
  if (!drag.moved) { pushUndo(); drag.moved = true; }
  for (const i of ed.sel) {
    ed.sym.e[i][4] = drag.orig[i][4] + dx;
    ed.sym.e[i][5] = drag.orig[i][5] + dy;
  }
  renderStage();
});
stage.addEventListener('pointerup', () => { drag = null; });

/* double-click a text element to edit it */
stage.addEventListener('dblclick', (ev) => {
  const t = ev.target.closest('.el, .handle'); if (!t) return;
  const el = ed.sym.e[+t.dataset.i];
  if (el[0] !== 'Z') return;
  const txt = prompt(tr('Text in the symbol:', 'Text i symbolen:'), el[8]); if (txt === null || !txt.trim()) return;
  const h = prompt(tr('Text height (units):', 'Texthöjd (enheter):'), el[10]) ?? el[10];
  pushUndo(); el[8] = txt; el[10] = +h || el[10]; renderStage();
});

/* tools */
$('btnRotate').onclick = () => {
  if (!ed.sel.size) return; pushUndo();
  for (const i of ed.sel) ed.sym.e[i][2] = (ed.sym.e[i][2] % 4) + 1;
  renderStage();
};
$('btnDelete').onclick = () => {
  if (!ed.sel.size) return; pushUndo();
  ed.sym.e = ed.sym.e.filter((_, i) => !ed.sel.has(i));
  ed.sel.clear(); renderStage();
};
$('btnDup').onclick = () => {
  if (!ed.sel.size) return; pushUndo();
  const copies = [...ed.sel].map(i => { const c = deep(ed.sym.e[i]); c[4] += 2; c[5] += 2; return c; });
  ed.sym.e.push(...copies);
  ed.sel = new Set(copies.map((_, k) => ed.sym.e.length - copies.length + k));
  renderStage();
};
$('btnUndo').onclick = doUndo;

/* Tab onto a shape = select it (focus and selection stay one thing).
   Capture-phase 'focus': focus events on SVG children don't reliably reach
   the svg root as focusin in Chrome. */
stage.addEventListener('focus', (ev) => {
  const g = ev.target.closest && ev.target.closest('.el');
  if (!g) return;
  const i = +g.dataset.i;
  stageFocusI = i;
  if (!(ed.sel.size === 1 && ed.sel.has(i))) { ed.sel = new Set([i]); renderStage(); }
}, true);
stage.addEventListener('keydown', (ev) => {
  const step = ev.shiftKey ? 1 : ed.step;
  const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[ev.key];
  if (move && ed.sel.size) {
    ev.preventDefault(); pushUndo();
    for (const i of ed.sel) { ed.sym.e[i][4] += move[0]; ed.sym.e[i][5] += move[1]; }
    renderStage(); return;
  }
  if ((ev.key === 'Delete' || ev.key === 'Backspace') && ed.sel.size) { ev.preventDefault(); $('btnDelete').onclick(); }
  if (ev.key.toLowerCase() === 'r' && ed.sel.size) { ev.preventDefault(); $('btnRotate').onclick(); }
  if (ev.key.toLowerCase() === 'd' && ed.sel.size) { ev.preventDefault(); $('btnDup').onclick(); }
  if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'z') { ev.preventDefault(); doUndo(); }
  if (ev.key === 'a' && (ev.metaKey || ev.ctrlKey)) {
    ev.preventDefault(); ed.sel = new Set(ed.sym.e.map((_, i) => i)); renderStage();
  }
});

/* meta fields */
$('gloss').addEventListener('input', () => { ed.sym.n = $('gloss').value; ed.dirty = true; });
$('symId').addEventListener('input', () => { ed.sym.id = $('symId').value.trim(); ed.dirty = true; });
$('wclass').addEventListener('change', () => { ed.sym.c = $('wclass').value; ed.dirty = true; });
$('country').addEventListener('input', () => { ed.sym.k = $('country').value.trim() || 'SWE'; ed.dirty = true; });

async function saveCurrentToList(key = ed.srcKey) {
  if (!ed.sym.e.length) { toast(tr('Nothing drawn yet', 'Inget ritat ännu')); return false; }
  const L = lists[key];
  ed.sym.n = $('gloss').value.trim() || tr('unnamed', 'namnlös');
  let id = parseInt($('symId').value, 10);
  if (!Number.isFinite(id)) {
    id = Math.max(89999, ...lists.A.syms.map(s => s.id), ...lists.B.syms.map(s => s.id)) + 1;
    toast(tr(`No BCI id — assigned personal id ${id}`, `Inget BCI-id — fick eget id ${id}`));   // personal range; BCI assigns standard ids
  }
  ed.sym.id = id; $('symId').value = id;
  const rec = deep({ id, n: ed.sym.n, c: ed.sym.c, k: ed.sym.k, e: ed.sym.e });
  const at = L.syms.findIndex(s => s.id === id);
  if (at >= 0) {
    if (!(await askConfirm(tr(`Id ${id} (${firstGloss(L.syms[at])}) exists in "${L.name}". Replace it?`, `Id ${id} (${firstGloss(L.syms[at])}) finns redan i "${L.name}". Ersätta den?`), tr('Replace', 'Ersätt')))) return false;
    L.syms[at] = rec;
  } else L.syms.push(rec);
  ed.dirty = false; ed.srcKey = key;
  L.mod = true;
  wListChanged();
  renderListPane(key);
  toast(tr(`Saved ${rec.n} (${id}) → ${L.name}`, `Sparade ${rec.n} (${id}) → ${L.name}`));
  return true;
}
$('btnAddToList').onclick = () => saveCurrentToList('A');
$('btnAddToListB').onclick = () => saveCurrentToList('B');

/* export current symbol */
function currentSVG(unit = ed.unit || 24) { return withBg(withText(blissSVG(ed.sym, { unit, color: exportInk() }), captionText())); }
$('btnExportSVG').onclick = () => {
  if (!ed.sym.e.length) return toast(tr('Nothing to export', 'Inget att exportera'));
  download(`${firstGloss(ed.sym) || 'symbol'}.svg`, new Blob([currentSVG(24)], { type: 'image/svg+xml' }));
};
function rasterizePNG() {
  return new Promise((res, rej) => {
    const svg = currentSVG(24);
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = img.width * 2; cv.height = img.height * 2;
      const cx = cv.getContext('2d');
      const bg = resolvedBg();
      if (bg) { cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); }
      cx.drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob(b => (b ? res(b) : rej(new Error('rasterization failed'))), 'image/png');
      URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  });
}
$('btnExportPNG').onclick = async () => {
  if (!ed.sym.e.length) return toast(tr('Nothing to export', 'Inget att exportera'));
  download(`${firstGloss(ed.sym) || 'symbol'}.png`, await rasterizePNG());
};
$('btnCopyClip').onclick = () => {
  if (!ed.sym.e.length) return toast(tr('Nothing to copy', 'Inget att kopiera'));
  if (!navigator.clipboard || !window.ClipboardItem)
    return toast(tr('Image copy is not supported in this browser', 'Bildkopiering stöds inte i den här webbläsaren'));
  // hand ClipboardItem the pending blob inside the click gesture (Safari requires it)
  navigator.clipboard.write([new ClipboardItem({ 'image/png': rasterizePNG() })])
    .then(() => toast(tr('Symbol copied to the clipboard as PNG', 'Symbolen kopierad till urklipp som PNG')))
    .catch(() => toast(tr('Copy failed', 'Kopieringen misslyckades')));
};

/* batch export of the list (MultiExport reborn) */
/* Which symbols would "Export list" take right now? */
function exportSelection() {
  if (lists.A.sel.size >= 2) return { list: lists.A, sel: [...lists.A.sel].sort((a, b) => a - b) };
  if (managerOpen() && lists.B.sel.size >= 2) return { list: lists.B, sel: [...lists.B.sel].sort((a, b) => a - b) };
  return { list: lists.A, sel: [] };
}
function updateExportTitle() {
  const b = $('btnExportList'); if (!b) return;
  const n = exportSelection().sel.length;
  const t = n
    ? tr(`Export selected (${n})`, `Exportera markerade (${n})`)
    : tr('Export the whole list as SVG files', 'Exportera hela listan som SVG-filer');
  b.title = t; b.setAttribute('aria-label', t);
}
$('btnExportList').onclick = async () => {
  // Selection-aware: 2+ symbols selected in either open pane exports just those
  // (pane A wins if both hold one); otherwise the whole main list is exported.
  // A single selected row is just the current row, not an export range.
  const src = exportSelection();
  const L = src.list;
  const which = src.sel.length ? src.sel.map(i => L.syms[i]) : L.syms;
  if (!which.length) return toast(tr('List is empty', 'Listan är tom'));
  if (!window.showDirectoryPicker) return alert(tr('Folder export needs a Chromium browser (Arc, Chrome, Edge).', 'Mappexport kräver en Chromium-webbläsare (Arc, Chrome, Edge).'));
  const msg = src.sel.length
    ? tr(`Export the ${which.length} selected symbols as SVG to a folder?`, `Exportera de ${which.length} markerade symbolerna som SVG till en mapp?`)
    : tr(`Export all ${which.length} symbols as SVG to a folder?`, `Exportera alla ${which.length} symboler som SVG till en mapp?`);
  if (!(await askConfirm(msg, tr('Export', 'Exportera')))) return;
  const dir = await window.showDirectoryPicker({ mode: 'readwrite' });
  let done = 0;
  const manifest = ['id;gloss;word_class;file'];
  for (const s of which) {
    try {
      const name = `${s.id}_${firstGloss(s).replace(/[^\w()-]+/g, '_').slice(0, 60)}.svg`;
      const fh = await dir.getFileHandle(name, { create: true });
      const w = await fh.createWritable();
      await w.write(withBg(withText(blissSVG(s, { unit: ed.unit || 24, color: exportInk() }), (s.n || '').split(',')[0].trim()), s.c));
      await w.close();
      manifest.push(`${s.id};${s.n.replace(/;/g, ',')};${s.c};${name}`);
      if (++done % 250 === 0) toast(tr(`Exporting… ${done}/${which.length}`, `Exporterar… ${done}/${which.length}`));
    } catch (err) { console.error('export failed for', s.id, err); }
  }
  const mh = await dir.getFileHandle('manifest.csv', { create: true });
  const mw = await mh.createWritable(); await mw.write(manifest.join('\n')); await mw.close();
  toast(tr(`Exported ${done} SVG files + manifest.csv`, `Exporterade ${done} SVG-filer + manifest.csv`));
};

/* ================= palette ================= */
const FAM_NAMES = {
  A: 'wave', B: 'heart', C: 'lattice', D: 'house', E: 'half-heart', F: 'arrow',
  G: 'wheel', H: 'circle', I: 'small circles', J: 'half-circle', K: 'arc',
  L: 'square', M: 'page', N: 'door', O: 'open rect', P: 'triangle', Q: 'dot',
  R: 'caret', S: 'grounded', T: 'cross', U: 'rounded', V: 'angle', W: 'line',
  Y: 'digits & marks', Z: 'text',
};
const FAM_NAMES_SV = {
  A: 'våg', B: 'hjärta', C: 'galler', D: 'hus', E: 'halvhjärta', F: 'pil',
  G: 'hjul', H: 'cirkel', I: 'små cirklar', J: 'halvcirkel', K: 'båge',
  L: 'kvadrat', M: 'sida', N: 'dörr', O: 'öppen rektangel', P: 'triangel', Q: 'punkt',
  R: 'vinkeltak', S: 'på jordlinjen', T: 'kors', U: 'rundad', V: 'vinkel', W: 'linje',
  Y: 'siffror & tecken', Z: 'text',
};
const famName = (f) => tr(FAM_NAMES[f] || '', FAM_NAMES_SV[f] || FAM_NAMES[f] || '');
const families = {};
for (const k of Object.keys(BLISS_SHAPES)) {
  const m = k.match(/^Element([A-Z])(\d+)$/);
  if (!m || m[1] === 'X') continue;
  (families[m[1]] = families[m[1]] || []).push(+m[2]);
}
for (const f in families) families[f].sort((a, b) => a - b);
// Z (text) lives on the engine, not in BLISS_SHAPES — without this line the text
// family never reached the palette, and strings had to be built letter by letter
// from the list (Håkan, 2026-09-24). Old WinBliss had strings; so does the format.
families.Z = [1];

let curFam = 'B';
/* Palette size — larger shape buttons on request (Håkan Larsson via PeO,
   2026-08-25): bigger glyphs AND bigger touch targets. Persisted. */
let palSize = Math.min(2, Math.max(1, parseFloat(localStorage.getItem('wb-palsize')) || 1));
function applyPalSize() {
  $('palette').style.setProperty('--pal', palSize);
}
function setPalSize(v) {
  palSize = Math.min(2, Math.max(1, Math.round(v * 4) / 4));   // steps of 0.25, 1..2
  localStorage.setItem('wb-palsize', palSize);
  applyPalSize(); renderFamRow(); renderVariantRow(false);
  setTimeout(renderStage, 30);   // the palette's height changed — refit the editor viewport
}
function renderFamRow() {
  // The element itself is the tab (as in the original WinBliss) — the letter
  // taxonomy and family name live in the tooltip/aria-label, not on screen.
  const row = $('famRow'); row.innerHTML = '';
  for (const f of Object.keys(families).sort()) {
    const b = document.createElement('button');
    // small glyphs need a proportionally bolder pen to stay legible
    b.innerHTML = paletteGlyph(f, families[f][0], 3.0 * palSize)
      .replace(/stroke-width="([\d.]+)"/, (m, w) => `stroke-width="${Math.round(w * 1.7)}"`);
    b.className = 'famBtn' + (f === curFam ? ' on' : '');
    const label = `${f} · ${famName(f)}`;
    b.title = label; b.setAttribute('aria-label', label);
    b.setAttribute('aria-expanded', f === curFam ? 'true' : 'false');
    b.onclick = () => { curFam = f; renderFamRow(); renderVariantRow(true); };
    row.appendChild(b);
  }
  // size stepper, far right: − / + scale the whole palette
  const sz = document.createElement('span'); sz.id = 'palSizer';
  for (const [txt, d] of [['−', -0.25], ['+', +0.25]]) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = txt;
    const label = d < 0 ? tr('Smaller shapes', 'Mindre former') : tr('Larger shapes', 'Större former');
    b.title = label; b.setAttribute('aria-label', label);
    b.disabled = d < 0 ? palSize <= 1 : palSize >= 2;
    b.onclick = () => setPalSize(palSize + d);
    sz.appendChild(b);
  }
  row.appendChild(sz);
}
function paletteGlyph(fam, sub, unit = 4.6, clock = 1) {
  const el = [fam, sub, clock, 0, 2, 8, 0, 0, fam === 'Z' ? 'ab' : '', 0, fam === 'Z' ? 6 : 4];
  try { return blissSVG({ e: [el] }, { unit, color: 'currentColor' }); } catch (_) { return '?'; }
}
/* Which clock orientations of a shape are actually distinct? Rendered and
   deduplicated — arrows yield four buttons, symmetric shapes just one, so every
   direction is one tap away instead of pick-then-rotate (PeO, 2026-08-25). */
function distinctClocks(fam, sub) {
  const seen = new Map();
  for (let clock = 1; clock <= 4; clock++) {
    const svg = paletteGlyph(fam, sub, 4.6, clock);
    if (!seen.has(svg)) seen.set(svg, clock);
  }
  return [...seen.values()];
}
function renderVariantRow(focusFirst = false) {
  const row = $('variantRow'); row.innerHTML = '';
  for (const sub of families[curFam]) {
    for (const clock of distinctClocks(curFam, sub)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'varBtn'; b.draggable = true;
      b.innerHTML = `${paletteGlyph(curFam, sub, 4.6 * palSize, clock)}<span class="cap mono">${curFam}${sub}</span>`;
      b.title = tr('Drag onto the canvas, or click / press Enter to add', 'Dra till ritytan, eller klicka / tryck Enter för att lägga till');
      b.setAttribute('aria-label', tr(`Add shape ${curFam}${sub} orientation ${clock}`, `Lägg till form ${curFam}${sub} riktning ${clock}`));
      const payload = JSON.stringify({ fam: curFam, sub, clock });
      b.addEventListener('dragstart', (ev) => ev.dataTransfer.setData('text/bliss', payload));
      b.addEventListener('click', () => addElement(curFam, sub, 12, 8, clock));   // first element lands at grid centre
      row.appendChild(b);
    }
  }
  if (focusFirst && row.firstChild) row.firstChild.focus();
}
/* arrow keys walk the shape row */
$('variantRow').addEventListener('keydown', (ev) => {
  if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
  const btns = [...$('variantRow').querySelectorAll('.varBtn')];
  const i = btns.indexOf(document.activeElement);
  if (i < 0) return;
  ev.preventDefault();
  const next = btns[(i + (ev.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
  next.focus();
});
function addElement(fam, sub, ux, uy, clock = 1) {
  pushUndo();
  let text = '', zh = 0;
  if (fam === 'Z') {
    text = prompt(tr('Text in the symbol (a word or a name, e.g. Lisa):',
                     'Text i symbolen (ett ord eller ett namn, t.ex. Lisa):'), '');
    if (text === null || !text.trim()) { ed.undo.pop(); return; }
    text = text.trim();
    zh = 6;
  }
  ed.sym.e.push([fam, sub, clock, 0, ux, uy, 0, 0, text, 0, fam === 'Z' ? zh : 4]);
  ed.sel = new Set([ed.sym.e.length - 1]);
  renderStage();
  // Focus follows the add: arrows move the new element IMMEDIATELY after a
  // palette click — no tabbing across the whole UI to get there.
  stageFocusI = ed.sym.e.length - 1;
  const g = stage.querySelector(`.el[data-i="${stageFocusI}"]`);
  (g || stage).focus({ preventScroll: true });
}
stage.addEventListener('dragover', (ev) => { ev.preventDefault(); });
stage.addEventListener('drop', (ev) => {
  ev.preventDefault();
  const d = ev.dataTransfer.getData('text/bliss'); if (!d) return;
  const { fam, sub, clock } = JSON.parse(d);
  const p = stagePoint(ev);
  const step = ev.shiftKey ? 1 : ed.step;
  addElement(fam, sub, snap(p.x / G, step), snap(p.y / G, step), clock || 1);
});

/* merge gesture: drop a dragged list row onto the canvas */
stage.addEventListener('drop', (ev) => {
  const d = ev.dataTransfer.getData('text/bliss-sym'); if (!d) return;
  const { key, i } = JSON.parse(d);
  const src = lists[key].syms[i]; if (!src) return;
  pushUndo();
  // place the merged symbol's elements to the right of current content (quarter-space gap)
  const maxX = ed.sym.e.length ? Math.max(...ed.sym.e.map(e => e[4])) + 10 : 0;
  const minSrcX = Math.min(...src.e.map(e => e[4]));
  const off = ed.sym.e.length ? (maxX - minSrcX) : 0;
  const startIdx = ed.sym.e.length;
  for (const e of src.e) { const c = deep(e); c[4] += off; ed.sym.e.push(c); }
  ed.sel = new Set(src.e.map((_, k) => startIdx + k));
  if (!ed.sym.n) { ed.sym.n = firstGloss(src); $('gloss').value = ed.sym.n; }
  renderStage();
  toast(tr(`Merged ${firstGloss(src)} — ${src.e.length} elements`, `Slog ihop ${firstGloss(src)} — ${src.e.length} element`));
});

/* ================= persistence (IndexedDB autosave) ================= */
const idb = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('winbliss-web', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => { this.db = r.result; res(); };
      r.onerror = () => rej(r.error);
    });
  },
  set(k, v) {
    return new Promise((res, rej) => {
      const t = this.db.transaction('kv', 'readwrite');
      t.objectStore('kv').put(v, k);
      t.oncomplete = res; t.onerror = () => rej(t.error);
    });
  },
  get(k) {
    return new Promise((res, rej) => {
      const t = this.db.transaction('kv', 'readonly');
      const q = t.objectStore('kv').get(k);
      q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
    });
  },
};
let persistT = null, persistReady = false;
function persistSoon() {
  if (!persistReady) return;
  clearTimeout(persistT);
  persistT = setTimeout(async () => {
    try {
      await idb.set('state', {
        v: 1, ts: Date.now(),
        a: { name: lists.A.name, syms: lists.A.syms, mod: lists.A.mod },
        b: { name: lists.B.name, syms: lists.B.syms, mod: lists.B.mod },
        edSym: ed.sym, srcKey: ed.srcKey, dirty: ed.dirty, ink: ed.ink, bg: ed.bg, unit: ed.unit,
        caption: ed.caption, textPlace: ed.textPlace,
      });
    } catch (err) { console.warn('autosave failed', err); }
  }, 900);
}

$('btnResetStd').onclick = async () => {
  if (!(await askConfirm(tr('Replace the left list with the shipped BCI-AV 2026 standard? Your own symbols in this list are removed (the right pane and saved .wbs files are untouched).', 'Ersätt vänstra listan med den medföljande BCI-AV 2026-standarden? Dina egna symboler i listan tas bort (högra panelen och sparade .wbs-filer påverkas inte).'), tr('Restore the standard', 'Återställ standarden')))) return;
  lists.A.syms = BLISS_DATA.map(s => ({ ...s, k: s.k || 'SWE', e: deep(s.e) }));
  lists.A.name = 'BCI-AV 2026-07-25.wbs'; lists.A.sel.clear(); lists.A.mod = false;
  renderListPane('A'); updateSaveTarget();
  toast(tr('Standard restored: 6556 symbols', 'Standarden återställd: 6556 symboler'));
};

/* colour controls */
ed.ink = null; ed.bg = 'transparent'; ed.unit = 24; ed.textPlace = 'none';
function resolvedBg(wclass) {
  if (ed.bg === 'transparent') return null;
  if (ed.bg === 'white') return '#ffffff';
  if (ed.bg === 'class') return softClassColor(wclass ?? ed.sym.c);
  return ed.bg;   // custom hex
}
function syncBgControls() {
  $('bgMode').value = ['transparent', 'white', 'class'].includes(ed.bg) ? ed.bg : 'custom';
  $('bgColor').style.display = $('bgMode').value === 'custom' ? '' : 'none';
  if ($('bgMode').value === 'custom') $('bgColor').value = ed.bg;
}
$('bgMode').addEventListener('change', () => {
  ed.bg = $('bgMode').value === 'custom' ? $('bgColor').value : $('bgMode').value;
  syncBgControls(); renderStage(); persistSoon();
});
$('bgColor').addEventListener('input', () => { ed.bg = $('bgColor').value; renderStage(); persistSoon(); });
$('expUnit').addEventListener('change', () => {
  ed.unit = Math.min(96, Math.max(4, +$('expUnit').value || 24));
  $('expUnit').value = ed.unit; persistSoon();
});
$('expText').addEventListener('change', () => { ed.textPlace = $('expText').value; persistSoon(); });

/* gloss-language picker (list display; independent of interface language) */
function populateGlossSelect() {
  const sel = $('setGloss'); if (!sel) return;
  sel.innerHTML = '';
  const o0 = document.createElement('option');
  o0.value = ''; o0.textContent = tr('English (BCI source)', 'Engelska (BCI-källan)');
  sel.appendChild(o0);
  for (const [code, native] of GLOSS_LANGS) {
    const o = document.createElement('option');
    const n = Object.keys(BLISS_GLOSSES[code]).length;
    o.value = code;
    o.textContent = native + (n < BLISS_DATA.length ? ` (${n}/${BLISS_DATA.length})` : '');
    sel.appendChild(o);
  }
  sel.value = glossLang;
}
populateGlossSelect();
$('setGloss').onchange = () => {
  glossLang = $('setGloss').value;
  localStorage.setItem('wb-gloss', glossLang);
  renderListPane('A'); renderListPane('B');
  updateCaptionBar();   // editor caption + gloss hint follow the display language
};

$('btnSettings').onclick = () => {
  $('setLang').value = lang;
  $('setGloss').value = glossLang;
  $('setTheme').value = localStorage.getItem('wb-theme') || 'auto';
  $('expText').value = ed.textPlace || 'none';
  $('wsList').checked = WS.list; $('wsChips').checked = WS.chips; $('wsChooser').checked = WS.chooser;
  $('wsUnit').value = WS.unit; $('wsText').value = WS.text; $('wsGap').value = WS.gap; $('wsPen').value = WS.pen;
  $('settingsDlg').showModal();
};
for (const [id, key, kind] of [['wsList', 'list', 'b'], ['wsChips', 'chips', 'b'], ['wsChooser', 'chooser', 'b'],
                               ['wsUnit', 'unit', 'n'], ['wsText', 'text', 'n'], ['wsGap', 'gap', 'n'], ['wsPen', 'pen', 'n']]) {
  $(id).addEventListener(kind === 'b' ? 'change' : 'input', () => {
    WS[key] = kind === 'b' ? $(id).checked : (parseFloat($(id).value) || WS[key]);
    saveWS(); applyWS();
    if (document.body.classList.contains('writing')) wRender();
  });
}
$('wSettings').onclick = () => $('btnSettings').onclick();
// footer link → the full attribution now lives in Settings → About & licence
$('aboutLink').onclick = (e) => {
  e.preventDefault(); $('btnSettings').onclick();
  $('aboutText').scrollIntoView({ block: 'end' });
};
$('btnHelp').onclick = () => { $('helpDlg').showModal(); };
document.addEventListener('keydown', (ev) => {
  if (ev.key !== '?' ) return;
  const t = ev.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  ev.preventDefault();
  $('helpDlg').showModal();
});

/* export settings files — the .wbx of WinBliss, reborn as JSON */
function collectWbx() {
  // v3: the whole settings dialog — interface (language, glosses, theme) + export
  return { format: 'winbliss-web-export-settings', v: 3,
           ink: ed.ink, bg: ed.bg, unit: ed.unit, text: ed.textPlace,
           lang, gloss: glossLang, theme: localStorage.getItem('wb-theme') || 'auto' };
}
function applyWbx(o) {
  if (!o || o.format !== 'winbliss-web-export-settings') { toast(tr('Not a WinBliss settings file', 'Inte en inställningsfil för WinBliss')); return; }
  ed.ink = o.ink || null;
  if (ed.ink) $('inkColor').value = ed.ink;
  if (o.bg) ed.bg = o.bg;                                   // v2+
  else ed.bg = o.transparent === false ? (o.classBg ? 'class' : 'white') : 'transparent';  // v1 files
  syncBgControls();
  ed.unit = Math.min(96, Math.max(4, +o.unit || 24)); $('expUnit').value = ed.unit;
  if (['none', 'top', 'bottom'].includes(o.text)) { ed.textPlace = o.text; $('expText').value = o.text; }
  // v3: interface settings (absent in v1/v2 files — those leave the interface untouched)
  if (o.gloss !== undefined && (o.gloss === '' || (o.gloss in BLISS_GLOSSES))) {
    glossLang = o.gloss; localStorage.setItem('wb-gloss', glossLang);
    const gs = $('setGloss'); if (gs) gs.value = glossLang;
  }
  if (o.theme && ['auto', 'light', 'dark'].includes(o.theme)) applyTheme(o.theme);
  if ((o.lang === 'en' || o.lang === 'sv') && o.lang !== lang && typeof applyLang === 'function') {
    lang = o.lang; wbSetLang(lang);
    applyLang();               // re-renders lists, stage, palette, selects
  } else { renderListPane('A'); renderListPane('B'); renderStage(); }
  persistSoon();
  toast(tr('Settings loaded', 'Inställningar laddade'));
}
$('btnWbxSave').onclick = () => {
  download('winbliss-settings.wbx', new Blob([JSON.stringify(collectWbx(), null, 2)], { type: 'application/json' }));
  toast(tr('Settings saved (.wbx)', 'Inställningar sparade (.wbx)'));
};
$('btnWbxOpen').onclick = () => {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.wbx,.json';
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    f.text().then(t => { try { applyWbx(JSON.parse(t)); } catch { toast(tr('Could not read that file', 'Kunde inte läsa filen')); } });
  };
  inp.click();
};
$('inkColor').addEventListener('input', () => { ed.ink = $('inkColor').value; renderStage(); persistSoon(); });
$('btnInkReset').onclick = () => { ed.ink = null; renderStage(); persistSoon(); toast(tr('Ink follows the theme again', 'Bläcket följer temat igen')); };
$('wclass').addEventListener('change', () => { if (ed.bg === 'class') renderStage(); });


/* ================= write view =================
   Writing IS part of the workbench — deliberately not a separate "communicator
   app": the person who writes with Bliss is also a symbol creator (PeO,
   2026-08-25). An unmatched word is an invitation to create the symbol; every
   matched word is one click from opening in the editor. */

/* indicators, read from the standard itself (same derivation as the MCP) */
const W_INDICATORS = (() => {
  const map = new Map(), sigs = new Set();
  for (const sy of BLISS_DATA) {
    const m = (sy.n || '').match(/^indicator_\(([^)]+)\)(.*)$/);
    if (!m || /OLD/.test(m[2])) continue;
    map.set(m[1], sy);
    for (const e of sy.e) sigs.add(e[0] + e[1]);
  }
  return { map, sigs };
})();
const W_IND_CHOICES = [
  ['', () => tr('none', 'ingen')],
  ['action', () => tr('verb', 'verb')],
  ['present_action', () => tr('present', 'presens')],
  ['past_action', () => tr('past', 'dåtid')],
  ['future_action', () => tr('future', 'futurum')],
  ['plural', () => tr('plural', 'plural')],
  ['imperative_form', () => tr('imperative', 'uppmaning')],
  // Swedish definite form (Håkan, 2026-09-24; obestämd and plural bestämd were
  // tried the same evening and dropped — bestämd alone is what the users need)
  ['definite_form', () => tr('definite', 'bestämd')],
];
function wIsInd(e) {
  if (!W_INDICATORS.sigs.has(e[0] + e[1])) return false;
  return e[5] === 4 || (e[5] === 0 && e[0] + e[1] !== 'W1');
}
function wSvgBox(els, unit = 4) {
  const svg = blissSVG({ e: els }, { unit, color: 'currentColor' });
  const m = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/);
  return { svg, vx: +m[1], vy: +m[2], vw: +m[3], vh: +m[4] };
}
/* The parts of a compound indicator keep an EIGHTH of a square of visible air
   between them (Håkan Larsson's ruling, 2026-09-24 — the Fundamental Rules
   give 1/8 square between digits, 4.3.5, and say nothing about the inside of an
   indicator). BCI's own record for present_action anchors its two arcs one
   half-unit apart, which at pen width makes them touch. The record is left as
   BCI ships it; this is a rendering rule on top of it. */
function wIndParts(rec) {
  const parts = rec.e.map(e => e.slice());
  const pad = 0.35 * 100;                               // blissSVG's stroke padding (engine units)
  const want = 100 + pad;                               // 1/8 square of air beyond the stroke
  for (let i = 1; i < parts.length; i++) {
    const a = wSvgBox([parts[i - 1]]), b = wSvgBox([parts[i]]);
    const gapNow = (b.vx + pad) - (a.vx + a.vw - pad);  // geometric gap between the ink paths
    if (gapNow < want) {
      const dx = (want - gapNow) / 100;
      for (let j = i; j < parts.length; j++) parts[j][4] += dx;
    }
  }
  return parts;
}
/* A word's form is one or more indicator keys joined with '+', in canonical
   order: tense first (mutually exclusive), then plural, then definite. Several
   indicators sit SIDE BY SIDE with an eighth of a square between them (Håkan,
   2026-09-24: "plural bestämd" is plural + definite next to each other). */
const W_IND_TENSE = new Set(['action', 'present_action', 'past_action', 'future_action', 'imperative_form']);
const W_IND_ORDER = ['action', 'present_action', 'past_action', 'future_action', 'imperative_form', 'plural', 'definite_form'];
const wIndKeys = (ind) => (ind || '').split('+').filter(Boolean);
function wIndJoin(keys) {
  return W_IND_ORDER.filter(k => keys.includes(k)).join('+');
}
function wIndToggle(ind, key) {
  if (!key) return '';
  let keys = wIndKeys(ind);
  if (keys.includes(key)) keys = keys.filter(k => k !== key);
  else {
    if (W_IND_TENSE.has(key)) keys = keys.filter(k => !W_IND_TENSE.has(k));
    keys.push(key);
  }
  return wIndJoin(keys);
}
/* Swedish surface forms for the word under the symbol (Håkan, 2026-10-15:
   "gå #2" should show "går"). HONESTY RULE: a wrong form is worse than the
   base form — the word under the symbol is the communication. So: a curated
   table carries the strong and group-2 verbs (closed classes), two safe rules
   carry the productive classes, and everything else keeps the base form. The
   word field stays editable; a hand-edited word is never overwritten. */
const W_SV_VERBS = {   // base: [presens, dåtid, uppmaning]
  'vara': ['är', 'var', 'var'], 'ha': ['har', 'hade', 'ha'], 'bli': ['blir', 'blev', 'bli'],
  'gå': ['går', 'gick', 'gå'], 'stå': ['står', 'stod', 'stå'], 'få': ['får', 'fick', 'få'],
  'förstå': ['förstår', 'förstod', 'förstå'], 'se': ['ser', 'såg', 'se'], 'ge': ['ger', 'gav', 'ge'],
  'ta': ['tar', 'tog', 'ta'], 'dra': ['drar', 'drog', 'dra'], 'dö': ['dör', 'dog', 'dö'],
  'le': ['ler', 'log', 'le'], 'slå': ['slår', 'slog', 'slå'],
  'komma': ['kommer', 'kom', 'kom'], 'äta': ['äter', 'åt', 'ät'], 'dricka': ['dricker', 'drack', 'drick'],
  'sova': ['sover', 'sov', 'sov'], 'springa': ['springer', 'sprang', 'spring'],
  'sitta': ['sitter', 'satt', 'sitt'], 'ligga': ['ligger', 'låg', 'ligg'],
  'lägga': ['lägger', 'la', 'lägg'], 'sätta': ['sätter', 'satte', 'sätt'],
  'säga': ['säger', 'sa', 'säg'], 'göra': ['gör', 'gjorde', 'gör'], 'veta': ['vet', 'visste', 'vet'],
  'vilja': ['vill', 'ville'], 'kunna': ['kan', 'kunde'], 'finnas': ['finns', 'fanns'],
  'heta': ['heter', 'hette'], 'betyda': ['betyder', 'betydde'],
  'läsa': ['läser', 'läste', 'läs'], 'skriva': ['skriver', 'skrev', 'skriv'],
  'åka': ['åker', 'åkte', 'åk'], 'köra': ['kör', 'körde', 'kör'], 'ringa': ['ringer', 'ringde', 'ring'],
  'köpa': ['köper', 'köpte', 'köp'], 'tycka': ['tycker', 'tyckte', 'tyck'],
  'tänka': ['tänker', 'tänkte', 'tänk'], 'känna': ['känner', 'kände', 'känn'],
  'höra': ['hör', 'hörde', 'hör'], 'hjälpa': ['hjälper', 'hjälpte', 'hjälp'],
  'leka': ['leker', 'lekte', 'lek'], 'söka': ['söker', 'sökte', 'sök'], 'byta': ['byter', 'bytte', 'byt'],
  'stänga': ['stänger', 'stängde', 'stäng'], 'möta': ['möter', 'mötte', 'möt'],
  'leva': ['lever', 'levde', 'lev'], 'välja': ['väljer', 'valde', 'välj'],
  'sälja': ['säljer', 'sålde', 'sälj'], 'falla': ['faller', 'föll', 'fall'],
  'hålla': ['håller', 'höll', 'håll'], 'bjuda': ['bjuder', 'bjöd', 'bjud'],
  'sjunga': ['sjunger', 'sjöng', 'sjung'], 'gråta': ['gråter', 'grät', 'gråt'],
  'vinna': ['vinner', 'vann', 'vinn'], 'brinna': ['brinner', 'brann', 'brinn'],
  'flyga': ['flyger', 'flög', 'flyg'], 'rida': ['rider', 'red', 'rid'],
  'krypa': ['kryper', 'kröp', 'kryp'], 'bita': ['biter', 'bet', 'bit'],
  'blåsa': ['blåser', 'blåste', 'blås'], 'frysa': ['fryser', 'frös', 'frys'],
  'växa': ['växer', 'växte', 'väx'], 'behöva': ['behöver', 'behövde', 'behöv'],
  'följa': ['följer', 'följde', 'följ'], 'glömma': ['glömmer', 'glömde', 'glöm'],
  'gömma': ['gömmer', 'gömde', 'göm'], 'resa': ['reser', 'reste', 'res'],
  'bära': ['bär', 'bar', 'bär'], 'skära': ['skär', 'skar', 'skär'], 'stiga': ['stiger', 'steg', 'stig'],
  'lyfta': ['lyfter', 'lyfte', 'lyft'], 'trycka': ['trycker', 'tryckte', 'tryck'],
  'släppa': ['släpper', 'släppte', 'släpp'], 'klippa': ['klipper', 'klippte', 'klipp'],
  'bygga': ['bygger', 'byggde', 'bygg'], 'riva': ['river', 'rev', 'riv'],
  'skjuta': ['skjuter', 'sköt', 'skjut'], 'steka': ['steker', 'stekte', 'stek'],
  'skölja': ['sköljer', 'sköljde', 'skölj'], 'gräva': ['gräver', 'grävde', 'gräv'],
  'drömma': ['drömmer', 'drömde', 'dröm'], 'svälja': ['sväljer', 'svalde', 'svälj'],
  'räcka': ['räcker', 'räckte', 'räck'], 'väga': ['väger', 'vägde', 'väg'],
  'mäta': ['mäter', 'mätte', 'mät'], 'lära': ['lär', 'lärde', 'lär'],
  'skrika': ['skriker', 'skrek', 'skrik'], 'kyssa': ['kysser', 'kysste', 'kyss'],
  'störa': ['stör', 'störde', 'stör'], 'böja': ['böjer', 'böjde', 'böj'],
  'stryka': ['stryker', 'strök', 'stryk'], 'hänga': ['hänger', 'hängde', 'häng'],
};
function svInflect(base, keys, sym) {
  if (glossLang !== 'sv') return null;
  const tense = keys.includes('past_action') ? 1 : keys.includes('present_action') ? 0
              : keys.includes('future_action') ? 2 : keys.includes('imperative_form') ? 3 : -1;
  if (tense < 0) return null;
  const b = base.toLowerCase();
  if (tense === 2) return 'ska ' + b;              // analytic futurum — always safe
  const t = W_SV_VERBS[b];
  if (t) return t[tense === 3 ? 2 : tense] || null;
  if (b.endsWith('s')) return null;                // deponens (hoppas, trivas): leave as typed
  if (!sym || sym.c !== 'RED') return null;        // the rules below only trust real verbs
  if (b.endsWith('a') && b.length > 2)             // the productive class: hoppa→hoppar/hoppade
    return tense === 0 ? b + 'r' : tense === 1 ? b + 'de' : b;
  if (/[åäöoueiy]$/.test(b))                       // vowel verbs: bo→bor/bodde, tro, må, sy, klä
    return tense === 0 ? b + 'r' : tense === 1 ? b + 'dde' : b;
  return null;
}
/* Recompute the word under the symbol after a form change. Only ever touches
   labels this function wrote itself (w.autoLabel) — a word the user typed in
   the label field is theirs. */
function wAutoLabel(w) {
  if (w.label && !w.autoLabel) return;
  const inf = svInflect(w.token, wIndKeys(w.ind), wSymById(w.ids[w.pick]));
  w.label = inf || null;
  w.autoLabel = !!inf;
}

/* the joined record of every chosen indicator, laid out left to right */
function wIndRecord(ind) {
  const recs = wIndKeys(ind).map(k => W_INDICATORS.map.get(k)).filter(Boolean);
  if (!recs.length) return null;
  const e = [];
  let xNext = 0;
  for (const rec of recs) {
    const x0 = Math.min(...rec.e.map(el => el[4]));
    const parts = rec.e.map(el => { const c = el.slice(); c[4] += xNext - x0; return c; });
    e.push(...parts);
    xNext = Math.max(...parts.map(el => el[4])) + 1;   // wIndParts then opens the 1/8-square air
  }
  return { e };
}
function wComposeEls(id, indKey) {
  const base = wSymById(id);
  if (!base) return [];
  let els = base.e.map(e => e.slice());
  if (indKey) {
    const rec = wIndRecord(indKey);
    if (rec) {
      const olds = els.filter(wIsInd);
      els = els.filter(e => !wIsInd(e));
      // the whole indicator record moves as one group — present_action and the
      // participles are two or three elements (Håkan, 2026-09-24: presens saknades)
      const inds = wIndParts(rec);
      const iw = wSvgBox(inds).vw / 100;
      const x0 = Math.min(...inds.map(e => e[4])), y0 = Math.min(...inds.map(e => e[5]));
      let cx, iy;
      if (olds.length) { cx = Math.min(...olds.map(e => e[4])) + wSvgBox(olds).vw / 200; iy = Math.min(...olds.map(e => e[5])); }
      else {
        const bb = wSvgBox(els.length ? els : base.e);
        cx = bb.vx / 100 + Math.min(bb.vw / 100, 8) / 2;
        iy = Math.min(...(els.length ? els : base.e).filter(e => !wIsInd(e)).map(e => e[5])) < 4 ? 0 : 4;
      }
      const dx = Math.round((cx - iw / 2 - x0) * 2) / 2, dy = iy - y0;
      for (const e of inds) { e[4] += dx; e[5] += dy; els.push(e); }
    }
  }
  return els;
}

/* word lookup: gloss language + interface language + the English source.
   The interface language is always indexed so writing in Swedish works even
   when the list displays English glosses (or vice versa). */
let W_INDEX = null, W_INDEX_LANG = null;
let W_LIST_REV = 0;                      // bumped on every list change
const wListChanged = () => { W_LIST_REV++; };
// id lookup for Skriv: the open list FIRST (the user's own and edited symbols
// live there — Håkan, 2026-10-05: a symbol saved to the list rendered as text
// in Skriv because every lookup went straight to the BCI-AV standard), then
// the standard data.
function wSymById(id) {
  return lists.A.syms.find(sy => sy.id === +id) || BLISS_DATA.find(sy => sy.id === +id);
}
function wBuildIndex() {
  const key = glossLang + '|' + lang + '|' + W_LIST_REV;
  if (W_INDEX && W_INDEX_LANG === key) return;
  W_INDEX = new Map(); W_INDEX_LANG = key;
  // Each (word, id) pairing remembers its best SOURCE TIER: 0 the open list's
  // own words, 1 the chosen writing language, 2 the interface language, 3 the
  // English source names. Håkan, 2026-10-08: with Swedish input, "i" offered
  // the English pronoun before Swedish "i" — the chosen language comes first.
  const tierOf = new Map();
  const put = (word, id, tier) => {
    const w = word.trim().toLowerCase(); if (!w) return;
    if (!W_INDEX.has(w)) W_INDEX.set(w, []);
    if (!W_INDEX.get(w).includes(id)) W_INDEX.get(w).push(id);
    const k = w + '|' + id;
    if (!tierOf.has(k) || tier < tierOf.get(k)) tierOf.set(k, tier);
  };
  const langs = [];
  if (glossLang) langs.push([glossLang, 1]);
  if (lang !== 'en' && BLISS_GLOSSES[lang] && lang !== glossLang) langs.push([lang, 2]);
  for (const [lg, tier] of langs) {
    for (const [id, g] of Object.entries(BLISS_GLOSSES[lg]))
      for (const syn of g.split(',')) { put(syn, +id, tier); put(syn.replace(/\s*\([^)]*\)/g, ''), +id, tier); }
  }
  const enTier = (!glossLang || glossLang === 'en') ? 1 : 3;
  for (const sy of BLISS_DATA)
    for (const syn of (sy.n || '').split(',')) {
      put(syn, sy.id, enTier);
      put(syn.replace(/_/g, ' ').replace(/-\(to\)$/, '').replace(/\s*\([^)]*\)/g, ''), sy.id, enTier);
    }
  // the open list's own words — the user's symbols and edited glosses. Only
  // entries that DIFFER from the standard get the top tier: the default list
  // is the full BCI-AV, and giving its English names tier 0 would put English
  // back on top of the chosen language (the bug behind Håkan's "i").
  const stdN = new Map(BLISS_DATA.map(s => [s.id, s.n]));
  for (const sy of lists.A.syms)
    if (sy.e && sy.e.length && stdN.get(sy.id) !== sy.n)
      for (const syn of (sy.n || '').split(',')) {
        put(syn, sy.id, 0);
        put(syn.replace(/_/g, ' ').replace(/-\(to\)$/, '').replace(/\s*\([^)]*\)/g, ''), sy.id, 0);
      }
  // Within a tier: function words (word class WHITE) rank FIRST — in running
  // text "med" means with before the sled runner, "i" the preposition before
  // anything else (Håkan, 2026-10-08). Alphabet letters rank last of all:
  // a letter glyph is always an explicit choice.
  const rank = new Map(BLISS_DATA.map(s => [s.id,
    /_\((lower|upper)case\)/.test(s.n || '') ? 2 : s.c === 'WHITE' ? 0 : 1]));
  for (const [w, arr] of W_INDEX)
    if (arr.length > 1) arr.sort((a, b) =>
      (tierOf.get(w + '|' + a) ?? 9) - (tierOf.get(w + '|' + b) ?? 9) ||
      (rank.get(a) ?? 0) - (rank.get(b) ?? 0));
}
// Last pick per written word, per writing language (Håkan, 2026-10-08:
// "med" kept offering the sled first — remember what I chose last time).
// Values: a symbol id, or 'text' for the as-text choice. Saved only on the
// user's own picks (chooser, list click) — never on the AI's.
let W_PICKS = {};
try { W_PICKS = JSON.parse(localStorage.getItem('wb-picks') || '{}') || {}; } catch (_) {}
const wPickKey = tok => (glossLang || 'en') + '|' + tok.toLowerCase();
function wRememberPick(w) {
  if (!w || w.br || w.punct || !w.token) return;
  W_PICKS[wPickKey(w.token)] = w.asText ? 'text' : w.ids[w.pick];
  try { localStorage.setItem('wb-picks', JSON.stringify(W_PICKS)); } catch (_) {}
}
function wEditDist(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 4) return 99;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
const W_PUNCT = { '?': 8485, '!': 8483, '.': 8486, ',': 8487 };

let W = [];                 // [{token, ids, pick, ind, asText}]
let wOpen = -1;             // chooser open for chip index

function wParse() {
  wBuildIndex();
  const rawLines = $('wInput').value.split('\n');
  const prev = W; W = [];
  const toks = [];
  let base = 0;
  rawLines.forEach((ln, li) => {
    if (li > 0) toks.push({ raw: '\u21B5', off: base - 1 });
    const re = /\S+/g; let m;
    while ((m = re.exec(ln))) toks.push({ raw: m[0], off: base + m.index });
    base += ln.length + 1;
  });
  const subs = [];
  toks.forEach(({ raw, off }, i) => {
    if (raw === '\u21B5') { W.push({ br: true, token: '\u21B5', off }); return; }
    const m = raw.match(/^(.*?)([?!.,]*)$/);
    const word = m[1], punct = m[2];
    // "gå #2" — a single-digit # code is a FORM on the word before it, and
    // disappears from the text (Håkan, 2026-10-15). It fires only once the
    // token is complete (something typed after it), so "#1" on the way to a
    // BCI code like #17744 is left alone. Real BCI ids are 4+ digits.
    const mform = word.match(/^#([0-7])$/);
    if (mform && (punct || off + raw.length < $('wInput').value.length)) {
      const [key] = W_IND_CHOICES[+mform[1]];
      // the word just before the code — never an earlier one: putting the form
      // on a word further back than the writer can see would be a surprise
      for (let i = W.length - 1; i >= 0; i--) {
        const ww = W[i];
        if (!ww || ww.br || ww.punct) continue;
        if (!ww.asText && ww.ids.length) { ww.ind = wIndToggle(ww.ind, key); wAutoLabel(ww); }
        break;
      }
      subs.push({ off, raw: word, rep: '' });
      for (const p of punct) if (W_PUNCT[p]) W.push({ token: p, ids: [W_PUNCT[p]], pick: 0, ind: '', asText: false, punct: true });
      return;
    }
    const mcode = word.match(/^#(\d+)$/);
    if (mcode) {
      const sym = wSymById(+mcode[1]);
      if (sym) {
        const gw = displayGloss(sym).split(',')[0].trim();
        if (!/\s/.test(gw)) subs.push({ off, raw: word, rep: gw });
        W.push({ token: gw, ids: [sym.id], pick: 0, ind: '', label: gw, asText: false, off });
      } else {
        W.push({ token: word, ids: [], pick: 0, ind: '', asText: true, off });
      }
      for (const p of punct) if (W_PUNCT[p]) W.push({ token: p, ids: [W_PUNCT[p]], pick: 0, ind: '', asText: false, punct: true });
      return;
    }
    if (word) {
      const old = prev[W.length];
      const lower = word.toLowerCase();
      let ids = W_INDEX.get(lower) || [];
      let fuzzy = false, keyOf = null;
      if (!ids.length && lower.length >= 3) {
        // Inflected forms (vill -> vilja): candidates share a 3+ letter stem,
        // ranked by edit distance. This is a GUESS and shows as one — real
        // lemmatization belongs to the AI layer; the chooser fixes the rest.
        // Two nets: same 3-letter stem (any distance), and same 2-letter stem
        // within edit distance 2 — the second catches strong verbs whose stem
        // shifts in the third letter (wrote -> write, stod -> stå).
        const pre3 = lower.slice(0, 3), pre2 = lower.slice(0, 2);
        const hits = [];
        for (const [k, v] of W_INDEX) {
          if (!k.startsWith(pre2)) continue;
          const d = wEditDist(lower, k);
          if (k.startsWith(pre3) || d <= 2) hits.push({ d, k, v });
        }
        hits.sort((x, y) => x.d - y.d);
        keyOf = new Map();
        for (const h of hits) {
          for (const id of h.v) if (!ids.includes(id)) { ids.push(id); keyOf.set(id, h.k); }
          if (ids.length >= 8) break;
        }
        fuzzy = ids.length > 0;
      }
      if (old && old.token === word) { old.off = off; W.push(old); }
      // A fuzzy hit is a guess and must not render as a symbol on its own:
      // it starts as text; the chooser offers the guesses, and a pick (yours
      // or the AI's) is what promotes it to a symbol. A REMEMBERED pick is a
      // pick: the same word chosen before resolves the same way again.
      else {
        let pick = 0, asText = ids.length === 0 || fuzzy;
        const mem = W_PICKS[wPickKey(word)];
        if (mem === 'text' && ids.length) asText = true;
        else if (typeof mem === 'number' && ids.includes(mem)) { pick = ids.indexOf(mem); asText = false; }
        W.push({ token: word, ids, pick, ind: '', asText, fuzzy: fuzzy && asText, keyOf, off });
      }
    }
    for (const p of punct) if (W_PUNCT[p]) W.push({ token: p, ids: [W_PUNCT[p]], pick: 0, ind: '', asText: false, punct: true });
  });
  if (subs.length) {
    const inp = $('wInput');
    let v = inp.value, caret = inp.selectionStart ?? v.length;
    for (const s of subs.sort((a, b) => b.off - a.off)) {
      v = v.slice(0, s.off) + s.rep + v.slice(s.off + s.raw.length);
      if (caret > s.off) caret = Math.max(s.off + s.rep.length, caret + s.rep.length - s.raw.length);
    }
    inp.value = v;
    inp.selectionStart = inp.selectionEnd = Math.min(caret, v.length);
    return wParse();   // one clean re-parse on the substituted text
  }
  if (wOpen >= W.length) wOpen = -1;
  wRender();
}

function wWordEls(w) {
  if (w.br) return [];
  if (w.asText) return [['Z', 1, 1, 0, 0, 10, 0, 0, w.token, 0, 6]];
  return wComposeEls(w.ids[w.pick], w.ind);
}
function wChipSVG(w) {
  try { return blissSVG({ e: wWordEls(w) }, { unit: 3.2, color: 'currentColor' }); } catch (_) { return '?'; }
}

function wRenderChips() {
  const box = $('wChips'); box.innerHTML = '';
  W.forEach((w, i) => {
    if (w.br) { const d = document.createElement('div'); d.className = 'wBr'; box.appendChild(d); return; }
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'wChip' + (w.asText && !w.ids.length ? ' unmatched' : '') + (w.fuzzy ? ' fuzzy' : '') + (i === wOpen ? ' on' : '');
    c.innerHTML = `${wChipSVG(w)}<span class="cap">${escXml(w.label || w.token)}${w.ind ? ' ·' : ''}</span>`;
    c.title = w.fuzzy
      ? tr('No exact match — click to see guesses, or let Interpret decide', 'Ingen exakt träff — klicka för att se gissningar, eller låt Tolka avgöra')
      : w.ids.length
      ? tr('Click to choose symbol, tense or text form', 'Klicka för att välja symbol, tempus eller textform')
      : tr('No symbol matched — stays as text, or create your own', 'Ingen symbol matchade — förblir text, eller skapa en egen');
    c.onclick = () => { wOpen = wOpen === i ? -1 : i; wRender(); };
    box.appendChild(c);
  });
}
function wRender() {
  wRenderChips();
  wRenderChooser();
  wRenderPreview();
}

function wRenderChooser() {
  const ch = $('wChooser');
  if (!WS.chooser || wOpen < 0 || !W[wOpen]) { ch.hidden = true; return; }
  const w = W[wOpen];
  ch.hidden = false; ch.innerHTML = '';
  const cands = document.createElement('div'); cands.className = 'wCands';
  w.ids.forEach((id, k) => {
    const sy = wSymById(id);
    const b = document.createElement('button');
    b.className = 'varBtn' + (!w.asText && k === w.pick ? ' sel' : '');
    const capTxt = (w.keyOf && w.keyOf.get(id)) || ((wSymById(id) || {}).n || String(id)).split(',')[0];
    b.innerHTML = `${wChipSVG({ ids: [id], pick: 0, ind: w.ind, asText: false })}<span class="cap">${escXml(capTxt)}</span>`;
    b.title = sy ? sy.n : '';
    b.onclick = () => { w.pick = k; w.asText = false; w.fuzzy = false; wRememberPick(w); wRender(); };
    cands.appendChild(b);
  });
  const tb = document.createElement('button');
  tb.className = 'varBtn' + (w.asText ? ' sel' : '');
  tb.textContent = tr('as text', 'som text');
  tb.onclick = () => { w.asText = true; wRememberPick(w); wRender(); };
  cands.appendChild(tb);
  const eb = document.createElement('button');
  eb.className = 'varBtn';
  eb.textContent = w.ids.length ? tr('open in editor', 'öppna i editorn') : tr('create the symbol', 'skapa symbolen');
  eb.onclick = () => {
    if (w.ids.length && !w.asText) {
      const base = deep(lists.A.syms.find(x => x.id === w.ids[w.pick]) || BLISS_DATA.find(x => x.id === w.ids[w.pick]));
      // the chosen form goes with it (Håkan, 2026-09-24: dåtid/futurum/presens
      // arrived in the editor as the bare base symbol) — same composition as the preview
      if (w.ind) base.e = wComposeEls(w.ids[w.pick], w.ind);
      guardedLoad(base, 'A');
    } else {
      loadIntoEditor({ id: '', n: w.token, c: 'YELLOW', k: 'SWE', e: [] }, 'A');
    }
    setWriting(false);
  };
  cands.appendChild(eb);
  ch.appendChild(cands);
  if (!w.punct) {
    const lr = document.createElement('div'); lr.className = 'wInds';
    const ll = document.createElement('span'); ll.textContent = tr('Word under the symbol:', 'Ordet under symbolen:');
    const li = document.createElement('input');
    li.value = w.label || w.token; li.size = Math.max(8, (w.label || w.token).length + 2);
    li.addEventListener('input', () => { w.label = li.value.trim() || null; w.autoLabel = false; wRenderChips(); wRenderPreview(); });
    lr.appendChild(ll); lr.appendChild(li); ch.appendChild(lr);
  }
  if (!w.punct && w.ids.length) {
    const inds = document.createElement('div'); inds.className = 'wInds';
    const lab = document.createElement('span'); lab.textContent = tr('Form:', 'Form:'); inds.appendChild(lab);
    for (const [di, [key, name]] of W_IND_CHOICES.entries()) {
      if (key && !W_INDICATORS.map.get(key)) continue;
      const b = document.createElement('button');
      b.title = '#' + di;                       // the # + digit shortcut
      b.className = (key ? wIndKeys(w.ind).includes(key) : !w.ind) ? 'sel' : '';
      // The indicator CHARACTER itself leads the label — a Bliss reader reads
      // the glyph, not the English/Swedish word. Drawn by the engine from the
      // real BCI indicator record, pen boldened like the other small glyphs.
      if (key) {
        const rec = W_INDICATORS.map.get(key);
        try {
          b.innerHTML = `<span class="bIcon indIcon">${
            blissSVG({ e: wIndParts(rec) }, { unit: 2.4, color: 'currentColor' })
              .replace(/stroke-width="(\d+(?:\.\d+)?)"/, (m, sw) => `stroke-width="${Math.round(sw * 1.15)}"`)
          }</span>${escXml(name())}`;
        } catch (_) { b.textContent = name(); }
      } else b.textContent = name();
      const kbd = document.createElement('kbd'); kbd.textContent = '#' + di; b.appendChild(kbd);
      b.onclick = () => { w.ind = wIndToggle(w.ind, key); wAutoLabel(w); wRender(); };
      inds.appendChild(b);
    }
    ch.appendChild(inds);
  }
}

/* # + siffra sets a form without the mouse (Håkan, 2026-10-14): the word whose
   chooser is open, otherwise the last symbol word. Same toggle as the Form
   buttons; 0 = none. Armed like the # family shortcuts in Former/Gissa —
   press #, then the digit, within 4 s. Skipped while typing in a field:
   inside the input #2 is a BCI code, not a shortcut. */
let wHashArmed = 0;
function wIndTarget() {
  const ok = w => w && !w.br && !w.punct && !w.asText && w.ids.length;
  if (wOpen >= 0 && ok(W[wOpen])) return wOpen;
  for (let i = W.length - 1; i >= 0; i--) if (ok(W[i])) return i;
  return -1;
}
document.addEventListener('keydown', (ev) => {
  if (!document.body.classList.contains('writing')) return;
  const t = ev.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
  if (ev.key === '#') {
    wHashArmed = Date.now(); ev.preventDefault();
    toast('# — ' + tr('press the form digit (0–7)', 'tryck formens siffra (0–7)'));
    return;
  }
  if (!wHashArmed) return;
  if (ev.key.length !== 1) return;                 // Shift/Alt etc: keep waiting
  if (Date.now() - wHashArmed > 4000) { wHashArmed = 0; return; }
  wHashArmed = 0;
  if (!/^[0-7]$/.test(ev.key)) return;
  const [key, name] = W_IND_CHOICES[+ev.key];
  if (key && !W_INDICATORS.map.get(key)) return;
  const ix = wIndTarget();
  if (ix < 0) { toast(tr('No word to give a form', 'Inget ord att ge form')); return; }
  ev.preventDefault();
  const w = W[ix];
  w.ind = wIndToggle(w.ind, key);
  wAutoLabel(w);
  wOpen = ix;                                      // the chooser shows what happened
  wRender();
  toast((w.label || w.token) + ': ' + (!key ? tr('no form', 'ingen form')
    : wIndKeys(w.ind).includes(key) ? name()
    : name() + ' ' + tr('removed', 'borttagen')));
});

/* Write-view display settings (Håkan's AAC field feedback, 2026-09-09):
   visibility of list/alternatives/forms + symbol size, text size, word gap,
   pen width. Applied to the live preview AND all exports. Persisted. */
let WS = Object.assign({ list: true, chips: true, chooser: true, unit: 11, text: 100, gap: 8, pen: 35 },
  JSON.parse(localStorage.getItem('wb-write') || '{}'));
function saveWS() { localStorage.setItem('wb-write', JSON.stringify(WS)); }
function applyWS() {
  document.body.classList.toggle('wnolist', !WS.list);
  document.body.classList.toggle('wnochips', !WS.chips);
  document.body.classList.toggle('wnochooser', !WS.chooser);
  // header quick-toggles + the settings checkboxes mirror the same state
  for (const [btn, key, box] of [['wtList', 'list', 'wsList'], ['wtChips', 'chips', 'wsChips'], ['wtChooser', 'chooser', 'wsChooser']]) {
    const b = $(btn);
    if (b) { b.classList.toggle('on', WS[key]); b.setAttribute('aria-pressed', String(WS[key])); }
    const c = $(box); if (c) c.checked = WS[key];
  }
}
for (const [btn, key] of [['wtList', 'list'], ['wtChips', 'chips'], ['wtChooser', 'chooser']]) {
  $(btn).onclick = () => {
    WS[key] = !WS[key];
    saveWS(); applyWS();
    if (document.body.classList.contains('writing')) wRender();
  };
}
function wGapOf(w) { return w.punct ? Math.max(2, WS.gap / 2) : WS.gap; }
function wLineSVG(words, unit = 14, withLabels = true) {
  if (!words.length) return null;
  let cursor = 0, parts = [], labels = [];
  let minY = 1e9, maxY = -1e9, maxX = 0;
  words.forEach((w, i) => {
    const els = wWordEls(w); if (!els.length) return;
    const box = wSvgBox(els, 4);
    const gap = i === 0 ? 0 : wGapOf(w);
    const dx = cursor * 100 + gap * 100 - box.vx;
    const body = (box.svg.match(/<\/style>([\s\S]*)<\/svg>/) || [, ''])[1];
    parts.push(`<g transform="translate(${dx.toFixed(1)} 0)">${body}</g>`);
    if (withLabels && !w.punct) labels.push({ x: dx + box.vx + box.vw / 2, t: w.label || w.token });
    minY = Math.min(minY, box.vy); maxY = Math.max(maxY, box.vy + box.vh);
    cursor = (dx + box.vx + box.vw) / 100;
    maxX = dx + box.vx + box.vw;
  });
  if (!parts.length) return null;
  if (WS.text <= 0) withLabels = false;
  const fs = 260 * (WS.text / 100), pad = 80;
  const textY = Math.max(maxY, 1600) + 400;
  const texts = withLabels ? labels.map(l =>
    `<text x="${l.x.toFixed(1)}" y="${textY}" text-anchor="middle" font-size="${fs}" font-family="Helvetica, Arial, sans-serif" stroke="none" class="bfill">${escXml(l.t)}</text>`).join('') : '';
  const vy = Math.min(minY, 300) - pad;
  const vh = (withLabels ? textY + fs * 0.3 : maxY) - vy + pad;
  const vx = -pad, vw = maxX + 2 * pad;
  const scale = unit / 100;
  const ink = exportInk();
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${(vw * scale).toFixed(1)}" height="${(vh * scale).toFixed(1)}" viewBox="${vx} ${vy} ${vw} ${vh}" stroke="${ink}" stroke-width="${WS.pen}" stroke-linecap="round" stroke-linejoin="round" style="color:${ink}"><style>.bfill{fill:${ink}}</style>${parts.join('')}${texts}</svg>`,
           w: vw * scale, h: vh * scale };
}

/* break the text into rendered lines: explicit ↵ breaks + auto-wrap at maxUnits */
const W_WRAP_UNITS = 110;
function wLines(maxUnits = W_WRAP_UNITS) {
  const lines = [[]];
  let cursor = 0;
  for (const w of W) {
    if (w.br) { lines.push([]); cursor = 0; continue; }
    const els = wWordEls(w); if (!els.length) continue;
    const wUnits = wSvgBox(els, 4).vw / 100;
    const gap = lines[lines.length - 1].length ? wGapOf(w) : 0;
    if (lines[lines.length - 1].length && cursor + gap + wUnits > maxUnits && !w.punct) {
      lines.push([]); cursor = 0;
      lines[lines.length - 1].push(w); cursor = wUnits;
    } else {
      lines[lines.length - 1].push(w); cursor += gap + wUnits;
    }
  }
  return lines.filter(l => l.length);
}

/* the whole text as one SVG document: lines stacked as nested <svg> */
function wDocSVG(unit = 18, withLabels = true) {
  const lines = wLines().map(l => wLineSVG(l, unit, withLabels)).filter(Boolean);
  if (!lines.length) return null;
  const gapPx = unit * 1.2;
  const w = Math.max(...lines.map(l => l.w));
  let y = 0; const inner = [];
  for (const l of lines) {
    inner.push(l.svg.replace('<svg ', `<svg y="${y.toFixed(1)}" `));
    y += l.h + gapPx;
  }
  const h = y - gapPx;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(1)}" height="${h.toFixed(1)}">${inner.join('')}</svg>`, w, h };
}

function wRenderPreview() {
  const pv = $('wPreview');
  // wrap where the SCREEN ends, not at a fixed width — big symbols get fewer
  // squares per line instead of a sideways scroll
  const availPx = ($('wPreviewWrap') && $('wPreviewWrap').clientWidth || 900) - 76;
  const maxU = Math.max(16, availPx / WS.unit);
  const items = (W.length ? wLines(maxU) : [])
    .map(l => ({ l, r: wLineSVG(l, WS.unit, true) }))
    .filter(x => x.r);
  W_PREV_LINES = items.map(x => x.l);
  if (!items.length) {
    pv.innerHTML = `<span style="color:var(--dim);font-size:13px">${tr('The text appears here', 'Texten visas här')}</span>`;
    return;
  }
  pv.innerHTML = items.map(x =>
    `<div>${x.r.svg.replace(/stroke="[^"]*"/, 'stroke="currentColor"').replace(/style="color:[^"]*"/, '').replace(/\.bfill\{fill:[^}]*\}/, '.bfill{fill:currentColor}')}</div>`).join('');
  wScrollToCaret();
}
/* the preview follows the pen: scroll to the rendered line that holds the
   word under the caret (PeO + Håkan, 2026-09-09) */
let W_PREV_LINES = [];
function wScrollToCaret() {
  const pv = $('wPreview');
  if (!W_PREV_LINES.length || !pv.children.length) return;
  const sel = $('wInput').selectionStart ?? $('wInput').value.length;
  let target = null;
  for (const w of W) { if (w.br) continue; if ((w.off ?? 0) <= sel) target = w; else break; }
  if (!target) return;
  const idx = W_PREV_LINES.findIndex(l => l.includes(target));
  const div = idx >= 0 && pv.children[idx];
  if (!div || !div.scrollIntoView) return;
  const wrap = $('wPreviewWrap');
  // a line taller than the window shows its TOP (symbols first, labels after)
  div.scrollIntoView({ block: div.offsetHeight > wrap.clientHeight ? 'start' : 'nearest' });
}

function setWriting(on) {
  document.body.classList.toggle('writing', on);
  $('btnWrite').classList.toggle('on', on);
  if (!on) setTimeout(renderStage, 30);
  else { wBuildIndex(); wParse(); wProbeAI(); $('wInput').focus(); }
}
$('btnWrite').onclick = () => setWriting(!document.body.classList.contains('writing'));
$('edBackWrite').onclick = () => setWriting(true);   // embed mode: the header's ✎ Skriv is hidden
// the symbol on the canvas → the engraving page (Håkan, 2026-09-24: "person Lisa" on a tag)
$('btnGravyr').onclick = () => {
  if (!ed.sym || !ed.sym.e.length) { toast(tr('Nothing on the canvas yet.', 'Inget på ritytan ännu.')); return; }
  localStorage.setItem('wb-gravyr', JSON.stringify({ id: ed.sym.id || 0, n: $('gloss').value || ed.sym.n || '', e: ed.sym.e }));
  window.open('gravyr.html?from=editor', '_blank');
};
$('wInput').addEventListener('input', wParse);
$('wInput').addEventListener('keyup', wScrollToCaret);
$('wInput').addEventListener('click', wScrollToCaret);
/* drop targets: the input takes the browser's native text drop (position-exact,
   payload is space-padded); chips and preview append at the end */
$('wInput').addEventListener('drop', () => setTimeout(wParse, 0));
for (const id of ['wChips', 'wPreview']) {
  $(id).addEventListener('dragover', (ev) => {
    if ([...ev.dataTransfer.types].includes('text/plain')) ev.preventDefault();
  });
  $(id).addEventListener('drop', (ev) => {
    ev.preventDefault();
    wAppendWords(ev.dataTransfer.getData('text/plain').trim());
  });
}
$('wClear').onclick = () => { $('wInput').value = ''; wOpen = -1; wParse(); };

/* documents (Håkan's users, 2026-09-10): save the text WITH every word's
   choice (symbol, form, label, as-text), reopen later or on someone else's
   WinBliss and keep writing. Plain JSON, extension .wbd. */
let wDocHandle = null;   // the opened/saved file — Save writes BACK to it
function wBuildDoc() {
  const words = W.filter(w => !w.br && !w.punct).map(w => ({
    t: w.token, id: w.asText ? null : (w.ids[w.pick] ?? null),
    ind: w.ind || '', label: w.label || null, asText: !!w.asText }));
  return { app: 'WinBliss', kind: 'write-doc', v: 1,
    date: new Date().toISOString().slice(0, 10), text: $('wInput').value, words };
}
$('wSaveDoc').onclick = async () => {
  if (!W.length) return toast(tr('Nothing to save yet', 'Inget att spara ännu'));
  const doc = wBuildDoc();
  const json = JSON.stringify(doc, null, 1);
  const name = ((doc.words[0] && doc.words[0].t) || 'dokument').replace(/[^\wåäöÅÄÖ-]/g, '') || 'dokument';
  // Real save dialog where the browser offers it (File System Access API:
  // Chrome/Edge on a secure origin, e.g. localhost). Save remembers the file
  // and writes back to it — no Downloads-copies (PeO 2026-09-10).
  if (window.showSaveFilePicker) {
    try {
      if (!wDocHandle) {
        wDocHandle = await showSaveFilePicker({
          suggestedName: name + '.wbd',
          types: [{ description: 'WinBliss-dokument', accept: { 'application/json': ['.wbd'] } }],
        });
      }
      const ws2 = await wDocHandle.createWritable();
      await ws2.write(json); await ws2.close();
      return toast(tr('Saved: ', 'Sparat: ') + wDocHandle.name);
    } catch (e) {
      if (e && e.name === 'AbortError') return;   // user cancelled the dialog
      wDocHandle = null;                          // handle went stale — fall through
    }
  }
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name + '.wbd'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
};
function wApplyDoc(txt) {
  let doc; try { doc = JSON.parse(txt); } catch (_) { doc = null; }
  if (!doc || doc.kind !== 'write-doc' || typeof doc.text !== 'string') {
    toast(tr('Not a WinBliss document (.wbd)', 'Inte ett WinBliss-dokument (.wbd)'));
    return false;
  }
  $('wInput').value = doc.text;
  wOpen = -1;
  wParse();
  const ws = W.filter(w => !w.br && !w.punct);
  (doc.words || []).forEach((s, i) => {
    const w = ws[i]; if (!w || w.token !== s.t) return;   // honest: skip on mismatch
    if (s.id != null) {
      if (!w.ids.includes(s.id) && BLISS_DATA.some(x => x.id === s.id)) w.ids.unshift(s.id);
      if (w.ids.includes(s.id)) { w.pick = w.ids.indexOf(s.id); w.asText = false; w.fuzzy = false; }
    } else if (s.asText) { w.asText = true; w.fuzzy = false; }
    w.ind = s.ind || '';
    if (s.label) w.label = s.label;
  });
  wRender();
  toast(tr('Document opened — keep writing', 'Dokumentet öppnat — fortsätt skriva'));
  return true;
}
$('wOpenDoc').onclick = async () => {
  if (window.showOpenFilePicker) {
    try {
      const [h] = await showOpenFilePicker({
        types: [{ description: 'WinBliss-dokument', accept: { 'application/json': ['.wbd'] } }],
      });
      const f = await h.getFile();
      if (wApplyDoc(await f.text())) wDocHandle = h;   // Save now writes back here
      return;
    } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.wbd,application/json';
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    f.text().then(wApplyDoc);
  };
  inp.click();
};

/* keyboard shortcuts in Write mode (Håkan 2026-09-11 — a screen keyboard can
   send key combos): Ctrl/Cmd+S = save the document, Ctrl/Cmd+O = open one */
document.addEventListener('keydown', (ev) => {
  if (!document.body.classList.contains('writing')) return;
  if (!(ev.metaKey || ev.ctrlKey) || ev.altKey || ev.shiftKey) return;
  const k = ev.key.toLowerCase();
  if (k === 's') { ev.preventDefault(); $('wSaveDoc').onclick(); }
  if (k === 'o') { ev.preventDefault(); $('wOpenDoc').onclick(); }
});

/* exports share the document pipeline */
$('wSVG').onclick = () => {
  const doc = wDocSVG(18);
  if (!doc) return toast(tr('Nothing to export', 'Inget att exportera'));
  download('bliss-text.svg', new Blob([doc.svg], { type: 'image/svg+xml' }));
};
function wRaster(svgStr, scale2x = 2) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = img.width * scale2x; cv.height = img.height * scale2x;
      const cx = cv.getContext('2d');
      const bg = resolvedBg(); cx.fillStyle = bg || '#ffffff';
      if (bg || true) cx.fillRect(0, 0, cv.width, cv.height);
      cx.drawImage(img, 0, 0, cv.width, cv.height);
      res(cv);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
  });
}
function wPngBlob() {
  const doc = wDocSVG(18);
  if (!doc) return Promise.reject(new Error('empty'));
  return wRaster(doc.svg).then(cv => new Promise((res, rej) => cv.toBlob(b => (b ? res(b) : rej(new Error('raster'))), 'image/png')));
}
$('wPNG').onclick = async () => {
  if (!W.length) return toast(tr('Nothing to export', 'Inget att exportera'));
  download('bliss-text.png', await wPngBlob());
};
$('wClip').onclick = () => {
  if (!W.length) return toast(tr('Nothing to copy', 'Inget att kopiera'));
  if (!navigator.clipboard || !window.ClipboardItem) return toast(tr('Image copy is not supported in this browser', 'Bildkopiering stöds inte i den här webbläsaren'));
  navigator.clipboard.write([new ClipboardItem({ 'image/png': wPngBlob() })])
    .then(() => toast(tr('Text copied to the clipboard as PNG', 'Texten kopierad till urklipp som PNG')))
    .catch(() => toast(tr('Copy failed', 'Kopieringen misslyckades')));
};
const W_ATTRIBUTION = 'Blissymbolics © C.K. Bliss 1949, 1965 · Parts herein © Blissymbolics Communication International (BCI), CC BY-SA 4.0 · WinBliss² (AnyCom AB)';
$('wDoc').onclick = async () => {
  if (!W.length) return toast(tr('Nothing to export', 'Inget att exportera'));
  const lines = wLines().map(l => wLineSVG(l, 18, true)).filter(Boolean);
  const imgs = [];
  for (const l of lines) {
    const cv = await wRaster(l.svg);
    imgs.push(`<p><img src="${cv.toDataURL('image/png')}" width="${Math.round(l.w)}"></p>`);
  }
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"></head><body>${imgs.join('')}<p style="font-size:8pt;color:#888">${W_ATTRIBUTION}</p></body></html>`;
  download('bliss-text.doc', new Blob(['﻿' + html], { type: 'application/msword' }));
  toast(tr('Word document saved (.doc)', 'Word-dokument sparat (.doc)'));
};
$('wPrint').onclick = () => {
  if (!W.length) return toast(tr('Nothing to print', 'Inget att skriva ut'));
  const lines = wLines().map(l => wLineSVG(l, 18, true)).filter(Boolean);
  const win = window.open('', '_blank');
  if (!win) return toast(tr('The browser blocked the print window', 'Webbläsaren blockerade utskriftsfönstret'));
  win.document.write(`<html><head><meta charset="utf-8"><title>Bliss</title><style>body{font-family:sans-serif;margin:2cm}div{margin-bottom:10px}footer{font-size:8pt;color:#888;margin-top:2em}</style></head><body>${lines.map(l => `<div>${l.svg}</div>`).join('')}<footer>${W_ATTRIBUTION}</footer></body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 300);
};

/* the AI layer: same chips, a different filler. The endpoint gets the text
   plus each word's VERIFIED candidates and returns choices for the same
   editable fields the user fills by hand — the human remains the author. */
// Served over http = ask the SAME server that served the page (it IS the
// interpret-server) — so ✨ Tolka works over the LAN too, not only on the
// machine that runs the server. file:// keeps the localhost fallback.
const W_AI_URL = location.protocol.startsWith('http')
  ? location.origin
  : 'http://localhost:8463';
let wAIBackend = null;
function wProbeAI() {
  fetch(W_AI_URL + '/health', { signal: AbortSignal.timeout(1200) })
    .then(r => r.json())
    .then(j => { if (j.ok) { wAIBackend = j.backend; $('wAI').style.display = ''; } })
    .catch(() => { wAIBackend = null; $('wAI').style.display = 'none'; });
}
$('wAI').onclick = async () => {
  if (!W.length) return toast(tr('Write something first', 'Skriv något först'));
  const tokens = [];
  W.forEach((w, i) => {
    if (w.br || w.punct) return;
    tokens.push({ i, token: w.token,
      candidates: (w.ids || []).slice(0, 6).map(id => {
        const sy = wSymById(id) || {};
        const svG = glossLang && BLISS_GLOSSES[glossLang] ? BLISS_GLOSSES[glossLang][id] : '';
        return { id, gloss: (svG ? svG + ' / ' : '') + (sy.n || ''), wc: sy.c };
      }) });
  });
  const btn = $('wAI'); btn.disabled = true;
  const oldTxt = btn.textContent; btn.textContent = tr('Interpreting…', 'Tolkar…');
  try {
    const r = await fetch(W_AI_URL + '/interpret', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: $('wInput').value, lang, gloss_lang: glossLang, tokens }),
    });
    const j = await r.json();
    if (j.error) throw new Error(j.error);
    for (const c of j.choices || []) {
      const w = W[c.i]; if (!w || w.br || w.punct) continue;
      if (c.id != null && w.ids.includes(c.id)) { w.pick = w.ids.indexOf(c.id); w.asText = false; }
      else if (c.id == null) {
        // The AI may name the BASE FORM as a word (wrote -> "write"); we look
        // it up in our own verified index, so the id still comes from BCI-AV.
        let hit = null, key = null;
        for (const lm of [c.lemma, c.lemma_en]) {
          if (lm && W_INDEX.has(lm)) { hit = W_INDEX.get(lm); key = lm; break; }
        }
        if (hit) {
          w.ids = hit.slice(); w.pick = 0; w.asText = false;
          w.keyOf = new Map(hit.map(id => [id, key]));
        } else w.asText = true;
      }
      w.ind = c.indicator || '';
      w.label = c.label && c.label !== w.token ? c.label : w.label;
      w.fuzzy = false;                        // interpreted, no longer a guess
    }
    wRender();
    toast(tr('Interpreted — every choice is still yours to adjust', 'Tolkat — varje val är fortfarande ditt att justera'));
  } catch (e) {
    toast(tr('Interpretation failed: ', 'Tolkningen misslyckades: ') + (e.message || e));
  }
  btn.disabled = false; btn.textContent = oldTxt;
};

/* dictation, when the browser offers it.
   Model: one click STARTS, one click STOPS — and the button says so loudly
   (red, pulsing, "Listening…") while the mic is live. continuous=true so a
   breathing pause doesn't silently end the recording (PeO, 2026-08-25:
   "I need visual feedback on when it is recording"). */
(() => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { $('wMic').style.display = 'none'; return; }
  let rec = null;
  const setMicUI = (on) => {
    const b = $('wMic');
    b.classList.toggle('recording', on);
    b.innerHTML = on ? `🎤 ${escXml(tr('Listening… click to stop', 'Lyssnar… klicka för att stoppa'))}` : '🎤';
    const label = on ? tr('Stop dictation', 'Stoppa dikteringen')
                     : tr('Dictate — tap to start/stop, or press and hold', 'Diktera — klicka för start/stopp, eller håll inne');
    b.title = label; b.setAttribute('aria-label', on ? label : tr('Dictate', 'Diktera'));
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  const start = () => {
    if (rec) return;
    rec = new SR();
    rec.lang = lang === 'sv' ? 'sv-SE' : 'en-US';
    rec.interimResults = false;
    rec.continuous = true;              // keep listening through pauses, until stopped
    rec.onresult = (ev) => {
      // append only the NEW final results (continuous mode fires per phrase)
      let t = '';
      for (let k = ev.resultIndex; k < ev.results.length; k++)
        if (ev.results[k].isFinal) t += ' ' + ev.results[k][0].transcript;
      t = t.trim();
      if (t) { $('wInput').value = ($('wInput').value + ' ' + t).trim(); wParse(); }
    };
    rec.onerror = (ev) => {
      if (ev.error === 'not-allowed')
        toast(tr('Microphone blocked — allow it in the browser', 'Mikrofonen blockerad — tillåt den i webbläsaren'));
      else if (ev.error !== 'no-speech' && ev.error !== 'aborted')
        toast(tr('Dictation error: ', 'Dikteringsfel: ') + ev.error);
    };
    rec.onend = () => { rec = null; setMicUI(false); };   // covers browser-initiated ends too
    setMicUI(true);
    rec.start();
  };
  const stop = () => { if (rec) rec.stop(); };
  /* One button, two grips (PeO, 2026-08-25):
     - a short TAP toggles — start red-and-pulsing, tap again to stop
       (the low-motor-effort path: switch access, tremor, keyboard)
     - PRESS AND HOLD (>350 ms) records for exactly as long as you hold,
       walkie-talkie style, and stops on release.
     The gesture itself chooses; no setting needed. Keyboard stays pure toggle. */
  const HOLD_MS = 350;
  let downAt = 0, wasRecordingAtDown = false;
  const mic = $('wMic');
  mic.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    mic.setPointerCapture(ev.pointerId);
    downAt = Date.now(); wasRecordingAtDown = !!rec;
    if (!rec) start();
  });
  mic.addEventListener('pointerup', () => {
    const held = Date.now() - downAt >= HOLD_MS;
    if (held) stop();                        // push-to-talk: release = stop
    else if (wasRecordingAtDown) stop();     // short tap while recording = stop
    /* short tap while idle: recording already started on pointerdown — keep going */
  });
  mic.addEventListener('pointercancel', stop);
  mic.addEventListener('keydown', (ev) => {  // keyboard/switch: pure toggle
    if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); rec ? stop() : start(); }
  });
  mic.addEventListener('click', (ev) => {    // assistive-tech activation (no pointer, no key)
    if (ev.detail === 0) { rec ? stop() : start(); }
  });
  setMicUI(false);                           // the two-grip hint from the start
})();

/* ================= boot ================= */
applyPalSize();
applyWS();
/* embed mode for AAC hosts (MindExpress web window etc., 2026-09-11):
   ?skriv=1 boots straight into Write with chrome hidden; &verktyg=0 also
   hides the tools row. All display settings (WS) apply as usual. */
(() => {
  const q = new URLSearchParams(location.search);
  if (q.get('skriv')) {
    document.body.classList.add('embed');
    if (q.get('verktyg') === '0') document.body.classList.add('embed-notools');
    // Embed DEFAULTS to the maximal writing surface (list, word alternatives
    // and form row OFF) — saved settings from the normal view do not apply
    // here, since ⚙ is unreachable. Turn things ON in the URL instead:
    // ?skriv=1&lista=1&ordval=1&bojning=1&symbol=30&text=120&avstand=10&linje=60
    // All in memory only — the normal view's saved settings stay untouched.
    WS.list = false; WS.chips = false; WS.chooser = false;
    const b = (k) => q.get(k) === null ? null : q.get(k) !== '0';
    const n = (k) => { const v = parseFloat(q.get(k)); return Number.isFinite(v) ? v : null; };
    if (b('lista') !== null) WS.list = b('lista');
    if (b('ordval') !== null) WS.chips = b('ordval');
    if (b('bojning') !== null) WS.chooser = b('bojning');
    if (n('symbol') !== null) WS.unit = n('symbol');
    if (n('text') !== null) WS.text = n('text');
    if (n('avstand') !== null) WS.gap = n('avstand');
    if (n('linje') !== null) WS.pen = n('linje');
    applyWS();
    setWriting(true);
  } else if (q.get('vy') === 'skriv') {
    // the start page's Skriv card (PeO, 2026-09-25): open IN writing mode but
    // with the normal header — ⌂ Start and the toggles stay reachable. The
    // chrome-free embed remains the skriv.html / MindExpress route.
    setWriting(true);
  }
})();
/* re-wrap the writing page when its box changes (first-layout settle, list
   toggles, window resize) — same fix as the game board 2026-08-26 */
new ResizeObserver(() => {
  if (document.body.classList.contains('writing')) wRenderPreview();
}).observe($('wPreviewWrap'));
renderFamRow();
renderVariantRow();
(async () => {
  let restored = false;
  try {
    await idb.open();
    const st = await idb.get('state');
    if (st && st.a && Array.isArray(st.a.syms) && st.a.syms.length) {
      lists.A.name = st.a.name; lists.A.syms = st.a.syms; lists.A.mod = !!st.a.mod;
      lists.B.name = st.b.name; lists.B.syms = st.b.syms; lists.B.mod = !!st.b.mod;
      restored = true;
      renderListPane('A');
      if (st.ink) { ed.ink = st.ink; $('inkColor').value = st.ink; }
      if (st.bg) ed.bg = st.bg;
      else if (st.transparent === false) ed.bg = st.classBg ? 'class' : 'white';
      else if (st.classBg) ed.bg = 'class';
      syncBgControls();
      if (st.unit) { ed.unit = st.unit; $('expUnit').value = st.unit; }
      if (st.textPlace) { ed.textPlace = st.textPlace; $('expText').value = st.textPlace; }
      if (st.edSym && st.edSym.e) {
        loadIntoEditor(st.edSym, st.srcKey || 'A');
        ed.dirty = !!st.dirty;
        if (st.caption != null) { ed.caption = st.caption; updateCaptionBar(); }
      } else loadIntoEditor(deep(lists.A.syms[0] || { e: [] }), 'A');
    }
  } catch (err) { console.warn('restore failed', err); }
  if (!restored) {
    renderListPane('A');
    loadIntoEditor(deep(lists.A.syms.find(s => s.id === 14164) || { e: [] }), 'A');
  }
  persistReady = true;
  persistSoon();
  if (restored) toast(tr('Session restored', 'Session återställd'));
})();


/* ================= theme ================= */
function applyTheme(mode) {
  if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('wb-theme', mode);
  const s = $('setTheme'); if (s) s.value = mode;
}
$('setTheme').onchange = () => applyTheme($('setTheme').value);
applyTheme(localStorage.getItem('wb-theme') || 'auto');

/* ---- shared $-shortcuts (Håkans blissanvändare, 2026-09-25) — see shortcuts.js.
   Context-aware: the same $C/$S/$O do the writing-mode thing in Skriv and the
   editor thing otherwise. $H stays out of embed mode (Philip's clean surface
   deliberately carries no navigation). ---- */
if (typeof wbShortcuts === 'function') {
  const inWriting = () => document.body.classList.contains('writing');
  wbShortcuts({
    title: () => inWriting() ? 'WinBliss — Skriv' : 'WinBliss — Editera',
    onHelp: () => { if (!$('helpDlg').open) $('helpDlg').showModal(); },
    actions: Object.assign({
      C: { run: () => inWriting() ? $('wClip').click() : $('btnCopyClip').click(),
           desc: () => inWriting() ? tr('copy the text to the clipboard', 'kopiera texten till klippbordet')
                                   : tr('copy the symbol to the clipboard', 'kopiera symbolen till klippbordet') },
      S: { run: () => inWriting() ? $('wSaveDoc').click() : $('btnSaveList').click(),
           desc: () => inWriting() ? tr('save the document', 'spara dokumentet')
                                   : tr('save the list', 'spara listan') },
      O: { run: () => inWriting() ? $('wOpenDoc').click() : $('btnOpen').click(),
           desc: () => inWriting() ? tr('open a document', 'öppna ett dokument')
                                   : tr('open a list', 'öppna en lista') },
    }, document.body.classList.contains('embed') ? {} : {
      H: { run: () => { location.href = 'start.html'; },
           desc: () => tr('to the start page', 'till startsidan') },
    }),
    extra: () => inWriting()
      ? [['# 0–7', tr('form on the word: none/verb/present/past/future/plural/imperative/definite — also inline: "gå #2" → går', 'form på ordet: ingen/verb/presens/dåtid/futurum/plural/uppmaning/bestämd — även i texten: "gå #2" → går')],
         ['Ctrl+S / Ctrl+O', tr('save / open a document', 'spara / öppna dokument')]]
      : [['R', tr('rotate the shape', 'rotera formen')],
         ['D', tr('duplicate', 'duplicera')],
         ['Delete', tr('remove the shape', 'ta bort formen')],
         ['Ctrl+Z', tr('undo', 'ångra')],
         ['?', tr('full help (the ? button)', 'hela hjälpen (?-knappen)')]],
  });
}
