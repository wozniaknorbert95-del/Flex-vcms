# Deploy-VPS.ps1
# Systematyka symlinku zapobiega naruszeniu srodowiska i minimalizuje downtime do 0 sekund.

$ServerIP = "185.243.54.115"
$User = "root"
$BaseDir = "/var/www/vcms"
$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "[1/6] Budowanie aplikacji PWA (VitePress)..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot\..

npm run docs:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Błąd podczas budowania VitePress. Przerwano operację." -ForegroundColor Red
    exit 1
}

Write-Host "[2/6] Tworzenie kapsuły Brains & To-Dos dla Agenta KODA..." -ForegroundColor Cyan
if (Test-Path "deploy-context") { Remove-Item -Recurse -Force "deploy-context" }
New-Item -ItemType Directory -Path "deploy-context" | Out-Null

$GithubDir = "C:\Users\FlexGrafik\FlexGrafik\github"
$FilesToCopy = @(
    "$GithubDir\flexgrafik-nl\brain-zzp.md",
    "$GithubDir\flexgrafik-nl\todo.json",
    "$GithubDir\app.flexgrafik.nl\brain-app.md",
    "$GithubDir\app.flexgrafik.nl\todo.json",
    "$GithubDir\zzpackage.flexgrafik.nl\brain-zzp.md",
    "$GithubDir\zzpackage.flexgrafik.nl\todo.json"
)
foreach ($File in $FilesToCopy) {
    if (Test-Path $File) {
        $Dir = Split-Path $File -Parent
        $DirName = Split-Path $Dir -Leaf
        $TargetDir = "deploy-context\" + $DirName
        if (-not (Test-Path $TargetDir)) { New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null }
        Copy-Item $File -Destination "$TargetDir\" -Force
    } else {
        Write-Host "Ostrzeżenie: Plik $File nie istnieje (Pominięto, KODA nie otrzyma tych danych)." -ForegroundColor Yellow
    }
}

Write-Host "[3/6] Tworzenie lokalnego archiwum (release.tar.gz)..." -ForegroundColor Cyan
if (Test-Path "release.tar.gz") { Remove-Item "release.tar.gz" -Force }

tar.exe -czf release.tar.gz docs package.json server.js ecosystem.config.js .agent/workflows deploy-context
if ($LASTEXITCODE -ne 0) {
    Write-Host "Błąd podczas pakowania tar.gz!" -ForegroundColor Red
    exit 1
}

Write-Host "[4/6] Konfiguracja skryptu instalacyjnego dla Linuksa..." -ForegroundColor Cyan
$BashScript = @"
#!/bin/bash
set -e

STAMP="$Stamp"
RELEASE_DIR="/var/www/vcms/releases/`$STAMP"
BASE_DIR="/var/www/vcms"

echo "-> Tworzenie katalogu dla nowej wersji..."
mkdir -p "$RELEASE_DIR"
rm -rf "$RELEASE_DIR/*"
mkdir -p "$BASE_DIR/logs"

echo "-> Wypakowanie z archiwum..."
tar -xzf "`$BASE_DIR/release.tar.gz" -C "`$RELEASE_DIR"

if [ ! -f "`$RELEASE_DIR/package.json" ]; then
    echo "Blad: Brak package.json po wypakowaniu."
    exit 1
fi

echo "-> Instalacja zaleznosci produkcyjnych..."
cd "`$RELEASE_DIR"
npm install --omit=dev --no-audit --no-fund

echo "-> Przelaczanie symlinku..."
rm -f "`$BASE_DIR/current"
ln -s "`$RELEASE_DIR" "`$BASE_DIR/current"

echo "-> Restartowanie procesu PM2..."
pm2 start "`$BASE_DIR/current/ecosystem.config.js" --update-env || pm2 restart "`$BASE_DIR/current/ecosystem.config.js" --update-env

echo "-> Czyszczenie starych plikow..."
find "`$BASE_DIR/releases" -maxdepth 1 -name "20260403_*" -type d ! -path "`$RELEASE_DIR" -exec rm -rf {} +
rm -f "`$BASE_DIR/release.tar.gz"
rm -f "`$BASE_DIR/deploy-script.sh"

echo "-> Testowanie backendu uslugi / zdrowotnosci portu 8001..."
sleep 2
if curl -s -I http://127.0.0.1:8001 > /dev/null; then
    echo "-> Sukces! Usluga na 127.0.0.1:8001 odpowiada bezblednie."
else
    echo "Blad Krytyczny: PM2 proces jest wlaczony, lecz wezel nie zwraca kodu pomyslnego na port."
    exit 1
fi
"@

# Podsystem uniksowy zmusza do LF; naprawa EOF z CR/LF na LF
[IO.File]::WriteAllText("deploy-script.sh", $BashScript.Replace("`r`n", "`n"))

Write-Host "[5/6] Wrzucanie archiwum .tar.gz oraz logiki instalacyjnej via SCP..." -ForegroundColor Cyan
scp .\release.tar.gz ${User}@${ServerIP}:${BaseDir}/release.tar.gz
scp .\deploy-script.sh ${User}@${ServerIP}:${BaseDir}/deploy-script.sh

Write-Host "[6/6] Rozpoczynanie cyklu skryptu po stronie serwera..." -ForegroundColor Cyan
ssh ${User}@${ServerIP} "bash ${BaseDir}/deploy-script.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Zdalny skrypt napotkał błędy operacyjne podczas instalacji/restartu!" -ForegroundColor Red
    exit 1
}

Write-Host "[7/7] Sprzątanie plików tymczasowych na stacji lokalnej..." -ForegroundColor Cyan
Remove-Item .\release.tar.gz -Force
Remove-Item .\deploy-script.sh -Force
if (Test-Path "deploy-context") { Remove-Item -Recurse -Force "deploy-context" }

Write-Host ""
Write-Host "PM2 VCMS-Core zaktualizowano. System PWA podpięty pod Nginx (Reverse Proxy) na łączach gniazda poprawnie." -ForegroundColor Green
Write-Host "UWAGA: W razie potrzeby natychmiastowego zrzutu wersji awaryjnej użyj: .\scripts\Deploy-Rollback.ps1" -ForegroundColor Yellow
