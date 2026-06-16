# VCMS — Local-First Orchestrator & Governance Docs

**Versioned Content Management & Supervision** — orchestrator ekosystemu FlexGrafik: skan repozytoriów, wykrywanie konfliktów SSoT, mapa modułów, handoffy i command center (docs + dashboard).

> Interaktywny LLM gateway (KODA) jest **wyłączony** — AI workflows przez Agent OS. Zobacz [Portfolio Truth](docs/VCMS_PORTFOLIO_TRUTH.md).

## Szybki start

```powershell
npm install
npm run scan
```

Oczekiwany wynik: `Conflicts: 0`.

Opcjonalnie (serwer lokalny + dashboard):

```powershell
npm start
# Dashboard: http://localhost:8001/
```

## Scan → read report

| Krok | Komenda / plik |
|------|----------------|
| 1 | `npm run scan` |
| 2 | [conflicts.md](docs/ecosystem/conflicts.md) — wynik (0 = zielone) |
| 3 | [map.md](docs/ecosystem/map.md) — 8 modułów |
| 4 | [SCAN-REPORT demo](docs/demo/SCAN-REPORT.md) — skrypt pokazania klientowi |

## Co VCMS jest / czego nie jest

| | |
|-|-|
| **Jest** | Skan, konflikty SSoT, mapa, handoffy, ops audit, weekly re-audit |
| **Nie jest (jeszcze)** | LLM chat, governance JSON audit log, severity matrix, HITL UI |

Szczegóły: [VCMS_PORTFOLIO_TRUTH.md](docs/VCMS_PORTFOLIO_TRUTH.md) · [DoD Scorecard](docs/VCMS_DOD_SCORECARD.md)

## Status legend (PROVEN / DEMO / PLANNED)

| Funkcja | Status | Gdzie |
|---------|--------|-------|
| Repo / content scan | **PROVEN** | `tools/vcms-scan.js` |
| Conflict detection | **PROVEN** | `docs/ecosystem/conflicts.md` |
| SSoT registry | **PROVEN** | `repos.yaml`, deploy-context |
| Conflict severity (info/warning/blocking) | **PLANNED** | Roadmap 30d — dziś binarne 0/N |
| Governance audit log | **PLANNED** | Handoffy = lightweight trail |
| Human approve / reject | **DEMO** | `agent-os-ui` HITL; handoffy w VCMS |
| Agent cards UI | **DEMO** | `agent-os-ui` + portfolio assets |

## Approve / reject (human-in-the-loop)

VCMS **nie** hostuje approval UI. Proces review:

1. **Agent OS / Mission Control** — approval gates przed deployem (HITL).
2. **Handoffy** — `docs/handoffs/` dokumentują decyzje sesji.
3. **Zasada:** *The system proposes; a human approves what ships.*

## Gdzie jest prawda (SSoT)

- **Backlog:** [flex-vcms-todo.json](flex-vcms-todo.json)
- **Kontrakt Dowódcy:** [brain.md](brain.md)
- **Mapa modułów:** [docs/ecosystem/map.md](docs/ecosystem/map.md)
- **Konflikty:** [docs/ecosystem/conflicts.md](docs/ecosystem/conflicts.md)
- **Portfolio / sprzedaż:** [VCMS_SALES_REPORT.md](docs/VCMS_SALES_REPORT.md)

## Zasady

1. **1-1-1** — jedna sesja = jeden moduł.
2. **Brak sekretów** w repo (`.env` tylko lokalnie / na VPS).
3. **Deploy manual only** — Zasada 11.

## Monitoring

- **Dashboard:** `http://localhost:8001/` (po `npm start`)
- **Prod:** `https://cmd.flexgrafik.nl` (Basic Auth + docs)
- **Weekly audit:** `npm run verify:prod-audit`

## Design

Dashboard używa tokenów governance (fiolet, nie emerald). SSoT: [docs/design/VCMS_UI_TOKENS.md](docs/design/VCMS_UI_TOKENS.md) · `public/tokens.css`.

## Portfolio (Quietforge)

Publiczna prezentacja: [flexgrafik-services.vercel.app](https://flexgrafik-services.vercel.app/) — repo `services`. Copy musi być zgodne z Portfolio Truth (bez „LLM gateway” przy VCMS).
