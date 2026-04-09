---
status: "[STABLE]"
title: "Poradnik Użytkownika — Start Tutaj"
---

# 🚀 Poradnik Użytkownika — Zacznij Tutaj

> Wróciłeś po przerwie? Zaczynasz od zera? Ten dokument to Twój **punkt startowy**.
> Czytaj od góry do dołu. Nie pomijaj.

---

## Co to jest VCMS?

**Vibe Coding Mastery System** to Twój osobisty system operacyjny dla pracy z AI.
Zamiast każdą sesję zaczynać od zera i tłumaczyć agentowi wszystko od nowa, VCMS zapewnia że:

- Agenty (AG, Gemini) **zawsze znają reguły gry** — nie trzeba im tłumaczyć od zera
- Każda sesja ma **jasny start i jasny koniec** — wiesz gdzie jesteś
- **Żadna wiedza nie ginie** między sesjami — handoff to obowiązek
- Deploy na produkcję jest **zawsze kontrolowany przez Ciebie** — agenty nigdy nie deployują autonomicznie

---

## VCMS jako Orchestrator ekosystemu (FlexGrafik)

VCMS (repo `flex-vcms`) jest warstwą **Orchestration**: nie „wymyśla prawdy”, tylko ją **zbiera, porządkuje i wystawia** jako deterministyczne artefakty.

### Single Source of Truth (moduły i ścieżki)

- Lista modułów i ich lokalizacja na dysku jest w `repos.yaml`.
- **Root modułów** (z `repos.yaml`): `C:\\Users\\FlexGrafik\\FlexGrafik\\github`
- Kod modułów żyje w podkatalogach `root` (po 1 na repo).

### Artefakty Orchestratora (po skanie)

Po uruchomieniu skanu, VCMS generuje:

- `data/vcms-index.json` — inventory plików + hashe (read-only ogląd repo)
- `docs/ecosystem/conflicts.md` — konflikty/ostrzeżenia (docelowo ma być **0**)
- `docs/ecosystem/map.md` — mapa + „Where is the truth” + linki do repo pages
- `docs/ecosystem/repos/*.md` — per-repo „Repo page” (canonical brain/todo, guardrails, handoffs readiness, last_handoff)

Te dokumenty są po to, żebyś **nie pracował w ciemno** i żeby kolejna sesja startowała od faktów, a nie od pamięci.

---

## 🔁 JAK DZIAŁA SESJA — Krok po Kroku

### KROK 0 — Ustal kontekst sesji i odśwież dashboard (VCMS scan)

Zanim cokolwiek planujesz lub implementujesz, odśwież stan ekosystemu lokalnie.

**PowerShell (referencyjnie):**

1) `Set-Location "C:\\Users\\FlexGrafik\\Desktop\\flex-vcms"`
2) `node tools\\vcms-scan.js`

**Co sprawdzasz po skanie (must-have):**

- `docs/ecosystem/conflicts.md` → ma być **Conflicts: 0** (jeśli >0, najpierw porządek, potem feature)
- `docs/ecosystem/map.md` → wybierasz repo docelowe i wiesz „gdzie jest prawda”
- `docs/ecosystem/repos/*.md` → w repo page masz canonical brain/todo + readiness

Jeśli masz wątpliwości „co jest kanoniczne”, odpowiedź **nie jest w głowie** — jest w repo page i w `repos.yaml`.

