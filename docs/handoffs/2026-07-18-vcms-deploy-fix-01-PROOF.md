# PROOF — VCMS-DEPLOY-FIX-01

**Date:** 2026-07-18  
**Gate:** `VCMS-DEPLOY-FIX-01` → **DONE**  
**PLAN:** `docs/handoffs/2026-07-18-vcms-deploy-fix-01-PLAN.md`

## Commits / PRs

| Item | Value |
|------|--------|
| PR #25 | fix Deploy-VPS Invoke-Remote + tar (`fe60c0a` era) |
| PR #26 | backup hang fix (`test -f`, quoted ssh) → tip **`65f0e89`** |
| GO deploy tip (script on VPS) | post-merge `65f0e89` |

## GO Deploy evidence

Command:

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget 'root@185.243.54.115'
```

| Check | Result |
|-------|--------|
| Script exit | **0** (~2.5 min after build) |
| First SSH hang | **none** (mkdir + backup OK) |
| Health | `{"status":"OK"}` |
| handbook | **200** |
| study-index | **200** |
| Transfer | tar.gz for public/src/tools/scripts/dist/deploy-context |
| npm ci + pm2 reload | OK |

Public: `https://cmd.flexgrafik.nl/docs/study/coi-commander-ops-handbook` → Basic Auth **401** (expected).

## Root cause (closed)

1. Nested PowerShell/`ssh` quotes mangled remote mkdir.  
2. Bare `if [ -d … ]` → PowerShell `[` wildcard hang on backup.  

Fix: single-arg `ssh host "$RemoteCmd"` + `test -f … \|\| true` + `Send-TarDir`.

## DoD

All binary DoD from PLAN — **PASS**.
