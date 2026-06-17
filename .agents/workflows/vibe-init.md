---
description: Start sesji VCMS — scan ekosystemu, klasyfikacja zadania, routing Standard vs Fast-Track.
---

# /vibe-init

## Goal

Mapowanie sytuacji, wczytanie zasad orchestratora i wybór ścieżki (Standard vs Fast-Track) dla pracy w flex-vcms lub cross-repo.

## Input

Problem/ticket od Dowódcy, opcjonalnie ścieżka do handoffu w `docs/handoffs/`.

## Agent procedure

### KROK 0 — Odśwież stan ekosystemu (VCMS, obowiązkowy przy nowej sesji CORE)

PowerShell (repo root `flex-vcms`):

```powershell
Set-Location "C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms"
node tools\vcms-scan.js
```

**Must-check po skanie:**

- `docs/ecosystem/conflicts.md` → **Conflicts: 0** (jeśli >0, STOP — porządek przed feature)
- `docs/ecosystem/map.md` → wybór repo docelowego
- `docs/ecosystem/repos/*.md` → canonical brain/todo + readiness

### KROK 1 — Kontekst sesji

- Przeczytaj `AGENTS.md`, `docs/PORADNIK_UZYTKOWNIKA.md` (skim).
- Jeśli kontynuacja: ostatni `docs/handoffs/YYYY-MM-DD-*.md` lub `V-FILES` z handoffu.
- Opcjonalnie (cross-repo): `../../flexgrafik-meta/docs/core/global-rules.md`, `master-plan.md` — tylko gdy zadanie dotyka strategii lub pricing.

### KROK 2 — Klasyfikacja

| Sygnały | TASK_CLASSIFICATION | Fast-Track? |
|---------|---------------------|-------------|
| Nowa funkcja, multi-file, zmiana `repos.yaml`/skaner | **Feature** | Nie → `/blast` |
| Bug, regresja, przyczyna nieznana | **Bugfix** | Nie → `/debug` lub `/blast` |
| Znana przyczyna, wąski fix, pilność prod | **Hotfix** | Tak → deploy prep |
| Wdrożenie VCMS docs/VPS, sync artefaktów skanu | **Deploy** | Tak → `/deploy-cf` po audit |
| Orchestrator-only: scan + map + handoff docs | **Orchestrator** | Często Trivial → implement docs |

### KROK 3 — Router

- **Deploy/Hotfix:** nie wchodź w głęboką analizę architektury — następny krok to audit lub deploy prep.
- **Feature/Bugfix:** jeśli scope >1 plik lub brak DoD → `/blast`.
- **Conflicts >0:** RECOMMENDED_NEXT = napraw konflikty (osobna sesja), nie feature.

## Do

- Uruchom `vcms-scan.js` na starcie sesji (chyba że Dowódca potwierdzi świeży scan <1h).
- Emituj strukturalny Output.
- Dla cross-repo wskaż **target repo** z `repos.yaml` / `map.md`.

## Don't

- Nie implementuj kodu w tym kroku (wyjątek: jedna atomowa akcja na wyraźną prośbę Dowódcy).
- Nie ignoruj Conflicts >0.
- Nie deployuj autonomicznie (Zasada 11).

## Output

```text
TASK_CLASSIFICATION: [Feature|Bugfix|Hotfix|Deploy|Orchestrator]
TARGET_REPO: [flex-vcms|zzpackage|jadzia-core|...|NONE]
CONSTRAINTS: [np. Conflicts:0, Zasada 11, read-only meta]
RISKS: [np. stale map, partial handoff]
MISSING: [NONE|lista]
SCAN: [Conflicts: N | SKIPPED with reason]
READY: [YES|NO]

---
CURRENT_STAGE: F1-Plan
RECOMMENDED_NEXT: [/blast | /debug | /audit-red-team | /deploy-cf]
WHY_NEXT: [1 zdanie]
---
```

## Done when

Agent wypisał klasyfikację, wynik skanu (lub uzasadniony SKIP), target repo i jedną rekomendowaną komendę — bez przedwczesnej implementacji.

---

# /cleanup-mode

## Goal

Bezpieczne, etapowe sprzątanie repo: usunięcie martwego kodu, nieużywanych narzędzi, artefaktów, wyeksponowanych sekretów — z zachowaniem SSoT (Conflicts: 0), PR-only workflow i brak regresji.

## When to Use

- Repozytorium napromadowało osierocone pliki, starą dokumentację, nieużywane skrypty.
- Chcemy opuścić "domyślną brudność" — przed dużą refaktoryzacją lub polishing sesją.
- Zawsze: **tylko inwentaryzacja + report**, zanim cokolwiek usuniemy.

## Input

- Problem: "Sprzątnąć repo" / "Clean up dead code and orphaned docs"
- Mode: Conservative (rekomendowane) = tylko dowody "unused"; Aggressive = pending removal flag
- Kontekst: najnowszy `docs/handoffs/` oraz `flex-vcms-todo.json` (co się robi teraz)

