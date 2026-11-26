// The outlines of characters in a font, for tools/blissonline-glyfer.js (macOS: CoreText).
//   swiftc -O tools/typsnitt-konturer.swift -o /tmp/typsnitt-konturer
//   /tmp/typsnitt-konturer ArialMT "ABC…" > arial.json
// Prints { name, glyphs: { ch: [[[x, y], …], …] }, adv } at size 1000, y up; curves flattened.
import Foundation
import CoreText
import CoreGraphics
let args = CommandLine.arguments
let font = CTFontCreateWithName(args[1] as CFString, 1000, nil)
var out: [String: [[[Double]]]] = [:]
var adv: [String: Double] = [:]
for ch in args[2] {
  let s = String(ch)
  var u = Array(s.utf16)
  var g = [CGGlyph](repeating: 0, count: u.count)
  guard CTFontGetGlyphsForCharacters(font, &u, &g, u.count), g[0] != 0 else { continue }
  var a = CGSize.zero
  CTFontGetAdvancesForGlyphs(font, .horizontal, &g, &a, 1)
  adv[s] = Double(a.width)
  guard let path = CTFontCreatePathForGlyph(font, g[0], nil) else { out[s] = []; continue }
  var subs: [[[Double]]] = []
  var cur: [[Double]] = []
  var last = CGPoint.zero, start = CGPoint.zero
  path.applyWithBlock { el in
    let e = el.pointee
    func add(_ p: CGPoint) { cur.append([Double(p.x), Double(p.y)]) }
    switch e.type {
    case .moveToPoint: if !cur.isEmpty { subs.append(cur) }; cur = []; last = e.points[0]; start = last; add(last)
    case .addLineToPoint: last = e.points[0]; add(last)
    case .addQuadCurveToPoint:
      let c = e.points[0], p = e.points[1]
      for k in 1...8 { let t = CGFloat(k) / 8, u = 1 - t
        add(CGPoint(x: u*u*last.x + 2*u*t*c.x + t*t*p.x, y: u*u*last.y + 2*u*t*c.y + t*t*p.y)) }
      last = p
    case .addCurveToPoint:
      let c1 = e.points[0], c2 = e.points[1], p = e.points[2]
      for k in 1...8 { let t = CGFloat(k) / 8, u = 1 - t
        add(CGPoint(x: u*u*u*last.x + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*p.x, y: u*u*u*last.y + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*p.y)) }
      last = p
    case .closeSubpath: add(start); last = start
    @unknown default: break
    }
  }
  if !cur.isEmpty { subs.append(cur) }
  out[s] = subs
}
let data = try! JSONSerialization.data(withJSONObject: ["name": CTFontCopyPostScriptName(font) as String, "glyphs": out, "adv": adv])
print(String(data: data, encoding: .utf8)!)
