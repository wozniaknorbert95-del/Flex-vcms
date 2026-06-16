#!/bin/bash
# VCMS TLS Activation Script
# Uruchom NA VPS po dodaniu DNS A record w Cyber-Folks:
#   bash /root/enable-tls-cmd.sh
set -e

DOMAIN="cmd.flexgrafik.nl"
IP="185.243.54.115"

echo "=== [1/4] DNS Check ==="
RESOLVED=$(nslookup "$DOMAIN" 8.8.8.8 | grep "Address:" | tail -1 | awk '{print $2}')
if [ "$RESOLVED" != "$IP" ]; then
  echo "FAIL: DNS nie wskazuje na $IP (resolved: '$RESOLVED')"
  echo "Dodaj A record w Cyber-Folks: cmd.flexgrafik.nl -> $IP i poczekaj na propagacje (TTL 3600 = maks 1h)."
  exit 1
fi
echo "OK: $DOMAIN -> $RESOLVED"

echo "=== [2/4] Certbot (Let's Encrypt) ==="
certbot --nginx -d "$DOMAIN" --register-unsafely-without-email --non-interactive --agree-tos

echo "=== [3/4] Nginx reload ==="
nginx -t && systemctl reload nginx
echo "NGINX_OK"

echo "=== [4/4] Smoke HTTPS ==="
sleep 3
HEALTH=$(curl -sk "https://$DOMAIN/health" 2>/dev/null || echo "unreachable")
echo "health response: $HEALTH"

echo ""
echo "=== TLS ACTIVATION DONE ==="
echo "URL: https://$DOMAIN"
echo "Basic Auth user: dowodca"
echo "Wykonaj smoke checklist: docs/checklists/vcms-prod-smoke.md"
echo "Zapisz wynik w: docs/handoffs/2026-05-08-tls-smoke-ph4-011.md"
