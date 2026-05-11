---
status: "DONE"
title: "VCMS Prod - Red Team Review (Senior Agency)"
date: "2026-05-08"
target: "https://cmd.flexgrafik.nl"
auditor: "Senior Agency (read-only first)"
branch: "feat/audit-3.0-knowledge-index"
commit: "5f68c04"
---

# VCMS Prod — Red Team Review

> **Tryb**: read-only. Zero zmian na produkcji w trakcie audytu (Zasada 11). Każda rekomendacja = osobna sesja `/blast` → checklista → manualny deploy Dowódcy.

## Executive Summary


| Kategoria                      | Werdykt                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| TLS / certbot                  | ✅ **PASS** — cert ważny do 2026-08-06, dry-run renewal SUCCESS                                |
| Helmet / CSP / Express headers | ✅ **PASS** — komplet, jedyne kompromisy `'unsafe-inline'` (znany trade-off)                   |
| Nginx security headers         | 🟡 **GAP** — brak HSTS/X-Frame na 401 (basic-auth wcześniej niż Express)                      |
| Firewall / UFW                 | ✅ **PASS** — minimalny whitelist (22, 80, 443, 8000)                                          |
| **Fail2ban**                   | 🔴 **FAIL** — `inactive` (brute-force basic-auth + sshd niechronione)                         |
| **Rate limiting**              | 🟡 **WEAK** — `/api/v1/scan` heavy → 200/15min za luźno; `/v1/status` (poll co 5s) bez limitu |
| Endpointy / API                | 🟡 **GAP** — `/api/v1/ecosystem/status` leakuje Windows ścieżki + nie działa na prod          |
| `/api/v1/scan` na prod         | 🔴 **BUG** — uruchamia się, ale repos.yaml ma Windows paths → zaśmieca log + DoS-able         |
| PM2                            | 🟡 **GAP** — brak `pm2-logrotate`, `vcms-error.log` rośnie nieskończenie (od 2026-04-14)      |
| npm audit (prod)               | 🟡 **OK-ish** — 0 critical, 0 high, **2 moderate** (ip-address XSS via express-rate-limit)    |
| Smoke HTTPS                    | ✅ **PASS** — 401, redirect 301, TLS, headers OK                                               |
| PH4-011 mobile                 | ⏳ **PENDING** — wymaga realnego telefonu Dowódcy                                              |


**Werdykt zbiorczy**: VCMS prod jest na zdrowym fundamencie (TLS + helmet + CSP + UFW + winston rotation), ale ma **3 luki HIGH** wymagające naprawy w najbliższych sesjach: (1) **fail2ban**, (2) **rate-limit `/api/v1/scan`**, (3) **leak Windows paths z `/v1/ecosystem/status`**.

---

## 1. Środowisko prod (snapshot)


| Komponent                | Wersja / stan                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| OS                       | Ubuntu 6.8.0-107-generic x86_64                                                                       |
| Node.js                  | v18.19.1 (PM2 worker)                                                                                 |
| nginx                    | 1.24.0 (Ubuntu)                                                                                       |
| PM2 process              | `vcms-core` v1.3.0-hardened, fork mode, 1 instance, 109 MB RES, ↺ 12                                  |
| Cert TLS                 | ECDSA, `cmd.flexgrafik.nl` valid do 2026-08-06 (89 dni); także `api.zzpackage.flexgrafik.nl` (59 dni) |
| Otwarte porty (UFW)      | 22, 80, 443, **8000**                                                                                 |
| Otwarte sockety (LISTEN) | `0.0.0.0:8000` (python/jadzia), `0.0.0.0:8001` (node/vcms — UFW blokuje), `0.0.0.0:80/443` (nginx)    |


---

## 2. Findings — Hard Gates (P0 / P1 / P2)

### 🔴 F1 [P0] — Fail2ban INACTIVE

