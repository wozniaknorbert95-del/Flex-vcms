---
status: "[STABLE]"
title: "Poradnik UÅ¼ytkownika â€” Start Tutaj"
---

# ðŸš€ Poradnik UÅ¼ytkownika â€” Zacznij Tutaj

> WrÃ³ciÅ‚eÅ› po przerwie? Zaczynasz od zera? Ten dokument to TwÃ³j **punkt startowy**.
> Czytaj od gÃ³ry do doÅ‚u. Nie pomijaj.

---

## Co to jest VCMS?

**Vibe Coding Mastery System** to TwÃ³j osobisty system operacyjny dla pracy z AI.
Zamiast kaÅ¼dÄ… sesjÄ™ zaczynaÄ‡ od zera i tÅ‚umaczyÄ‡ agentowi wszystko od nowa, VCMS zapewnia Å¼e:

- Agenty (OpenCode / Cursor) **zawsze znajÄ… reguÅ‚y gry** â€” nie trzeba im tÅ‚umaczyÄ‡ od zera
- KaÅ¼da sesja ma **jasny start i jasny koniec** â€” wiesz gdzie jesteÅ›
- **Å»adna wiedza nie ginie** miÄ™dzy sesjami â€” handoff to obowiÄ…zek
- Deploy na produkcjÄ™ jest **zawsze kontrolowany przez Ciebie** â€” agenty nigdy nie deployujÄ… autonomicznie

---

## VCMS jako Orchestrator ekosystemu (FlexGrafik)

VCMS (repo `flex-vcms`) jest warstwÄ… **Orchestration**: nie â€žwymyÅ›la prawdyâ€, tylko jÄ… **zbiera, porzÄ…dkuje i wystawia** jako deterministyczne artefakty.

### Single Source of Truth (moduÅ‚y i Å›cieÅ¼ki)

- Lista moduÅ‚Ã³w i ich lokalizacja na dysku jest w `repos.yaml`.
- **Root moduÅ‚Ã³w** (z `repos.yaml`): `C:\\Users\\FlexGrafik\\FlexGrafik\\github`
- Kod moduÅ‚Ã³w Å¼yje w podkatalogach `root` (po 1 na repo).

### Artefakty Orchestratora (po skanie)

Po uruchomieniu skanu, VCMS generuje:

- `data/vcms-index.json` â€” inventory plikÃ³w + hashe (read-only oglÄ…d repo)
- `docs/ecosystem/conflicts.md` â€” konflikty/ostrzeÅ¼enia (docelowo ma byÄ‡ **0**)
- `docs/ecosystem/map.md` â€” mapa + â€žWhere is the truthâ€ + linki do repo pages
- `docs/ecosystem/repos/*.md` â€” per-repo â€žRepo pageâ€ (canonical brain/todo, guardrails, handoffs readiness, last_handoff)

Te dokumenty sÄ… po to, Å¼ebyÅ› **nie pracowaÅ‚ w ciemno** i Å¼eby kolejna sesja startowaÅ‚a od faktÃ³w, a nie od pamiÄ™ci.

---

## ðŸ” JAK DZIAÅA SESJA â€” Krok po Kroku

### KROK 0 â€” Ustal kontekst sesji i odÅ›wieÅ¼ dashboard (VCMS scan)

Zanim cokolwiek planujesz lub implementujesz, odÅ›wieÅ¼ stan ekosystemu lokalnie.

**PowerShell (referencyjnie):**

1) `Set-Location "C:\\Users\\FlexGrafik\\FlexGrafik\\github\\Flex-vcms\\flex-vcms"`
2) `node tools\\vcms-scan.js`

**Co sprawdzasz po skanie (must-have):**

- `docs/ecosystem/conflicts.md` â†’ ma byÄ‡ **Conflicts: 0** (jeÅ›li >0, najpierw porzÄ…dek, potem feature)
- `docs/ecosystem/map.md` â†’ wybierasz repo docelowe i wiesz â€žgdzie jest prawdaâ€
- `docs/ecosystem/repos/*.md` â†’ w repo page masz canonical brain/todo + readiness

JeÅ›li masz wÄ…tpliwoÅ›ci â€žco jest kanoniczneâ€, odpowiedÅº **nie jest w gÅ‚owie** â€” jest w repo page i w `repos.yaml`.

