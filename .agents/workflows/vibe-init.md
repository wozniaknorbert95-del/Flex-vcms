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
