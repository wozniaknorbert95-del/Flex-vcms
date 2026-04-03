# Deploy-VPS.ps1
# Systematyka symlinku zapobiega naruszeniu srodowiska i minimalizuje downtime do 0 sekund.

$ServerIP = "185.243.54.115"
$User = "root"
$BaseDir = "/var/www/vcms"
$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ReleaseDir = "$BaseDir/releases/$Stamp"

Write-Host "[1/5] Budowanie aplikacji PWA (VitePress)..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot\..
npm run docs:build

Write-Host "[2/5] Wytwarzanie instancji serwerowej na VPS..." -ForegroundColor Cyan
ssh ${User}@${ServerIP} "mkdir -p $ReleaseDir/docs/.vitepress && mkdir -p $BaseDir/logs"

Write-Host "[3/5] Klonowanie pakietu (SCP)..." -ForegroundColor Cyan
scp -r .\docs\.vitepress\dist ${User}@${ServerIP}:${ReleaseDir}/docs/.vitepress/
scp .\server.js ${User}@${ServerIP}:${ReleaseDir}/
scp .\ecosystem.config.js ${User}@${ServerIP}:${ReleaseDir}/
scp .\package.json ${User}@${ServerIP}:${ReleaseDir}/

Write-Host "[4/5] Instalacja Modulow i Skierowanie PM2 na Symlink ($Stamp)..." -ForegroundColor Cyan
$Command = @"
cd $ReleaseDir && npm install --production --no-audit --no-fund &&
rm -f $BaseDir/current &&
ln -s $ReleaseDir $BaseDir/current &&
pm2 restart vcms-core || pm2 start $BaseDir/current/ecosystem.config.js
"@

ssh ${User}@${ServerIP} $Command

Write-Host "[5/5] PM2 Uslugi przeladowane. System Online." -ForegroundColor Green
Write-Host "UWAGA: Jesli system zachowuje sie zle, wpisz: .\scripts\Deploy-Rollback.ps1" -ForegroundColor Yellow
