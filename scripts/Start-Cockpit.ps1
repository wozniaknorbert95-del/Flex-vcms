Set-Location -Path "$PSScriptRoot\.."
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing..." -ForegroundColor Cyan
    npm install
}
Write-Host "ZAPALAM SILNIK VCMS... (COCKPIT IGNITION)" -ForegroundColor Magenta
Write-Host "Otwieram przegladarke na http://localhost:5173..." -ForegroundColor Green
Start-Process "http://localhost:5173"
npm run docs:dev
