---
status: "[ACTIVE]"
title: "FlexGrafik.nl Brain — Portal (Trust & Authority)"
owner: "Norbert Wozniak"
updated: "2026-07-05"
readiness: "~75% (home S12 strong; subpages need sales polish S13+)"
---

## 1) Rola modulu
`flexgrafik-nl` to **portal zaufania** (Trust & Authority). Buduje wiarygodnosc i kieruje do:
- Wizarda: `zzpackage.flexgrafik.nl`
- Gry: `app.flexgrafik.nl`

**Nie sprzedaje bezposrednio** — brak koszyka i checkout na portalu (Wizard-only).

## 2) Source of Truth
- **Kanoniczny brain tego repozytorium:** `brain.md`
- **Reconciliation (ostatnia prawda):** `docs/reconciliation/2026-06-25-portal-truth.md`
- Strategia makro: `../flexgrafik-meta/docs/core/master-plan.md`
- Module spec (upstream): `../flexgrafik-meta/docs/core/modules/module-flexgrafik-nl.md`
- Global rules: `../flexgrafik-meta/docs/core/global-rules.md`
- Workflow: `../flexgrafik-meta/docs/core/workflow-manual.md`
- Backlog modulu: `todo.json`
- Historia: `docs/handoffs/`

## 3) Guardrails
- UI/Copy: **NL** (dla klienta); wewnetrznie PL/EN OK.
- Deploy manualny (Zasada 11): `/deploy-wp` → `/deploy` → GHA.
- Zmiany w malych iteracjach (1-1-1).
- **Zakaz** hasel, kluczy API i danych DB/hostingu w repo.
- **Elementor:** usuniety z produkcji (2026-05-18); layout = `flexgrafik-child` + Astra.
- **Launch guard:** nie implementuj TO-BE (qualification agent) przed launch gate PASS.

## 4) AS-IS (LIVE na produkcji)

### Stack
- WordPress + Astra child `flexgrafik-child`
- Custom PHP templates (bez Elementor)
- Asset sync: `scripts/sync-home-assets-from-zzpackage.py`
- Deploy: GHA `scripts/deploy.ps1`
- Security: gitleaks via `.githooks/`

### Kanoniczne URL-e

| Strona | URL | Template |
|--------|-----|----------|
| Home | `/` | `front-page.php` |
| Diensten | `/nl/diensten/` | `page-diensten.php` |
| Over ons | `/nl/over-ons/` | `page-about.php` |
| Portfolio (hub) | `/portfolio/` | `page-portfolio.php` |
| Ons werk (legacy) | `/ons-werk/` → 301 `/portfolio/` | `page-ons-werk.php` |
| Portfolio-diensten (legacy) | `/portfolio-diensten/` → 301 `/portfolio/` | `page-portfolio-diensten.php` |
| Game landing | `/hoe-scoor-jij-je-branding/` | `page-game-rules.php` |
| Contact | `/contact/` | `page-contact.php` |
| Privacy | `/privacybeleid/` | `page-privacybeleid.php` |
| Voorwaarden | `/algemene-voorwaarden/` | `page-algemene-voorwaarden.php` |

**Legacy (nie linkowac w nav):** `page-services.php` — stary szablon; kanon = `page-diensten.php`.

### Integracje LIVE

| Integracja | Status | Dowod |
|------------|--------|-------|
| CTA → Wizard | LIVE | header, footer, front-page |
| CTA → Game | LIVE | nav, sticky bar |
| Asset sync zzpackage | LIVE | `scripts/sync-home-assets-from-zzpackage.py` |
| Chat widget UI | LIVE | `flexgrafik-child/assets/js/chat-widget.js` |

### GAP-V01 — Chat (uczciwosc operacyjna)

| | AS-IS (LIVE) | TO-BE (post-angel) |
|---|--------------|------------------|
| Agent | `customer_agent` (generic sales) | `portal_qualification_node` |
| Endpoint | `POST api.zzpackage.flexgrafik.nl/api/v1/widget/chat` | `POST /api/v1/portal/qualify` (jadzia — kod DONE, prod po deploy) |
| Cel | Ogolna rozmowa sprzedazowa NL | Kwalifikacja branzy → preset Wizard |

**Na launch:** chat generic jest OK. Nie opisuj go jako „inteligentnego agenta kwalifikacji”.

### Copy i konwersja (LIVE)
- Hero home: **single-path** — Minimum €199 + bijv., trust bar, proof chips; Wizard = enige primary op fold; DA = tekstlink
- SSoT hero: `docs/copy/home-hero-nl.md`
- **Wizard-only funnel:** portal CTA → `/wizard/` — geen preset links, geen pakketten/groeipaden in templates
- **Audit 2026-07-05:** subpages inconsistent → `docs/audits/2026-07-05-portal-sales-audit.md`
- **S13 copy alignment (2026-07-05):** Minimum €199 excl. in meta, diensten, portfolio CTA; hero contact zonder pakket; `fg_wizard_url()` → `/wizard/`
- FAQ home + contact (`docs/copy/faq-portal-master-nl.md`) — contact FAQ wymaga skrócenia (audit)
- Google Reviews: statyczne karty — **BLOCKED_CONTENT** (czeka na realne opinie)

## 5) TO-BE (post-angel — nie mieszac z LIVE)

Pelna wizja: `../flexgrafik-meta/docs/core/futures/future-flexgrafik-nl.md`

- Portal Qualification Agent — spec: `../flexgrafik-meta/docs/core/portal-qualification-agent-spec.md`
- Plan: `../flexgrafik-meta/docs/plans/2026-06-25-portal-qualification-enterprise.md`
- Backend B1+B2: jadzia-core `POST /api/v1/portal/qualify` (lokalnie, 18 tests PASS — 2026-06-25)
- Handoff rollout: `docs/handoffs/2026-06-25-portal-qualification-int012-complete.md`
- **Deploy plan:** `docs/handoffs/2026-06-25-int012-deploy-plan.md`
- GA4 events: chat_open, cta_wizard_click
- Blog/SEO hub NL (Rotterdam ZZP)
- Case studies z realizacji

## 6) Kontekst produktowy (skrot)

- **Doel:** wizytowka — zaufanie → Wizard.
- **Kern:** portfolio, proces, blog NL, reviews, partner ErKaPremium, CTA „Start de Wizard”.
- **Visueel:** dark premium, cyan/magenta, trust bar, spojny z zzpackage.
- **SEO:** NL, Yoast/meta, lokalne slowa kluczowe — backlog w `todo.json`.

## 7) Pliki pomocnicze (niekanoniczne)

- `brain-flex.md` — stub (stare odwolania) → patrz `brain.md`
- `docs/internal/company-profile-pl.md` — **NOT CANON** (referencja PL wewnetrzna)
- `brain-app.md`, `brain-zzp.md`, `brain-krzys.md` — notatki ekosystemu
