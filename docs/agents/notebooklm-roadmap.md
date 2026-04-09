---
status: "[STABLE]"
title: "NotebookLM — roadmap (RAG / drugi mózg)"
updated: "2026-04-09"
---

# NotebookLM — roadmap

**Cel:** użyć NotebookLM (lub podobnego RAG) jako **czytelnej warstwy** na dokumentacji VCMS + meta — *bez* zastępowania SSoT w repozytorium.

## Faza 0 — przygotowanie (lokalne)

- [ ] Wybór zestawu źródeł: `docs/core/*`, `docs/playbooks/*`, `flexgrafik-meta/docs/core/*` (wg uprawnień).
- [ ] Wykluczenia: `.env`, klucze, `node_modules`, binaria ([security policy](/core/security-policy)).

## Faza 1 — pierwszy notebook

- [ ] Jedna „książka” = **Orchestrator**: quickstart + PORADNIK + session anchor spec.
- [ ] Test: 5 pytań otrybowych (scan, conflicts, handoff) — odpowiedzi muszą zgadzać się z plikami w repo.

## Faza 2 — rozszerzenie

- [ ] Drugi notebook: **Wizard / zzpackage** (tylko publiczne / whitelisted docs z modułu).
- [ ] Procedura aktualizacji: po większej zmianie w Core — eksport / ponowne załadowanie źródeł.

## Ryzyka

- **Halucynacje RAG** — NotebookLM nie zastępuje `node tools\vcms-scan.js` ani `repos.yaml`.
- **Prywatność** — nie wgrywaj sekretów ani pełnych backupów DB.

## Status

Roadmapa robocza; realizacja **po** ustabilizowaniu lokalnego SSoT (Fazy 0–4 planu ekosystemu).
