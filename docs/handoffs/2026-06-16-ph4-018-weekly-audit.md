# HANDOFF — PH4-018 Weekly Audit Verification

**Date:** 2026-06-16  
**Status:** DONE  
**Branch:** `feat/audit-3.0-knowledge-index`

## SESSIONANCHOR

PROJECT: flex-vcms  
PHASE: 4  
MODULE: flex-vcms  
WORKSPACE_ROOT: C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms  
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github  
VERIFY: node tools\vcms-scan.js  
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/audits/latest-verification.md  
CONFLICTS: 0  
LAST_HANDOFF: docs/handoffs/2026-06-16-ph4-018-weekly-audit.md  
NEXT: PH4-017 — real device mobile test (4G/5G)  
BLOCKER: Brak  

## CO ZMIENIONE / WAŻNE

### PH4-018 — feedback loop audytu (G2 z live audit)

| Komponent | Ścieżka |
|-----------|---------|
| Core verify | `scripts/ph4-016-verify.sh` (+ markdown REPORT_FILE, localhost F2/F3) |
| VPS cron | `scripts/weekly-audit-check.sh` |
| Cron install | `scripts/install-weekly-audit-cron.sh` |
| Laptop runner | `scripts/Invoke-WeeklyAudit.ps1` |
| npm | `npm run verify:prod-audit` |
| GHA | `.github/workflows/weekly-audit-verify.yml` |
| Docs | `docs/jobs/README.md` |
| Deploy | `Deploy-VPS.ps1` kopiuje katalog `scripts/` |

### Prod — pierwszy run

- **13/13 PASS** — raport: `docs/audits/latest-verification.md`
- VPS cron: `0 9 * * 1` → `/var/log/vcms-audit.log`
- Raporty VPS: `/var/log/vcms-audit/reports/`

### GitHub Actions (opcjonalnie)

Ustaw secrets: `VCMS_SSH_KEY`, `VCMS_SSH_HOST`, opcjonalnie `VCMS_REMOTE_PATH`.

## NEXT (1 rzecz)

**PH4-017** — test telefonu na 4G/5G (`tmpl-ph4-011-mobile.md` → handoff).

## WERYFIKACJA

```powershell
npm run verify:prod-audit
# lub
.\scripts\Invoke-WeeklyAudit.ps1 -SyncReport
```

Oczekiwane: PASS=13, FAIL=0.

## BLOCKER / RISK

- GHA bez secrets = skip (workflow exit 0 z warningiem) — OK na start.
- Raporty w repo (`docs/audits/`) syncowane ręcznie przez `-SyncReport` — cron na VPS nie commituje do git (by design).
