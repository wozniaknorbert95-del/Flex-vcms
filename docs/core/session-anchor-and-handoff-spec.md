---
status: "[STABLE]"
title: "Session Anchor + Handoff Spec — Canonical Contract"
updated: "2026-04-09"
---

# Session Anchor + Handoff Spec — Canonical Contract

Ten dokument jest **kanoniczną specyfikacją** dla:
- **PH3-003**: Session Anchor schema (minimalny stan sesji)
- **PH3-010**: Handoff spec + walidacja (PASS/FAIL)

Cel: handoff ma być **kontraktem** (mierzalny, weryfikowalny), a nie luźnym opisem.

---

## Scope

- Dotyczy: `flex-vcms` (Orchestration layer) + standard, który można przenieść do innych repo.
- Nie dotyczy: deploy na produkcję, zmian w stacku, automatyzacji narzędzi.

## Zależności (SSoT)

- Quality Gates / DoD: [phase-3-verification.md](/checklists/phase-3-verification) (Gate 6)
- SOP sesji: [PORADNIK_UZYTKOWNIKA.md](/PORADNIK_UZYTKOWNIKA)
- Hard constraints: [global-rules.md](/core/global-rules)
- Recovery: [if-lost.md](/if-lost)

---

## 1) Session Anchor (PH3-003)

### 1.1 Wymóg

Każdy handoff musi zawierać sekcję `SESSIONANCHOR` z **tym samym zestawem kluczy** (1 linia = 1 wartość), żeby dało się to:\n
- przeczytać szybko jako człowiek\n
- wyciągnąć maszynowo (regex) bez zgadywania.

### 1.2 Format (kanoniczny)

W handoffie zapisujesz:

```
## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: 3
MODULE: flex-vcms
WORKSPACE_ROOT: C:\Users\FlexGrafik\Desktop\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
VERIFY: node tools\vcms-scan.js
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/ecosystem/map.md; docs/ecosystem/repos/*.md
CONFLICTS: 0
LAST_HANDOFF: docs/handoffs/YYYY-MM-DD-<topic>.md
NEXT: <dokładnie jedna rzecz>
BLOCKER: Brak
```

### 1.3 Reguły

- `NEXT` to **dokładnie jedna rzecz** (jedno zdanie, bez list).
- `BLOCKER` zawsze istnieje: `Brak` albo 1-liniowy opis + impact.
- `VERIFY` ma być uruchamialne lokalnie (PowerShell) i odnosić się do artefaktów Orchestratora.

### 1.4 Gdzie przechowujemy anchor?

- Default: **tylko w handoffie** (unikamy dodatkowych plików stanu).
- Jeśli kiedyś potrzebujesz automatycznej walidacji: dopuszczamy derived artefakt `data/session-anchor.json`, ale to jest **poza zakresem** tej fazy.

---

## 2) Handoff spec (PH3-010)

### 2.1 Minimalne sekcje (wymagane)

Każdy handoff ma mieć sekcje w tej kolejności:

1) `SESSIONANCHOR`\n
2) `CO ZMIENIONE / WAŻNE`\n
3) `NEXT (1 rzecz)`\n
4) `BLOCKER`\n
5) `Weryfikacja`\n

### 2.2 Reguły treści (anti-hallucination)

- `CO ZMIENIONE / WAŻNE` musi zawierać:\n
  - listę plików/artefaktów (ścieżki)\n
  - oraz 1–3 zdania „co to zmienia” (fakty, bez marketingu)\n
- `NEXT (1 rzecz)` nie może być listą.\n
- `Weryfikacja` musi zawierać:\n
  - komendę (np. `node tools\vcms-scan.js`)\n
  - oczekiwany wynik (np. `Conflicts: 0`)\n

### 2.3 Nazewnictwo i lokalizacja

- Lokalizacja: `docs/handoffs/`
- Nazwa pliku:\n
  - `YYYY-MM-DD-<short-topic>.md`\n
  - lub dla faz: `YYYY-MM-DD-phaseX-<topic>.md`\n

---

## 3) Walidacja (PASS/FAIL) — 5 minut

> To jest kanoniczna walidacja Gate 6 (Phase 3 Verification).

### PASS jeśli:

- [ ] Najnowszy handoff ma sekcje minimalne z 2.1.\n
- [ ] `SESSIONANCHOR` ma wszystkie klucze z 1.2.\n
- [ ] `NEXT` jest dokładnie 1 rzecz.\n
- [ ] `BLOCKER` jest obecny (może być `Brak`).\n
- [ ] `VERIFY` jest wykonalne, a wynik jest zgodny (np. `Conflicts: 0`).\n

### FAIL jeśli:

- brakuje sekcji lub kluczy\n
- `NEXT` ma więcej niż jedną rzecz\n
- brak komendy weryfikacyjnej lub brak spodziewanego wyniku\n

---

## 4) Raporty agentów (audyt read-only) — jakość minimalna

Dotyczy raportów typu „READ-ONLY audit” (Antigravity, inne agenty), które **nie** są pełnym handoffem sesji, ale maja byc **falsyfikowalne** i zgodne z kontraktem `NEXT (1 rzecz)`.

### 4.1 Wymagane pola / reguły

1. **DATA_RAPORTU** = data faktycznego odczytu plików (nie „wczorajsza” data systemowa przy stanie repo z jutra).
2. **SESSIONANCHOR (skrót)** zawiera co najmniej: repo, fokus, oraz **`session_anchor.id`** z `flex-vcms-todo.json` (jeśli dotyczy bieżącej pracy), nie tylko `branch`.
3. **`NEXT (1 rzecz)`** = jedna **decyzja lub jedna akcja**, którą mozna wykonac w jednym kroku (np. „Wykonaj smoke PASS wg vcms-prod-smoke.md”). Unikaj „pipeline w jednym zdaniu” (deploy + smoke + mobile + zamkniecie backlogu) — to jest wiele rzeczy.
4. Po **`node tools/vcms-scan.js`** raport dopisuje: czy **working tree** jest czysty (`git status` — brak niezamierzonych zmian w artefaktach skanu), albo wprost: „nie sprawdzono”.

### 4.2 PASS / FAIL (szybko)

- **PASS**: powyzsze 4 punkty spelnione lub jawnie oznaczone jako „nie dotyczy / nie sprawdzono” tam gdzie brak danych.
- **FAIL**: sprzeczne daty, brak `session_anchor.id` przy odwolaniu do backlogu, albo `NEXT` jako lista ukryta w jednym zdaniu.

Powiazane operacyjnie: [PH4-011 operator runbook](/reference/ph4-011-operator-runbook), [PH4-011 mobile prep](/checklists/ph4-011-mobile-prep).

