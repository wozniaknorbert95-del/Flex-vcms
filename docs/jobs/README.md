# PH4-018 — Weekly Audit Verification Jobs

Automated re-check of PH4-016 hardening findings on production VPS.

## Components

| File | Role |
|------|------|
| `scripts/ph4-016-verify.sh` | Core checklist (14 findings) |
| `scripts/weekly-audit-check.sh` | Cron entrypoint + markdown report |
| `scripts/install-weekly-audit-cron.sh` | One-time VPS cron install |
| `scripts/Invoke-WeeklyAudit.ps1` | Run from Windows laptop |
| `.github/workflows/weekly-audit-verify.yml` | GitHub Actions (optional, needs secrets) |

## VPS one-time setup (Zasada 11 — manual)

After `Deploy-VPS.ps1` (scripts are deployed with app):

```bash
ssh root@185.243.54.115
VCMS_ROOT=/var/www/vcms/current bash /var/www/vcms/current/scripts/install-weekly-audit-cron.sh
```

Cron: **Monday 09:00 UTC** → `/var/log/vcms-audit.log`  
Reports: `/var/log/vcms-audit/reports/YYYY-MM-DD-verification.md`

## Laptop (on demand)

```powershell
.\scripts\Invoke-WeeklyAudit.ps1 -SyncReport
```

Syncs latest report to `docs/audits/latest-verification.md`.

## GitHub Actions secrets (optional)

| Secret | Value |
|--------|-------|
| `VCMS_SSH_KEY` | Private key for root@VPS |
| `VCMS_SSH_HOST` | `185.243.54.115` |
| `VCMS_REMOTE_PATH` | `/var/www/vcms/current` (optional) |

Without secrets, workflow warns and exits 0 (local run required).

## Alerting

- Cron exit code `1` = at least one FAIL in checklist
- Review `/var/log/vcms-audit.log` and latest report on VPS
- Future: wire to email/Slack (out of scope PH4-018 v1)
