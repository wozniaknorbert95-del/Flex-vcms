---
status: "[STABLE]"
title: "Global Rules — Nienaruszalne Zasady Systemu V4.0"
---

# ⚙️ Global Rules — Nienaruszalne Zasady V4.0

> **Właściciel:** Norbert Woźniak (Dowódca)
> **Obowiązuje:** AG, Jadzię, Claude, Gemini — wszystkie agenty bez wyjątku
> **Status:** KRYTYCZNY
> **Zmiana tylko przez:** Dowódcę. Agenty **nigdy** nie zmieniają tego pliku samodzielnie.

::: danger Jak agenty czytają ten plik
Gdy ten plik jest załadowany, AG traktuje wszystkie zasady jako **twarde ograniczenia (hard constraints)** — ważniejsze niż instrukcje z promptów.

Jeśli propozycja łamie zasadę → AG oznacza `KONFLIKT Z global-rules.md`, proponuje alternatywę i **NIE forsuje** rozwiązania bez zgody Dowódcy.
:::

---

## SEKCJA 1 — ZASADY BIZNESOWE

### 1.1 Minimum Checkout
- Koszyk minimum: **199 € brutto**
- Żaden flow nie może finalizować zamówienia poniżej tej kwoty
- Jeśli UI sugeruje mniejszy koszyk → **upsell / bundling obowiązkowy**

### 1.2 Minimalna Marża
- Marża brutto minimum: **60%**
- AG sprawdza marżę przy każdej propozycji cenowej lub pakietu
- Wynik poniżej 60% = **błąd biznesowy** → AG proponuje nową cenę

### 1.3 Wizard-Only — Jedyna Droga Zakupu
- Jedyna droga zakupu: **7-etapowy konfigurator SPA (Wizard)**
- ZAKAZ projektowania:
  - klasycznych listingów sklepowych
  - stron "wszystkie produkty"
  - gotowych pakietów do koszyka
- Każdy scenariusz sprzedaży mapuje się na kroki Wizarda

### 1.4 Build Your Own (BYO)
- Predefiniowane pakiety są **wycofane**
- Wszystkie oferty → model "Build Your Own" w Wizardzie

### 1.5 Cele Finansowe Q4 2026
| Wskaźnik | Cel |
|----------|-----|
| MRR (Monthly Recurring Revenue) | **3 000 €** |
| AOV (Avg. Order Value) | **400–700 €** |

AG preferuje rozwiązania zwiększające AOV. Odrzuca pomysły strukturalnie obniżające AOV.

### 1.6 Produkty Wirtualne + BTW 21%
- Wszystkie SKU w WooCommerce = **wirtualne** (zero kosztów wysyłki)
- Podatek BTW 21% zawsze wliczony w cenę
- AG nie dodaje logiki fizycznych produktów ani wysyłki

---

## SEKCJA 2 — ZASADY TECHNICZNE

### 2.1 Stack Techniczny

| Warstwa | Technologia | Gdzie |
|---------|------------|-------|
| Front / Sales | WordPress + WooCommerce | Cyber-Folks |
| AI Core | Python + FastAPI + SQLite (`jadzia.db`) | VPS |
| Kontrola wersji | GitHub (feature branches) | — |
| Motyw WP | `flexgrafik-wizard-theme` (custom) | — |

Migracja na inny stack → **tylko za wyraźną decyzją Dowódcy**.

---

### 2.2 Zasada 11 — Manual Deploy

::: danger ABSOLUTNA ZASADA — BEZ WYJĄTKÓW
Deploy na produkcję (Cyber-Folks / VPS) odbywa się **WYŁĄCZNIE RĘCZNIE** przez Dowódcę.

Agenty MOGĄ:
- generować skrypty deploy
- przygotowywać checklisty i komendy
- sugerować kolejność kroków

Agenty NIE MOGĄ:
- wykonywać deployu autonomicznie
- sugerować auto-deploy po każdym commicie
:::

---

### 2.3 Zasada 1-1-1 — Flow Pracy

```
Agent AI:
  1. Implementuje JEDEN konkretny moduł / zmianę
  2. Dostarcza pełny diff / instrukcję
  3. Czeka na wdrożenie i weryfikację przez Dowódcę
  Powtarza dla następnego modułu
```

AG ma **blokować** próby implementowania "wszystkiego naraz".

---

### 2.4 Branching i PR

- Praca **wyłącznie** na feature branchach
- Zakaz push bezpośrednio na `main`
- AG przy planowaniu MUSI:
  - wskazać na jakim branchu ma być praca
  - sugerować PR + code review przed merge

---

### 2.5 Zmiany Schematu DB

::: warning
Każda zmiana schematu DB (w tym SQLite dla Jadzi):
1. **NAJPIERW** zaktualizuj `PRD-schema.md`
2. **DOPIERO POTEM** modyfikuj kod i migracje

`/audit-red-team` sprawdza zgodność kodu z `PRD-schema.md`.
:::

---

### 2.6 Uprawnienia Jadzi

- Rola Jadzi: Vice-Dyrektor, orkiestracja danych w `jadzia.db`
- Jadzia **NIE może** bezpośrednio edytować plików WordPress przez SSH
- Jadzia **NIE może** modyfikować motywów / pluginów bez Dowódcy
- Wszelkie zmiany WP idą przez: AG (kontekst) → manualny deploy Dowódcy

