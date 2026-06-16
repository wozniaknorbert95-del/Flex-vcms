---
status: "[STABLE]"
title: "VCMS Brain — Dowodca SSoT (Operational Contract)"
owner: "Norbert Wozniak (Dowodca)"
updated: "2026-06-16"
audience:
  - "Dowodca"
  - "OpenCode (Coding Agent)"
  - "Cursor (IDE Cockpit)"
---

## DLA KOGO JEST TEN BRAIN (kontrakt)

- **Dowodca (Ty)**: Twoj kompas decyzyjny. Gdy masz chaos -- wracasz tutaj, wybierasz 1 modul i 1 zadanie.
- **OpenCode (Agent)**: Coding agent CLI. Po przeczytaniu egzekwujesz `workflow-manual.md`, pracujesz w trybie Plan/Build.
- **Cursor (IDE)**: Cockpit codzienny. MCP, inline agents, live-debug przez CDP.

## Jedno zdanie (misja)

**Versioned Content Management & Supervision** — warstwa governance ekosystemu FlexGrafik: skan repozytoriów, wykrywanie konfliktów SSoT, mapa modułów, handoffy i command center (docs + dashboard).

Operacyjnie: **jedno źródło prawdy, jedna sesja = jedno zadanie, zawsze handoff** (Zasada 1-1-1).

Pełna granica produktu (co jest / czego nie ma): `docs/VCMS_PORTFOLIO_TRUTH.md`.

---

## 1) Kim jestem i jak mam byc prowadzony (ADHD SOP)

### Preferowany styl komunikacji (obowiazuje wszystkich agentow)
- Krotko, konkretnie, bez lania wody.
- Najpierw **co robimy teraz**, potem **dlaczego**, na koncu **nastepny krok**.
- Nie pytaj mnie 3 razy o to samo. Jak brakuje danych -- pokaz brak i powiedz, co minimalnie jest potrzebne.
- Nie rozpraszaj mnie na 5 modulow. **Jeden modul na sesje**.

### Twarde zakazy (dla agentow)
- Zakaz "zrob wszystko naraz".
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

### Definition of Done (sesja jest "ukonczona" tylko gdy)
- Zaktualizowany backlog (todo/audit-todo) w aktywnym module
- Zrobiony wpis handoff w `docs/handoffs/` aktywnego modulu
- Jesli byl deploy: checklista `docs/checklists/prep-deploy.md` przeszla + smoke test

---

## 3) Hard guardrails (Top 10 — skrot, nie duplikat)

1) **Deploy manual only** (Zasada 11) -- Ty uruchamiasz komendy.
2) **Zasada 1-1-1** -- jedno zadanie na iteracje, koniec z mega-diffami.
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

## 4) Aktywny ekosystem (8 repo — warstwy)

Kanoniczny rejestr: `repos.yaml` · mapa: `docs/ecosystem/map.md` · skan: `npm run scan`.

### Warstwa: Governance & meta
| Repo | Rola | Canonical brain | Backlog |
|------|------|-----------------|---------|
| **flexgrafik-meta** | Konstytucja — rules, strategia, workflow | `docs/core/master-plan.md` | `todo.json` |
| **flex-vcms** | Orchestrator — skan, konflikty, handoffy, command center | `brain.md` (ten plik) | `flex-vcms-todo.json` |

### Warstwa: Produkty & aplikacje
| Repo | Rola | Canonical brain | Backlog |
|------|------|-----------------|---------|
| **zzpackage.flexgrafik.nl** | Wizard / Cash Engine | `MASTER-BRAIN.md` | `docs/audit-todo.json` |
| **flexgrafik-nl** | Portal zaufania | `brain.md` | `todo.json` |
| **app.flexgrafik.nl** | Gra / lead magnet | `brain.md` | `todo.json` |

### Warstwa: AI & wykonanie
| Repo | Rola | Canonical brain | Backlog |
|------|------|-----------------|---------|
| **jadzia-core** | Backend AI / automaty / dane | `brain.md` | `todo.json` |
| **agent-os** | Orkiestracja agentów (LangGraph) | `SESSION-ANCHOR.md` | `todo.json` |
| **agent-os-ui** | Mission Control — HITL, approval UI | `README.md` | `todo.json` |

---

## 4.1) Granice produktu (nie mylić modułów)

| Capability | Gdzie żyje | Status |
|------------|------------|--------|
| Skan 8 repo, konflikty SSoT | **flex-vcms** | PROVEN |
| Handoffy sesji (markdown) | **flex-vcms** `docs/handoffs/` | PROVEN |
| Human approval gate (UI) | **agent-os-ui** | DEMO/PROVEN |
| Agent cards (UI) | **agent-os-ui** + portfolio gratka | DEMO |
| LLM chat / KODA | **wyłączone** w VCMS | PLANNED via Agent OS |
| Governance audit log (JSON trail) | **roadmap** flex-vcms | PLANNED |
| Strona sprzedażowa Quietforge | **services** repo | osobny moduł |

Portfolio copy musi być zgodne z `docs/VCMS_PORTFOLIO_TRUTH.md` — bez przypisywania HITL do flex-vcms UI.

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

**DLA KOGO**: Dowodca + Agent (jako prowadzacy).

**Cel**: utrzymac kierunek i nie gubic sie w backlogach.

**Gdzie zapisujemy**: `docs/templates/tmpl-weekly-review.md` (jako wzor) + nowy plik w `docs/journal/`.

**Procedura (5 min):**
1) Otworz `flex-vcms-todo.json` i policz:
   - co jest DONE,
   - co jest NEXT,
   - co stoi w miejscu.
