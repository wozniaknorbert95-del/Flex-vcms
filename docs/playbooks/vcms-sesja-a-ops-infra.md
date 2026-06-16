---
status: "[DONE — verified 2026-06-16]"
title: "Sesja A — Ops/Infra: fail2ban + nginx security headers + pm2-logrotate"
date: "2026-05-11"
verified: "2026-06-16"
findings: "F1, F4, F6, F7, F13, F14"
audit_source: "docs/audits/2026-05-08-vcms-prod-redteam.md"
deploy_type: "manual SSH lub scripts/Invoke-PH4-016-SessionA.ps1"
estimated_effort: "~20 minut"
---

# Sesja A — VPS Ops/Infra

> **Status 2026-06-16:** Sesja A **już wdrożona i zweryfikowana** na VPS.  
> Szybka weryfikacja: `.\scripts\Invoke-PH4-016-SessionA.ps1 -SshTarget root@185.243.54.115 -VerifyOnly`  
> Pełny plan zamknięcia: [PH4-016-SESSION-A-PLAN.md](../plans/PH4-016-SESSION-A-PLAN.md)

Wykonujesz **ręcznie na VPS** (`ssh root@185.243.54.115`) **tylko gdy trzeba re-apply** po regresji.
Alternatywa: `.\scripts\Invoke-PH4-016-SessionA.ps1 -SshTarget root@185.243.54.115` (idempotentny skrypt).

Kolejność: 1→2→3→4 (każdy krok niezależny, ale wykonaj wszystkie).

---

## Krok 1 — fail2ban (F1 — P0)

```bash
# Zainstaluj i skonfiguruj fail2ban
apt install -y fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd

[sshd]
enabled = true

[nginx-http-auth]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/error.log
EOF

systemctl enable --now fail2ban

# Weryfikacja (powinno być active + jaile widoczne)
systemctl is-active fail2ban
fail2ban-client status
fail2ban-client status sshd
fail2ban-client status nginx-http-auth
```

**PASS jeśli**: `systemctl is-active fail2ban` = `active`, obie jaile widoczne w statusie.

---

## Krok 2 — nginx: security headers + server_tokens + TLS + usuń listen 8010 (F4, F7, F13, F14)

```bash
# 2a. Zastąp VCMS nginx site nową wersją (skopiuj z repo po Deploy-VPS.ps1)
# Plik jest już w repo: docs/reference/VCMS-nginx-live.conf
# Po deployu znajdzie się w: /var/www/vcms/current/docs/reference/VCMS-nginx-live.conf
cp /var/www/vcms/current/docs/reference/VCMS-nginx-live.conf /etc/nginx/sites-enabled/vcms

# 2b. nginx.conf: server_tokens off + TLS 1.2+ tylko
# Edytuj /etc/nginx/nginx.conf i zmień dwie linie w bloku http {}:
sed -i 's/# server_tokens off;/server_tokens off;/' /etc/nginx/nginx.conf
sed -i 's/ssl_protocols TLSv1 TLSv1\.1 TLSv1\.2 TLSv1\.3;/ssl_protocols TLSv1.2 TLSv1.3;/' /etc/nginx/nginx.conf

# Zweryfikuj że sed zadziałał
grep 'server_tokens\|ssl_protocols' /etc/nginx/nginx.conf

# 2c. Test konfiguracji
nginx -t

# 2d. Reload (zero-downtime)
nginx -s reload

# Weryfikacja headers (powinny pojawić się w 401)
curl -sS -I http://127.0.0.1/ | grep -iE "strict-transport|x-frame|x-content|referrer|permissions"
```

**PASS jeśli**: `nginx -t` = OK, curl pokazuje ≥3 security headers.

> **Uwaga**: `Strict-Transport-Security` pojawi się tylko w bloku HTTPS (serwer 1).
> Blok IP-direct (serwer 3) nie ma HSTS celowo — HTTP nie może ustawić HSTS.

---

## Krok 3 — pm2-logrotate (F6)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD

# Weryfikacja
pm2 conf pm2-logrotate
```

**PASS jeśli**: `pm2 conf pm2-logrotate` pokazuje skonfigurowane wartości (max_size, retain, compress).

---

## Krok 4 — Szybka weryfikacja całości

```bash
echo "=== fail2ban ==="
fail2ban-client status

echo "=== nginx headers (zewnetrzny przez localhost) ==="
curl -sS -I https://cmd.flexgrafik.nl/ 2>/dev/null | grep -iE "strict-transport|x-frame|x-content|server:"

echo "=== server_tokens ==="
nginx -T 2>/dev/null | grep server_tokens

echo "=== ssl_protocols ==="
nginx -T 2>/dev/null | grep ssl_protocols | head -3

echo "=== pm2-logrotate ==="
pm2 conf pm2-logrotate | head -10
```

---

## Po Sesji A — uruchom z laptopa

```powershell
# Weryfikacja headers z zewnątrz
curl.exe -sS -I https://cmd.flexgrafik.nl/ | Select-String "strict-transport|x-frame|x-content|server:"
```

**PASS**: `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options` widoczne nawet bez logowania.

---

## NEXT po Sesji A

Uruchom `Deploy-VPS.ps1` z laptopa (deploy kodu z Sesji B — zmiany w `src/`) a następnie sprawdź raport `docs/audits/2026-05-08-vcms-prod-redteam.md` sekcja 7 (komendy weryfikacyjne dla F2, F3, F5, F9).