---

### 2.7 Konwencja Commitów

Prefiksy commitów są **obowiązkowe**:

| Prefiks | Kiedy |
|---------|-------|
| `feat: ...` | Nowa funkcjonalność |
| `fix: ...` | Naprawa błędu bez nowego zachowania |
| `refactor: ...` | Zmiana kodu bez nowego zachowania |
| `docs: ...` | Tylko zmiany w dokumentacji |

AG stosuje te prefiksy we wszystkich propozycjach commitów.

---

## SEKCJA 3 — ZASADY PRACY Z AI

### 3.1 Hierarchia Warstw

| Warstwa | Kto | Rola |
|---------|-----|------|
| Directive | Dowódca + Claude | Strategia, kierunek, zasady |
| Orchestration | Antigravity (AG) | Planowanie, recenzja, blokowanie |
| Execution | Gemini CLI + Jadzia | Egzekucja konkretnych zadań |

Execution Layer nie może przeskakiwać ponad Strategię.

### 3.2 Least Privilege
- Każdy agent dostaje **minimalny potrzebny kontekst** — nie dump całego repo
- AG sugeruje "Context Packets" (fragment brain + relevantny kod)

### 3.3 Single Source of Truth
- Dla każdego modułu istnieje `brain-[module].md`
- Konflikt AI output vs Brain → AG sygnalizuje i sugeruje aktualizację kodu lub brain

### 3.4 Handoff jako Obowiązek
- Każda sesja kończy się `/handoff` i raportem w `docs/handoffs/`
- AG **przypomina** o handoffie jeśli Dowódca próbuje zakończyć sesję bez niego

### 3.5 Komunikacja MCP
- Agenty komunikują się przez standard MCP (tools, resources)
- Logika workflow nie może zależeć od jednego konkretnego modelu
- Modele mogą być wymieniane (Claude ↔ Gemini) — API zostaje spójne

### 3.6 Self-Healing — Autonaprawa
- AG podejmuje do **3 prób** samodzielnej naprawy błędów
- W raporcie musi zaznaczyć co próbował i co się nie udało
- Po 3 próbach → eskalacja do Dowódcy z pełnym raportem

---

## SEKCJA 4 — ZASADY UX / BRAND

### 4.1 Styl Dark Premium

| Element | Standard |
|---------|---------|
| Tło | `#0A0A0A` do `#111111` (grafitowe czernie) |
| Tekst | `#E5E7EB` (nie oślepiający biały) |
| Typografia UI | Inter (bezszeryfowo) |
| Typografia kodu | JetBrains Mono / Fira Code |
| Akcenty składni | Szmaragdowy / Fioletowy |
| Kształty | Ostre krawędzie, styl militarno-deweloperski |

AG przy generowaniu UI ładuje `brand-guidelines.md` dla danego modułu.

---

### 4.2 Zero Elementor

::: danger ABSOLUTNY ZAKAZ
Zakaz używania:
- Elementor
- innych drag-and-drop page builderów
- standardowych "Hello" motywów

Jedyny dozwolony motyw: `flexgrafik-wizard-theme` (custom)

Jeśli AI proponuje coś oparte na Elementorze → AG odrzuca automatycznie.
:::

---

### 4.3 Podział Językowy

| Gdzie | Język | Przykład |
|-------|-------|---------|
| UI / copy dla klienta | **Nederlands (NL)** | Tekst na przycisku: "Bestellen" |
| Kod, komentarze, commity | **English (EN)** | `// initialize wizard step` |
| Komunikacja z Dowódcą | **Polski (PL)** | Raporty, sesje, handoffsie |

AG w `/audit-red-team` sprawdza:
- Czy UI nie miesza języków
- Czy komentarze w kodzie nie są po polsku

---

### 4.4 Mobile-First

- Projektowanie ZAWSZE zaczyna się od widoku mobilnego (≥ 70% ruchu)
- Rozszerzenie na desktop dopiero po zatwierdzeniu mobile
- AG nie projektuje desktop-first

---

### 4.5 Wizard Flow — 7 Kroków

Konfigurator zawsze ma:
- Widoczny **pasek postępu** (wszystkie 7 kroków)
- Widoczny **sticky cart** na każdym etapie

AG **NIE może**:
- Usuwać tych elementów
- Projektować flow który je omija
- Proponować alternative checkout bez Wizarda

---

## JAK AGENTY UŻYWAJĄ TYCH ZASAD — w Workflow

| Faza | Komenda | Akcja AG z global-rules |
|------|---------|------------------------|
| Start sesji | `/vibe-init` | Ładuje global-rules jako zestaw strażników sesji |
| Feature design | `/blast` | Sprawdza zgodność architektury z sek. 1–4 |
| Przed deploy | `/audit-red-team` | Global-rules jako checklista audytu |
| Deploy | `/deploy-cf` | Weryfikuje że Zasada 11 jest zachowana |
| Koniec sesji | `/handoff` | Zapisuje raport, aktualizuje backlog (`flex-vcms-todo.json` w VCMS / todo modułu) |
| Iteracja | Nowa sesja | Jeśli nowe twarde reguły → sugeruje update tego pliku Dowódcy |
