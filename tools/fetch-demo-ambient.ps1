# Regenerate docs/demo/ambient.mp3 (synthetic ambient, ~90s)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not $root) { $root = (Resolve-Path "$PSScriptRoot\..").Path }
$out = Join-Path $root "docs\demo\ambient.mp3"
$ff = node -e "console.log(require('ffmpeg-static'))"
& $ff -y `
  -f lavfi -i "sine=frequency=110:duration=90" `
  -f lavfi -i "sine=frequency=164.81:duration=90" `
  -f lavfi -i "sine=frequency=220:duration=90" `
  -f lavfi -i "anoisesrc=color=brown:duration=90:amplitude=0.006" `
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest,volume=0.12[tones];[tones][3:a]amix=inputs=2:duration=longest,volume=0.85,lowpass=f=800" `
  -c:a libmp3lame -q:a 4 $out
Write-Host "Wrote $out ($((Get-Item $out).Length) bytes)"
