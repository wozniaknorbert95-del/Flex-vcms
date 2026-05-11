master-plan.md
Rola: Strategiczny Roadmap Ekosystemu FlexGrafik V4.0
Właściciel: Norbert Woźniak (Dowódca)
Status: DOKUMENT STRATEGICZNY – nadrzędny wobec pojedynczych feature’ów
Ostatnia aktualizacja: 19 marca 2026

==================================================
0. INSTRUKCJA DLA ANTIGRAVITY / JADZI
==================================================

Kiedy ten plik jest załadowany, AG / Jadzia MUSZĄ:

- Traktować go jako główne „źródło kierunku” (strategia makro), ważniejsze niż pojedyncze zadania z `todo.json`.
- W Fazie PLAN (`/vibe-init`) sprawdzać, czy wybrane zadanie:
  - przybliża do realizacji Etapów 1–5,
  - nie jest sprzeczne z opisanym tu modelem biznesowym.
- W Fazie DESIGN (`/blast`) weryfikować, czy proponowany feature:
  - wzmacnia kluczowe moduły i zależności,
  - nie wprowadza „piątego modułu” bez decyzji Dowódcy.
- W Fazie ITERATE (`/handoff` + Brain Update) sugerować aktualizację sekcji „Aktualny status”, jeśli postęp prac tego wymaga.

Jeśli feature jest atrakcyjny, ale nie pasuje do Master Planu:

- AG powinno oznaczyć to jako: `POMYSŁ SPOZA MASTER-PLANU`
- i zapytać Dowódcę, czy:
  - dodać nową pozycję do Master Planu,
  - czy odłożyć pomysł (parking lot).

==================================================
1. OVERVIEW EKOSYSTEMU FLEXGRAFIK V4.0
==================================================

Opis wysokopoziomowy – CO budujemy i JAK te części ze sobą grają.

1.1. Model „Wizard-First, AI-Operated”

Ekosystem FlexGrafik V4.0 jest autonomicznym przedsiębiorstwem brandingowym dla ZZP w Holandii, opartym na:

- jednym lejku sprzedażowym: 7‑etapowy Wizard (SPA),
- jednym mózgu operacyjnym: system agentów AI (Jadzia),
- dwóch „wzmacniaczach” ekosystemu: Gra Mobilna (lead magnet) i Strona Wizytówka (brand portal).

1.2. Moduły i ich rola

A) Sklep Online (Wizard) — `zzpackage.flexgrafik.nl`  
Rola: **Cash Engine** – generuje przychód i finansuje rozwój ekosystemu.  
Charakterystyka:
- Jedyna ścieżka zakupu: 7‑krokowy konfigurator SPA.
- Brak klasycznego sklepu, brak list produktów.
- Wszystkie produkty jako wirtualne, BTW 21% wliczony, Dark Premium.

B) System Agent AI (Jadzia-Core) — `jadzia-core`  
Rola: **The Brain / Nervous System** – orkiestruje operacje, zamówienia, logistykę, automaty.  
Charakterystyka:
- Hierarchia agentów: Directive, Orchestration, Execution (zgodnie z `agents.md`).
- MCP jako standard komunikacji.
- Baza `jadzia.db` jako centralne źródło danych operacyjnych.

C) Gra Mobilna (Lead Magnet) — `app.flexgrafik.nl`  
Rola: **Community & Leads** – przyciąga potencjalnych klientów, generuje leady i kupony.  
Charakterystyka:
- Skill‑based game powiązana z brandingiem.
- Nagrody w postaci kuponów do Wizarda.
- Integracja z `jadzia.db` (leady, kupony, użycie).

D) Strona Wizytówka (Brand Portal) — `flexgrafik.nl`  
Rola: **Trust & Authority** – buduje wizerunek lokalnego eksperta, prezentuje portfolio, park maszynowy.  
Charakterystyka:
- Jednoznacznie w stylu Dark Premium.
- Język: NL, komunikatywne, proste copy dla ZZP.
- Pełni rolę „wejścia” do ekosystemu (linki do Wizarda i Gry).

1.3. Kluczowe zależności (System Nerwowy)