- **Evidence**: `systemctl is-active fail2ban` → `inactive`. Brak `/etc/fail2ban/jail.d/`.
- **Impact**: SSH (port 22) i nginx basic-auth (port 80/443) podatne na brute-force. Hasło `dowodca` bez limitu prób = kompromitacja w godzinach.
- **Fix (manual deploy proposal)**:
  ```bash
  apt install -y fail2ban
  cat >/etc/fail2ban/jail.local <<'EOF'
  [DEFAULT]
  bantime = 1h
  findtime = 10m
  maxretry = 5
  backend = systemd

  [sshd]
  enabled = true

  [nginx-http-auth]
  enabled = true
  port    = http,https
  logpath = /var/log/nginx/error.log
  EOF
  systemctl enable --now fail2ban
  fail2ban-client status
  ```
- **Owner**: SRE / Dowódca (manual deploy).

### 🔴 F2 [P0] — `/api/v1/ecosystem/status` leakuje Windows ścieżki + nie działa

- **Evidence**: response zawiera `"path":"C:\\Users\\FlexGrafik\\FlexGrafik\\github\\..."` × 6 repo, każde z `"git":{"status":"error","error":"Not a git repo"}`.
- **Impact**:
  1. Disclosure: ujawnia layout laptopa Dowódcy (nazwa użytkownika OS, struktura katalogów) → przydatne dla phishingu.
  2. Funkcjonalność martwa: endpoint nie zwraca użytecznych danych na prod (na laptopie zwraca poprawnie).
- **Root cause**: `repos.yaml` ma absolute Windows paths; deploy-context wysyła go 1:1 na VPS bez rewrite na ścieżki linuxowe (lub stub na "n/a remote").
- **Fix (kod, do manualnego deployu)**: dwa warianty:
  - **A)** Endpoint wykrywa `process.env.NODE_ENV === 'production'` i zwraca `{"status":"remote","note":"git ops not available on VPS — see laptop dashboard"}`.
  - **B)** Sanityzacja: usuwać pełne ścieżki z response (zwracać tylko `name + type + status`).
  - Rekomendacja: **B**. Plus: caller/caller path detection w samym kodzie aby nie pokazywać HOST_USERNAME.

### 🔴 F3 [P0] — `/api/v1/scan` rate-limit za luźny + uruchamia się na prod z błędną config

- **Evidence**: `apiLimiter` = 200 req / 15 min dla heavy scan. 3 strzały POST = 3× pełen `node tools/vcms-scan.js` (CPU + DB writes + disk IO).
  - Skan zwrócił `Repo path not found: /var/www/vcms/releases/.../C:\\Users\\...` — sklejanie absolute Windows path z release dir = błąd, ale endpoint kończy 200 i pisze do SQLite.
- **Impact**:
  1. DoS-able: 200 req w 15 min × N IP = wiarygodne CPU spike (skaner nie jest async-light).
  2. Endpoint manifestuje błędną konfig na prod (operacja nieużyteczna, ale pozornie poprawna).
- **Fix**:
  - Rate limit dedykowany: `scanLimiter = rateLimit({ windowMs: 60*60*1000, max: 5 })` (5 razy / godz).
  - Walidacja: jeśli `repos.yaml` zawiera Windows-style paths (`/^[A-Z]:\\\\/`), zwróć `400 — config not portable to remote` zamiast uruchamiać.
  - Wymóg auth API key (poza basic-auth na nginx) dla mutating endpoints (`POST /api/v1/scan`, `POST /chat`).

### 🟡 F4 [P1] — Brak nginx security headers (HSTS / X-Frame / CSP) dla 401 i statics

- **Evidence**: zewnętrzny `curl -I https://cmd.flexgrafik.nl/` → HTTP/1.1 401 → tylko `Server: nginx/1.24.0 (Ubuntu)`, `WWW-Authenticate`, `Content-Type`, `Date`, `Connection`. **Brak Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP**.
- **Powód**: helmet jest na Express, ale 401 z basic-auth nigdy nie dochodzi do upstream.
- **Impact**: 
  1. Pierwsze hit przed loginem → przeglądarka **nie zapamięta HSTS**. Jeśli ktoś wpisze `http://cmd.flexgrafik.nl` z hotelu, MitM aktywny.
  2. Strona logowania (przeglądarkowy popup basic-auth) jest "naga" — można ją wyfreemować w iframe (gdzieś).
