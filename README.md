# VCMS — Local-First Orchestrator & Governance Docs

VCMS (Versioned Content Management & Supervision) to **orchestrator ekosystemu FlexGrafik**: skan repozytoriów, wykrywanie konfliktów SSoT, mapa modułów, handoffy i command center (docs + dashboard).

> **Uwaga:** Interaktywny LLM gateway (KODA / Control Lab) jest **wyłączony w tej wersji** — AI workflows przez Agent OS. Zobacz `docs/VCMS_PORTFOLIO_TRUTH.md`.

## Szybki start

```powershell
npm install
node tools\vcms-scan.js    # lub: npm run scan
```

Oczekiwany wynik: `Conflicts: 0`.

Opcjonalnie (serwer lokalny + dashboard):

```powershell
npm start
# Dashboard: http://localhost:8001/
```

## Gdzie jest prawda (SSoT)

- **Backlog:** [flex-vcms-todo.json](flex-vcms-todo.json)
- **Kontrakt Dowódcy:** [brain.md](brain.md)
- **Mapa modułów:** [docs/ecosystem/map.md](docs/ecosystem/map.md)
- **Konflikty:** [docs/ecosystem/conflicts.md](docs/ecosystem/conflicts.md)
- **Gotowość portfolio:** [docs/VCMS_READINESS_AUDIT.md](docs/VCMS_READINESS_AUDIT.md)

## Zasady

1. **1-1-1** — jedna sesja = jeden moduł.
2. **Brak sekretów** w repo (`.env` tylko lokalnie / na VPS).
3. **Deploy manual only** — Zasada 11.

## Monitoring

- **Dashboard:** `http://localhost:8001/` (po `npm start`)
- **Prod:** `https://cmd.flexgrafik.nl` (Basic Auth + docs)
- **Weekly audit:** `npm run verify:prod-audit`

