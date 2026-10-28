# Checks the PWA in a clean, headless Microsoft Edge: service worker, cache,
# every part online and with the network gone. tools/serve.ps1 must be running.
#   powershell -ExecutionPolicy Bypass -File tools\check-pwa.ps1
param([int]$Port = 8765, [int]$Seconds = 25)
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
          "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge was not found.' }
$report = Join-Path $PSScriptRoot 'last-pwa-check.json'
if (Test-Path $report) { Remove-Item $report -Confirm:$false }
$userDir = Join-Path $env:TEMP ('blissverktyget-pwa-check-' + [guid]::NewGuid().ToString('N'))
$p = Start-Process $edge -PassThru -ArgumentList @('--headless=new', '--disable-gpu', '--no-first-run',
  "--user-data-dir=$userDir", '--remote-debugging-port=0', "http://localhost:$Port/tools/pwa-check.html")
$t = 0
while (-not (Test-Path $report) -and $t -lt $Seconds) { Start-Sleep -Seconds 1; $t++ }
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
# only the Edge processes this check started (they carry its profile folder)
Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | Where-Object { $_.CommandLine -like "*$userDir*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 1
Remove-Item $userDir -Recurse -Force -Confirm:$false -ErrorAction SilentlyContinue
if (Test-Path $report) { Get-Content $report -Raw -Encoding UTF8 } else { "No report within $Seconds s - is tools\serve.ps1 running on port $Port?" }