**Commit i rejestr:** gdy ruszasz `repos.yaml`, `scan-rules.json` lub skaner, trzymaj siÄ™ tabeli *â€žRytm orchestratoraâ€* w [Workflow Manual â€” Orchestration SOP](/core/workflow-manual#rytm-orchestratora) (jeden commit ze Å›wieÅ¼ymi artefaktami skanu).

### Skrypty PowerShell (helpers)

W katalogu `scripts/` (root `flex-vcms`):

- **`New-Log.ps1`** â€” kopiuje szablon do `docs/journal/_log_<data-czas>.md` i otwiera plik w `code` (VS Code CLI). Parametr `-Type` (domyÅ›lnie `session`): `session`, `incident`, `playbook`, `weekly-review` (szablony: `docs/templates/tmpl-<typ>.md`).
- **`Start-Cockpit.ps1`** â€” `Set-Location` do root repozytorium i `npm run docs:dev` (lokalny podglÄ…d dokumentacji VitePress).
- **`Deploy-VPS.ps1`** â€” build `docs:build`, `scp` plikÃ³w Node + `dist` na VPS, zdalnie `npm ci --omit=dev` i `pm2 reload` (parametr `-WhatIf` = dry-run). Runbook: [VPS runbook](/reference/vcms-vps-runbook).

---

### KROK 1 â€” OtwÃ³rz sesjÄ™ komendÄ… `/vibe-init`

Rozpocznij sesjÄ™ w OpenCode / Cursor Agent od komendy:

```
/vibe-init
```

Agent przeczyta kontekst projektu (`flex-vcms-todo.json` w repo VCMS + ewentualnie `brain.md`) i powie Ci w 2 zdaniach co rozumie jako cel sesji.
**ZatwierdÅº lub popraw** zanim agent napisze JAKIKOLWIEK kod.

---

### KROK 2 â€” Zanim zaczniecie feature: `/blast`

```
/blast [opisz krÃ³tko co chcesz zrobiÄ‡]
```

Agent uÅ¼ywa frameworka BLAST, Å¼eby zaplanowaÄ‡ pracÄ™:

| Litera | Co to | Po co |
|--------|-------|-------|
| **B** â€” Background | Kontekst, co rozwiÄ…zujemy | Å»eby AG rozumiaÅ‚ problem |
| **L** â€” Limitations | Ograniczenia, zakres plikÃ³w | Å»eby AG nie wychylaÅ‚ siÄ™ poza scope |
| **A** â€” Actions | Konkretne kroki implementacji | Å»ebyÅ› wiedziaÅ‚ co siÄ™ bÄ™dzie dziaÄ‡ |
| **S** â€” Success | Definicja DONE | Å»eby wiedzieÄ‡ kiedy skoÅ„czyÄ‡ |
| **T** â€” Tests | Jak weryfikujemy Å¼e dziaÅ‚a | Å»eby nie wychodziÄ‡ bez smoketest |

::: info
**Zawsze zatwierdÅº plan BLAST** zanim AG napisze pierwszÄ… liniÄ™ kodu.
Bez zgody Twojej = agent nie pisze kodu.
:::

---

### KROK 3 â€” Implementacja: Zasada 1-1-1

Agent implementuje **JEDEN moduÅ‚ na raz**.

```
1 moduÅ‚ â†’ 1 diff â†’ 1 wdroÅ¼enie â†’ sprawdÅº â†’ powtÃ³rz
```

Ty wdraÅ¼asz. Sprawdzasz. Dopiero potem AG robi nastÄ™pny element.

::: danger ZAKAZANE
Nigdy nie mÃ³w "zrÃ³b wszystko naraz".
To jest przepis na regresje, konflikty i utratÄ™ kontroli nad projektem.
:::

---

### KROK 4 â€” Przed deploy: `/audit-red-team`

```
/audit-red-team
```

Agent "atakuje" swÃ³j wÅ‚asny kod jak red team. Sprawdza:
- ðŸ”’ Security (sekrety w kodzie, walidacja inputÃ³w, SQL injection)
- ðŸ“¡ Reliability (co gdy API nie odpowie, co przy duplikacji)
- ðŸ—„ï¸ Data (backup przed migracjÄ…, rollback moÅ¼liwy?)
- ðŸŒ WordPress (wp-config.php poza repo, PHP zwalidowany?)

Wynik: **ðŸŸ¢ Gotowe / ðŸŸ¡ Drobne uwagi / ðŸ”´ Blokuje deploy**

::: warning
**Tylko ðŸŸ¢ jedzie na produkcjÄ™.** Przy ðŸ”´ â€” najpierw naprawa, potem audit ponownie.
:::

---

### KROK 5 â€” Deploy ZAWSZE rÄ™cznie przez Ciebie

Agent przygotuje gotowe komendy przez `/deploy-cf` lub `/deploy-wp`.
**Ty je uruchamiasz.** Agent NIGDY nie deployuje autonomicznie.

```powershell
# PrzykÅ‚ad â€” agent przygotuje, Ty uruchamiasz:
scp -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -P 222 deploy.tar.gz ...
```

---

### KROK 6 â€” ZakoÅ„cz sesjÄ™: `/handoff`

```
/handoff
```

Agent zapisze raport sesji:
- Co zrobiono (lista zmian)
- Stan obecny (branch, ostatni commit)
- Co niedokoÅ„czone (i dlaczego)
- **NastÄ™pny krok** (1 zdanie na start kolejnej sesji)

::: danger
Bez handoffu â€” wiedza ginie miÄ™dzy sesjami.
To obowiÄ…zek, nie opcja. Agent przypomni jeÅ›li sprÃ³bujesz zakoÅ„czyÄ‡ bez handoffu.
:::

---

#### Minimalny format handoff (wymagany)

KaÅ¼dy handoff musi zawieraÄ‡ (wprost, bez â€ždomyÅ›l siÄ™â€):

- **SESSIONANCHOR**: projekt/moduÅ‚, status fazy, komenda weryfikacyjna, link do ostatniego handoff
- **CO ZMIENIONE / WAÅ»NE**: fakty (pliki/artefakty), bez marketingu
- **NEXT (1 rzecz)**: jedna najlepsza rzecz na start kolejnej sesji
- **BLOCKER**: jeÅ›li brak, napisz â€žBrakâ€

PrzykÅ‚ad referencyjny (zakoÅ„czenie Fazy 2): `docs/handoffs/2026-04-09-phase2-repo-pages.md`

Kanoniczna specyfikacja `SESSIONANCHOR` + format i walidacja handoff: [session-anchor-and-handoff-spec.md](/core/session-anchor-and-handoff-spec)

---

## ðŸ§­ MAPA KOMEND â€” Slash Commands

| Komenda | Kiedy uÅ¼ywaÄ‡ | Co robi |
|---------|-------------|---------|
| `/vibe-init` | **Start KAÅ»DEJ sesji** | Czyta kontekst projektu, proponuje cel, czeka na zatwierdzenie |
| `/blast` | Przed kaÅ¼dym nowym featurem | Analiza BLAST + plan â†’ czeka na zatwierdzenie |
| `/audit-red-team` | Przed kaÅ¼dym deploy | Red team audyt bezpieczeÅ„stwa i zgodnoÅ›ci |
| `/deploy-cf` | Deploy na Cyber-Folks | Przygotowuje komendy SCP + SSH |
| `/deploy-wp` | Deploy WordPress | Backup â†’ pull â†’ smoke test |
| `/debug` | Gdy coÅ› nie dziaÅ‚a | 5-krokowa diagnostyka root cause, nie zgaduje |
| `/context-reset` | Agent krÄ™ci siÄ™ w kÃ³Å‚ko (>2 prÃ³by) | Reset â€” agent tÅ‚umaczy problem i nowe podejÅ›cie |
| `/handoff` | **Koniec KAÅ»DEJ sesji** | Raport + commit + push |

---

## âš¡ 3 ZÅOTE ZASADY

::: tip ZASADA 1 â€” Plan przed kodem
Zawsze `/blast` przed implementacjÄ…. Zawsze czekaj na zatwierdzenie planu.
Kod bez planu = chaos i regresje.
:::

::: tip ZASADA 2 â€” Zasada 1-1-1
Jeden moduÅ‚. Jeden diff. Jedno wdroÅ¼enie. SprawdÅº. Powtarzaj.
Nie "wszystko naraz" â€” nigdy.
:::

::: tip ZASADA 3 â€” Deploy to Ty, nie AG
Agent daje gotowe komendy. Ty je uruchamiasz. Ty masz kontrolÄ™.
Nigdy odwrotnie.
:::

---

## ðŸ—ºï¸ Mapa Strony â€” Co gdzie znajdziesz

| Sekcja | ZawartoÅ›Ä‡ |
|--------|-----------|
| [âš™ï¸ CORE](/core/global-rules) | Nienaruszalne zasady systemu V4.0 |
| [ðŸ¤– AGENTS](/agents/agent-boundaries) | Kto co moÅ¼e â€” granice agentÃ³w |
| [ðŸ“˜ PLAYBOOKS](/playbooks/feature-loop) | PeÅ‚ne opisy operacji krok po kroku |
| [â˜‘ï¸ CHECKLISTS](/checklists/prep-deploy) | Listy do zaklikania przed deploy i commitem |
| [ðŸ“š REFERENCE](/reference/glossary) | SÅ‚ownik, zÅ‚ote prompty, antywzorce |
| [ðŸ“ TEMPLATES](/templates/tmpl-session-log) | Gotowe szablony YAML do sesji i incydentÃ³w |
| [ðŸ“” JOURNAL](/journal/logs-index) | Rejestr operacyjny â€” historia sessions |
| [ðŸ§ª LAB](/lab/lab-index) | Poligon promptÃ³w i eksperymentÃ³w |
| **VIBE COACH (nauka)** | Kanoniczna nauka i skill map: `C:\Users\FlexGrafik\FlexGrafik\github\vibe-coach\docs\study-index.md` |

---

## ðŸ†˜ Pomoc â€” Gdzie szukaÄ‡?

| Sytuacja | Gdzie iÅ›Ä‡ |
|----------|----------|
| Chaos i nie wiesz co robiÄ‡ | [â†’ if-lost.md](/if-lost) |
| CoÅ› siÄ™ zepsuÅ‚o w kodzie | Wpisz `/debug` |
| Agent siÄ™ gubi i powtarza | Wpisz `/context-reset` |
| Chcesz poznaÄ‡ zasady systemu | [â†’ global-rules.md](/core/global-rules) |
| Chcesz wiedzieÄ‡ co moÅ¼e agent | [â†’ agent-boundaries.md](/agents/agent-boundaries) |
| Chcesz rozumieÄ‡ role agentÃ³w | [â†’ agents.md](/agents/agent-boundaries) |

---

## Orchestration Decision Loop (jak podejmowaÄ‡ decyzje bez zgadywania)

To jest prosty, twardy loop â€” zawsze w tej kolejnoÅ›ci:

1) **Scan**: uruchom `node tools\\vcms-scan.js`
2) **Gate**: otwÃ³rz `docs/ecosystem/conflicts.md`
   - jeÅ›li konflikty >0 â†’ najpierw eliminujesz konflikty / braki SSoT, dopiero potem robisz feature