- Sklep → Jadzia:
  - każde zamówienie z Wizarda tworzy rekord w `jadzia.db`,
  - Jadzia inicjuje operacje (projekty, produkcja, wysyłka plików, komunikacja z klientem).

- Gra → Sklep:
  - Gra generuje kupony i leady,
  - Jadzia waliduje kupony, mapuje lead → klient w Wizardzie.

- Jadzia → Wszystko:
  - trzyma stan operacyjny całej firmy,
  - pozwala na automatyzacje i raportowanie,
  - jest docelowym „OS firmy”.

==================================================
2. PRIORYTETY WDROŻENIA (ETAP 1–5)
==================================================

> ZASADA: Zadania z `todo.json` powinny być zawsze mapowane na poniższe Etapy.

Etap 1 – CORE (Infrastruktura Wiedzy)
- Cel: mieć profesjonalny workflow zanim dotkniesz kolejnego feature’a.
- Zakres:
  - dopracowanie `workflow-manual.md`,
  - dopracowanie `global-rules.md`,
  - utworzenie `agents.md`, `todo.json`, podstawowych `brain-[module].md`.
- Efekt: AG i Jadzia działają w jednym, spójnym modelu operacyjnym.

Etap 2 – Sklep Online (Stabilizacja Lejka)
- Cel: Wizard musi zarabiać stabilnie.
- Priorytety:
  - naprawa krytycznych błędów koszyka (persistencja, walidacja),
  - uzupełnienie grafik dla 77 SKU (zgodnie z brand‑guidelines),
  - dopięcie full flow płatności i webhooków (Mollie).
- Efekt: stabilny, konwersyjny, Wizard‑only lejek z AOV 400–700 €.

Etap 3 – Jadzia Core (Automatyzacja)
- Cel: wyjście z trybu „manualnej obsługi zamówień”.
- Priorytety:
  - wdrożenie hierarchii agentów (Strategist, Planner, Execution),
  - konfiguracja MCP tools (`mcp-tools.json`),
  - stworzenie pierwszych nodów operacyjnych (np. `order_node`, `task_node`).
- Efekt: zamówienia z Wizarda automatycznie wyzwalają procesy w Jadzi.

Etap 4 – Gra Mobilna (Migracja i Integracja)
- Cel: zacząć generować leady i ruch do Wizarda.
- Priorytety:
  - migracja kodu z repo „bouwplaats‑chaos” do uporządkowanej struktury,
  - lokalizacja na NL,
  - integracja z `jadzia.db` (leady, kupony, eventy).
- Efekt: gra generuje realne leady, mierzona w Jadzi.

Etap 5 – Strona Wizytówka (Szlif Brandu)
- Cel: wizerunek = realny poziom systemu.
- Priorytety:
  - naprawa menu i struktury nawigacji,
  - pełne przejście na Dark Premium,
  - dopięcie spójnych ścieżek: Strona → Wizard / Gra.
- Efekt: całość wygląda i czuje się jak jeden produkt klasy enterprise.

==================================================
3. CELE BIZNESOWE VS CELE TECHNICZNE (MAKRO)
==================================================

3.1. Rentowność

Cel biznesowy:
- Marża brutto ≥ 60%.
- AOV 400–700 €.
- Hard‑block koszyka na 199 €.

Cel techniczny:
- Wizard z pricingiem zgodnym z `global-rules.md`.
- Mechanizmy upsell/cross‑sell konfigurowalne przez Jadzię (np. rekomendacje pakietów w ramach Wizarda).

3.2. Autonomia

Cel biznesowy:
- Skalowanie przychodów bez zatrudniania pracowników (AI‑Only / AI‑First stack).

Cel techniczny:
- Pełne wdrożenie:
  - MCP jako standardu narzędzi,
  - Agent Cards (`agents.md`),
  - pipeline’u handoff → Brain Update,
  - Jadzia jako główny OS.

3.3. Wzrost

Cel biznesowy:
- MRR 3 000 € na Q4 2026.
- Stały dopływ leadów z Gry i ruchu z Wizytówki.

