---
date: "2026-06-16"
task: "P0 portfolio honesty sprint"
status: "DONE"
---

# Handoff — P0 Portfolio Honesty Sprint

## CO zrobiono

| P0 | Fix |
|----|-----|
| P0-1 | LLM chat wyłączony: `public/index.html` (Governance tab), `KodaChat.vue` banner, README bez „Gateway” |
| P0-2 | README: dashboard `http://localhost:8001/` (nie `dashboard.html`) |
| P0-3 | `public/app.js`: `status: remote` bez crash na `repo.git` |
| P0-4 | `docs/VCMS_PORTFOLIO_TRUTH.md` — co jest / czego nie ma |
| P0-5 | `docs/demo/SCAN-REPORT.md` + `npm run scan` alias |

Dodatkowo: fake LLM metrics → Ecosystem Mode / Repo Count; backlog czyta `before_you_start`.

## Weryfikacja

```powershell
npm run scan   # Conflicts: 0 ✓
```

## NIE zrobiono (świadomie)

- Deploy na VPS (Zasada 11 — Dowódca)
- Commit (brak explicit request)
- PH4-017 mobile test (wymaga telefonu Dowódcy)
- Przywrócenie `/api/chat` (decyzja: hide, nie restore)

## NASTĘPNY KROK

1. **Deploy** `public/` + docs na VPS (`Deploy-VPS.ps1`) — żeby prod dashboard miał fix ecosystem
2. **PH4-017** — test 4G/5G z nowym hasłem Basic Auth
3. Opcjonalnie: commit P0 jako osobny focused PR

## Pliki

- `README.md`, `package.json`
- `public/app.js`, `public/index.html`
- `docs/.vitepress/components/KodaChat.vue`
- `docs/VCMS_PORTFOLIO_TRUTH.md`, `docs/demo/SCAN-REPORT.md`
- `docs/VCMS_READINESS_AUDIT.md` (update note)