**Commit i rejestr:** gdy ruszasz `repos.yaml`, `scan-rules.json` lub skaner, trzymaj się tabeli *„Rytm orchestratora”* w [Workflow Manual — Orchestration SOP](/core/workflow-manual#rytm-orchestratora) (jeden commit ze świeżymi artefaktami skanu).

### Skrypty PowerShell (helpers)

W katalogu `scripts/` (root `flex-vcms`):

- **`New-Log.ps1`** — kopiuje szablon do `docs/journal/_log_<data-czas>.md` i otwiera plik w `code` (VS Code CLI). Parametr `-Type` (domyślnie `session`): `session`, `incident`, `playbook`, `weekly-review` (szablony: `docs/templates/tmpl-<typ>.md`).
- **`Start-Cockpit.ps1`** — `Set-Location` do root repozytorium i `npm run docs:dev` (lokalny podgląd dokumentacji VitePress).
- **`Deploy-VPS.ps1`** — build `docs:build`, `scp` plików Node + `dist` na VPS, zdalnie `npm ci --omit=dev` i `pm2 reload` (parametr `-WhatIf` = dry-run). Runbook: [VPS runbook](/reference/vcms-vps-runbook).

---

### KROK 1 — Otwórz sesję komendą `/vibe-init`

Wpisz to Antigravity (AG) na początku **KAŻDEJ** sesji:

```
/vibe-init
```

AG przeczyta kontekst projektu (`flex-vcms-todo.json` w repo VCMS + ewentualnie `brain.md`) i powie Ci w 2 zdaniach co rozumie jako cel sesji.
**Zatwierdź lub popraw** zanim AG napisze JAKIKOLWIEK kod.

---

### KROK 2 — Zanim zaczniecie feature: `/blast`

```
/blast [opisz krótko co chcesz zrobić]
```

AG używa frameworka BLAST, żeby zaplanować pracę:

| Litera | Co to | Po co |
|--------|-------|-------|
| **B** — Background | Kontekst, co rozwiązujemy | Żeby AG rozumiał problem |
| **L** — Limitations | Ograniczenia, zakres plików | Żeby AG nie wychylał się poza scope |
| **A** — Actions | Konkretne kroki implementacji | Żebyś wiedział co się będzie dziać |
| **S** — Success | Definicja DONE | Żeby wiedzieć kiedy skończyć |
| **T** — Tests | Jak weryfikujemy że działa | Żeby nie wychodzić bez smoketest |

::: info
**Zawsze zatwierdź plan BLAST** zanim AG napisze pierwszą linię kodu.
Bez zgody Twojej = AG nie pisze kodu.
:::

---

### KROK 3 — Implementacja: Zasada 1-1-1

AG implementuje **JEDEN moduł na raz**.

```
1 moduł → 1 diff → 1 wdrożenie → sprawdź → powtórz
```

Ty wdrażasz. Sprawdzasz. Dopiero potem AG robi następny element.

::: danger ZAKAZANE
Nigdy nie mów "zrób wszystko naraz".
To jest przepis na regresje, konflikty i utratę kontroli nad projektem.
:::

---

### KROK 4 — Przed deploy: `/audit-red-team`

```
/audit-red-team
```

AG "atakuje" swój własny kod jak red team. Sprawdza:
- 🔒 Security (sekrety w kodzie, walidacja inputów, SQL injection)
- 📡 Reliability (co gdy API nie odpowie, co przy duplikacji)
- 🗄️ Data (backup przed migracją, rollback możliwy?)
- 🌐 WordPress (wp-config.php poza repo, PHP zwalidowany?)

Wynik: **🟢 Gotowe / 🟡 Drobne uwagi / 🔴 Blokuje deploy**

::: warning
**Tylko 🟢 jedzie na produkcję.** Przy 🔴 — najpierw naprawa, potem audit ponownie.
:::

---

### KROK 5 — Deploy ZAWSZE ręcznie przez Ciebie

AG przygotuje gotowe komendy przez `/deploy-cf` lub `/deploy-wp`.
**Ty je uruchamiasz.** AG NIGDY nie deployuje autonomicznie.

```powershell
# Przykład — AG przygotuje, Ty uruchamiasz:
scp -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -P 222 deploy.tar.gz ...
```

---

### KROK 6 — Zakończ sesję: `/handoff`

```
/handoff
```

AG zapisze raport sesji:
- Co zrobiono (lista zmian)
- Stan obecny (branch, ostatni commit)
- Co niedokończone (i dlaczego)
- **Następny krok** (1 zdanie na start kolejnej sesji)

::: danger
Bez handoffu — wiedza ginie między sesjami.
To obowiązek, nie opcja. AG przypomni jeśli spróbujesz zakończyć bez handoffu.
:::

---

#### Minimalny format handoff (wymagany)

Każdy handoff musi zawierać (wprost, bez „domyśl się”):

- **SESSIONANCHOR**: projekt/moduł, status fazy, komenda weryfikacyjna, link do ostatniego handoff
- **CO ZMIENIONE / WAŻNE**: fakty (pliki/artefakty), bez marketingu
- **NEXT (1 rzecz)**: jedna najlepsza rzecz na start kolejnej sesji
- **BLOCKER**: jeśli brak, napisz „Brak”

Przykład referencyjny (zakończenie Fazy 2): `docs/handoffs/2026-04-09-phase2-repo-pages.md`

Kanoniczna specyfikacja `SESSIONANCHOR` + format i walidacja handoff: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)

