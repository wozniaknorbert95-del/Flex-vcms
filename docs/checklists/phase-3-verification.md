---
status: "[STABLE]"
title: "Phase 3 Verification — Quality Gates + DoD (Orchestration)"
---

# Phase 3 Verification — Quality Gates + DoD (Orchestration)

> Ten dokument jest kanoniczną checklistą zamknięcia Fazy 3 dla **Orchestration layer** (repo `flex-vcms`).
> Cel: **PASS/FAIL bez interpretacji**.

---

## Scope

- Dotyczy tylko: Orchestrator `flex-vcms` + artefakty generowane przez `node tools/vcms-scan.js`.
- Nie obejmuje: deploy na produkcję, zmian w stacku, automatyzacji poza tym repo.

## Single Source of Truth (must read)

- Zasady twarde: [global-rules.md](/core/global-rules)
- Granice agentów: [agent-boundaries.md](/agents/agent-boundaries)
- SOP pracy: [PORADNIK_UZYTKOWNIKA.md](/PORADNIK_UZYTKOWNIKA)
- Bramka manuala: [workflow-manual.md](/core/workflow-manual)
- Kontrakt pracy asystenta (Orchestration): [assistant-workflow-contract.md](/core/assistant-workflow-contract)
- Recovery: [if-lost.md](/if-lost)
- Manual test scenarios (Phase 3): [phase-3-test-scenarios.md](/checklists/phase-3-test-scenarios)

## Inputs / Outputs

### Inputs

- `repos.yaml` (root repo: `C:\Users\FlexGrafik\FlexGrafik\github`)
- `scan-rules.json`

### Outputs (po skanie)

- `data/vcms-index.json`
- `docs/ecosystem/conflicts.md`
- `docs/ecosystem/map.md`
- `docs/ecosystem/repos/*.md`

---

## Quality Gates (PH3-005)

> Zasada: jeśli jakikolwiek gate jest FAIL → **STOP**. Najpierw napraw, potem kontynuuj.

### Gate 0 — Safety / Guardrails compliance

- [ ] **PASS**: ta checklista i SOP są zgodne z:
  - manual deploy (Zasada 11)
  - 1-1-1 (jeden moduł na sesję)
  - zakaz autonomicznych zmian `global-rules.md` przez agentów
- **Evidence**: odnośniki w sekcji „Single Source of Truth”, w tym polityka bezpieczenstwa: [security-policy.md](/core/security-policy).

### Gate 1 — Scan runs

- [ ] **PASS**: komenda kończy się sukcesem:

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
node tools\vcms-scan.js
```

- **Evidence**: konsola zawiera „VCMS scan complete.” i listę wygenerowanych artefaktów.

### Gate 2 — Conflicts = 0

- [ ] **PASS**: `docs/ecosystem/conflicts.md` pokazuje **Conflicts found: 0**.
- **FAIL**: jakikolwiek konflikt > 0.
- **Recovery**:
  - wróć do SOP w `PORADNIK_UZYTKOWNIKA.md` („najpierw porządek, potem feature”)
  - jeśli utknąłeś: [if-lost.md](/if-lost)

### Gate 3 — Map correctness

- [ ] **PASS**: `docs/ecosystem/map.md` ma tabelę „Where is the truth (canonical pointers)”.
- [ ] **PASS**: linki `Repo page` w `docs/ecosystem/map.md` wskazują na istniejące pliki w `docs/ecosystem/repos/`.
- **Evidence**: otwarcie mapy + kliknięcie każdego `Repo page`.

### Gate 4 — Repo pages completeness

- [ ] **PASS**: dla każdego repo z `repos.yaml` istnieje repo page w `docs/ecosystem/repos/*.md`.
- [ ] **PASS**: repo page zawiera sekcje:
  - „Canonical pointers (truth)”
  - „Status” (Guardrails present / Handoffs ready / Last handoff)
  - „Quick links (by file type)”
- **Evidence**: szybki przegląd repo pages (po 1–2 min na repo).

### Gate 5 — Determinism (doc outputs)

> Cel: brak „losowych” zmian w raportach między uruchomieniami bez zmian w repo.

- [ ] **PASS**: dwa uruchomienia `node tools\vcms-scan.js` bez zmian w plikach nie zmieniają treści raportów w sposób nieuzasadniony.
- **Dopuszczalne**: `updated` wynikające ze stabilnego „ostatniego mtime” (a nie czasu uruchomienia).
- **Kryteria dopuszczalnych różnic (SSoT)**: OP-006 w [orchestration-commands.md](/core/orchestration-commands).
- **Evidence**:
  - porównaj diff (manualnie lub `git diff`) dla:
    - `docs/ecosystem/conflicts.md`
    - `docs/ecosystem/map.md`
    - 1 wybranej repo page z `docs/ecosystem/repos/`

### Gate 6 — Handoff standard

- [ ] **PASS**: najnowszy plik w `docs/handoffs/` spełnia minimalny format:
  - SESSIONANCHOR
  - CO ZMIENIONE / WAŻNE
  - NEXT (dokładnie 1 rzecz)
  - BLOCKER (lub „Brak”)
  - komenda weryfikacyjna (np. `node tools\vcms-scan.js`)
- **Evidence**: ręczny przegląd najnowszego handoff wg kanonicznej specyfikacji: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)

---

## Definition of Done — Phase 3 (PH3-015)

Faza 3 jest **DONE** jeśli spełnione są wszystkie warunki:

- [ ] Wszystkie Quality Gates (Gate 0–6) są PASS.
- [ ] Istnieje kanoniczny kontrakt pracy asystenta (PH3-001): [assistant-workflow-contract.md](/core/assistant-workflow-contract).
- [ ] PH3-002 jest domknięte: istnieje kanoniczny SOP w `docs/PORADNIK_UZYTKOWNIKA.md` i bramka `docs/core/workflow-manual.md` prowadzi do SOP.
- [ ] Istnieje kanoniczny kontrakt operacji (PH3-004): [orchestration-commands.md](/core/orchestration-commands) (OP-001..OP-006).
- [ ] Istnieją manualne scenariusze testowe (PH3-009): [phase-3-test-scenarios.md](/checklists/phase-3-test-scenarios) i są wykonalne lokalnie (Windows).
- [ ] Istnieje polityka bezpieczeństwa Orchestratora (PH3-011): [security-policy.md](/core/security-policy).
- [ ] Istnieje spec Session Anchor + Handoff (PH3-003/PH3-010): [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec).
- [ ] Istnieje dowód wykonania TS-001 + TS-005 (Gate evidence): `docs/handoffs/2026-04-09-phase3-gates-evidence.md`.
- [ ] Istnieje jeden kanoniczny dokument weryfikacyjny (ten plik) i jest linkowany z:
  - `docs/PORADNIK_UZYTKOWNIKA.md`
  - `docs/core/workflow-manual.md`
- [ ] Zasada blokująca jest respektowana: **nie dopisujemy Fazy 4+ dopóki wszystkie PH3-* nie są DONE** (chyba że istnieje jeden jawny wpis „waiver” z uzasadnieniem i datą).

