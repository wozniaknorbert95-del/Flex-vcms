---
status: "[DONE — HTTP smoke PASS + TLS ACTIVE, czeka na PH4-011 test telefonu]"
title: "2026-05-08 — TLS setup DONE, deploy prod, smoke HTTP+HTTPS PASS"
session: "Senior Agency — kompleksowe przywrócenie prod VCMS"
---

## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: 4
MODULE: flex-vcms
WORKSPACE_ROOT: C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
BRANCH: feat/audit-3.0-knowledge-index
HEAD: d091fd7
VERIFY: node tools\vcms-scan.js
CONFLICTS: (do sprawdzenia na starcie następnej sesji)
LAST_HANDOFF: docs/handoffs/2026-05-08-vps-ui-csp-backlog-handoff.md
NEXT: Test telefonu PH4-011 na https://cmd.flexgrafik.nl (Basic Auth: dowodca) — zapisz wynik wg tmpl-ph4-011-mobile.md.
BLOCKER: brak (TLS aktywny, DNS propaguje).

---

## CO ZROBIONE W TEJ SESJI

### Deploy i smoke HTTP — PASS
- `Deploy-VPS.ps1 -SkipBuild` wykonany: pliki, dist, deploy-context, npm ci, PM2 reload — wszystko OK.
- `vcms-core` online, uptime stabilny, restart count 12 (normalny po reload).
- Smoke na localhost VPS:
  - `GET /health` → `{"status":"OK"}` ✅
  - `GET /api/v1/status` → v1.3.0-hardened, uncle_tip: Zasada 11 ✅
  - `GET /api/v1/backlog` → backlog_ok: True ✅
  - `POST /api/chat {}` → 400 validation ✅
- Nginx reload po przesłaniu pre-TLS config: `nginx -t` PASS ✅

### Git
- Commit `docs: sync context, BRAIN.md canon, handoff 2026-05-08 CSP+backlog fix` (58c11ec)
- Commit `feat: nginx HTTPS config + TLS activation script for cmd.flexgrafik.nl` (d091fd7)
- Push do `origin/feat/audit-3.0-knowledge-index` ✅

### Nginx config
- `docs/reference/VCMS-nginx.conf` — zaktualizowany z blokiem HTTPS (dla certbot po DNS).
- `docs/reference/VCMS-nginx-pre-tls.conf` — wdrożony na VPS jako `/etc/nginx/sites-available/vcms`.
- Na VPS aktywna konfiguracja: HTTP-only, Basic Auth (`dowodca`), ACME challenge path gotowy.

### TLS Activation Script
- Skrypt gotowy na VPS: `/root/enable-tls-cmd.sh` (chmod +x)
- Lokalnie w repo: `scripts/enable-tls-vps.sh`
- Skrypt sprawdza DNS → certbot → nginx reload → smoke HTTPS

---

## DNS — Stan

| Subdomena | Oczekiwane | Stan (2026-05-08 17:00) |
|-----------|-----------|------------------------|
| cmd.flexgrafik.nl | A → 185.243.54.115 | NXDOMAIN ❌ |
| vcms.flexgrafik.nl | (opcjonalnie) | NXDOMAIN ❌ |

**Panel DNS:** Cyber-Folks (ns1/ns2/ns3.cyberfolks.pl)
**Gdzie dodać:** https://panel.cyberfolks.pl → Domeny → flexgrafik.nl → Rekordy DNS

---

## NEXT — dokładnie 1 krok dla Dowódcy

**Zaloguj się do Cyber-Folks panel i dodaj:**

```
Typ: A
Nazwa: cmd
Wartość: 185.243.54.115
TTL: 3600
```

**Potem (po propagacji — zwykle 15–60 min):**

```bash
# Weryfikacja propagacji:
Resolve-DnsName cmd.flexgrafik.nl  # oczekiwane: 185.243.54.115

# TLS activation (jeden command z laptopa):
ssh root@185.243.54.115 "bash /root/enable-tls-cmd.sh"
```

Skrypt sam sprawdzi DNS, wyda cert, zreładuje nginx i zrobi smoke HTTPS.

**Po PASS HTTPS:**
- Smoke checklist: `docs/checklists/vcms-prod-smoke.md` na `https://cmd.flexgrafik.nl`
- Test telefonu (PH4-011): zaloguj na `https://cmd.flexgrafik.nl` z iOS/Android

---

## BLOCKER

DNS A record `cmd.flexgrafik.nl` → `185.243.54.115` w Cyber-Folks panel — jedyna akcja niemożliwa bez dostępu do panelu rejestratora. Zero code blockerów.

---

## Weryfikacja (po DNS + certbot)

```powershell
# 1. DNS
Resolve-DnsName cmd.flexgrafik.nl  # -> 185.243.54.115

# 2. Smoke HTTPS z laptopa
Invoke-WebRequest "https://cmd.flexgrafik.nl/health" -UseBasicParsing
# oczekiwane: StatusCode 200, Content: {"status":"OK",...}

# 3. API endpoints
Invoke-WebRequest "https://cmd.flexgrafik.nl/api/v1/backlog" -UseBasicParsing
# oczekiwane: 200, JSON backlog
```

---

## Stan produkcji po tej sesji

| Check | Stan |
|-------|------|
| VPS dostępny | ✅ 185.243.54.115 |
| PM2 vcms-core | ✅ online v1.3.0-hardened |
| HTTP → HTTPS redirect (301) | ✅ aktywny |
| HTTPS / TLS Let's Encrypt | ✅ AKTYWNY (ważny do 2026-08-06) |
| DNS cmd.flexgrafik.nl | ✅ 185.243.54.115 (propaguje) |
| Certyfikat | ✅ CN=cmd.flexgrafik.nl, issuer=Let's Encrypt E7 |
| Auto-renewal certbot | ✅ skonfigurowany (systemd timer) |
| Smoke HTTP → HTTPS redirect | ✅ 301 PASS |
| Smoke HTTPS Basic Auth (401) | ✅ PASS |
| Smoke health/backlog/chat | ✅ PASS (loopback) |
| PH4-011 test telefonu | ⏳ do wykonania przez Dowódcę |