---

## 🧭 MAPA KOMEND — Slash Commands

| Komenda | Kiedy używać | Co robi |
|---------|-------------|---------|
| `/vibe-init` | **Start KAŻDEJ sesji** | Czyta kontekst projektu, proponuje cel, czeka na zatwierdzenie |
| `/blast` | Przed każdym nowym featurem | Analiza BLAST + plan → czeka na zatwierdzenie |
| `/audit-red-team` | Przed każdym deploy | Red team audyt bezpieczeństwa i zgodności |
| `/deploy-cf` | Deploy na Cyber-Folks | Przygotowuje komendy SCP + SSH |
| `/deploy-wp` | Deploy WordPress | Backup → pull → smoke test |
| `/debug` | Gdy coś nie działa | 5-krokowa diagnostyka root cause, nie zgaduje |
| `/context-reset` | AG kręci się w kółko (>2 próby) | Reset — AG tłumaczy problem i nowe podejście |
| `/handoff` | **Koniec KAŻDEJ sesji** | Raport + commit + push |

---

## ⚡ 3 ZŁOTE ZASADY

::: tip ZASADA 1 — Plan przed kodem
Zawsze `/blast` przed implementacją. Zawsze czekaj na zatwierdzenie planu.
Kod bez planu = chaos i regresje.
:::

::: tip ZASADA 2 — Zasada 1-1-1
Jeden moduł. Jeden diff. Jedno wdrożenie. Sprawdź. Powtarzaj.
Nie "wszystko naraz" — nigdy.
:::

::: tip ZASADA 3 — Deploy to Ty, nie AG
AG daje gotowe komendy. Ty je uruchamiasz. Ty masz kontrolę.
Nigdy odwrotnie.
:::

---

## 🗺️ Mapa Strony — Co gdzie znajdziesz

| Sekcja | Zawartość |
|--------|-----------|
| [⚙️ CORE](/core/global-rules) | Nienaruszalne zasady systemu V4.0 |
| [🤖 AGENTS](/agents/agent-boundaries) | Kto co może — granice agentów |
| [📘 PLAYBOOKS](/playbooks/feature-loop) | Pełne opisy operacji krok po kroku |
| [☑️ CHECKLISTS](/checklists/prep-deploy) | Listy do zaklikania przed deploy i commitem |
| [📚 REFERENCE](/reference/glossary) | Słownik, złote prompty, antywzorce |
| [📝 TEMPLATES](/templates/tmpl-session-log) | Gotowe szablony YAML do sesji i incydentów |
| [📔 JOURNAL](/journal/logs-index) | Rejestr operacyjny — historia sessions |
| [🧪 LAB](/lab/lab-index) | Poligon promptów i eksperymentów |
| [🧠 STUDY](/study/study-index) | Systematyczna nauka technologii |