3) **Select repo**: w `docs/ecosystem/map.md` i `docs/ecosystem/repos/*.md` wybierasz repo docelowe
4) **Load truth**: z repo page bierzesz canonical brain/todo + guardrails
5) **Plan**: dopiero teraz `/blast` (z â€žLimitationsâ€ ustawionymi na jeden moduÅ‚ i konkretne pliki)
6) **Execute**: zasada 1-1-1
7) **Close**: `/handoff` z NEXT=1

Kontrakty operacji (OP-001..OP-006) i ich PASS/FAIL: [orchestration-commands.md](/core/orchestration-commands)

To jest mechanizm, ktÃ³ry broni CiÄ™ przed regresjami i â€žkreatywnymâ€ AI.

---

## Failure modes & Recovery (flex-vcms)

### JeÅ›li skan nie dziaÅ‚a / nie generuje plikÃ³w

- Upewnij siÄ™, Å¼e jesteÅ› w `C:\\Users\\FlexGrafik\\FlexGrafik\\github\\Flex-vcms\\flex-vcms`
- Uruchom ponownie `node tools\\vcms-scan.js`
- JeÅ›li dalej Åºle: przejdÅº przez protokÃ³Å‚ ratunkowy: [â†’ if-lost.md](/if-lost)

### JeÅ›li `docs/ecosystem/conflicts.md` pokazuje konflikty >0

