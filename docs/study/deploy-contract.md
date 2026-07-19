---
status: "[ACTIVE]"
title: "VCMS Deploy Contract (certainty)"
updated: "2026-07-19"
gate: "CERTAINTY-C1"
---

# VCMS Deploy Contract

Hard rules for production sync to `cmd` / VPS. Violating these recreates multi-minute hangs.

## Must

1. Run **directly** — never pipe the script:
   - BAD: `.\Deploy-VPS.ps1 ... | Tee-Object` / `| Select-Object -Last`
   - OK: `.\scripts\Deploy-VPS.ps1 -SshTarget 'root@…'`
2. Script uses **`ssh -n`** so OpenSSH never waits on PowerShell stdin.
3. After upload, Deploy writes/verifies **`REVISION`** (git tip + SHA256 of dist probes).
4. Post-deploy smoke: health OK + handbook + surfaces-map **200** on `:8001`.
5. Certainty gate: `.\scripts\Verify-DeployCertainty.ps1 -SshTarget 'root@…'` (pipe + no-pipe).

## Tip truth

- Local tip: `git rev-parse --short HEAD`
- VPS tip: `cat /var/www/vcms/current/REVISION` → `git_short=`
- Must match after successful Deploy.

## Timeout

- First remote step &gt; 3 min without log progress → kill process; check pipe/`ssh -n`, not “big src”.
