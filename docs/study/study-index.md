---
status: "[ACTIVE]"
title: "Study Index — Dziennik Nauki Dowodcy"
updated: "2026-04-09"
---

# Study Index — Dziennik Nauki

> Kanoniczny rejestr poziomow wiedzy i planu nauki Dowodcy (Faza 4 SSoT).
> KODA czyta go przed kazdym `/checkpoint` i `/review-week`.
> Aktualizuj po kazdej sesji gdzie cos sie zmienilo — nie po kazdej sesji.

---

## Skala Poziomow Wiedzy

| Poziom | Definicja |
|--------|-----------|
| **0** | Nie wiem co to |
| **1** | Slysze pierwszy raz |
| **2** | Znam pojecie, nie uzywam |
| **3** | Rozumiem jak dziala |
| **4** | Potrafia zrobic z pomoca AG |
| **5** | Robie samodzielnie |
| **6** | Wiem kiedy i dlaczego uzyc |
| **7** | Moge nauczyc kogos innego |

**Cel na koniec Q2 2026: poziom 5+ we wszystkich obszarach CORE (T1–T4).**

---

## SKILL MAP — 7 Obszarow Technicznych (T1–T7)

> To jest glowna mapa Fazy 4. Aktualizuj poziom gdy masz konkretny dowod (commit, deploy, fix).
> Nie podnosic poziomu "bo mi sie wydaje" — tylko na fakcie.

### T1 — Git & Version Control

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| `git add` + `git commit` | 3 | Regularne commity w sesjach |
| Konwencja commitow (feat/fix/docs) | 3 | Stosuje z pomoca AG |
| Feature branches (create / switch / merge) | 2 | Wiem o tym, nie stosowalem |
| PR + code review (GitHub) | 1 | Tylko teoria |
| `git revert` / `git reset` (rollback) | 1 | Nie robilem |
| `git stash` | 1 | Nie robilem |
| Konflikty merge — reczne rozwiazywanie | 1 | Nie mialem |

**Cel T1: poziom 5 do Q2 2026** (commit + branch + PR bez pomocy AG)

---

### T2 — Deploy (Cloudflare Pages / WordPress)

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| Deploy VitePress na CF Pages (manualny) | 2 | Wiem z checklstiy, nie robilem |
| Deploy WordPress (WP CLI / FTP) | 1 | Nie robilem |
| Prep-deploy checklist — samodzielne przejscie | 2 | Czytam, nie przechodzilem |
| Smoke test po deploy (HTTP 200 + flow) | 2 | Wiem co to |
| Rollback po nieudanym deploy | 1 | Nie robilem |
| Zmienne srodowiskowe / sekrety (bezpiecznie) | 2 | Wiem ze istnieja |

**Cel T2: poziom 4 do Q2 2026** (1x deploy z checklista pod nadzorem AG)

---

### T3 — Debug (diagnostyka bledow)

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| 5-krokowa diagnostyka AG (`/debug`) | 2 | Znam kroki, nie uzywalem na prawdziwym bledzie |
| Czytanie logow (konsola przegladarki) | 3 | Robie na co dzien |
| Czytanie logow serwera / Node | 2 | Sporadycznie |
| Izolacja bledu (binary search / min reprodukcja) | 2 | Wiem konceptualnie |
| PowerShell: podstawy debugowania skryptow | 2 | Uzywam, ale powierzchownie |

**Cel T3: poziom 4 do Q2 2026** (1x `/debug` na realnym bledzie, zapisany evidence)

---

### T4 — JavaScript / Node

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| Czytanie JS (rozumienie cudzego kodu) | 3 | Rozumiem podstawy |
| Pisanie JS (funkcje, zmienne, obiekty) | 2 | Z pomoca AG |
| Node.js scripts (np. vcms-scan.js) | 3 | Uruchamiam, rozumiem co robi |
| npm (install, run scripts) | 3 | Uzywan regularnie |
| Async / Promise / fetch | 2 | Wiem ze istnieje |
| JSON parsing / manipulation | 3 | Podstawy, vcms-index.json |

**Cel T4: poziom 4 do Q3 2026** (samodzielna mala modyfikacja narzedzia Node)

---

### T5 — WordPress / PHP (snippety)

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| Edycja motywu (functions.php snippety) | 2 | Z pomoca AG |
| WooCommerce — podstawy konfiguracji | 2 | Wiem co to |
| Custom Post Types / ACF | 1 | Tylko czytam |
| PHP — czytanie snippetow | 2 | Rozumiem proste |
| WP CLI — podstawowe komendy | 1 | Nie uzywalem |

**Cel T5: poziom 3 do Q3 2026** (nie jest CORE — uczymy sie gdy konkretne zadanie wymaga)

---

### T6 — CI / Automaty (Jadzia-core)

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| GitHub Actions — czytanie YAML workflow | 2 | Wiem jak wyglada |
| GitHub Actions — pisanie/edycja | 1 | Nie robilem |
| Jadzia-core — co robi i jak uruchamiac | 2 | Znam z opisu modulu |
| Webhooks — koncepcja | 2 | Wiem co to |
| Automatyzacja lokalnie (PowerShell skrypty) | 3 | Uzywan sporadycznie |

**Cel T6: poziom 3 do Q3 2026** (nie jest CORE — uruchomienie 1 akcji Jadzia z dowodem)

---

### T7 — Data / JSON / VCMS tools

