// Bliss rendering engine — JS port of WinBliss Bliss_Common (Elementfuncs.pas et al.)
// Original engine (c) AnyCom AB / P-O Hedvall. Port preserves GDI drawing semantics.
//
// Coordinate model: WinBliss half-units. Full-size shape = 8 units = 1 matrix square.
// g (GridSquareSize) = 100 so the original integer trunc() behaviour matches the
// Pascal code running at pixel scale; SVG viewBox scales the result.

class BlissCanvas {
  constructor() {
    this.g = 100;         // VGridSquareSize
    this.ox = 0;          // OffsetX
    this.oy = 0;          // OffsetY
    this.PA = new Array(41).fill(0);   // PointArray[1..40]
    this.reset();
  }
  reset() { this.segs = []; this.extras = []; }

  // Pascal Lines(Count): pairs of MoveTo/LineTo from PointArray
  lines(count) {
    let i = 1, d = '';
    while (count--) {
      d += `M ${this.PA[i]} ${this.PA[i + 1]} L ${this.PA[i + 2]} ${this.PA[i + 3]} `;
      i += 4;
    }
    this.segs.push(d);
  }

  // GDI Arc: ellipse in rect (l,t)-(r,b), from the radial through (sx,sy)
  // to the radial through (ex,ey), drawn COUNTERCLOCKWISE on screen.
  arc(l, t, r, b, sx, sy, ex, ey) {
    const cx = (l + r) / 2, cy = (t + b) / 2;
    const rx = Math.abs(r - l) / 2, ry = Math.abs(b - t) / 2;
    if (rx < 1e-9 || ry < 1e-9) return;
    // parametric angles, math orientation (y up => negate screen dy)
    const a1 = Math.atan2(-(sy - cy) / ry, (sx - cx) / rx);
    const a2 = Math.atan2(-(ey - cy) / ry, (ex - cx) / rx);
    let delta = a2 - a1;                       // CCW sweep
    while (delta <= 1e-9) delta += 2 * Math.PI; // identical points -> full-ish circle
    const p = (a) => [cx + rx * Math.cos(a), cy - ry * Math.sin(a)];
    if (delta >= 2 * Math.PI - 1e-6) {
      // full ellipse as two arcs
      const [x1, y1] = p(a1);
      const [xm, ym] = p(a1 + Math.PI);
      this.segs.push(`M ${x1} ${y1} A ${rx} ${ry} 0 0 0 ${xm} ${ym} A ${rx} ${ry} 0 0 0 ${x1} ${y1} `);
      return;
    }
    // GDI ends the arc where the radial through (sx,sy)/(ex,ey) crosses the
    // ellipse; WinBliss's start/stop points were *designed* as junctions and
    // the residue was hidden by the 2px pen. Honour the intent: when the given
    // point sits close to the ellipse, use it verbatim as the endpoint so
    // adjoining shapes meet exactly; fall back to the radial intersection
    // when the point is only a direction ray (e.g. far off the ellipse).
    const near = (px, py) => {
      const q = ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2;
      return q > 0.8 && q < 1.25;
    };
    const [x1, y1] = near(sx, sy) ? [sx, sy] : p(a1);
    const [x2, y2] = near(ex, ey) ? [ex, ey] : p(a2);
    const large = delta > Math.PI ? 1 : 0;
    // CCW on screen (y down) = SVG sweep flag 0
    this.segs.push(`M ${x1} ${y1} A ${rx} ${ry} 0 ${large} 0 ${x2} ${y2} `);
  }

  // Pascal DrawPieSlice helper (only the arc part was drawn — no radii lines)
  pieSlice(cx, cy, radius, startDeg, stopDeg) {
    const d2r = (d) => (d * Math.PI) / 180;
    const l = Math.trunc(cx - radius), t = Math.trunc(cy - radius);
    const r = Math.trunc(cx + radius), b = Math.trunc(cy + radius);
    const sx = cx + Math.trunc(radius * Math.cos(d2r(startDeg)));
    const sy = cy - Math.trunc(radius * Math.sin(d2r(startDeg)));
    const ex = cx + Math.trunc(radius * Math.cos(d2r(stopDeg)));
    const ey = cy - Math.trunc(radius * Math.sin(d2r(stopDeg)));
    this.arc(l, t, r, b, sx, sy, ex, ey);
  }