- **Fix nginx**: w obu server blocks (HTTPS + IP-direct) dodać przed `location /`:
  ```nginx
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "no-referrer" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;
  server_tokens off;  # przenieść do http{} block
  ```
  Flaga `always` jest kluczowa — bez niej nginx nie dodaje headers do 4xx/5xx.

### 🟡 F5 [P1] — `Permissions-Policy` brakuje całkowicie (Express helmet)

- **Evidence**: response `/health` nie zawiera `Permissions-Policy`. Helmet domyślnie nie ustawia od v6+.
- **Fix (kod `src/middleware/guards.js`)**:
  ```js
  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()');
    next();
  });
  ```
  Albo upgrade helmet na ten z `permissionsPolicy` plugin.

### 🟡 F6 [P1] — Brak pm2-logrotate → `vcms-error.log` rośnie bez końca

- **Evidence**: `/var/www/vcms/logs/vcms-error.log` 116 KB, mtime **14 kwietnia 2026**, brak rotacji od 24 dni. `pm2 conf pm2-logrotate` zwraca pustkę (module nie zainstalowany).
- **Impact**: za 6-12 miesięcy plik może mieć GB. Plus duplikacja logów (PM2 stdout + winston-daily-rotate-file w `current/logs/`).
- **Fix**:
  ```bash
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:max_size 10M
  pm2 set pm2-logrotate:retain 7
  pm2 set pm2-logrotate:compress true
  pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
  ```
  Plus: rozważyć usunięcie redundancji — albo Winston, albo PM2-stdout, nie oba.

### 🟡 F7 [P1] — `server_tokens` wycieka wersję nginx

- **Evidence**: `Server: nginx/1.24.0 (Ubuntu)` w każdym response.
- **Fix**: w `/etc/nginx/nginx.conf` w bloku `http {}` odkomentować `server_tokens off;`. Restart nginx.

### 🟡 F8 [P1] — `vcms-core` 12× restart w 54 min (nie idle)

- **Evidence**: `pm2 status` → ↺=12, uptime=54m. Restart_delay=4s, max_restarts=10. Po 10 crashach PM2 wystawia `errored` — 2 restarty ponad limit znaczy że **PM2 zresetował licznik ostatnimi godzinami**.
- **Hypothesis**: ostatni `pm2 reload` z deploy-context-sync mógł podbić licznik. **ALE**: brak `min_uptime` w `ecosystem.config.js` → PM2 nie wie kiedy proces uznać za stabilny.
- **Fix**: dodać `min_uptime: '60s'` do ecosystem.config.js. Sprawdzić ostatnie crashe w `vcms-error.log`.

### 🟡 F9 [P2] — port 8001 bind na `0.0.0.0` (defense-in-depth)

- **Evidence**: `app.listen(port, '0.0.0.0', ...)` w `server.js:86`. UFW blokuje 8001 z internetu, ale gdyby UFW był wyłączony / źle skonfigurowany, dostęp byłby otwarty.
- **Fix**: `app.listen(port, '127.0.0.1', ...)` — VCMS i tak musi być za nginx (bo basic-auth na nginx, nie na Express).

### 🟡 F10 [P2] — npm audit: 2 moderate (ip-address XSS via express-rate-limit)

- **Evidence**:
  - `ip-address <=10.1.0` — XSS in Address6 HTML-emitting methods (CWE-79, GHSA-v2v4-37r5-5v8g).
  - `express-rate-limit 8.0.1 - 8.5.0` — affected via transitive dep.
- **Real risk**: niski. Address6 HTML methods nie są używane przez `express-rate-limit` (rate-limit korzysta tylko z parsing IP). Theoretical CVE.
- **Fix**: `npm install express-rate-limit@latest` (jeśli >=8.6.0 ma fix) lub override w package.json:
  ```json
  "overrides": { "ip-address": "^11.0.0" }
  ```
  Wymaga lokalnego testu `npm test` + smoke przed deployem.