- To jest **blokada**. Najpierw porzÄ…dek (SSoT), potem feature.
- Wybierasz repo i jedziesz po rekomendacjach w raporcie konfliktÃ³w.

### JeÅ›li nie wiesz â€žgdzie jest prawdaâ€ (brain/todo/guardrails)

- OtwÃ³rz `docs/ecosystem/repos/<slug>.md` dla repo.
- JeÅ›li repo page pokazuje braki â†’ naprawa jest priorytetem (guardrails/handoffs/canonical).

---

## Checklist (SOP) â€” szybka weryfikacja na start i na koniec sesji

> Kanoniczna checklista weryfikacyjna Fazy 3 (Quality Gates + DoD): [phase-3-verification.md](/checklists/phase-3-verification)
> Polityka bezpieczenstwa (sekrety/.env/wp-config): [security-policy.md](/core/security-policy)

### Start sesji (5 minut)

- Uruchom `node tools\\vcms-scan.js`
- `docs/ecosystem/conflicts.md` â†’ Conflicts: **0**
- `docs/ecosystem/map.md` â†’ wybierz repo docelowe (1 moduÅ‚)
- Repo page â†’ canonical brain/todo + guardrails present = yes
- Dopiero wtedy `/vibe-init` i `/blast`

### Koniec sesji (5 minut)

- Jest handoff z formatem minimalnym (SESSIONANCHOR/CO ZMIENIONE/NEXT/BLOCKER)
- NEXT jest dokÅ‚adnie **1 rzecz** (bez listy 10 punktÃ³w)
- JeÅ›li w tej sesji zmieniaÅ‚eÅ› â€žprawdÄ™â€ (np. brain/todo/guardrails) â†’ uruchom ponownie `node tools\\vcms-scan.js` i upewnij siÄ™, Å¼e conflicts nadal = 0

