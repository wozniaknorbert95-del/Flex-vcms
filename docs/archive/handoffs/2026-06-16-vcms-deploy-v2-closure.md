# Handoff — VCMS deploy v2 + git closure

**Date:** 2026-06-16  
**Branch:** `feat/audit-3.0-knowledge-index`  
**Prod:** https://cmd.flexgrafik.nl  
**Status:** DEPLOY OK (after hotfix)

## Git

| Commit | Opis |
|--------|------|
| `47f065d` | feat(vcms): terminal UI, demo v2, KODA, portfolio polish (122 plików) |
| `43a4ea3` | fix(deploy): sync `tools/` na VPS |

- Push: `origin/feat/audit-3.0-knowledge-index`
- PR: **#18** (istniejący, zaktualizowany o nowe commity)

## Deploy

1. `Deploy-VPS.ps1 -SshTarget root@185.243.54.115` — pliki zsynchronizowane
2. **Hotfix:** PM2 crash `MODULE_NOT_FOUND: tools/vcms-audit-log` — `tools/` nie było w `$requiredDirectories`
3. Redeploy z `tools/` + `pm2 restart vcms-core`
4. **Health:** `curl http://127.0.0.1:8001/health` → `{"status":"OK"}`

## Co jest na prod

- Terminal UI v2 (`theme-terminal.css`, locale EN via `?locale=en`)
- KODA `/api/chat`, audit log API
- Dashboard PL domyślnie

## Następna sesja (Dowódca)

1. `szlif pod portfolio/VCMS_CURSOR_PROMPT_UPDATED.md`
2. Merge PR #18 → master (opcjonalnie)
3. Repo **services** — optymalizacja

## Lokalnie (nie w git)

- `docs/demo/*.mp4`, `ambient.mp3` — gitignored, na dysku po `npm run demo:all`
