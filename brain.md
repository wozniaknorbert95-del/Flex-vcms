---
status: "[STABLE]"
title: "VCMS Brain — Dowodca SSoT (Operational Contract)"
owner: "Norbert Wozniak (Dowodca)"
updated: "2026-04-09"
audience:
  - "Dowodca"
  - "Antigravity (AG)"
  - "Gemini CLI"
---

## DLA KOGO JEST TEN BRAIN (kontrakt)

- **Dowodca (Ty)**: Twoj kompas decyzyjny. Gdy masz chaos → wracasz tutaj, wybierasz 1 modul i 1 zadanie.
- **Antigravity (AG)**: Orkiestracja sesji. Po przeczytaniu masz egzekwowac `workflow-manual.md`, nie „pomysly z kosmosu”.
- **Gemini CLI**: Warstwa wykonawcza. Po przeczytaniu masz stosowac tylko „deploy gates” i checklisty. Bez autonapraw na produkcji.

## Jedno zdanie (misja)
VCMS ma trzymac Twoj workflow w ryzach: **jedno zrodlo prawdy, jedna sesja = jedno zadanie, zawsze handoff**.

---

## 1) Kim jestem i jak mam byc prowadzony (ADHD SOP)

### Preferowany styl komunikacji (obowiazuje wszystkich agentow)
- Krotko, konkretnie, bez lania wody.
- Najpierw **co robimy teraz**, potem **dlaczego**, na koncu **nastepny krok**.
- Nie pytaj mnie 3 razy o to samo. Jak brakuje danych → pokaz brak i powiedz, co minimalnie jest potrzebne.
- Nie rozpraszaj mnie na 5 modulow. **Jeden modul na sesje**.

### Twarde zakazy (dla agentow)
- Zakaz „zrob wszystko naraz”.
- Zakaz deployu autonomicznego (Zasada 11).
- Zakaz zmieniania architektury poza zatwierdzonym planem (/blast).

### Gdy jest chaos / jestem zgubiony
Wtedy obowiazuje protokol: `docs/if-lost.md`.

---

## 2) Jedyny workflow (system operacyjny sesji)

### Kanoniczne dokumenty workflow
- **Workflow do egzekwowania**: `flexgrafik-meta/docs/core/workflow-manual.md`
- **Twarde zasady**: `docs/core/global-rules.md`
- **Strategia makro**: `flexgrafik-meta/docs/core/master-plan.md`
- **Hierarchia agentow**: `flexgrafik-meta/docs/core/agents.md`

### Definition of Done (sesja jest „ukonczona” tylko gdy)
- Zaktualizowany backlog (todo/audit-todo) w aktywnym module
- Zrobiony wpis handoff w `docs/handoffs/` aktywnego modulu
- Jesli byl deploy: checklista `docs/checklists/prep-deploy.md` przeszla + smoke test

---

## 3) Hard guardrails (Top 10 — skrot, nie duplikat)

1) **Deploy manual only** (Zasada 11) — Ty uruchamiasz komendy.
2) **Zasada 1-1-1** — jedno zadanie na iteracje, koniec z mega-diffami.
3) **Minimum checkout**: 199 EUR.
4) **Minimum marza**: 60%.
5) **Wizard-only**: Wizard to jedyna droga zakupu (brak klasycznego sklepu).
6) **Least privilege**: minimalny kontekst, zero dumpow repo.
7) **Jezyki**: UI klienta NL, kod/komentarze EN, komunikacja z Dowodca PL.
8) **Brak cichych ulepszen**: duze zmiany zawsze poprzedza /blast.
9) **Handoff jest obowiazkowy**.
10) **Bez sekretow w repo**: zadnych tokenow/.env w kontekcie.

Zrodlo: `docs/core/global-rules.md`.

---

## 4) Aktywny ekosystem (moduly + rola)

Kanoniczny rejestr modulow: `repos.yaml`.

### Moduly (5)
- **zzpackage.flexgrafik.nl** — Wizard / Cash Engine
  - Canonical backlog: `docs/audit-todo.json`
  - Canonical brain: `MASTER-BRAIN.md`
- **jadzia-core** — OS operacyjny / automaty / dane
  - Canonical backlog: `todo.json`
  - Canonical brain: `brain.md`
- **app.flexgrafik.nl** — gra / lead magnet
  - Canonical backlog: `todo.json`
  - Canonical brain: `brain.md`
- **flexgrafik-nl** — portal zaufania / authority
  - Canonical backlog: `todo.json`
  - Canonical brain: `brain.md`
- **flexgrafik-meta** — meta: strategia + rules + workflow + cohesion
  - Canonical backlog: `todo.json`
  - Canonical brain: `docs/core/master-plan.md`

---

## 5) Fokus Dowodcy (ustalenia na teraz)

### Fokus tygodnia (domyslny)
**Modul**: `zzpackage.flexgrafik.nl` (Cash Engine) dopoki stabilizacja lejka nie jest domknieta.

### 1 cel na tydzien (konkretnie)
- Domykac zadania, ktore podnosza stabilnosc i konwersje (bez dorzucania nowych modulow).

