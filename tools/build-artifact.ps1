# Builds the claude.ai artifact version of Bildspel from workbench\bildspel.html
# into dist\artifact\bildspel.html (not committed).
#   powershell -ExecutionPolicy Bypass -File tools\build-artifact.ps1
# The artifact publish step wraps its own doctype/html/head/body skeleton, so
# those tags go; app-only links (manifest, icons, pwa.js) go too, and the shared
# stylesheet is inlined. Publish the page with these files beside it, at the
# same relative paths as in workbench\:
#   js/shared/lang.js  js/shared/wbs.js  js/shared/shortcuts.js
#   js/engine/bliss-shapes.js  js/engine/bliss-engine.js
#   js/data/bliss-data.js  js/data/glosses.js
$app = Join-Path $PSScriptRoot '..\workbench'
$src = Join-Path $app 'bildspel.html'
$out = Join-Path $PSScriptRoot '..\dist\artifact\bildspel.html'
New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null
$utf8 = [Text.UTF8Encoding]::new($false)
$t = [IO.File]::ReadAllText($src, $utf8)
if ($t.Length -lt 1000) { throw "short read of $src" }
$css = [IO.File]::ReadAllText((Join-Path $app 'css\wb-base.css'), $utf8)
$t = $t -replace '(?m)^<!DOCTYPE html>\r?\n', '' `
        -replace '(?m)^<html lang="sv">\r?\n', '' `
        -replace '(?m)^</?head>\r?\n', '' `
        -replace '(?m)^<meta charset="utf-8">\r?\n', '' `
        -replace '(?m)^<meta name="viewport"[^>]*>\r?\n', '' `
        -replace '(?m)^<link rel="(manifest|icon|apple-touch-icon)"[^>]*>\r?\n', '' `
        -replace '(?m)^<meta name="theme-color"[^>]*>\r?\n', '' `
        -replace '(?m)^<script src="js/shared/pwa\.js"></script>\r?\n', '' `
        -replace '(?m)^</?body>\r?\n?', '' `
        -replace '(?m)^</html>\r?\n?', '' `
        -replace '<title>[^<]*</title>', "<title>WinBliss$([char]0xB2) Bildspel</title>"
$t = $t.Replace('<link rel="stylesheet" href="css/wb-base.css">', "<style>`n$css</style>")
[IO.File]::WriteAllText($out, $t, $utf8)
"wrote $out ($((Get-Item $out).Length) bytes)"
Select-String -Path $out -Pattern '<!DOCTYPE|<html|<head>|<body>|</body>|</html>|manifest\.webmanifest|pwa\.js|wb-base\.css' |
  ForEach-Object { "LEFTOVER: $($_.Line)" }
