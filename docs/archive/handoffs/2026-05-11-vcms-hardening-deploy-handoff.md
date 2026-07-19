---
status: "[DONE]"
title: "2026-05-11 — VCMS Hardening: deploy + Krok 2 SSH + GitHub cleanup"
session: "Senior Agency — kompleksowe domknięcie PH4-016 (Sesja A + B)"
---

## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: 4
MODULE: flex-vcms
WORKSPACE_ROOT: C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms
BRANCH: feat/audit-3.0-knowledge-index
HEAD: 5555677
CONFLICTS: 0
LAST_HANDOFF: docs/handoffs/2026-05-08-vcms-prod-redteam-handoff.md
NEXT: Merge PR #18 na GitHub (feat: VCMS Prod Hardening) -> master, potem opcjonalnie Sesja C (F10 npm deps)
BLOCKER: Brak

---

## CO ZROBIONE

### Kod Node.js (Sesja B — F2/F3/F5/F8/F9/F11)
- **F2**: `/api/v1/ecosystem/status` zwraca `status: remote` zamiast ujawniać Windows paths — ZWERYFIKOWANE na prod
- **F3**: `scanLimiter` (5/h) + portability guard — `POST /api/v1/scan` z Windows repos.yaml zwraca 400
- **F5**: `Permissions-Policy` header w `guards.js`
- **F8**: `min_uptime: '60s'` w `ecosystem.config.js`
- **F9**: `server.js` binduje `127.0.0.1` (nie `0.0.0.0`)
- **F11**: `router.use(apiLimiter)` — globalny limit na wszystkich trasach API

### Deploy VPS
- `npm run docs:build` → 5.17s PASS (naprawa broken frontmatter w raporcie audytu)
- `Deploy-VPS.ps1 -SshTarget root@185.243.54.115 -SkipBuild` → `npm ci` + `pm2 reload` → Health PASS
- `vcms-core` online, nowy kod aktywny

### Krok 2 SSH (Sesja A — F1/F4/F6/F7/F13/F14)
- **F1 fail2ban**: zainstalowany, 2 jaile (sshd + nginx-http-auth), już zbanował **5 IP brute-force SSH**
- **F4 nginx headers**: `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` z flagą `always` — widoczne na 401 z zewnątrz
- **F6 pm2-logrotate**: zainstalowany, skonfigurowany (10M, 7 dni, compressed, daily)
- **F7 server_tokens off**: `Server: nginx` (bez wersji)
- **F13 TLS**: `ssl_protocols TLSv1.2 TLSv1.3` w nginx.conf
- **F14**: usunięty `listen 8010` (martwy port)

### Dokumentacja + skill
- `docs/audits/2026-05-08-vcms-prod-redteam.md` — pełny raport audytu (frontmatter naprawiony)
- `docs/playbooks/vcms-sesja-a-ops-infra.md` — ops runbook
- `docs/agents/skills/handoff.md` — **nowy skill `/handoff`** (ten wykonany właśnie)

### GitHub
- Branch `feat/audit-3.0-knowledge-index` wypchnięty na origin
- **PR #18** otwarty: https://github.com/wozniaknorbert95-del/Flex-vcms/pull/18
- 6 stale lokalnych branchy usuniętych (wszystkie merged)
- Lokalnie: 2 branchy — `feat/audit-3.0-knowledge-index` + `master`

---

## STAN PROD (post-deploy)

| Check | Stan |
|-------|------|
| `https://cmd.flexgrafik.nl/` | ✅ 401 z security headers |
| `Strict-Transport-Security` | ✅ max-age=63072000; includeSubDomains; preload |
| `X-Frame-Options` | ✅ DENY |
| `X-Content-Type-Options` | ✅ nosniff |
| `Referrer-Policy` | ✅ no-referrer |
| `Permissions-Policy` | ✅ camera/mic/geo/payment blocked |
| `Server:` header | ✅ `nginx` (brak wersji) |
| `/health` | ✅ 200 OK |
| `/api/v1/ecosystem/status` | ✅ `status: remote` (brak Windows paths) |
| fail2ban | ✅ active, 2 jaile, 5 IP zbanowanych |
| pm2-logrotate | ✅ active, skonfigurowany |
| TLS protocols | ✅ TLSv1.2 + TLSv1.3 only |
| PM2 vcms-core | ✅ online |

---

## NEXT

**Rank 1 — Merge PR #18** (Dowódca, GitHub UI, ~2 min):
```
https://github.com/wozniaknorbert95-del/Flex-vcms/pull/18
```
Po merge: `git checkout master && git pull` lokalnie.

**Rank 2 (opcjonalnie) — Sesja C: F10 npm deps** (~1h):
```powershell
npm install express-rate-limit@latest
# lub override w package.json:
# "overrides": { "ip-address": "^11.0.0" }
npm audit --omit=dev  # powinno: 0 vulnerabilities
.\scripts\Deploy-VPS.ps1 -SshTarget root@185.243.54.115
```

**Rank 3 (Dowódca) — PH4-017 real device test**:
Wypełnić `docs/templates/tmpl-ph4-011-mobile.md` → `docs/handoffs/<DATA>-ph4-011-mobile-real.md`
Na 4G/5G (NIE Wi-Fi z hosts-file).

---

## BLOCKER

Brak.

---

## Komendy weryfikacyjne

```powershell
# 1. Headers z zewnątrz
curl.exe -sS -I https://cmd.flexgrafik.nl/ | findstr /I "strict-transport x-frame x-content referrer permissions server"

# 2. Health
curl.exe -sS -u "dowodca:<haslo>" https://cmd.flexgrafik.nl/health

# 3. Fail2ban (SSH do VPS)
ssh root@185.243.54.115 "fail2ban-client status; fail2ban-client status sshd"

# 4. Ecosystem endpoint (brak Windows paths)
ssh root@185.243.54.115 "curl -sS http://127.0.0.1:8001/api/v1/ecosystem/status"

# 5. Scan gate (lokalnie)
node tools/vcms-scan.js | Select-String "Conflicts:"
```