## Agent Procedure

### FAZA 1 — Inwentaryzacja (Discovery)

```powershell
Set-Location "C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms"
# Krok 1: Skan SSoT
node tools\vcms-scan.js
# Weryfikacja: docs/ecosystem/conflicts.md → Conflicts: 0

# Krok 2: Higiena repo
git status --porcelain
git clean -ndX

# Krok 3: Sekrety (manual, brak gitleaks w CLI)
# Szukaj: OPENROUTER, GEMINI, api_key, private_key, secret, password
# Sprawdź: czy .env/.env.keys w .gitignore

# Krok 4: Duże pliki
Get-ChildItem -Recurse -File | Where-Object {$_.Length -gt 50MB} | ForEach-Object {Write-Host $_.FullName}
```

### FAZA 2 — Identyfikacja Kandydatów

- **Martwy kod (tools/):**
  - Porównaj pliki w `tools/*` z wpisami w `package.json` scripts + handoff references
  - Szukaj: narzędzia bez skryptów lub importów w codebase
  
- **Dokumentacja osierocona (docs/):**
  - `docs/archive/*` — pliki starsze niż 60 dni, bez referencji
  - `docs/templates/*` — szablony nieużywane
  - `docs/plans/*` — stare plany, superseded przez aktywne backlog

- **Secrets & Security:**
  - Verify `.env`, `.env.keys` in `.gitignore`
  - Scan for exposed API keys, tokens, passwords in tracked files

### FAZA 3 — Report Kandydatów

Dokument: `docs/handoffs/YYYY-MM-DD-cleanup-session-N-candidates.md`

Dla każdego kandydata:
- **File:** ścieżka
- **Reason:** powód (unused, superseded, orphaned)
- **Evidence:** dowód (grep output, no refs, archive folder, etc.)
- **Impact:** LOW/MEDIUM/HIGH
- **Decision:** remove now / pending / hold

### FAZA 4 — Akceptacja & Execution (After Dowódca approval)

Małe, atomowe commity:

```powershell
# Per candidate or logically grouped:
git rm tools/remote-sync-helper.js
git commit -m "chore(cleanup): remove unused tools/remote-sync-helper.js

Evidence: No references found in repo. Tool was dead code.
"

# Batch docs:
git rm docs/archive/*.json
git commit -m "chore(cleanup): remove superseded todo files

Files: todo-10-orphan.json, todo-root-legacy-2026-04-04.json
Evidence: Replaced by canonical flex-vcms-todo.json; zero active refs.
"
```

### FAZA 5 — Verification (Optional, deferred to Polish session)

Testowanie przychodzi **w następnej sesji** (polerka).
Dziś: tylko sprzątanie bez regresji testów.

## Mode Decision

| Mode | Criteria | Risk |
|------|----------|------|
| **Conservative** (Rec.) | Only files with hard proof of unused | LOW — safe, no false positives |
| **Aggressive** | Candidates + "pending removal" flags | MEDIUM — requires team review, can false-positive |

Domyślnie: **Conservative** (Zasada Least Privilege).

## Guardrails

- Conflicts: 0 — nie ruszamy generowanych artefaktów skanera
- No `.env` secrets in repo — jeśli znalezione, note it; nie commit
- PR-only: każdy commit w osobnym PR, jeden temat na PR
- Zasada 11: Dowódca zatwierdza removals; agent tylko raportuje
- Handoff obowiązkowy: co usunęliśmy, dlaczego, jakie ryzyka

## Output

```text
CLEANUP_MODE: [Conservative|Aggressive]
INVENTORY_STATUS: [Discovery Complete|Awaiting Approval|In Progress|Done]
CANDIDATES_FOUND: [count]
CRITICAL_FINDINGS: [none|list]
REPORT_FILE: docs/handoffs/YYYY-MM-DD-cleanup-session-N-candidates.md
NEXT_ACTION: [Await approval|Execute removals|Run verification]
```

## Do

- Uruchom inwentaryzację zawsze (`git status`, `git clean -ndX`, sekrety)
- Generuj raport w `.handoffs/` z każdym dowodem
- Czekaj na akceptację Dowódcy zanim usuniesz cokolwiek
- Zmień po akceptacji: małe, atomowe commity z dowodem w opisie
- Zaktualizuj backlog (`flex-vcms-todo.json`) po cleanup

## Don't

- Nie usuwaj bez dowodu "unused" (Conservative mode)
- Nie ruszaj artefaktów skanera (`data/`, `docs/ecosystem/*` generated)
- Nie deployuj zmian poza PR (Zasada 11)
- Nie miksuj cleanup z feature/refactor — jeden temat na sesję (1-1-1)
- Nie commituj bez handoff na koniec

## Done when

- Raport kandydatów wygenerowany + saved w `docs/handoffs/`
- Wszystkie removal commity merged do `main` (jeśli approved)
- Backlog + handoff zaktualizowany
- Conflicts: 0 po ostatnim skanie
- Gotowy na polishing sesję (Session 2)