  // stroke-only ellipse in bounding rect
  ellipse(l, t, r, b) {
    const cx = (l + r) / 2, cy = (t + b) / 2;
    const rx = Math.abs(r - l) / 2, ry = Math.abs(b - t) / 2;
    this.extras.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none"/>`);
  }
  // filled ellipse (Y21-25 punctuation dots) — fills with the drawing colour
  ellipseFill(l, t, r, b) {
    const cx = (l + r) / 2, cy = (t + b) / 2;
    const rx = Math.max(Math.abs(r - l) / 2, this.g * 0.28);
    const ry = Math.max(Math.abs(b - t) / 2, this.g * 0.28);
    this.extras.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="bfill" stroke="none"/>`);
  }

  // ElementZ1 — text (Trebuchet MS, baseline at Y + FSize)
  ElementZ1(X, Y, FSize, abc) {
    const size = this.g * FSize * 0.92;
    const tx = X * this.g + this.ox;
    const ty = (Y + FSize) * this.g + this.oy;
    const esc = String(abc).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    this.extras.push(
      `<text x="${tx}" y="${ty}" font-family="'Trebuchet MS',Arial,sans-serif" font-size="${size}" stroke="none" class="bfill">${esc}</text>`);
  }
}

// Mix the transpiled shape procedures into the canvas
Object.assign(BlissCanvas.prototype, BLISS_SHAPES);

// Q1 (dot/point): the Pascal drew a ±1 *pixel* ellipse — a solid dot under the
// 2px raster pen, invisible at vector scale. Faithful vector form: filled dot.
BlissCanvas.prototype.ElementQ1 = function (X, Y, Dir) {
  this.ellipseFill(X * this.g - 1 + this.ox, Y * this.g - 1 + this.oy,
                   X * this.g + 1 + this.ox, Y * this.g + 1 + this.oy);
};

// ---- Refinement (2026, PeO-approved): smoothed heart sides ----
// The faithful port draws B1/E1's side sweeps as GDI circle arcs (r=8u); their
// tangents break ~8° where they meet the top humps. This override keeps every
// endpoint identical but draws the sweeps as cubic curves that leave the humps
// with a vertical tangent (no shoulder kink) and arrive at the bottom point at
// 60° for a crisper tip. DEFAULT OFF (PeO's ruling, 2026-08-22): Bliss curves
// are template geometry — circle arcs you can draw with the 1980 BCI stencil —
// and the Bezier tip reads as a drop shape, not Bliss. Faithful mode matches
// the official BCI exports. The override remains available for experiments.
{
  const origB1 = BLISS_SHAPES.ElementB1;
  const origE1 = BLISS_SHAPES.ElementE1;
  BlissCanvas.prototype.smoothHearts = false;
  BlissCanvas.prototype.ElementB1 = function (X, Y, Dir) {
    if (!this.smoothHearts) return origB1.call(this, X, Y, Dir);
    const g = this.g;
    // left sweep: vertical start tangent at (X, Y+2), 60° arrival at (X+4, Y+8)
    this.segs.push(`M ${X * g} ${(Y + 2) * g} C ${X * g} ${(Y + 5.2) * g} ${(X + 2.9) * g} ${(Y + 6.1) * g} ${(X + 4) * g} ${(Y + 8) * g} `);
    // left hump — unchanged circle arc
    this.arc(X * g, Y * g, (X + 4) * g, (Y + 4) * g, (X + 4) * g, (Y + 2) * g, X * g, (Y + 2) * g);
    this.ElementE1(X + 4, Y, 1);
  };
  BlissCanvas.prototype.ElementE1 = function (X, Y, Dir) {
    if (!this.smoothHearts) return origE1.call(this, X, Y, Dir);
    const g = this.g;
    // right hump — unchanged circle arc
    this.arc(X * g, Y * g, (X + 4) * g, (Y + 4) * g, (X + 4) * g, (Y + 2) * g, X * g, (Y + 2) * g);
    // right sweep: 60° departure from the point, vertical arrival at (X+4, Y+2)
    this.segs.push(`M ${X * g} ${(Y + 8) * g} C ${(X + 1.1) * g} ${(Y + 6.1) * g} ${(X + 4) * g} ${(Y + 5.2) * g} ${(X + 4) * g} ${(Y + 2) * g} `);
  };
}

// Render one parsed .wbs symbol (compact form from bliss-data.js) to SVG markup.
// Element tuple: [type, sub, clock, mirror, x, y, x2, y2, text, radius, zheight]
function renderBliss(sym, opts = {}) {
  const strokeUnits = opts.strokeUnits ?? 0.35;  // line weight in half-units (~1/24 matrix square)
  const c = new BlissCanvas();
  if (opts.smoothHearts === false) c.smoothHearts = false;
  for (const e of sym.e) {
    const [t, sub, clock, , x, y, x2, y2, text, , zheight] = e;
    if (t === 'Z') { c.ElementZ1(x, y, zheight, text); continue; }
    if (t === 'X') { c.PA[1] = x * c.g; c.PA[2] = y * c.g; c.PA[3] = x2 * c.g; c.PA[4] = y2 * c.g; c.lines(1); continue; }
    const fn = c[`Element${t}${sub}`];
    if (typeof fn === 'function') {
      if (t === 'Y' && sub >= 21) fn.call(c, x, y, clock, 'currentColor');
      else fn.call(c, x, y, clock);
    }
  }
  // bounds from generated geometry
  const nums = [];
  const re = /-?\d+(?:\.\d+)?/g;
  for (const s of c.segs) { const m = s.match(re); if (m) nums.push(...m.map(Number)); }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    // crude: alternate x,y works for M/L pairs but arc params pollute; use path bbox later.
  }
  const stroke = strokeUnits * c.g;
  const pathD = c.segs.join('');
  const body =
    (pathD ? `<path d="${pathD}" fill="none"/>` : '') + c.extras.join('');
  return { body, stroke, g: c.g };
}

// Wrap rendered body in an <svg> sized to the symbol's own extent (via DOM bbox).
function blissSVG(sym, opts = {}) {
  const { body, stroke, g } = renderBliss(sym, opts);
  const color = opts.color ?? '#111';
  const pad = stroke;      // breathing room for stroke caps
  const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tmp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
  tmp.innerHTML = `<g>${body}</g>`;
  document.body.appendChild(tmp);
  let bb = { x: 0, y: 0, width: 8 * g, height: 8 * g };
  try { bb = tmp.firstChild.getBBox(); } catch (_) {}
  document.body.removeChild(tmp);
  const vx = bb.x - pad, vy = bb.y - pad;
  const vw = bb.width + 2 * pad, vh = bb.height + 2 * pad;
  // Fixed scale: px per half-unit. Size differences between symbols are
  // semantic in Bliss (MOUTH vs SUN) and must be preserved.
  const scale = (opts.unit ?? 14) / g;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${(vw * scale).toFixed(1)}" height="${(vh * scale).toFixed(1)}"
    viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}"
    stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"
    style="color:${color}">
    <style>.bfill{fill:${color}}</style>${body}</svg>`;
}