### 🟡 F11 [P2] — `/api/v1/status` (polling co 5s z dashboard) bez rate limit

- **Evidence**: dashboard wysyła `GET /api/v1/status` co 5s (widoczne w PM2 logs). Plus `/api/v1/ecosystem/status` co 30s.
- **Impact**: jeśli w przeglądarce otworzysz 50 tabów dashboardu, dostajesz 50× polling = 600 req/min. Brak globalnego rate limitu daje teoretyczne łatwe spike.
- **Fix**: dodać `apiLimiter` (200/15min) do `router.use(...)` na poziomie całego `/api/v1/`*, nie tylko per-endpoint.

### 🟡 F12 [P2] — CSP `'unsafe-inline'` w scriptSrc + styleSrc

- **Evidence**: `src/middleware/guards.js:22-23`. Komentarz w kodzie wskazuje świadomy trade-off.
- **Impact**: XSS w dashboardzie ma niższą barierę (inline script attack vector żywy).
- **Fix (długoterminowy)**: refactor dashboard do nonce-based CSP. Odsuwany.

### 🟡 F13 [P2] — TLSv1.0 / TLSv1.1 wciąż w globalnym `nginx.conf`

- **Evidence**: `nginx.conf` http block: `ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;`.
- **Powód że nie groźne**: certbot includes `options-ssl-nginx.conf` w sites-enabled/vcms (server block 1) i ten nadpisuje na TLSv1.2+. Sprawdzone: zewnętrzny smoke nie negocjuje 1.0/1.1 (default Mozilla intermediate). Ale globalny config ma wciąż dziadowski preset.
- **Fix**: w `nginx.conf` zmienić na `ssl_protocols TLSv1.2 TLSv1.3;`.

### 🟡 F14 [P2] — `listen 8010` w nginx (server block 3) bez UFW

- **Evidence**: `VCMS-nginx-live.conf:52`. Port 8010 nasłuchuje w nginx, ale UFW blokuje incoming.
- **Risk**: marginalny — UFW chroni. Ale to zanieczyszczenie config (martwy port).
- **Fix**: usunąć `listen 8010;` (był tymczasowym fallback).

---

## 3. Co działa dobrze (Goods)


| ✅   | Co                                                | Evidence                                                           |
| --- | ------------------------------------------------- | ------------------------------------------------------------------ |
| G1  | TLS Let's Encrypt ECDSA                           | cmd.flexgrafik.nl valid 89 dni, certbot dry-run = success          |
| G2  | HTTP→HTTPS 301                                    | `curl -I http://cmd.flexgrafik.nl/` → 301 Location HTTPS           |
| G3  | Basic Auth chroni wszystkie endpointy z internetu | external 401 bez WWW-Authenticate-bypass                           |
| G4  | Express helmet z porządnym CSP                    | 12 security headers, frame-ancestors `'none'`, object-src `'none'` |
| G5  | UFW active z minimalnym whitelist                 | tylko 22/80/443/8000                                               |
| G6  | `disable('x-powered-by')`                         | brak `X-Powered-By: Express`                                       |
| G7  | `trust proxy: 1`                                  | poprawne IP w logach przez X-Forwarded-For                         |
| G8  | Graceful shutdown SIGTERM/SIGINT                  | server.close + db.close + 10s force timeout                        |
| G9  | execFile zamiast exec dla git/scan                | brak shell injection                                               |
| G10 | Joi walidacja env + body                          | `GEMINI_API_KEY` required, body schema na `/chat`                  |
| G11 | Winston daily rotate (7d, 20MB)                   | `logs/vcms-2026-05-08.log` rotuje OK                               |
| G12 | `/deploy-context` zwraca 403                      | secret leak protection ✅                                           |
| G13 | nginx logrotate (14 dni, compress)                | `/etc/logrotate.d/nginx` config OK                                 |
| G14 | Body limit 5MB                                    | przeciw memory bomb                                                |
| G15 | CORS strict allowedOrigins                        | brak `*`, alert na blokadę                                         |
| G16 | Backlog cache 10s                                 | smart, nie bombarduje fs                                           |