---

## 🆘 Pomoc — Gdzie szukać?

| Sytuacja | Gdzie iść |
|----------|----------|
| Chaos i nie wiesz co robić | [→ if-lost.md](/if-lost) |
| Coś się zepsuło w kodzie | Wpisz `/debug` |
| Agent się gubi i powtarza | Wpisz `/context-reset` |
| Chcesz poznać zasady systemu | [→ global-rules.md](/core/global-rules) |
| Chcesz wiedzieć co może AG | [→ agent-boundaries.md](/agents/agent-boundaries) |
| Chcesz rozumieć jak rozmawiać z AG | [→ antigravity.md](/agents/antigravity) |

---

## Orchestration Decision Loop (jak podejmować decyzje bez zgadywania)

To jest prosty, twardy loop — zawsze w tej kolejności:

1) **Scan**: uruchom `node tools\\vcms-scan.js`
2) **Gate**: otwórz `docs/ecosystem/conflicts.md`
   - jeśli konflikty >0 → najpierw eliminujesz konflikty / braki SSoT, dopiero potem robisz feature
3) **Select repo**: w `docs/ecosystem/map.md` i `docs/ecosystem/repos/*.md` wybierasz repo docelowe
4) **Load truth**: z repo page bierzesz canonical brain/todo + guardrails
5) **Plan**: dopiero teraz `/blast` (z „Limitations” ustawionymi na jeden moduł i konkretne pliki)
6) **Execute**: zasada 1-1-1
7) **Close**: `/handoff` z NEXT=1

Kontrakty operacji (OP-001..OP-006) i ich PASS/FAIL: [orchestration-commands.md](/core/orchestration-commands)

To jest mechanizm, który broni Cię przed regresjami i „kreatywnym” AI.

---

## Failure modes & Recovery (flex-vcms)

### Jeśli skan nie działa / nie generuje plików

- Upewnij się, że jesteś w `C:\\Users\\FlexGrafik\\Desktop\\flex-vcms`
- Uruchom ponownie `node tools\\vcms-scan.js`
- Jeśli dalej źle: przejdź przez protokół ratunkowy: [→ if-lost.md](/if-lost)

### Jeśli `docs/ecosystem/conflicts.md` pokazuje konflikty >0

- To jest **blokada**. Najpierw porządek (SSoT), potem feature.
- Wybierasz repo i jedziesz po rekomendacjach w raporcie konfliktów.

### Jeśli nie wiesz „gdzie jest prawda” (brain/todo/guardrails)

- Otwórz `docs/ecosystem/repos/<slug>.md` dla repo.
- Jeśli repo page pokazuje braki → naprawa jest priorytetem (guardrails/handoffs/canonical).

---

## Checklist (SOP) — szybka weryfikacja na start i na koniec sesji

> Kanoniczna checklista weryfikacyjna Fazy 3 (Quality Gates + DoD): [phase-3-verification.md](/checklists/phase-3-verification)
> Polityka bezpieczenstwa (sekrety/.env/wp-config): [security-policy.md](/core/security-policy)

### Start sesji (5 minut)

- Uruchom `node tools\\vcms-scan.js`
- `docs/ecosystem/conflicts.md` → Conflicts: **0**
- `docs/ecosystem/map.md` → wybierz repo docelowe (1 moduł)
- Repo page → canonical brain/todo + guardrails present = yes
- Dopiero wtedy `/vibe-init` i `/blast`

### Koniec sesji (5 minut)

- Jest handoff z formatem minimalnym (SESSIONANCHOR/CO ZMIENIONE/NEXT/BLOCKER)
- NEXT jest dokładnie **1 rzecz** (bez listy 10 punktów)
- Jeśli w tej sesji zmieniałeś „prawdę” (np. brain/todo/guardrails) → uruchom ponownie `node tools\\vcms-scan.js` i upewnij się, że conflicts nadal = 0
