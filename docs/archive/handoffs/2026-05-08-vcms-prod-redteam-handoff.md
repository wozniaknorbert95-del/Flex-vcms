---
status: "[DONE]"
title: "2026-05-08 — Sesja Senior Agency: Red Team Review VCMS prod"
session: "Profesjonalny audyt VCMS prod (read-only)"
---

## SESSIONANCHOR

- **PROJECT**: flex-vcms
- **PHASE**: 4
- **MODULE**: flex-vcms
- **WORKSPACE_ROOT**: `C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms`
- **BRANCH**: `feat/audit-3.0-knowledge-index`
- **HEAD na start**: `2ffbb86`
- **HEAD na koniec**: `<commit po tej sesji>` (chore commit + audit + backlog)
- **CONFLICTS**: 0 (nie regenerowano w tej sesji — audyt read-only)
- **TRYB**: Senior Agency, 1-1-1, read-only first (Zasada 11 zachowana — zero zmian na VPS)

## CO ZROBIONE

### 1) Porządek pre-audyt
- 3 zsynchronizowane pliki niescommitowane → 1 chore commit `5f68c04`
- Pre-flight SSH probe na `root@185.243.54.115` → OK, system Ubuntu 6.8.0

### 2) Recon lokalny (kod repo)
Przeczytane i przeanalizowane:
- `docs/reference/VCMS-nginx-live.conf` (nginx prod config)
- `ecosystem.config.js` (PM2)
- `server.js` + `src/middleware/guards.js` + `src/middleware/logger.js` + `src/routes/api.js` + `src/config/env.js`
- `package.json` + `npm audit --omit=dev --json`

### 3) Recon zdalny (VPS przez SSH, read-only)
- `pm2 status` + `pm2 logs vcms-core --lines 100`
- `ss -tlnp` (porty)
- `ufw status verbose` + `iptables -L INPUT`
- `systemctl is-active fail2ban` (= `inactive` 🔴)
- `nginx -t` + `nginx -T` + `sites-enabled/{vcms,jadzia}`
- `certbot certificates` + `certbot renew --dry-run` (= success ✅)
- Logrotate (`/etc/logrotate.d/nginx`) + log sizes + winston rotation check
- Port 8000 owner = `python /root/jadzia/venv/...` (FastAPI Jadzia)
- `pm2 conf pm2-logrotate` (= moduł nieinstalowany 🟡)

### 4) Smoke HTTPS end-to-end
- **Zewnętrzny** (laptop → internet → nginx):
  - `https://cmd.flexgrafik.nl/` → 401 (basic-auth) ✅
  - `http://cmd.flexgrafik.nl/` → 301 ✅
  - `http://185.243.54.115/` → 401 (basic-auth) ✅
  - **GAP**: response 401 nie zawiera HSTS/XFO/CSP (helmet jest na Express, nie nginx)
- **Wewnętrzny** (VPS → 127.0.0.1:8001):
  - `/health`, `/api/v1/status`, `/api/v1/backlog`, `/api/v1/ecosystem/status` → 200, helmet headers PASS
  - `/deploy-context/manifest.json` → 403 ✅
  - `/api/v1/scan` POST × 3 → 200 (heavy operacja, rate-limit 200/15min za luźny 🔴)
  - `/api/v1/ecosystem/status` leakuje Windows paths z `repos.yaml` 🔴

### 5) Raport + backlog + handoff
- **Raport**: `docs/audits/2026-05-08-vcms-prod-redteam.md` (375+ linii, 14 findings F1-F14, 16 goods G1-G16, 7 verify commands, sugerowany podział na 3 sesje napraw)
- **Backlog**: dodano `PH4-016` (parent + 3 subtasks A/B/C) + `PH4-017` (real device follow-up). `meta.next` zmienione z PH4-011 (sprzeczność DONE/next) na PH4-016-A.
- **Handoff**: ten plik.

## STAN PRODUKCJI (post-audyt)