Cel techniczny:
- „Content Engine” generujący:
  - posty z realizacji (np. social),
  - case studies,
  - materiały do landingów,
  - bazujący na danych z `jadzia.db` i brainów.

3.4. Standardy i reputacja

Cel biznesowy:
- Pozycja lokalnego eksperta w Rotterdamie (druk, branding, AI‑stack).

Cel techniczny:
- Twarde standardy dev‑ops:
  - deploy tylko ręcznie (Zasada 11),
  - praca na feature branchach,
  - testy i audyty jako obowiązkowe kroki,
  - spójny Dark Premium UX.

==================================================
4. AKTUALNY STATUS (STAN NA 19.03.2026)
==================================================

> Uwaga: ta sekcja ma być AKTUALIZOWANA po większych sesjach /handoff.

| Moduł       | Gotowość | Kluczowe wyzwania                                                                 |
|------------|----------|-------------------------------------------------------------------------------------|
| Sklep (Wizard) | ~90%     | Bug koszyka (persistencja), brak kompletu grafik 77 SKU, drobne UX flow           |
| Jadzia Core   | ~30%     | Brak pełnej hierarchii agentów, brak produkcyjnych nodów operacyjnych             |
| Gra Mobilna   | ~85%     | Migracja z repo „bouwplaats-chaos”, lokalizacja NL, dopięcie integracji z Jadzią  |
| Wizytówka     | ~60%     | Menu, spójność Dark Premium, dopięcie ścieżek do Wizarda i Gry                    |

AG w Fazie PLAN powinna używać tego statusu, by:

- priorytetyzować zadania z `todo.json` (np. najpierw krytyczne rzeczy w Sklepie i Jadzi),
- unikać zadań „kosmetycznych”, gdy core nie jest stabilny.

==================================================
5. JAK UŻYWAĆ MASTER-PLAN W WORKFLOW
==================================================

Faza 1 – PLAN (`/vibe-init`, Krok 1–2)
- AG musi:
  - przeczytać sekcje 1–2 i 4,
  - zmapować wybrane zadanie z `todo.json` na odpowiedni Etap (1–5),
  - zgłosić Dowódcy, do którego celu makro i modułu dane zadanie należy.

Faza 2 – DESIGN (`/blast`, Krok 4)
- Podczas `/blast` AG:
  - sprawdza, czy implementacja nie rozbija kluczowych zależności (Sklep↔Jadzia↔Gra),
  - ocenia wpływ na cele biznesowe (marża, AOV, MRR, autonomia).

Faza 3–4 – BUILD / TEST
- Master Plan jest referencją:
  - czy dane zadanie nie jest zbyt „lokalne” wobec priorytetów (np. drobny CSS vs. kluczowy bug koszyka),
  - czy testy i audyt wspierają cele makro (bezpieczeństwo, spójność UX, język NL).

Faza 5 – LAUNCH
- Przy planowaniu release’u:
  - AG powinna wskazać, do którego Etapu i celu makro należy dany release,
  - to ułatwia decyzje: czy release ma priorytet.

Faza 6 – ITERATE (`/handoff` + Brain Update)
- Po sesji:
  - Dowódca aktualizuje sekcję „Aktualny status” (punkt 4),
  - jeśli zmienia się strategia (np. nowy cel MRR, re‑prioritetyzacja Etapów) – aktualizuje sekcje 2–3.
- AG może w /handoff zaproponować:
  - „Sugerowana aktualizacja master-plan.md: [lista zmian]”.

==================================================
6. ZASADA KOŃCOWA
==================================================

Zmiany w `master-plan.md`:

- mogą pochodzić wyłącznie od Dowódcy (lub na jego wyraźne polecenie),
- nie mogą być wprowadzane autonomicznie przez agentów,
- muszą być traktowane jako wydarzenie strategiczne – po zmianie Master Planu konieczne jest:
  - poinformowanie AG/Jadzi,
  - ponowne wczytanie dokumentu w kolejnych sesjach.

Master Plan jest „konstytucją kierunku” – wszystkie inne dokumenty i zadania muszą być z nim zgodne.
