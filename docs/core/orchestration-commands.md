---
status: "[STABLE]"
title: "Orchestration Commands — Contract (flex-vcms)"
updated: "2026-04-09"
---

# Orchestration Commands — Contract (flex-vcms)

Ten dokument jest **kanoniczną specyfikacją operacji (commands/ops)** wykonywanych dziś w Orchestratorze `flex-vcms`.
To nie są „magiczne komendy” — to **kontrakty** na realne operacje oparte o istniejące pliki i `tools/vcms-scan.js`.

---

## Zależności (SSoT)

- Workflow entrypoint: [workflow-manual.md](/core/workflow-manual)
- Artifacts standard (Phase 3): [artifacts-standard.md](/core/artifacts-standard)
- Security policy: [security-policy.md](/core/security-policy)
- Quality Gates (Phase 3): [phase-3-verification.md](/checklists/phase-3-verification)
- Manual test scenarios (Phase 3): [phase-3-test-scenarios.md](/checklists/phase-3-test-scenarios)
- Session Anchor + Handoff spec: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)
- Scanner implementation: `tools/vcms-scan.js`
- Scanner inputs: `repos.yaml`, `scan-rules.json`

---

## Szablon kontraktu (obowiązkowy dla każdej operacji)

- **Purpose**
- **How to run** (komenda lub manual)
- **Preconditions**
- **Inputs (files)**
- **Outputs (files)**
- **No side-effects**
- **Dry-run** (N/A + dlaczego, jeśli nie dotyczy)
- **Failure modes**
- **Recovery**
- **Maps to Quality Gates**

---

## OP-001 — scan (bazowa operacja Orchestratora)

