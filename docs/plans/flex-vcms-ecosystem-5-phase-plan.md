---
status: "[DRAFT]"
title: "FlexGrafik Ecosystem — 5‑Phase Stabilization Plan (Local‑First)"
owner: "Norbert Wozniak (Dowodca)"
updated: "2026-04-09"
scope_root: "C:\\Users\\FlexGrafik\\FlexGrafik\\github"
vcms_root: "C:\\Users\\FlexGrafik\\Desktop\\flex-vcms"
---

## Cel planu (jedno zdanie)
Zrobic z Flex‑VCMS lokalny **system operacyjny** do zarzadzania modulami FlexGrafik: *jedno zrodlo prawdy (brains/todos), zero chaosu, twardy workflow, przewidywalny deploy*.

## Definicje
- **Modul**: osobne repozytorium w `C:\\Users\\FlexGrafik\\FlexGrafik\\github` (np. `zzpackage.flexgrafik.nl`, `jadzia-core`).
- **Meta**: repo `flexgrafik-meta` (strategia makro, global rules, workflow, cohesion).
- **VCMS**: `C:\\Users\\FlexGrafik\\Desktop\\flex-vcms` (dashboard + dokumentacja + asystent workflow).
- **Canonical**: jeden wskazany plik per typ (brain/todo/rules), reszta to mirror albo archive.

## Zasady (hard constraints)
- Local‑first: **100% lokalnie**. Brak VPS, brak remote automatyzacji na tym etapie.
- Deploy manual (Zasada 11): VCMS moze tylko generowac checklisty/komendy, nie wykonuje deployu sam.
- Least privilege: asystent zawsze operuje na **whitelist** plikow, ignoruje sekrety i binaria.

---

## Faza 0 — Inwentaryzacja + Repo Registry + Conflict Scanner (P0)
### Cel
Miec jedna, spójna mape ekosystemu: *jakie moduly istnieja, gdzie sa brains/todos, co jest canonical, co duplikatem*.

### Deliverables
1) `flex-vcms/repos.yaml` — rejestr modulow (kanoniczny spis, sciezki, typy, owners, ryzyko).
2) `flex-vcms/data/vcms-index.json` — wygenerowany indeks plikow wiedzy per modul (mtime + hash + typ).
3) `flex-vcms/docs/ecosystem/map.md` — czytelna mapa modulow + zaleznosci (mermaid) + status.
4) `flex-vcms/docs/ecosystem/conflicts.md` — raport konfliktow (duplicate todo/brain, rozjazd rules).

### Implementacja (high level)
- Whitelist globs na pliki wiedzy:
  - `AGENTS.md`, `.cursor/rules/*.mdc`
  - `brain*.md`, `MASTER-BRAIN.md`
  - `todo.json`, `docs/audit-todo.json`
  - `docs/handoffs/**`
  - `docs/core/global-rules.md`, `docs/core/workflow-manual.md`, `docs/core/master-plan.md`
- Z kazdego repo odczytaj tylko: nazwa, sciezka, `.git` (jezeli jest), i znalezione pliki z whitelisty.
- Normalizacja do jednego modelu: `repo -> { canonical: {...}, files: [...], warnings: [...] }`.

### Kryteria sukcesu (Definition of Done)
- Dla kazdego modulu VCMS pokazuje: **canonical brain**, **canonical todo**, **last handoff**, **guardrails present?**.
- VCMS wykrywa min. te klasy problemow:
  - `DUPLICATE_TODO`
  - `DUPLICATE_BRAIN`
  - `MISSING_HANDOFFS`
  - `MISSING_AGENT_GUARDRAILS`
  - `RULES_CONFLICT` (np. roznice miedzy meta rules a modul rules)

### Ryzyka i jak je minimalizujemy
- Performance: brak rekurencji po calym repo; tylko whitelist + cache po mtime.
- Sekrety: jawny denylist (`.env*`, `*.pem`, `*.key`, `*.zip`, `*.tar.gz`, `node_modules`, `dist`, `cache`).

---

## Faza 1 — Standaryzacja: Brain/Todo/Handoff w kazdym module (P1)
### Cel
Usunac „gdzie jest prawda?”: kazdy modul ma 1 brain i 1 todo (albo audit‑todo), reszta jest oznaczona jako archive/mirror.

### Deliverables
1) Standard `brain-[module].md` (lub `docs/brain.md`) w kazdym repo + linki do meta rules.
2) Jeden kanoniczny backlog per repo:
   - Wizard: `docs/audit-todo.json`
   - Inne: `todo.json` w root (lub `docs/todo.json`, ale tylko 1).
3) Szablon handoff + jednolite nazewnictwo w `docs/handoffs/`.

### Dozwolone warianty
- Repo typu „sprintowy” moze miec `docs/audit-todo.json` zamiast prostego `todo.json`, ale nadal 1 canonical.

### Kryteria sukcesu
- `conflicts.md` ma 0 pozycji klasy `DUPLICATE_*` dla wszystkich aktywnych modulow.

---

## Faza 2 — VCMS jako Dashboard + Index (P1/P2)
### Cel
W VitePress widzisz 1 panel: co aktywne, co blokuje, co dalej, bez szukania po folderach.

### Deliverables
1) Strona `docs/ecosystem/map` (moduly + status + last update).
2) Strona `docs/ecosystem/repos/[module]` (brain/todo/handoff/guardrails).
3) `docs/if-lost` rozszerzone o „otworz dashboard i wybierz modul”.

### Kryteria sukcesu
- „W 30 sekund” znajdujesz: canonical todo + next action + ostatni handoff.

---

## Faza 3 — Asystent Workflow (Orchestration) (P2)
### Cel
Asystent prowadzi sesje jak ksiazka: wymusza kroki z `workflow-manual.md` i konczy sesje kompletnym handoffem.

### Deliverables
1) Generator „Session Brief”:
   - active module
   - task ID
   - context packet (lista plikow do zaladowania)
   - checklisty (pre-commit, prep-deploy, verification)
2) Generator „Context Packet” dla:
   - Antigravity (orchestrator)
   - Gemini CLI (execution / deploy steps)
3) Lokalne logi sesji w `docs/journal/` (z szablonu `tmpl-session-log.md`).

### Kryteria sukcesu
- Nie da sie „zostawic sesji” bez: zaktualizowanego todo + handoff wpisanego do dziennika.

---

## Faza 4 — Nauka i profil Dowodcy (ADHD‑friendly) (P2/P3)
### Cel
VCMS zna Twoj poziom wiedzy i uczy Cie *w kontekscie realnych zadan*, bez przeciazania.

### Deliverables
1) Uzupelnione `brain.md` (VCMS) jako profil Dowodcy (SSoT).
2) Skill map (Git/Deploy/Debug/JS/WP/CI/Data) + weekly cadence.
3) „Study queue” powiazana z zadaniami z modulow.

### Kryteria sukcesu
- Przy kazdym zadaniu VCMS proponuje 1–2 mikro‑lekcje, nie 10.

---

## Operacyjny protokol „po kazdej fazie”
Po ukonczeniu Fazy N:
1) Aktualizujemy `flex-vcms-todo.json`:
   - zamykamy zadania Fazy N
   - dodajemy zadania Fazy N+1
2) Dopisujemy krótki handoff do `docs/handoffs/` w VCMS (co zrobione, co dalej, co zablokowalo).

