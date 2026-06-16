---
status: "[STABLE]"
title: "VCMS Brain — Dowodca SSoT (Rendered)"
updated: "2026-06-16"
---

> a tak wtedy ja przejde do nagrywania. a i ja to nagram. 
>
> atne apiKanoniczny plik jest w root: `[brain.md](../brain.md)`.  
> Ten dokument jest mirrorem do VitePress (`/brain`). Przy zmianach edytuj root, potem zsynchronizuj tutaj.

---

## FlexGrafik VCMS — BRAIN (Operational Contract)

**owner**: Norbert Wozniak (Dowodca)  
**audience**: Dowodca / OpenCode / Cursor Agent

## DLA KOGO JEST TEN BRAIN (kontrakt)

- **Dowodca (Ty)**: Twoj kompas decyzyjny. Gdy masz chaos → wracasz tutaj, wybierasz 1 modul i 1 zadanie.
- **OpenCode (Agent)**: Coding agent CLI. Po przeczytaniu egzekwujesz `workflow-manual.md`, pracujesz w trybie Plan/Build.
- **Cursor (IDE)**: Cockpit codzienny. MCP, inline agents, live-debug przez CDP.

## Jedno zdanie (misja)

**Versioned Content Management & Supervision** — warstwa governance ekosystemu FlexGrafik: skan repozytoriów, wykrywanie konfliktów SSoT, mapa modułów, handoffy i command center.

Operacyjnie: **jedno źródło prawdy, jedna sesja = jedno zadanie, zawsze handoff**.

Pełna granica produktu: `[VCMS_PORTFOLIO_TRUTH.md](./VCMS_PORTFOLIO_TRUTH.md)`.

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

1. **Deploy manual only** (Zasada 11) — Ty uruchamiasz komendy.
2. **Zasada 1-1-1** — jedno zadanie na iteracje, koniec z mega-diffami.
3. **Minimum checkout**: 199 EUR.
4. **Minimum marza**: 60%.
5. **Wizard-only**: Wizard to jedyna droga zakupu (brak klasycznego sklepu).
6. **Least privilege**: minimalny kontekst, zero dumpow repo.
7. **Jezyki**: UI klienta NL, kod/komentarze EN, komunikacja z Dowodca PL.
8. **Brak cichych ulepszen**: duze zmiany zawsze poprzedza /blast.
9. **Handoff jest obowiazkowy**.
10. **Bez sekretow w repo**: zadnych tokenow/.env w kontekcie.

Zrodlo: `docs/core/global-rules.md`.

---

## 4) Aktywny ekosystem (8 repo — warstwy)

Kanoniczny rejestr: `repos.yaml` · mapa: `docs/ecosystem/map.md` · skan: `npm run scan`.

Zobacz pełną tabelę warstw w `[brain.md](../brain.md)` §4 i §4.1 (Governance / Produkty / AI).

---

## 4.1) Granice produktu


| Capability           | Gdzie            | Status  |
| -------------------- | ---------------- | ------- |
| Skan, konflikty SSoT | flex-vcms        | PROVEN  |
| HITL approval UI     | agent-os-ui      | DEMO    |
| LLM chat             | wyłączone w VCMS | PLANNED |


Szczegóły: `[VCMS_PORTFOLIO_TRUTH.md](./VCMS_PORTFOLIO_TRUTH.md)`.

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

**DLA KOGO**: Dowodca + agent prowadzacy.

**Cel**: utrzymac kierunek i nie gubic sie w backlogach.

**Gdzie zapisujemy**: `docs/templates/tmpl-weekly-review.md` (jako wzor) + nowy plik w `docs/journal/`.

**Procedura (5 min):**

1. Otworz `flex-vcms-todo.json` i policz:
  - co jest DONE,
  - co jest NEXT,
  - co stoi w miejscu.
2. Otworz najnowsze handoffy w aktywnym module (np. `zzpackage.../docs/handoffs/`) i wypisz 1 zdanie: *co bylo ostatnio realnie dowiezione*.
3. Wybierz **1 cel na tydzien** (jedno zdanie) i **1 metryke** (np. „Wizard stabilny / brak regresji / 1 deploy bez rollbacku”).
4. Parking lot: dopisz max 3 „pomysly” (bez realizacji).

**Output**: 1 plik weekly review + 3 action items max.

---

## 6) Granice wiedzy i tryb nauki

### Zasada nauki