### STOP conditions (kiedy sesja ma sie zatrzymac)
- Brak planu (/blast) przed zmianami w kodzie.
- Brak backupu przed deploy.
- Brak handoff na koniec.

---

## 5.1) Weekly Review (5 minut, raz w tygodniu)

**DLA KOGO**: Dowodca + AG (jako prowadzący).

**Cel**: utrzymac kierunek i nie gubic sie w backlogach.

**Gdzie zapisujemy**: `docs/templates/tmpl-weekly-review.md` (jako wzor) + nowy plik w `docs/journal/`.

**Procedura (5 min):**
1) Otworz `flex-vcms-todo.json` i policz:
   - co jest DONE,
   - co jest NEXT,
   - co stoi w miejscu.
2) Otworz najnowsze handoffy w aktywnym module (np. `zzpackage.../docs/handoffs/`) i wypisz 1 zdanie: *co bylo ostatnio realnie dowiezione*.
3) Wybierz **1 cel na tydzien** (jedno zdanie) i **1 metryke** (np. „Wizard stabilny / brak regresji / 1 deploy bez rollbacku”).
4) Parking lot: dopisz max 3 „pomysly” (bez realizacji).

**Output**: 1 plik weekly review + 3 action items max.

---

## 6) Granice wiedzy i tryb nauki

### Zasada nauki
Uczymy sie *na realnym zadaniu*, nie przez kurs.

### Jak agent ma mnie uczyc
- 1 mikro-lekcja na koniec zadania (5–10 minut).
- Slowniczek max 5 pojec na sesje.
- Zawsze pokaz: „co klikam / co wpisuje” (PowerShell, git).

### Skill map (SSoT)
Kanoniczny rejestr poziomow wiedzy + study queue: `docs/study/study-index.md`.

Obszary sledzone (7 technicznych):

| Obszar | ID w study-index |
|--------|-----------------|
| Git & Version Control | T1 |
| Deploy (CF Pages / WP) | T2 |
| Debug (5-krokowa diagnostyka) | T3 |
| JavaScript / Node | T4 |
| WordPress / PHP (snippety) | T5 |
| CI / Automaty (Jadzia) | T6 |
| Data / JSON / VCMS tools | T7 |

### Weekly cadence (zasada)
- Kazda sesja: 1 mikro-lekcja z obszaru powiazanego z aktualnym zadaniem.
- Co tydzien: `/review-week` + aktualizacja poziomow w `study-index.md`.
- Nie uczymy sie z wyprzedzeniem -- lekcja dopiero gdy zadanie wywoluje potrzebe.

---

## 7) Context packets (minimalne, gotowe do uzycia)

### DLA AG (Orchestrator) — start kazdej sesji
Wczytaj:
- `flex-vcms/brain.md` (ten plik)
- `flexgrafik-meta/docs/core/workflow-manual.md`
- `flex-vcms/docs/core/global-rules.md`
- `flexgrafik-meta/docs/core/master-plan.md`
- `flexgrafik-meta/docs/core/agents.md`
- `flex-vcms/repos.yaml`
- backlog modulu (np. `zzpackage.flexgrafik.nl/docs/audit-todo.json`)
- ostatni handoff modulu (`docs/handoffs/*` najnowszy)

Output od AG po /vibe-init:
- `STATUS: Faza 1, Krok 1 (/vibe-init)` + modul + branch + cel sesji (2 zdania)
- 1–3 zadania z backlogu (kandydaci)

### DLA Gemini CLI (Execution / Deploy)
Przed deploy:
- checklista: `docs/checklists/prep-deploy.md`
- diff: `git diff` (w module)
- testy/validatory modulu (np. wizard: walidator SSoT)

Po deploy:
- smoke test (HTTP 200 + reczne przejscie krytycznej sciezki)
- handoff wpisany do `docs/handoffs/`

---

## 8) Session Exit Checklist (1 ekran, zawsze na koniec)

**DLA KOGO**: Dowodca + AG.

Jesli jakikolwiek punkt jest NIE / NIE WIEM → **STOP** (nie „zamykać sesji na szybko”).

- [ ] **Zadanie sesji bylo jedno (1-1-1)** i jest domkniete lub jasno oznaczone jako BLOCKED.
- [ ] **Backlog zaktualizowany** w aktywnym module (statusy, next action).
- [ ] **Handoff zapisany** w `docs/handoffs/` aktywnego modulu (co zrobione + co dalej).
- [ ] **VCMS index nadal spójny** (opcjonalnie) uruchom: `node tools/vcms-scan.js` i upewnij sie, ze `conflicts.md` nie rośnie.
- [ ] Jesli byl deploy: **prep-deploy checklist** odhaczona + smoke test wykonany.
- [ ] Jesli sesja utknela: zapisany **SESSIONANCHOR** (ponizej) + 1 zdanie *dlaczego utknelo*.

### SESSIONANCHOR (gdy przerywamy bez stresu)
Format:
- `ANCHOR:` co bylo ostatnim stabilnym stanem (plik/commit/branch)
- `NEXT:` jedna konkretna rzecz do zrobienia jako pierwsza w nastepnej sesji
- `BLOCKER:` co brakuje (1 linia)