| Komponent | Stan | Komentarz |
|-----------|------|-----------|
| TLS Let's Encrypt | ✅ valid 89 dni | Auto-renewal dry-run = success |
| HTTP→HTTPS 301 | ✅ działa | |
| Basic Auth (nginx) | ✅ działa | F4: brak HSTS na 401 |
| PM2 vcms-core | ✅ online | F8: ↺=12, brak min_uptime |
| Fail2ban | 🔴 inactive | **F1 P0** — krytyczny |
| Express helmet | ✅ porządne CSP | F12: 'unsafe-inline' świadome |
| Rate limit /api/v1/scan | 🔴 200/15min | **F3 P0** — DoS-able |
| /api/v1/ecosystem/status | 🔴 leak Win paths | **F2 P0** |
| pm2-logrotate | 🟡 nieinstalowany | F6 |
| npm audit | 🟡 2 moderate | F10: ip-address XSS via express-rate-limit |
| Smoke HTTPS | ✅ PASS | |

## NEXT

### Rank 1 — PH4-016-A (Sesja A: Ops/Infra)
**Zadania (manual deploy SSH na VPS, Zasada 11)**:
1. F1 — Install fail2ban + jail.local (sshd + nginx-http-auth)
2. F4 — Dodaj security headers (HSTS, XFO, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) do obu server blocks w `/etc/nginx/sites-enabled/vcms` (z flagą `always`)
3. F6 — `pm2 install pm2-logrotate` + konfiguracja
4. F7 — odkomentuj `server_tokens off;` w `/etc/nginx/nginx.conf`
5. F13 — `ssl_protocols TLSv1.2 TLSv1.3;` w `nginx.conf`
6. F14 — usuń `listen 8010;` z VCMS-nginx-live.conf + sync na prod

**Effort**: ~1.5h. **Sesja**: nowa, `/blast` przed zmianami.

### Rank 2 (parallel, nie blokuje) — PH4-017
Realny telefon na 4G/5G → `docs/handoffs/2026-05-08-ph4-011-mobile-real.md` (z `tmpl-ph4-011-mobile.md`).

## BLOCKER

**Brak twardych blockerów**.

Miękkie:
- Cross-module finding: port 8000 (Jadzia FastAPI) jest publicznie otwarty bez TLS na bare IP. **Eskalacja do osobnej sesji** dla modułu `jadzia-core` (poza scope VCMS).
- Hosts-file workaround dla DNS Google nadal aktywny — nie blokuje, ale falszuje testy mobile z domowego Wi-Fi.

## Komendy weryfikacyjne (do nastepnej sesji)

```powershell
# 1. Cert renew (już zrobione, dla powtórzenia po Sesji A)
ssh root@185.243.54.115 "certbot renew --dry-run 2>&1 | tail -5"

# 2. Headers po fix nginx (F4)
curl.exe -sS -I https://cmd.flexgrafik.nl/ | findstr /I "strict-transport x-frame x-content referrer permissions"

# 3. Fail2ban po Sesji A (F1)
ssh root@185.243.54.115 "fail2ban-client status sshd; fail2ban-client status nginx-http-auth"

# 4. Server header po F7
curl.exe -sS -I https://cmd.flexgrafik.nl/ | findstr /I "server"

# 5. Pełny re-audit smoke
node tools/vcms-scan.js  # lokalnie, Conflicts: 0 expected
```

## Linki

- **Raport pełny**: [docs/audits/2026-05-08-vcms-prod-redteam.md](../audits/2026-05-08-vcms-prod-redteam.md)
- **Backlog**: [flex-vcms-todo.json](../../flex-vcms-todo.json) (PH4-016, PH4-017)
- **Poprzedni handoff**: [2026-05-08-session-final-handoff.md](2026-05-08-session-final-handoff.md)
- **Boot doc**: [docs/agents/boot-senior-agency.md](../agents/boot-senior-agency.md)
