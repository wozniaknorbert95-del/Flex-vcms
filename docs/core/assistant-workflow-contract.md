---
status: "[STABLE]"
title: "Assistant Workflow (Orchestration) — Contract (flex-vcms)"
updated: "2026-04-09"
---

# Assistant Workflow (Orchestration) — Contract (flex-vcms)

Ten dokument jest kanonicznym kontraktem dla **PH3-001**: jak ma działać asystent w warstwie Orchestration (`flex-vcms`) — bez magii, bez deployu, bez zgadywania.

---

## Purpose

- Zapewnić powtarzalny workflow sesji: **scan → gates → decyzje → plan → (opcjonalnie implementacja w 1-1-1) → handoff**.
- Utrzymać „truth” w plikach/artefaktach Orchestratora, a nie w pamięci.

## Scope

- Dotyczy: repo `flex-vcms` (Orchestration layer) i artefaktów generowanych przez `node tools/vcms-scan.js`.
- Nie dotyczy: deploy na produkcję, zmian infrastruktury, automatyzacji zewnętrznych serwisów.

## Non-negotiables (hard constraints)

- **Read-only first**: decyzje i planowanie na artefaktach (`docs/`, `data/`) zanim dotkniesz kodu modułów.
- **1-1-1**: jeden moduł na sesję, jeden logiczny diff na iterację.
- **STOP rule**: jeśli jakikolwiek gate jest FAIL → STOP, naprawa, dopiero potem kontynuacja.
- **Deploy manual-only**: asystent nie wykonuje deployu autonomicznie.
- **No secrets**: absolutnie żadnych `.env*`, tokenów, kluczy itd. w kontekście/commitach.

Zobacz też: `docs/core/security-policy.md`, `docs/checklists/phase-3-verification.md`.

---

## Inputs (files)

Asystent ma prawo opierać się wyłącznie na SSoT i artefaktach Orchestratora:

- `repos.yaml`
- `scan-rules.json`
- `data/vcms-index.json`
- `docs/ecosystem/conflicts.md`
- `docs/ecosystem/map.md`
- `docs/ecosystem/repos/*.md`
- `docs/handoffs/*.md`
- CORE SSoT: `docs/core/*` oraz SOP: `docs/PORADNIK_UZYTKOWNIKA.md`

## Outputs (files)

Asystent może tworzyć/aktualizować wyłącznie w tym repo (Orchestrator), zgodnie z kontraktami:

- artefakty skanu (OP-001): `data/vcms-index.json`, `docs/ecosystem/*`
- dokumenty/checklisty w `docs/`
- handoffy w `docs/handoffs/` (koniec sesji)

## No side-effects

- **Nie modyfikuje repo modułów** w `ECOSYSTEM_ROOT` podczas Orchestration (scan/read/plan).
- Zmiany w module są osobną decyzją (po gates) i muszą respektować 1-1-1.

---

## Operating modes (jak asystent pracuje)

### Mode A — Read-only orchestration (default)

Cel: przejść przez scan + gates + repo selection bez zmian w kodzie.

- OP-001 scan
- OP-002 read-conflicts (STOP/GO)
- OP-003 read-map
- OP-004 read-repo-page
- (opcjonalnie) OP-006 determinism-check

### Mode B — Plan-only (no implementation)

Cel: zakończyć sesję planem/raportem i handoffem bez zmian w module.

- Artefakty + plan + handoff (Gate 6)
- Zero zmian w repo modułów

### Mode C — Implementation (po gates)

Cel: zrobić zmianę w dokładnie jednym module (1-1-1), a Orchestrator dostarcza kontekst i guardrails.

- Najpierw PASS: Gate 0–4 (minimum) oraz brak konfliktów
- Dopiero potem praca w module, zawsze z handoffem na koniec

---

## Failure modes (typowe i co robimy)

- **Conflicts > 0**: STOP; naprawa zgodnie z `docs/ecosystem/conflicts.md`.
- **Brak repo page / brak sekcji**: STOP; wróć do OP-001, napraw przyczynę, nie rób obejść.
- **Handoff invalid / missing**: FAIL Gate 6; popraw handoff wg spec i zwaliduj ponownie.
- **Determinism diff**: klasyfikuj wg OP-006 (mtime vs content); bez „akceptuję na oko”.

Recovery zawsze: `docs/if-lost.md`.

---

## Maps to Phase 3 (SSoT)

- Ops: `docs/core/orchestration-commands.md` (OP-001..OP-006)
- Gates / DoD: `docs/checklists/phase-3-verification.md`
- Manual test scenarios: `docs/checklists/phase-3-test-scenarios.md`
- Security: `docs/core/security-policy.md`
- Handoff: `docs/core/session-anchor-and-handoff-spec.md`