2) Otworz najnowsze handoffy w aktywnym module (np. `zzpackage.../docs/handoffs/`) i wypisz 1 zdanie: *co bylo ostatnio realnie dowiezione*.
3) Wybierz **1 cel na tydzien** (jedno zdanie) i **1 metryke** (np. "Wizard stabilny / brak regresji / 1 deploy bez rollbacku").
4) Parking lot: dopisz max 3 "pomysly" (bez realizacji).

**Output**: 1 plik weekly review + 3 action items max.

---

## 6) Granice wiedzy i tryb nauki

### Zasada nauki
Uczymy sie *na realnym zadaniu*, nie przez kurs.

### Jak agent ma mnie uczyc
- 1 mikro-lekcja na koniec zadania (5-10 minut).
- Slowniczek max 5 pojec na sesje.
- Zawsze pokaz: "co klikam / co wpisuje" (PowerShell, git).

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

### DLA OpenCode/Cursor (Orchestrator) — start kazdej sesji
Wczytaj:
- `flex-vcms/brain.md` (ten plik)
- `flexgrafik-meta/docs/core/workflow-manual.md`
- `flex-vcms/docs/core/global-rules.md`
- `flexgrafik-meta/docs/core/master-plan.md`
- `flexgrafik-meta/docs/core/agents.md`
- `flex-vcms/repos.yaml`
- backlog modulu (np. `zzpackage.flexgrafik.nl/docs/audit-todo.json`)
- ostatni handoff modulu (`docs/handoffs/*` najnowszy)

### DLA Deploy (Execution)
Przed deploy:
- checklista: `docs/checklists/prep-deploy.md`
- diff: `git diff` (w module)
- testy/validatory modulu (np. wizard: walidator SSoT)

Po deploy:
- smoke test (HTTP 200 + reczne przejscie krytycznej sciezki)
- handoff wpisany do `docs/handoffs/`

---

## 8) Session Exit Checklist (1 ekran, zawsze na koniec)

**DLA KOGO**: Dowodca + Agent.

Jesli jakikolwiek punkt jest NIE / NIE WIEM -- **STOP** (nie "zamykac sesji na szybko").

- [ ] **Zadanie sesji bylo jedno (1-1-1)** i jest domkniete lub jasno oznaczone jako BLOCKED.
- [ ] **Backlog zaktualizowany** w aktywnym module (statusy, next action).
- [ ] **Handoff zapisany** w `docs/handoffs/` aktywnego modulu (co zrobione + co dalej).
- [ ] **VCMS index nadal spojny** (opcjonalnie) uruchom: `node tools/vcms-scan.js` i upewnij sie, ze `conflicts.md` nie rosnie.
- [ ] Jesli byl deploy: **prep-deploy checklist** odhaczona + smoke test wykonany.
- [ ] Jesli sesja utknela: zapisany **SESSIONANCHOR** (ponizej) + 1 zdanie *dlaczego utknelo*.

## 9) VCMS Command Center (Instrukcja Obslugi)

Nowoczesne centrum dowodzenia (PH4-014) integruje wiedze z calego ekosystemu.

### Jak to dziala (SSoT Sync)
1. **Lokalnie**: Gdy robisz zmiany w dowolnym repo (np. `zzpackage`), narzedzie `tools/vcms-sync-context.js` zbiera pliki `brain.md` i `todo.json`.
2. **Deploy**: Skrypt `Deploy-VPS.ps1` automatycznie uruchamia sync i wysyla paczke wiedzy na serwer (Atomic Swap).
3. **Na Serwerze**: VCMS Dashboard czyta manifest i wyswietla stan systemu.

### Governance tab (dashboard)
- Zakładka **Governance** w dashboardzie (`npm start` → `http://localhost:8001/`) — zakres produktu, linki do Portfolio Truth i Readiness Audit.
- **LLM chat (KODA / Control Lab) jest wyłączony** — brak `/api/chat`. AI workflows: Agent OS.
- Skan lokalny: `npm run scan` → `docs/ecosystem/conflicts.md` (Deep Scan z UI działa tylko na maszynie dev).

### Widgety i LEDy (Jak czytac Dashboard)
- **Next Action (Backlog)**: Pobiera dane bezposrednio z `flex-vcms-todo.json`. Zawsze wiesz, co jest priorytetem w skali calego ekosystemu.
- **Context Health (LEDy)**:
  - HEALTHY: Wiedza na serwerze jest aktualna (< 24h).
  - STALE: Dane sa starsze niz 24h. Zalecany deploy (`.\scripts\Deploy-VPS.ps1`).
  - MISSING: SSoT jest niepelne (brak pliku brain lub todo). Sprawdz `repos.yaml`.

### 9.1 UI/UX (dashboard)

- **SSoT tokenów:** `docs/design/VCMS_UI_TOKENS.md` · plik CSS: `public/tokens.css`
- **Motyw:** `<body data-app="flex-vcms">` — akcent governance **fiolet** (`--accent-primary`), nie emerald
- **LEDy Context Health:** `led--healthy` / `led--stale` / `led--missing` → `--fx-money` / `--fx-calm` / `--fx-time`
- **Governance tab:** klasa `panel panel--governance` na głównym cardzie zakładki

---

### SESSIONANCHOR (gdy przerywamy bez stresu)
Format:
- `ANCHOR:` co bylo ostatnim stabilnym stanem (plik/commit/branch)
- `NEXT:` jedna konkretna rzecz do zrobienia jako pierwsza w nastepnej sesji
- `BLOCKER:` co brakuje (1 linia)