Uczymy sie *na realnym zadaniu*, nie przez kurs.

### Jak agent ma mnie uczyc

- 1 mikro-lekcja na koniec zadania (5–10 minut).
- Slowniczek max 5 pojec na sesje.
- Zawsze pokaz: „co klikam / co wpisuje” (PowerShell, git).

---

## 7) Context packets (minimalne, gotowe do uzycia)

### DLA Senior Agency (Orchestrator) — start każdej sesji

Wczytaj:

- `BRAIN.md` (kanoniczny)
- `flexgrafik-meta/docs/core/workflow-manual.md`
- `flex-vcms/docs/core/global-rules.md`
- `flexgrafik-meta/docs/core/master-plan.md`
- `flexgrafik-meta/docs/core/agents.md`
- `flex-vcms/repos.yaml`
- backlog modulu (np. `zzpackage.flexgrafik.nl/docs/audit-todo.json`)
- ostatni handoff modulu (`docs/handoffs/`* najnowszy)

Output od agenta po /vibe-init:

- `STATUS: Faza 1, Krok 1 (/vibe-init)` + modul + branch + cel sesji (2 zdania)
- 1–3 zadania z backlogu (kandydaci)

### DLA OpenCode / Cursor Agent (Execution / Deploy Prep)

Przed deploy:

- checklista: `docs/checklists/prep-deploy.md`
- diff: `git diff` (w module)
- testy/validatory modulu (np. wizard: walidator SSoT)

Po deploy:

- smoke test (HTTP 200 + reczne przejscie krytycznej sciezki)
- handoff wpisany do `docs/handoffs/`

---

## 8) Session Exit Checklist (1 ekran, zawsze na koniec)

**DLA KOGO**: Dowodca + agent prowadzacy.

Jesli jakikolwiek punkt jest NIE / NIE WIEM → **STOP** (nie „zamykać sesji na szybko”).

- [ ] **Zadanie sesji bylo jedno (1-1-1)** i jest domkniete lub jasno oznaczone jako BLOCKED.
- [ ] **Backlog zaktualizowany** w aktywnym module (statusy, next action).
- [ ] **Handoff zapisany** w `docs/handoffs/` aktywnego modulu (co zrobione + co dalej).
- [ ] **VCMS index nadal spójny** (opcjonalnie) uruchom: `node tools/vcms-scan.js` i upewnij sie, ze `conflicts.md` nie rośnie.
- [ ] Jesli byl deploy: **prep-deploy checklist** odhaczona + smoke test wykonany.
- [ ] Jesli sesja utknela: zapisany **SESSIONANCHOR** (ponizej) + 1 zdanie *dlaczego utknelo*.

---

## 9) VCMS Command Center (Instrukcja Obslugi)

Nowoczesne centrum dowodzenia (PH4-014) integruje wiedze z calego ekosystemu.

### Jak to dziala (SSoT Sync)

1. **Lokalnie**: `tools/vcms-sync-context.js` zbiera `brain.md` i `todo.json` z repozytoriów.
2. **Deploy**: `Deploy-VPS.ps1` uruchamia sync i wysyla paczke na serwer (Atomic Swap).
3. **Na serwerze**: Dashboard czyta manifest i wyswietla stan systemu.

### Governance tab (dashboard)

- Zakładka **Governance** (`npm start` → `http://localhost:8001/`) — zakres produktu, Portfolio Truth, Readiness Audit.
- **LLM chat wyłączony** — brak `/api/chat`. AI: Agent OS.
- Skan: `npm run scan` → `docs/ecosystem/conflicts.md`.

### Widgety i LEDy

- **Next Action**: `flex-vcms-todo.json`
- **Context Health**: HEALTHY (<24h) · STALE (>24h) · MISSING (brak SSoT)

### 9.1 UI/UX (dashboard)

- **SSoT tokenów:** `[VCMS_UI_TOKENS.md](./design/VCMS_UI_TOKENS.md)` · `public/tokens.css`
- **Motyw:** `<body data-app="flex-vcms">` — akcent **fiolet** (`--accent-primary`), nie emerald
- **LEDy:** `led--healthy` / `led--stale` / `led--missing` → `fx-money` / `fx-calm` / `fx-time`
- **Governance tab:** `panel panel--governance`

---

### SESSIONANCHOR (gdy przerywamy bez stresu)

Kanoniczny format i walidacja: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)