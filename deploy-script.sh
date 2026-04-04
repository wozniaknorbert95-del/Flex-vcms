#!/bin/bash
set -e

STAMP="20260404_072021"
RELEASE_DIR="/var/www/vcms/releases/$STAMP"
BASE_DIR="/var/www/vcms"

echo "-> Tworzenie katalogu dla nowej wersji..."
mkdir -p ""
rm -rf "/*"
mkdir -p "/logs"

echo "-> Wypakowanie z archiwum..."
tar -xzf "$BASE_DIR/release.tar.gz" -C "$RELEASE_DIR"

if [ ! -f "$RELEASE_DIR/package.json" ]; then
    echo "Blad: Brak package.json po wypakowaniu."
    exit 1
fi

echo "-> Instalacja zaleznosci produkcyjnych..."
cd "$RELEASE_DIR"
npm install --omit=dev --no-audit --no-fund

echo "-> Przelaczanie symlinku..."
rm -f "$BASE_DIR/current"
ln -s "$RELEASE_DIR" "$BASE_DIR/current"

echo "-> Restartowanie procesu PM2..."
pm2 start "$BASE_DIR/current/ecosystem.config.js" --update-env || pm2 restart "$BASE_DIR/current/ecosystem.config.js" --update-env

echo "-> Czyszczenie starych plikow..."
find "$BASE_DIR/releases" -maxdepth 1 -name "20260403_*" -type d ! -path "$RELEASE_DIR" -exec rm -rf {} +
rm -f "$BASE_DIR/release.tar.gz"
rm -f "$BASE_DIR/deploy-script.sh"

echo "-> Testowanie backendu uslugi / zdrowotnosci portu 8001..."
sleep 2
if curl -s -I http://127.0.0.1:8001 > /dev/null; then
    echo "-> Sukces! Usluga na 127.0.0.1:8001 odpowiada bezblednie."
else
    echo "Blad Krytyczny: PM2 proces jest wlaczony, lecz wezel nie zwraca kodu pomyslnego na port."
    exit 1
fi