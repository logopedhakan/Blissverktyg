# Local test server for WinBliss2 — no Python or Node needed.
#   powershell -ExecutionPolicy Bypass -File tools\serve.ps1
# then open http://localhost:8765/  (service workers need http://localhost or https,
# never file://, so the PWA can only be tested this way or on GitHub Pages).
param([string]$Root = (Join-Path $PSScriptRoot '..\workbench'), [int]$Port = 8765)
$Root = [IO.Path]::GetFullPath($Root)
$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "WinBliss2 serves $Root on http://localhost:$Port/  (Ctrl+C stops)"
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json'; '.webmanifest' = 'application/manifest+json'
  '.png' = 'image/png'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'; '.woff2' = 'font/woff2'
}
$Tools = [IO.Path]::GetFullPath($PSScriptRoot)
$script:offline = $false
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
  # tools/make-icons.html saves the icons it draws: POST /__save/icons/<name>.png|svg
  if ($c.Request.HttpMethod -eq 'POST' -and $p -match '^__save/(icons/[\w.-]+\.(png|svg))$') {
    $ms = [IO.MemoryStream]::new(); $c.Request.InputStream.CopyTo($ms)
    [IO.File]::WriteAllBytes((Join-Path $Root $Matches[1]), $ms.ToArray())
    Write-Host "saved $($Matches[1]) ($($ms.Length) bytes)"
    $c.Response.Close(); continue
  }
  # pretend the network is gone (for tools/pwa-check.html): POST /__offline/on|off;
  # while on, every app request has its connection dropped = a real network error
  if ($c.Request.HttpMethod -eq 'POST' -and $p -match '^__offline/(on|off)$') {
    $script:offline = $Matches[1] -eq 'on'; Write-Host "offline: $script:offline"
    $c.Response.Close(); continue
  }
  if ($script:offline -and $p -notlike '__*' -and $p -notlike 'tools/*') { $c.Response.Abort(); continue }
  # tools/pwa-check.html reports its result: POST /__report -> tools/last-pwa-check.json
  if ($c.Request.HttpMethod -eq 'POST' -and $p -eq '__report') {
    $ms = [IO.MemoryStream]::new(); $c.Request.InputStream.CopyTo($ms)
    [IO.File]::WriteAllBytes((Join-Path $Tools 'last-pwa-check.json'), $ms.ToArray())
    Write-Host "pwa-check report saved"
    $c.Response.Close(); continue
  }
  if (-not $p) { $p = 'index.html' }
  # /tools/* is served from this folder (dev pages, never deployed)
  if ($p -like 'tools/*') { $base = $Tools; $p = $p.Substring(6) } else { $base = $Root }
  $f = [IO.Path]::GetFullPath((Join-Path $base $p))
  if ($f.StartsWith($base) -and (Test-Path $f -PathType Leaf)) {
    $b = [IO.File]::ReadAllBytes($f)
    $t = $types[[IO.Path]::GetExtension($f).ToLower()]; if (-not $t) { $t = 'application/octet-stream' }
    $c.Response.ContentType = $t
    $c.Response.Headers.Add('Cache-Control', 'no-cache')
    $c.Response.ContentLength64 = $b.Length
    if ($c.Request.HttpMethod -ne 'HEAD') { $c.Response.OutputStream.Write($b, 0, $b.Length) }
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
