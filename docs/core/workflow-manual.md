---
status: "[STABLE]"
title: "Workflow Manual (Canonical) — Orchestration SOP"
updated: "2026-04-09"
---

## Kanoniczny Workflow Manual

**Źródło prawdy (kanoniczna treść SOP)** jest w: [Poradnik Użytkownika](/PORADNIK_UZYTKOWNIKA).

Ten plik istnieje jako **bramka/entrypoint** dla warstwy Orchestration oraz jako stabilny artefakt do indeksowania przez VCMS (scanner rozpoznaje `workflow-manual.md`).

## Scope (co obejmuje SOP)

- **Orchestration (flex-vcms)**: scan → conflicts/map/repo pages → decyzje → handoff.
- **Ecosystem-wide**: praca na *jednym module na sesję*, z twardymi ograniczeniami z CORE.

## Single Source of Truth (moduły i ścieżki)

- Moduły i ścieżki są w `repos.yaml`.
- Root modułów: `C:\Users\FlexGrafik\FlexGrafik\github`

## Artefakty Orchestratora

Po uruchomieniu `node tools\vcms-scan.js` powstają:

- `data/vcms-index.json`
- `docs/ecosystem/conflicts.md`
- `docs/ecosystem/map.md`
- `docs/ecosystem/repos/*.md`
- Manualny dashboard (PH3-013): `docs/ecosystem/report.md`

## Hard constraints (nie negocjujemy)

- Zasady globalne: [global-rules.md](/core/global-rules)
- Granice agentów: [agent-boundaries.md](/agents/agent-boundaries)
- Protokół ratunkowy: [if-lost.md](/if-lost)
- Polityka bezpieczenstwa (Orchestrator): [security-policy.md](/core/security-policy)
- Kontrakt pracy asystenta (Orchestration): [assistant-workflow-contract.md](/core/assistant-workflow-contract)

## Quality Gates + DoD (Faza 3)

- Kanoniczna checklista weryfikacyjna: [phase-3-verification.md](/checklists/phase-3-verification)
- Manualne scenariusze testowe (Phase 3): [phase-3-test-scenarios.md](/checklists/phase-3-test-scenarios)

## Session Anchor + Handoff (Faza 3)

- Kanoniczna specyfikacja: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)

## Orchestration Commands (Faza 3)

- Kontrakty operacji Orchestratora: [orchestration-commands.md](/core/orchestration-commands)

