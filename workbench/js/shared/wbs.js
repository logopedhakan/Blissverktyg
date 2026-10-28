/* WinBliss² — the .wbs list format, read and written the same way by every
   part (editor, Gissa, Gravyrkort, Bildspel). One line per symbol:
     id$gloss$wordclass$kind$element&element&…%£
   and each element  type#sub#clock#mirror#x#y#x2#y2#text#radius#zheight*
   Element array form: [type, sub, clock, mirror, x, y, x2, y2, text, radius, zheight] */
'use strict';
function writeElementRec(e) {
  return [e[0], e[1], e[2], e[3] ? 1 : 0, e[4], e[5], e[6], e[7], e[8], e[9], e[10]].join('#') + '*';
}
function writeSymbolLine(s) {
  return `${s.id}$${s.n}$${s.c}$${s.k || 'SWE'}$` + s.e.map(writeElementRec).join('&') + '%£';
}
function parseWbsText(text) {
  const out = [];
  for (let line of text.split(/\r?\n/)) {
    line = line.trim().replace(/£$/, '');
    if (!line || !line.includes('$')) continue;
    const i1 = line.indexOf('$'), i2 = line.indexOf('$', i1 + 1),
          i3 = line.indexOf('$', i2 + 1), i4 = line.indexOf('$', i3 + 1);
    if (i4 < 0) continue;
    const body = line.slice(i4 + 1).replace(/%$/, '');
    const e = [];
    for (let rec of body.split('&')) {
      rec = rec.replace(/\*$/, '');
      if (!rec) continue;
      const f = rec.split('#');
      if (f.length < 11) continue;
      e.push([f[0], +f[1] || 0, +f[2] || 0, f[3] === '1' ? 1 : 0, +f[4] || 0, +f[5] || 0,
              +f[6] || 0, +f[7] || 0, f[8], +f[9] || 0, +f[10] || 0]);
    }
    out.push({ id: +line.slice(0, i1), n: line.slice(i1 + 1, i2),
               c: line.slice(i2 + 1, i3), k: line.slice(i3 + 1, i4), e });
  }
  return out;
}
/* Latin-1 when every character fits (what old WinBliss writes), else UTF-16LE with BOM */
function encodeWbs(symbols) {
  const text = symbols.map(writeSymbolLine).join('\r\n') + '\r\n';
  let latin1Ok = true;
  for (const ch of text) if (ch.codePointAt(0) > 255) { latin1Ok = false; break; }
  if (latin1Ok) {
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
    return bytes;
  }
  const bytes = new Uint8Array(2 + text.length * 2);
  bytes[0] = 0xFF; bytes[1] = 0xFE;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    bytes[2 + 2 * i] = c & 0xFF; bytes[3 + 2 * i] = c >> 8;
  }
  return bytes;
}
function decodeWbsBuffer(buf) {
  const b = new Uint8Array(buf);
  if (b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder('utf-16le').decode(b.subarray(2));
  return new TextDecoder('iso-8859-1').decode(b);
}
