---
status: "[DRAFT]"
title: "FlexGrafik.nl Brain — Portal (Trust & Authority)"
owner: "Norbert Wozniak"
updated: "2026-05-18"
---

## 1) Rola modulu
`flexgrafik-nl` to **portal zaufania** (Trust & Authority). Ma budowac wiarygodnosc i kierowac do:
- Wizarda: `zzpackage.flexgrafik.nl`
- Gry: `app.flexgrafik.nl`

## 2) Source of Truth
- **Kanoniczny brain tego repozytorium (ten plik):** `brain.md`
- Strategia makro: `flexgrafik-meta/docs/core/master-plan.md`
- Global rules: `flex-vcms/docs/core/global-rules.md`
- Workflow: `flexgrafik-meta/docs/core/workflow-manual.md`
- Backlog modulu: `todo.json`
- Historia: `docs/handoffs/`

## 3) Guardrails
- UI/Copy: NL (dla klienta), wewnetrznie mozna PL.
- Deploy manualny (Zasada 11).
- Zmiany robimy w malych iteracjach (1-1-1).
- **Zakaz trzymania haseł, kluczy API i danych identyfikacyjnych bazy/hostingu w repozytorium** — szczegóły tylko poza git (menedżer haseł / panel hostingu).
- **Elementor:** usunięty z produkcji flexgrafik.nl (2026-05-18); layout = motyw potomny `flexgrafik-child` + Astra.

## 4) Kontekst produktowy (portal) — skrót operacyjny
*(Utrzymywany tutaj; `brain-flex.md` to tylko stub z tą samą nazwą pliku.)*

- **Doel:** flexgrafik.nl jest „wizytówką” — nie sprzedaje bezpośrednio; buduje zaufanie i kieruje do Wizarda (ZZPackage).
- **Kern:** portfolio (before/after), opis procesu, blog NL, reviews, partner ErKaPremium, spójne CTA „Start de Wizard”.
- **Visueel:** dark premium, spójność z zzpackage (tło, akcent cyan/magenta, trust bar, footer).
- **CTA:** primary → Wizard; secondary → gra (`app.flexgrafik.nl`); brak cen i koszyka na portalu (kierunek do Wizarda).
- **SEO (kierunek):** NL, Yoast/meta per pagina, blog artykuły lokalne (Rotterdam / ZZP); słowa kluczowe — patrz backlog w `todo.json`.

## 5) Pliki pomocnicze (niekanoniczne)
- `brain-flex.md` — **stub** (zachowana nazwa dla starych odwołań); cała merytorka w `brain.md`.
- `brain-app.md`, `brain-zzp.md`, `brain-krzys.md` — notatki per moduł/domena w ekosystemie; bez sekretów w treści.
