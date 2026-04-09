---
status: "[STABLE]"
title: "Ownership & Escalation — Decision Rights, STOP Rules, BLOCKER Standard (PH3-014)"
updated: "2026-04-09"
---

# Ownership & Escalation — Decision Rights, STOP Rules, BLOCKER Standard (PH3-014)

Ten dokument jest kanonicznym kontraktem „kto decyduje i co robimy, gdy utknęliśmy” dla Orchestratora `flex-vcms`.
Cel: decyzje mają być szybkie, powtarzalne i weryfikowalne — bez zgadywania i bez rozlewania odpowiedzialności.

---

## Scope

- Dotyczy: pracy w repo `flex-vcms` (Orchestration layer) oraz decyzji operacyjnych wokół artefaktów skanera.
- Nie dotyczy: deploy na produkcję, zmiany infrastruktury, automatyzacje zewnętrzne.

## Zależności (SSoT)

- Hard constraints / tryby pracy: [assistant-workflow-contract.md](/core/assistant-workflow-contract)
- Safety / zakazy: [security-policy.md](/core/security-policy)
- Gates / STOP rule: [phase-3-verification.md](/checklists/phase-3-verification)
- Session Anchor / Handoff / NEXT=1: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)
- Ops: [orchestration-commands.md](/core/orchestration-commands)
- Artifacts ownership + lifecycle: [artifacts-standard.md](/core/artifacts-standard)
- Recovery: [if-lost.md](/if-lost)

---

## Definicje (minimalne)

- **Dowódca**: właściciel produktu/systemu; podejmuje decyzje ryzykowne i arbitrażowe.
- **Asystent**: wykonawca w ramach kontraktów; proponuje warianty i robi zmiany tylko w dozwolonym zakresie.
- **Reviewer**: osoba/rola akceptująca PR (w praktyce może to być Dowódca).
- **SSoT**: manualne źródło prawdy w `docs/*` (nie generowane przez skaner).
- **Derived**: artefakt nadpisywany przez narzędzie (np. `docs/ecosystem/*`, `data/vcms-index.json`).
- **STOP**: twarda blokada pracy — najpierw usuwamy przyczynę, dopiero potem kontynuujemy.

---

## Decision rights (kto decyduje)

### Zasada nadrzędna

- **Dowódca decyduje o priorytetach i ryzyku.** Asystent może decydować tylko w granicach kontraktów (SSoT + gates).

### Asystent może decydować samodzielnie (safe decisions)

- Uzupełnianie/utrzymanie SSoT w `flex-vcms` w sposób zgodny z istniejącymi kontraktami.
- Drobne poprawki spójności treści w `docs/` (format, linki, nazwy), jeśli nie zmieniają sensu.
- Aktualizacja `docs/ecosystem/report.md` po OP-001 oraz utrzymanie `flex-vcms-todo.json`.

### Asystent nie może decydować samodzielnie (requires Dowódca)

- Zmiana priorytetów (co jest NEXT) inaczej niż „NEXT=1” z `SESSIONANCHOR`/handoff.
- Zmiana kontraktów globalnych/zakazów (np. odkręcanie security rules, naruszenie 1-1-1).
- Praca w repo modułów poza `flex-vcms` bez przejścia gates i bez jawnej decyzji wejścia w Mode C.
- Każdy krok, który wymagałby obejścia STOP rule (np. „idź dalej mimo FAIL”).

---

## STOP rules (kiedy zatrzymujemy pracę)

### STOP natychmiast (P0)

Zatrzymaj pracę i przejdź do „Escalation ladder” jeśli zachodzi którekolwiek:

- **Gate FAIL**: jakikolwiek gate z `docs/checklists/phase-3-verification.md` jest FAIL (w tym Conflicts > 0).
- **Sekret / dane wrażliwe**: podejrzenie lub wykrycie sekretu w pliku, diffie, artefaktach skanu (patrz `security-policy.md`).
- **Out-of-scope**: praca wymaga produkcji / zewnętrznych serwisów / deployu / zmian infrastruktury.
- **Niejasna prawda (SSoT conflict)**: nie da się wskazać źródła prawdy bez arbitrażu (np. dwa równorzędne „canonical”).
- **Scope creep**: pojawia się nowy cel uboczny, który rozbija 1-1-1 lub NEXT=1.

### STOP techniczny (P1)

- **Niedeterministyczne artefakty**: OP-006 determinism-check FAIL (trzeba naprawić generator lub wskazać przyczynę).
- **Brak minimalnych artefaktów**: nie da się uruchomić OP-001 albo brakuje `docs/ecosystem/*` po skanie.

---

## Escalation ladder (jak eskalujemy)

### Poziom 0 — Samonaprawa w granicach kontraktu

Jeśli STOP wynika z czegoś lokalnego i jednoznacznego w `flex-vcms`:

- napraw w PR (bez zmian w repo modułów),
- dodaj evidence do `docs/ecosystem/report.md` lub handoffa (jeśli to koniec sesji),
- wróć do gates.

### Poziom 1 — BLOCKER do Dowódcy (standard)

Jeśli STOP wymaga decyzji lub ryzyka:

- wpisz **BLOCKER** zgodnie ze standardem poniżej (1 linia w Session Anchor/handoff, pełne szczegóły w sekcji BLOCKER body),
- podaj 1–2 opcje z trade-offami,
- ustaw **NEXT=1** na „odblokowanie” (nie na feature).

### Poziom 2 — Freeze scope (gdy chaos)

Jeśli w ciągu jednej sesji pojawia się 2+ STOP albo kontekst jest niespójny:

- wróć do `docs/if-lost.md`,
- uruchom OP-001,
- ogranicz się do 1 repo (1-1-1) i 1 decyzji.

---

## Standard BLOCKER (format)

### 1) Krótka linia (do SESSIONANCHOR i do nagłówka handoffa)

Format (jedna linia):

`BLOCKER: <co> — impact=<Low|Med|High> — owner=<Dowódca|Asystent|Tooling> — next=<1 akcja>`

Przykład:

`BLOCKER: Conflicts>0 w ecosystem scan — impact=High — owner=Tooling — next=naprawić canonical pointers wg conflicts.md`

### 2) Pełny opis (w treści handoffa / PR)

Minimalne pola (w tej kolejności):

- **Cause**: co jest przyczyną (fakt, nie hipoteza).
- **Evidence**: ścieżka do pliku/artefaktu + co tam widać.
- **Impact**: co blokuje i jak bardzo (Low/Med/High).
- **Owner**: kto ma uprawnienie podjąć decyzję/wykonać zmianę.
- **Options**: 1–3 opcje z koszt/ryzyko.
- **Recommendation**: jedna rekomendacja (jeśli jest).
- **Unblock criteria**: co oznacza „odblokowane” (PASS/FAIL warunek).

---

## How to verify (lokalnie)

- Potwierdź, że STOP rule jest respektowana: jeśli Gate FAIL → praca nie idzie dalej „feature’owo”.
- Potwierdź, że `NEXT` jest zawsze dokładnie 1 rzecz (SESSIONANCHOR + report/handoff).
- Potwierdź, że BLOCKER ma wymagane pola (linia + body, jeśli potrzebne).

---

## Maps to Quality Gates

- **Gate 0 (Safety)**: STOP rules + eskalacja ryzyka.
- **Gate 6 (Handoff standard)**: BLOCKER i NEXT=1 jako twardy standard raportowania.

