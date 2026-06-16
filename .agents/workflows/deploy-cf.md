---
description: Przygotowanie deploy Cyber-Folks / VCMS VPS — Zasada 11, skrypt Deploy-VPS.ps1.
---

# /deploy-cf

## Goal

Wygenerować **atomowy plan deploy** VCMS Command Center (Node + VitePress dist) na VPS — agent przygotowuje, **Dowódca wykonuje**.

## Input

- `VERDICT: PASS ✅` z `/audit-red-team`.
- Runbook: `docs/reference/vcms-vps-runbook.md`
- Lokalny skrypt: `scripts/Deploy-VPS.ps1`

## Agent procedure

### KROK 1 — Gate

- Brak PASS → STOP → `/audit-red-team`.
- Zasada 11: zero autonomicznego `scp`/`ssh` przez agenta.

### KROK 2 — Pre-deploy lokalnie

```powershell
Set-Location "C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms"
npm run docs:build
# opcjonalnie: node tools\vcms-scan.js — jeśli zmieniano repos.yaml
```

### KROK 3 — Dry-run

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget 'root@[HOST]' -RemotePath '/var/www/vcms/current' -WhatIf
```

Dowódca weryfikuje plan; potem **bez** `-WhatIf`.

### KROK 4 — Komendy produkcyjne (Dowódca)

Pełny deploy (przykład):

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget 'root@[HOST]' -RemotePath '/var/www/vcms/current'
```

Na VPS (referencja — Dowódca przez SSH jeśli potrzeba):

```bash
cd /var/www/vcms/current && npm ci --omit=dev
pm2 reload ecosystem.config.js --update-env
```

### KROK 5 — Smoke (checklist)

Z `docs/reference/vcms-vps-runbook.md` + `/checklists/vcms-prod-smoke`:

- [ ] HTTPS + Basic Auth
- [ ] Dokumentacja VitePress ładuje się
- [ ] `/api/health` lub odpowiednik OK
- [ ] Brak nowych błędów w `logs/vcms-error.log`

### KROK 6 — Rollback

- Przywróć poprzedni `docs/.vitepress/dist` + `server.js` z backupu.
- `pm2 reload ecosystem.config.js`

## Do

- `-WhatIf` przed realnym deploy.
- Sekrety tylko w `.env` na VPS — nie w czacie.

## Don't

- Nie wykonuj deploy za Dowódcę.
- Nie pomijaj build `docs:build` lokalnie.
- Nie deploy bez PASS audytu.

## Output

```text
AUDIT: PASS ✅
TARGET: [host/path]
LOCAL_BUILD: [npm run docs:build — status]
DEPLOY_COMMANDS: [PowerShell + optional SSH]
SMOKE_CHECKLIST: [...]
ROLLBACK: [skrót]

AWAIT_COMMANDER_EXECUTION: YES

---
CURRENT_STAGE: F5-Launch
RECOMMENDED_NEXT: /handoff
WHY_NEXT: Po smoke — SESSIONANCHOR z wynikiem deploy
---
```

## Done when

Dowódca ma komplet komend; smoke checklist wypisany; AWAIT_COMMANDER_EXECUTION = YES.