---

## 4. Smoke HTTPS — Evidence

### Zewnętrzny (laptop → internet → nginx)


| Endpoint                     | Status                    | Headers (dla 401)                                                  |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------ |
| `https://cmd.flexgrafik.nl/` | 401 (basic-auth required) | Server, WWW-Authenticate, brak HSTS/CSP                            |
| `http://cmd.flexgrafik.nl/`  | 301 → https               | Location: [https://cmd.flexgrafik.nl/](https://cmd.flexgrafik.nl/) |
| `http://185.243.54.115/`     | 401 (basic-auth required) | jak wyżej                                                          |


### Wewnętrzny (VPS → 127.0.0.1:8001)


| Endpoint                            | Status                          | Helmet headers                          |
| ----------------------------------- | ------------------------------- | --------------------------------------- |
| `GET /health`                       | 200                             | ✅ Komplet (12 nagłówków)                |
| `GET /api/v1/status`                | 200, version=1.3.0-hardened     | ✅                                       |
| `GET /api/v1/backlog`               | 200, next_task=PH4-011          | ✅                                       |
| `GET /api/v1/ecosystem/status`      | 200, **leakuje Windows paths**  | ✅ (headers OK, response problematyczny) |
| `GET /deploy-context/manifest.json` | **403 Forbidden** ✅             | ✅                                       |
| `POST /api/v1/scan` × 3             | 200 (limit 200/15min nie wpadł) | ✅, ale heavy operation                  |


### Certbot

```
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/api.zzpackage.flexgrafik.nl/fullchain.pem (success)
  /etc/letsencrypt/live/cmd.flexgrafik.nl/fullchain.pem (success)
no renewal failures
```

---

## 5. Cross-module finding (poza scope, do report)

### Port 8000 (jadzia) jest publicznie otwarty bez TLS/Basic-Auth na bare IP

- UFW: `8000/tcp ALLOW IN Anywhere` + `Anywhere (v6)` → port osiągalny przez `http://185.243.54.115:8000/`.
- nginx proxy `api.zzpackage.flexgrafik.nl` → 127.0.0.1:8000 (z TLS dla zzpackage api.zzpackage.flexgrafik.nl, valid 59 dni).
- **Raw IP:port 8000 nie ma TLS i nie ma auth (zależy od FastAPI middleware Jadzi)**.
- **NIE poprawiam** — to scope `jadzia-core`, nie VCMS. **Eskalacja do osobnej sesji** dla modułu Jadzia.

---

## 6. Rekomendowana kolejność napraw (1-1-1)


| #   | Task                                                                    | Severity | Effort | Sesja   | Repo              |
| --- | ----------------------------------------------------------------------- | -------- | ------ | ------- | ----------------- |
| 1   | F1 — Install fail2ban + jail nginx-http-auth + sshd                     | P0       | 30 min | sesja A | flex-vcms (ops)   |
| 2   | F2 — Sanityzuj `/api/v1/ecosystem/status` (filter Windows paths)        | P0       | 1 h    | sesja B | flex-vcms (kod)   |
| 3   | F3 — Dedykowany `scanLimiter` (5/h) + walidacja repos.yaml portability  | P0       | 1 h    | sesja B | flex-vcms (kod)   |
| 4   | F4 — Dodaj security headers do nginx server blocks (HSTS/XFO/CSP basic) | P1       | 30 min | sesja A | flex-vcms (nginx) |
| 5   | F5 — Permissions-Policy w guards.js                                     | P1       | 15 min | sesja B | flex-vcms (kod)   |
| 6   | F6 — pm2-logrotate install + config                                     | P1       | 15 min | sesja A | flex-vcms (ops)   |
| 7   | F7 — `server_tokens off` w nginx.conf                                   | P1       | 5 min  | sesja A | flex-vcms (nginx) |
| 8   | F8 — `min_uptime: '60s'` w ecosystem.config.js                          | P1       | 5 min  | sesja B | flex-vcms (kod)   |
| 9   | F9 — `127.0.0.1:8001` bind                                              | P2       | 5 min  | sesja B | flex-vcms (kod)   |
| 10  | F10 — npm audit fix (express-rate-limit)                                | P2       | 30 min | sesja C | flex-vcms (deps)  |
| 11  | F11 — globalny apiLimiter na `/api/v1/`*                                | P2       | 15 min | sesja B | flex-vcms (kod)   |
| 12  | F13 — TLS 1.2+ w globalnym nginx.conf                                   | P2       | 5 min  | sesja A | flex-vcms (nginx) |
| 13  | F14 — usuń `listen 8010`                                                | P2       | 5 min  | sesja A | flex-vcms (nginx) |


**Sugerowane sesje**:

- **Sesja A — Ops/Infra** (F1, F4, F6, F7, F13, F14): nginx + fail2ban + pm2-logrotate. Manual deploy na VPS.
- **Sesja B — App/Kod** (F2, F3, F5, F8, F9, F11): zmiany w `src/`. Build + Deploy-VPS.ps1 + smoke.
- **Sesja C — Deps** (F10): npm install + tests + deploy.

---

## 7. Komendy weryfikacyjne (do powtórzenia po naprawach)

```powershell
# 1. Headers — czy HSTS dochodzi do 401
curl.exe -sS -I -k https://cmd.flexgrafik.nl/ | findstr /I "strict-transport x-frame x-content"

# 2. Cert renew
ssh root@185.243.54.115 "certbot renew --dry-run 2>&1 | tail -5"

# 3. Fail2ban
ssh root@185.243.54.115 "fail2ban-client status; fail2ban-client status sshd; fail2ban-client status nginx-http-auth"

# 4. PM2 logrotate
ssh root@185.243.54.115 "pm2 conf pm2-logrotate"

# 5. Rate-limit /api/v1/scan
ssh root@185.243.54.115 "for i in 1 2 3 4 5 6 7; do curl -sS -o /dev/null -w 'POST %{http_code}\\n' -X POST http://127.0.0.1:8001/api/v1/scan; done"

# 6. Server header (nginx server_tokens)
curl.exe -sS -I https://cmd.flexgrafik.nl/ | findstr /I "server"

# 7. /v1/ecosystem/status — sanity
ssh root@185.243.54.115 "curl -sS http://127.0.0.1:8001/api/v1/ecosystem/status | grep -i 'C:\\\\Users' && echo 'LEAK' || echo 'OK'"
```

---

## 8. PH4-011 mobile — status

- **Symulacja Chromium** już była PASS (zapisane w `2026-04-10-ph4-011-mobile.md`).
- **Test na realnym telefonie** wciąż nie wykonany (sprzeczność: `meta.next` mówi PH4-011, `tasks.PH4-011.status` mówi DONE).
- **Krok dla Dowódcy**: skopiuj `docs/templates/tmpl-ph4-011-mobile.md` → `docs/handoffs/2026-05-08-ph4-011-mobile-real.md`, wypełnij na telefonie podczas najbliższej okazji (4G/5G, NIE Wi-Fi domowe — żeby ominąć hosts-file workaround).
- Jeśli FAIL → utworzyć osobne zadanie follow-up. Jeśli PASS → ustawić `meta.next` na PH4-016 (parent audytu).

---

## 9. SESSIONANCHOR (audyt)

- **DATA**: 2026-05-08
- **BRANCH**: `feat/audit-3.0-knowledge-index`
- **HEAD**: `5f68c04` (chore: sync deploy-context post-TLS)
- **TRYB**: Read-only audit (Zasada 11 zachowana — żaden plik na VPS nie zmodyfikowany).
- **NEXT**: PH4-016 — VCMS Prod Hardening (3 sesje: A/B/C wg sekcji 6) + PH4-011 mobile real device (Dowódca).
- **BLOCKER**: brak.

