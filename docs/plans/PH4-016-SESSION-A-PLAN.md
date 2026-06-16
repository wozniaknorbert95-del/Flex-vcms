---
status: "[DONE — verified 2026-06-16]"
title: "PH4-016 Sesja A — Plan wykonania i zamknięcia"
date: "2026-06-16"
audit_source: "docs/audits/2026-06-15-LIVE-AUDIT-FLASH.md"
---

# PH4-016 Sesja A — Plan (Senior Specialist)

## Werdykt po audycie live (2026-06-16)

**Sesja A jest już wdrożona na VPS** (pierwotnie 2026-05-11, nadal aktywna).

Weryfikacja zdalna (`Invoke-PH4-016-SessionA.ps1 -VerifyOnly`) potwierdza:

| Finding | Opis | Status |
|---------|------|--------|
| F1 | fail2ban (sshd + nginx-http-auth) | ✅ PASS |
| F4 | HSTS / XFO / CSP na 401 | ✅ PASS |
| F5 | Permissions-Policy (nginx + Express) | ✅ PASS |
| F6 | pm2-logrotate | ✅ PASS |
| F7 | server_tokens off | ✅ PASS |
| F8 | min_uptime PM2 | ✅ PASS |
| F9 | bind 127.0.0.1:8001 | ✅ PASS |
| F10 | npm audit prod = 0 | ✅ PASS |
| F13 | TLS 1.2+ only | ✅ PASS |
| F14 | port 8010 nie nasłuchuje | ✅ PASS |

**Sesja B + C** — wdrożone deployem 2026-06-16 (`Deploy-VPS.ps1`).

---

## Co zostało (15 min, Dowódca)

### 1. Weryfikacja endpointów z auth (F2, F3, F11)

Z laptopa (podstaw swoje dane basic auth):

```powershell
# F2 — brak wycieku ścieżek Windows
curl.exe -sS -u "dowodca:HASLO" https://cmd.flexgrafik.nl/api/v1/ecosystem/status | Select-String "C:\\\\Users"
# Oczekiwane: brak wyniku

# F3 — rate limit scan (6. request = 429)
1..7 | ForEach-Object { curl.exe -sS -u "dowodca:HASLO" -X POST https://cmd.flexgrafik.nl/api/v1/scan -w " $_ -> %{http_code}`n" }
```

Lub na VPS:

```bash
ssh root@185.243.54.115 "VCMS_AUTH='dowodca:HASLO' bash /tmp/ph4-016/verify.sh"
```

### 2. Zamknij PH4-016 w backlogu

Po PASS powyżej:
- `PH4-016-A` → DONE
- `PH4-016` → DONE
- Handoff: `docs/handoffs/2026-06-16-ph4-016-CLOSURE.md`

### 3. Opcjonalnie — re-apply Sesji A (gdy coś się zepsuje)

```powershell
.\scripts\Invoke-PH4-016-SessionA.ps1 -SshTarget root@185.243.54.115
```

Skrypt:
1. Wgrywa `scripts/ph4-016-harden-vps.sh` (idempotentny)
2. Uruchamia `scripts/ph4-016-verify.sh`

`-WhatIf` — tylko podgląd komend.

---

## Narzędzia (nowe w repo)

| Plik | Rola |
|------|------|
| `scripts/ph4-016-harden-vps.sh` | Idempotentny hardening VPS (Sesja A) |
| `scripts/ph4-016-verify.sh` | Checklist 14 findings (VPS) |
| `scripts/Invoke-PH4-016-SessionA.ps1` | Wrapper Windows: apply + verify |
| `docs/playbooks/vcms-sesja-a-ops-infra.md` | Playbook krok-po-kroku (manual) |
| `docs/reference/VCMS-nginx-live.conf` | Kanoniczny vhost z headerami |

---

## Następny sprint (po zamknięciu PH4-016)

| ID | Tytuł | Priorytet | Effort |
|----|-------|-----------|--------|
| PH4-018 | Weekly audit verification CI/cron | P1 | ~8h |
| PH4-017 | Real device mobile test (4G/5G) | P1 | ~1h |
| G3 | `tools/vcms-semantic-check.js` | P2 | ~4h |

---

## Dlaczego live audit pokazywał FAIL?

Raport 2026-06-15 był **read-only bez ponownej weryfikacji SSH**. Sesja A była już zrobiona 2026-05-11 (`docs/handoffs/2026-05-11-vcms-hardening-deploy-handoff.md`). Brakowało tylko deployu Sesji B/C — wykonany dziś.

**Deployment gate: 🟢 OPEN** po Twojej weryfikacji F2/F3 z auth.