| Umiejetnosc | Poziom | Dowod |
|-------------|--------|-------|
| Czytanie / walidacja JSON recznie | 3 | flex-vcms-todo.json, vcms-index.json |
| Uruchamianie `node tools/vcms-scan.js` | 5 | Robie samodzielnie, wiem co generuje |
| Interpretacja `conflicts.md` i `map.md` | 4 | Rozumiem i reaguje |
| Edycja `repos.yaml` (dodanie modulu) | 3 | Robilem z AG |
| Interpretacja `vcms-index.json` | 3 | Rozumiem strukture |

**Cel T7: poziom 5 do Q2 2026** (VCMS tools sa juz bliskie — 1 samodzielny cykl scan+interpret+fix)

---

## SKILL MAP — Obszary Operacyjne (O1–O5)

> Uzupelnienie dla obszarow "miekkich" i workflow. Wazne dla codziennego dzialalnia.

| Obszar | Komenda / Umiejetnosc | Poziom | Dowod |
|--------|-----------------------|--------|-------|
| O1 — VCMS Workflow | `/vibe-init` | 3 | Uzywam regularnie |
| O1 — VCMS Workflow | `/blast` | 3 | Zatwierdzilem plan |
| O1 — VCMS Workflow | `/handoff` | 2 | Wiem, nie robie konsekwentnie |
| O1 — VCMS Workflow | `/checkpoint` | 2 | Znam, nie uzywalem |
| O2 — VitePress | Uruchomienie `npm run docs:dev` | 4 | Robie samodzielnie |
| O2 — VitePress | Dodanie nowej strony .md | 4 | Zrobilem |
| O2 — VitePress | Konfiguracja sidebar | 2 | Wiem ze istnieje |
| O3 — AI Promptowanie | Jasny prompt do AG | 3 | Uzywam slash commands |
| O3 — AI Promptowanie | Context packet (co dac AG) | 3 | Mam tmpl-session-brief.md |
| O3 — AI Promptowanie | Handoff jako protokol | 3 | Stosuje od tej sesji |
| O4 — Biznes | MRR tracking | 1 | Brak aktywnego pomiaru |
| O4 — Biznes | AOV tracking | 1 | Brak aktywnego pomiaru |

---

## WEEKLY CADENCE

> Zasada: **1 obszar na tydzien**, powiazany z aktualnym modulem/zadaniem.
> Nie uczymy sie "na zapas" — tylko gdy zadanie wywoluje potrzebe.

### Format (aktualizuj co poniedzialek lub przed `/review-week`)

| Tydzien | Modul / Zadanie | Obszar nauki | Planowana lekcja (1 rzecz) | Status |
|---------|-----------------|-------------|---------------------------|--------|
| 2026-W15 (07–13.04) | flex-vcms Faza 4 | T7 — VCMS tools | Samodzielny cykl: scan + interpret + fix konfliktu | AKTYWNY |
| 2026-W16 (14–20.04) | zzpackage — Cash Engine | T1 — Git | Feature branch + PR bez pomocy AG | ZAPLANOWANY |
| 2026-W17 (21–27.04) | zzpackage — deploy | T2 — Deploy | 1x prep-deploy checklist samodzielnie | ZAPLANOWANY |

> Dodawaj nowe tygodnie na gorie (append-only pattern — nie usuwaj historii).

---

## STUDY QUEUE — Powiazana z Zadaniami Modulow

> To jest kolejka 1-2 mikro-lekcji gotowych do wykonania.
> KODA proponuje max 2 na raz. Nie 10.
> Gdy wykonujesz zadanie z backlogu → sprawdz czy masz lekcje do zlinkowania.

### Aktywna kolejka (max 3 wpisy naraz)

| ID | Lekcja (co robisz) | Powiazane zadanie | Obszar | Szacowany czas |
|----|---------------------|-------------------|--------|----------------|
| SQ-001 | Zrob `/handoff` samodzielnie bez pomocy AG na koniec tej sesji | flex-vcms Faza 4 exit | O1 | 10 min |
| SQ-002 | Uruchom `node tools/vcms-scan.js`, przeczytaj `vcms-index.json` i opisz 1 zdaniem co zawiera 1 repo | Dowolne zadanie z backlogu VCMS | T7 | 15 min |
| SQ-003 | Zrob commit z prawidlowym prefiksem `docs:` bez podpowiedzi AG | Ta sesja (zmiany docs/) | T1 | 5 min |

### Historia (wykonane questy)

| ID | Lekcja | Data | Dowod |
|----|--------|------|-------|
| SQ-H001 | Commit z prawidlowym prefiksem | 2026-04-03 | commit ec44888 |

---

## CHECKPOINTY — Historia Kontroli

> Wpis po kazdym `/checkpoint`.

| Data | Ocena KODY (0-10) | Kluczowe obserwacje | NEXT |
|------|-------------------|---------------------|------|
| — | — | Brak checkpointow. Wpisz `/checkpoint` aby zaczac. | — |

---

## NOTATKI KODY

> KODA dodaje tu obserwacje po sesjach i checkpointach.

- **2026-04-09**: Faza 4 zainicjowana. Skill map T1-T7 wypelniona poziomami startowymi. Priorytet: T7 (VCMS tools juz bliskie 5), potem T1 (Git — fundament wszystkiego). SQ-001 do wykonania na koniec tej sesji.

---

## JAK KODA CZYTA TEN PLIK

1. Sprawdza poziomy T1-T7 — czy rosna miedzy sesjami? Czy sa dowody?
2. Sprawdza study queue — co zostalo wykonane, co stoi?
3. Sprawdza weekly cadence — czy tydzien ma przypisany obszar?
4. Sprawdza biznesowe KPI — MRR, AOV (w O4)
5. Aktualizuje tylko gdy widzi zmiane (nie pisze "brak zmian")

**Ten plik jest zywym dokumentem. Nie archiwum.**
