---
date: "2026-06-16"
task: "VCMS Enterprise Polish — KODA & OpenCode Styling"
status: "DONE"
---

# Handoff — VCMS OpenCode Polish + KODA Reactivation

## CO zrobiono

| Obszar | Zmiana |
|--------|--------|
| **UX OpenCode** | `public/styles.css`, `public/tokens.css`, `docs/.vitepress/theme/style.css` — ciemny motyw fx-*, JetBrains Mono, twarde bordery 6–8px |
| **KODA backend** | `POST /api/chat` w `src/routes/api.js` + `src/logic/koda-chat.js` (OpenRouter → Gemini fallback, RAG z `getContextData`, rate limit + Joi) |
| **KODA frontend** | Zakładka KODA w dashboardzie (`public/index.html`, `public/app.js`), `KodaChat.vue` aktywny |
| **Action Log** | `GET /api/v1/audit-log` → `data/governance-audit.jsonl` (`tools/vcms-audit-log.js` `readRecentEvents`) |
| **Architektura SSoT** | `brain.md`, `docs/agents/agent-boundaries.md`, `VCMS_PORTFOLIO_TRUTH.md`, `README.md`, runbook |

## Podział ról (CANONICAL)

- **flex-vcms** = Governance / Nadzór (read-only) + KODA RAG
- **agent-os-ui** = Execution / HITL

## Weryfikacja lokalna

```powershell
cd flex-vcms
npm test
npm run scan
npm start
# Dashboard → KODA tab (wymaga klucza w .env)
# curl -X POST http://127.0.0.1:8001/api/chat -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"parts\":[{\"text\":\"Co to VCMS?\"}]}]}"
```

## Deploy (ręcznie — Zasada 11)

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget root@185.243.54.115
# Upewnij się że .env na VPS ma OPENROUTER_API_KEY lub GEMINI_API_KEY
# pm2 reload ecosystem.config.js --update-env
```

## NASTĘPNY KROK

1. Wgrać / zweryfikować klucz LLM na VPS i smoke `POST /api/chat` przez Basic Auth.
2. Opcjonalnie: `npm run docs:build` przed deploy (VitePress theme).

## BLOCKER

Brak klucza LLM w `.env` na środowisku docelowym → KODA zwróci 503 (kontrolowany komunikat).