- **Purpose**: wygenerować deterministyczny stan ekosystemu na podstawie `repos.yaml` + `scan-rules.json`.
- **How to run** (PowerShell):

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
node tools\vcms-scan.js
```

- **Preconditions**:
  - cwd = `C:\Users\FlexGrafik\Desktop\flex-vcms`
  - zgodność z [security-policy.md](/core/security-policy) (brak pracy na sekretach / brak skanowania poza whitelistą)
- **Inputs (files)**:
  - `repos.yaml` (root: `C:\Users\FlexGrafik\FlexGrafik\github`)
  - `scan-rules.json`
- **Outputs (files)** (z `tools/vcms-scan.js`):
  - `data/vcms-index.json`
  - `docs/ecosystem/conflicts.md`
  - `docs/ecosystem/map.md`
  - `docs/ecosystem/repos/*.md`
- **No side-effects**:
  - nie modyfikuje repo modułów w `C:\Users\FlexGrafik\FlexGrafik\github\*` (read-only skan)
  - nie wykonuje deployu
- **Dry-run**: N/A — ta operacja z definicji generuje artefakty; „dry-run” jest zastąpiony przez operacje odczytu OP-002..OP-004.
- **Failure modes**:
  - repo z `repos.yaml` nie istnieje na dysku → raportuje `MISSING_REPO` w artefaktach
  - błędny `repos.yaml` (format) lub `scan-rules.json` (JSON parse) → skan nie kończy się sukcesem
  - brak uprawnień FS → skan nie kończy się sukcesem
- **Recovery**:
  - protokół ratunkowy: [if-lost.md](/if-lost)
  - jeśli to błąd danych: wróć do `repos.yaml` i ścieżek, bez zgadywania
- **Maps to Quality Gates**:
  - Gate 1 (Scan runs)
  - Gate 2 (Conflicts = 0) — pośrednio przez `docs/ecosystem/conflicts.md`
  - Gate 3/4 (Map/repo pages)
  - Gate 5 (Determinism) — jako warunek wejściowy do porównań

---

## OP-002 — read-conflicts (manual)

- **Purpose**: podjąć decyzję STOP/GO na podstawie konfliktów ekosystemu.
- **How to run**: otwórz `docs/ecosystem/conflicts.md` po OP-001.
- **Preconditions**: OP-001 wykonane w tej samej sesji.
- **Inputs (files)**: `docs/ecosystem/conflicts.md`
- **Outputs (files)**: N/A (output = decyzja + ewentualny plan naprawy).
- **No side-effects**: tylko odczyt.
- **Dry-run**: N/A (to jest dry-run w sensie decyzyjnym).
- **Failure modes**: plik nie istnieje → OP-001 nie został wykonany.
- **Recovery**: uruchom OP-001.
- **Maps to Quality Gates**: Gate 2.

---

## OP-003 — read-map (manual)

- **Purpose**: wybrać repo docelowe i wejść na repo page bez zgadywania.
- **How to run**: otwórz `docs/ecosystem/map.md` po OP-001.
- **Preconditions**: OP-001 wykonane.
- **Inputs (files)**: `docs/ecosystem/map.md`
- **Outputs (files)**: N/A (output = wybrane repo + link do repo page).
- **No side-effects**: tylko odczyt.
- **Dry-run**: N/A.
- **Failure modes**: brak mapy → OP-001 nie wykonane.
- **Recovery**: uruchom OP-001.
- **Maps to Quality Gates**: Gate 3.

---

## OP-004 — read-repo-page (manual)

- **Purpose**: uzyskać canonical pointers i readiness repo (guardrails/handoffs/last_handoff).
- **How to run**: otwórz `docs/ecosystem/repos/<slug>.md` po OP-001.
- **Preconditions**: OP-001 wykonane.
- **Inputs (files)**: `docs/ecosystem/repos/*.md`
- **Outputs (files)**: N/A (output = canonical brain/todo + readiness).
- **No side-effects**: tylko odczyt.
- **Dry-run**: N/A.
- **Failure modes**: brak repo pages → OP-001 nie wykonane lub błąd zapisu.
- **Recovery**: uruchom OP-001; jeśli powtarzalne → eskaluj wg `if-lost`.
- **Maps to Quality Gates**: Gate 4.

---

## OP-005 — handoff-validate (manual)

- **Purpose**: wykonać PASS/FAIL Gate 6 na najnowszym handoffie.
- **How to run**:
  1) znajdź najnowszy plik w `docs/handoffs/`
  2) waliduj wg: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)
- **Preconditions**: istnieje co najmniej jeden handoff.
- **Inputs (files)**:
  - `docs/handoffs/*.md`
  - `docs/core/session-anchor-and-handoff-spec.md`
- **Outputs (files)**: N/A (output = PASS/FAIL).
- **No side-effects**: tylko odczyt.
- **Dry-run**: N/A.
- **Failure modes**: brak handoffów lub brak sekcji/kluczy.
- **Recovery**: utwórz handoff zgodny ze spec i wróć do walidacji.
- **Maps to Quality Gates**: Gate 6.

---

## OP-006 — determinism-check (manual)

- **Purpose**: potwierdzić brak „losowych” zmian w raportach między uruchomieniami bez zmian w repo.
- **How to run**:
  1) uruchom OP-001
  2) bez zmian w plikach uruchom OP-001 drugi raz
  3) porównaj diff (manualnie lub `git diff`) dla:
     - `docs/ecosystem/conflicts.md`
     - `docs/ecosystem/map.md`
     - 1 wybranej repo page w `docs/ecosystem/repos/`
- **Preconditions**: brak zmian w repo pomiędzy uruchomieniami.
- **Inputs (files)**: artefakty `docs/ecosystem/*`.
- **Outputs (files)**: N/A (output = PASS/FAIL).
- **No side-effects**: tylko odczyt + uruchomienie OP-001.
- **Dry-run**: N/A.
- **Allowed diffs (PASS/FAIL bez uznaniowości)**:
  - **Dopuszczalne (PASS)**: zmiany pól typu `updated`/`lastUpdatedAt`/`stableUpdatedAt` **tylko jeśli** wynikają z faktycznej zmiany wejściowego **mtime** w repo (w `ECOSYSTEM_ROOT`), a nie z czasu uruchomienia skanu.
  - **Niedopuszczalne (FAIL)**: jakakolwiek zmiana treści merytorycznej raportów (np. lista konfliktów, canonical pointers, readiness, listy plików/linków) bez odpowiadającej zmiany w danych wejściowych.
  - **Niedopuszczalne (FAIL)**: zmiany o charakterze losowym/niestabilnym (np. różna kolejność wierszy bez przyczyny, losowe ID, timestamp „czas runu”, flapping whitespace), jeśli łamią powtarzalność treści.
  - **Dopuszczalne (warunkowo)**: zmiany formatowania/whitespace wynikające z jednorazowej korekty generatora — ale po tej korekcie kolejne dwa runy bez zmian nie mogą już generować diff (inaczej FAIL).
  - **Wymóg evidence**: jeśli diff ≠ pusty, PASS wymaga wpisania w handoff: (a) które pliki się zmieniły, (b) klasyfikacji przyczyny `mtime` vs `content`, (c) decyzji PASS/FAIL.
- **Failure modes**: „diff” się zmienia → najpierw ustal czy zmieniły się mtime w repo (to jest wejście dla stableUpdatedAt).
- **Recovery**: ustal źródło zmiany (mtime vs treść) zanim zaakceptujesz.
- **Maps to Quality Gates**: Gate 5.

