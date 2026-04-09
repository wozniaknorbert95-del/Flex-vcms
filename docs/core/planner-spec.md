---
status: "[STABLE]"
title: "Planner Spec — Next=1, Phase Lock, and Backlog Updates (PH3-007)"
updated: "2026-04-09"
---

# Planner Spec — Next=1, Phase Lock, and Backlog Updates (PH3-007)

Ten dokument jest kanoniczną specyfikacją dla „Planner” w Orchestratorze `flex-vcms`.
Planner to **manual-first proces** utrzymywania `NEXT=1` i aktualizacji `flex-vcms-todo.json` na podstawie artefaktów skanu + gates + handoffów — bez implementacji w modułach.

---

## Purpose

- Utrzymać **jednoznaczny priorytet pracy**: `NEXT (1 rzecz)` w dashboardzie i w handoffie.
- Aktualizować backlog Orchestratora (`flex-vcms-todo.json`) w sposób powtarzalny.
- Egzekwować **blokadę faz**: nie dopisujemy zadań Phase 4+ zanim Phase 3 jest DONE (chyba że istnieje jawny waiver).

## Scope / Non-goals

- Dotyczy tylko repo `flex-vcms` i plików SSoT/Derived w tym repo.
- Planner **nie** zmienia repo modułów w `ECOSYSTEM_ROOT`.
- Planner **nie** wykonuje deployu (manual-only).

## Zależności (SSoT)

- Gates + reguła blokująca Phase 4+: [phase-3-verification.md](/checklists/phase-3-verification)
- Ownership/STOP/BLOCKER: [ownership-and-escalation.md](/core/ownership-and-escalation)
- Ops (artefakty skanu): [orchestration-commands.md](/core/orchestration-commands)
- Artifacts lifecycle: [artifacts-standard.md](/core/artifacts-standard)
- Waivers register (jedno miejsce prawdy): [phase-waivers.md](/core/phase-waivers)

---

## Inputs (files)

Planner bazuje wyłącznie na:

- Backlog: `flex-vcms-todo.json`
- Artefakty skanu (Derived): `data/vcms-index.json`, `docs/ecosystem/conflicts.md`, `docs/ecosystem/map.md`, `docs/ecosystem/repos/*.md`
- Handoffs (SSoT): `docs/handoffs/*.md`
- Dashboard (SSoT): `docs/ecosystem/report.md`
- Waivery (SSoT): `docs/core/phase-waivers.md`

## Outputs (files)

- Aktualizacja `flex-vcms-todo.json` (statusy, `done_at`, `note`, priorytety jeśli potrzebne).
- Aktualizacja `docs/ecosystem/report.md`:\n
  - `NEXT (1 rzecz)`\n
  - `BLOCKER` (albo `Brak`)\n
  - (opcjonalnie) link do właściwego SSoT/spec

## No side-effects

- Brak zmian w repo modułów (tylko Orchestrator).
- PR-only workflow (feature branch → PR → merge).

---

## Blocking rule: Phase lock (Phase 4+)

Reguła jest kanoniczna w DoD Phase 3:

- **Nie dopisujemy Fazy 4+ dopóki wszystkie `PH3-*` nie są DONE**\n
  wyjątek: istnieje **jeden jawny wpis „waiver”** z uzasadnieniem i datą.

Miejsce prawdy dla waiverów: `docs/core/phase-waivers.md` (jedyny rejestr).

### Jak Planner egzekwuje blokadę

- Jeśli jakiekolwiek `PH3-*` ma status różny od `DONE`:\n
  - Planner **nie dodaje** nowych tasków Phase 4+ do `flex-vcms-todo.json`.\n
  - Wyjątek: istnieje wpis w `docs/core/phase-waivers.md` dla Phase 4+ (aktywny wg `review_by`).

---

## Planner algorithm (manual, deterministic)

### Krok 0 — Gates i STOP

- Jeśli `docs/ecosystem/conflicts.md` ma `Conflicts found > 0` → **STOP** (zgodnie z gates) i `NEXT=1` musi dotyczyć odblokowania.
- Jeśli gate jest FAIL → `NEXT=1` = naprawa gate (nie feature).

### Krok 1 — Wybór `NEXT=1` (źródła w kolejności)

1) Najnowszy handoff (`docs/handoffs/*`) i jego `SESSIONANCHOR.NEXT`.\n
2) Zaległe P0 w `flex-vcms-todo.json` (najpierw TODO).\n
3) Najbliższy sensowny task P1 zgodny z Phase 3 DoD.\n

Zasada: `NEXT` to **dokładnie jedno zdanie** (bez list).

### Krok 2 — BLOCKER

- Jeśli istnieje STOP lub brak możliwości postępu bez decyzji Dowódcy: ustaw `BLOCKER` wg standardu z `docs/core/ownership-and-escalation.md`.
- W przeciwnym wypadku: `BLOCKER: Brak`.

### Krok 3 — Aktualizacja `flex-vcms-todo.json`

Po zrobieniu pracy w `flex-vcms`:\n
- ustaw task na `DONE` i dodaj `done_at: YYYY-MM-DD`.\n
- w `note` dodaj wskazanie SSoT (np. `SSoT: docs/core/planner-spec.md`).\n

Zasada: Planner nie “sprząta” całego backlogu na raz. Aktualizuje tylko to, co dotyczy bieżącego `NEXT=1`.

---

## Verification (lokalnie)

- [ ] `NEXT (1 rzecz)` w `docs/ecosystem/report.md` jest dokładnie jedną rzeczą.\n
- [ ] Jeśli jakikolwiek gate FAIL → `NEXT=1` odnosi się do naprawy.\n
- [ ] Jeśli Phase 3 nie jest DONE i brak waivera → brak nowych zadań Phase 4+ w `flex-vcms-todo.json`.\n
- [ ] Waivery (jeśli są) są tylko w `docs/core/phase-waivers.md`.\n

---

## Maps to Quality Gates

- Gate 0: bezpieczeństwo i brak side-effectów (PR-only, read-only-first).\n
- Gate 6: standard `NEXT=1` i `BLOCKER` (handoff/dashboard).\n

