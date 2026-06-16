---
status: "[CANONICAL]"
title: "VCMS — Portfolio Truth (co jest / czego nie ma)"
date: "2026-06-16"
---

# VCMS Portfolio Truth

Jedna strona prawdy przed pokazaniem VCMS zawodowcom. Bez marketingu.

## Co VCMS **jest** (PROVEN)

| Capability | Dowód |
|------------|-------|
| Skan 8 repozytoriów | `npm run scan` → `data/vcms-index.json` |
| Wykrywanie konfliktów SSoT | `docs/ecosystem/conflicts.md` |
| Mapa ekosystemu | `docs/ecosystem/map.md` |
| Rejestr canonical brain/todo | `repos.yaml` + `docs/ecosystem/repos/` |
| Handoffy sesji | `docs/handoffs/` |
| Command center docs | VitePress `/docs` |
| Dashboard visual (governance) | Fiolet `--accent-primary` — nie emerald; `public/tokens.css` |
| Ops / security na prod | `docs/audits/latest-verification.md` |
| Weekly re-audit | PH4-018 cron + `npm run verify:prod-audit` |

## Czego VCMS **nie jest** (jeszcze)

| Obietnica | Status | Gdzie naprawdę |
|-----------|--------|----------------|
| LLM Gateway / KODA chat | **Aktywne** (RAG read-only) | `POST /api/chat` · wymaga klucza w `.env` |
| Governance audit log (kto/co/dlaczego) | **DEMO** | `data/governance-audit.jsonl` append po scan + `GET /api/v1/audit-log` |
| Human approval (HITL) | **Inny produkt** | `agent-os-ui` |
| Agent cards (UI) | **Roadmap** | `docs/agents/agent-boundaries.md` = prose |
| Deep Scan z VPS | **Lokalnie only** | `repos.yaml` ma ścieżki Windows |
| Severity info/warning/blocking | **PROVEN** | `scan-rules.json` + tally w `conflicts.md` |

## Jak pokazywać demo (60s)

1. `npm run scan`
2. Otwórz `docs/ecosystem/conflicts.md` (0 lub wykryte problemy)
3. Otwórz `docs/ecosystem/map.md`
4. Opcjonalnie: `npm start` → `http://localhost:8001/` → zakładka **KODA** (wymaga klucza LLM w `.env`)

**Nie pokazuj:** Deep Scan na prod VPS bez laptopa dev. **Nie myl:** KODA (analiza) ≠ Agent OS (egzekucja).

## Powiązane

- [VCMS Readiness Audit](./VCMS_READINESS_AUDIT.md)
- [Demo scan report](./demo/SCAN-REPORT.md)
