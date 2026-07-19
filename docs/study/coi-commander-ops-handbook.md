---
status: "[ACTIVE]"
title: "COI Commander — Instrukcja obsługi (ops handbook)"
updated: "2026-07-19 (CMD-MKT-DASH-02)"
gate: "MKT-BRAIN-PRO Program Close + dash sync"
---

# COI Commander — Instrukcja obsługi

::: tip UI ≠ ta strona
To jest **instrukcja** w VCMS Knowledge Base (`cmd.flexgrafik.nl/docs/…`).  
**Interfejs Commandera** jest na: [https://api.zzpackage.flexgrafik.nl/commander/](https://api.zzpackage.flexgrafik.nl/commander/) (`#main` po zalogowaniu).  
Mapa powierzchni: [surfaces-map](./surfaces-map.md).
:::

**[→ Otwórz COI Commander](https://api.zzpackage.flexgrafik.nl/commander/?v=mkt-dash02)**

Profesjonalny playbook Dowódcy: **cold-open → jedna akcja → hop**.  
Język UI: **PL**. Treści biznesowe (Marketing body): **NL**.

| | |
|--|--|
| **Prod URL** | https://api.zzpackage.flexgrafik.nl/commander/?v=mkt-dash02 |
| **Tip evidence** | jadzia ≥ **`660c5f8`** LIVE (Program Close ~86% · dash sync · JWT-resilient Marketing) |
| **Auth** | Telegram `/commander` → jednorazowy link (15 min) · fallback: token JWT w panelu Sesja |
| **Dogfood / ADR SoT** | `jadzia-core/docs/design/coi-commander/` (nie kopiuj ADR do VCMS) |
| **Marketing SoT** | `jadzia-core/docs/ops/marketing/OPERATOR-TODAY.md` · board: `MKT-BRAIN-PRO.md` |

## Mapa ekranu (IA)

Primary (max 5, desktop ≡ mobile):

1. **Start** — priorytety dnia + kolejka CRITICAL/ACTION  
2. **Marketing** — kalendarz / publish HITL  
3. **Analityka** — snapshot / leady / zamówienia  
4. **Agenci** — rejestr ról AI OS  
5. **Ustawienia** — Delegat, budżet, role  

**Audyt** = secondary (tylko przez Ustawienia → „Otwórz Audyt”).

Na dole Startu: **Mapa systemu** (hops do OS / VCMS / Wizard — bez merge kodu).

---

## Scenariusz 1 — Cold-open dnia

**Cel:** W ≤2 min wiedzieć, co jest na stole, i wykonać **jedną** akcję.

| Krok | Działanie | Oczekiwany wynik |
|------|-----------|------------------|
| 1 | Otwórz prod URL (hard refresh jeśli stary cache) | Eyebrow `COI Commander · Start`, tytuł „Dziś — 3 priorytety” |
| 2 | Zaloguj: TG `/commander` **lub** Sesja → token | „Zalogowano…”, pole JWT schowane |
| 3 | Poczekaj na skeleton → karty | Priorytety / kolejka albo spokojny empty state PL |
| 4 | Wybierz **jedną** kartę CRITICAL/ACTION | CTA: Potwierdź (primary) / Odłóż / Zamknij |
| 5 | Kliknij jedną akcję | Toast OK · karta znika lub zmienia status |

**FAIL → co robić**

| Objaw | Akcja |
|-------|--------|
| Sesja wygasła | TG `/commander` ponownie; nie wklejaj sekretów do chatu |
| Pusty ekran bez empty state | Hard refresh `?v=` / cache-bust; sprawdź `/health` |
| Skeleton w nieskończoność | Sieć / API; retry „Spróbuj ponownie” |

**Evidence:** POLISH P1–P4 PASS · tip ≥ `8d40efc`.

---

## Scenariusz 2 — Lead hot (sales_cta / hot_lead)

**Cel:** Obsłużyć lead bez paniki i bez laptopowego „debugowania”.

| Krok | Działanie | Oczekiwany wynik |
|------|-----------|------------------|
| 1 | Na Startcie znajdź kartę lead / sales_cta | Badge CRITICAL lub ACTION |
| 2 | **Potwierdź** | Toast `Lead … → acked` (zielony) |
| 3 | Alternatywa: **Odłóż** | Toast snoozed · znika z dziś |
| 4 | Alternatywa: **Zamknij** | Toast closed · koniec ścieżki |

Hierarchia CTA (enterprise): Potwierdź = primary · Odłóż = secondary · Zamknij = danger.

**FAIL → co robić**

| Objaw | Akcja |
|-------|--------|
| Toast błąd / 422 | Sprawdź sieć; nie spamuj klików (przyciski się blokują) |
| Brak przycisków na karcie | To nie lead — inny typ kolejki; użyj approve/reject jeśli dotyczy |

**Evidence:** UX-03 krok 3 PASS · disposition Content-Type fix.

---

## Scenariusz 3 — Start → Marketing (Marketing OS / Program Close)

**Cel:** Rozróżnić **Organic HITL** (Commander) od **Paid / Instant Form** (Ads Manager); zobaczyć stan Program Close (~86%) bez mylenia powierzchni.

**North Star:** optymalizujemy pod **CPA_wizard** (koszt → wejście do Wizard), nie pod tanie kliknięcia.  
**MB_MODE:** `propose` · agent = observe-only · Approve MB = **Telegram**.

| Krok | Działanie | Oczekiwany wynik |
|------|-----------|------------------|
| 1 | Hard refresh `?v=mkt-dash02` → nav **Marketing** | View Marketing; Start nieaktywny |
| 2 | Strip **Marketing OS** | Status `MB propose · ~86% · observe` + parks H-Meta / H-Purchase / H-Insights / H-WA / H-F4x |
| 3 | FB health strip | Page OK + **amber** gdy brak `read_insights` (nie false green) |
| 4 | Panel **Weekly scorecard — draft** | Leads/margin z DTL; Spend/CPL = — (Ads Manager); decyzja pusta (HITL) |
| 5 | (Opcja) szkic lub zaplanuj organic — HITL | Toast sukcesu; undo 60s gdy dotyczy approve |
| 6 | Nav **Analityka** → Data Health | Drivers · conscious parks (`fb_read_insights`, Purchase, Ads create) · FB organic reason |
| 7 | Paid / Instant Form | **Poza Commanderem** — Meta Ads Manager |

**SoT Marketing OS (nie pełna kopia w VCMS):**

- `jadzia-core/docs/ops/marketing/OPERATOR-TODAY.md`
- Blob: [OPERATOR-TODAY.md](https://github.com/wozniaknorbert95-del/jadzia/blob/master/docs/ops/marketing/OPERATOR-TODAY.md)
- Board: [MKT-BRAIN-PRO.md](https://github.com/wozniaknorbert95-del/jadzia/blob/master/docs/ops/marketing/MKT-BRAIN-PRO.md)

**FAIL → co robić**

| Objaw | Akcja |
|-------|--------|
| Wieczne „Ładowanie draftu…” | Tip ≥ `660c5f8` + hard refresh `?v=mkt-dash02`; potem nowe `/commander` |
| Draft/FB „Sesja wygasła…” | TG `/commander` lub świeży JWT w Sesja |
| Brak stripu parks / weekly panel | Hard refresh; VPS tip ≥ `660c5f8` |
| FB amber + `insights: brak` | H-Insights: Graph `read_insights` → nowy token (nie fake PASS) |
| Home ticket „Token Facebook wygasł” mimo FB OK | Stary ticket w kolejce — patrz `fb-health`, nie mylić |
| Chcesz odpalić € ads z Commandera | STOP — Ads Manager + OPERATOR-TODAY |

**Evidence:** CMD-MKT-DASH-01/02 · Program Close · tip ≥ `660c5f8` · cache `mkt-dash02`.

---

## Scenariusz 4 — Delegat / Ustawienia (eskalacja)

**Cel:** Eskalacja 24h ma odbiorcę ≠ Ty.

| Krok | Działanie | Oczekiwany wynik |
|------|-----------|------------------|
| 1 | Nav **Ustawienia** | Formularz Delegata |
| 2 | Uzupełnij email Delegata (+ opcjonalnie TG chat_id) | Zapisz → brak żółtego bannera „Brak Delegata” na Home |
| 3 | (Opcja) Audyt secondary | Settings → „Otwórz Audyt” |

SMTP eskalacji Delegata: **LIVE** (gate SMTP-01). Nie wklejaj haseł SMTP do docs ani chatu.

**FAIL → co robić**

| Objaw | Akcja |
|-------|--------|
| Banner Delegata nadal widoczny | PATCH settings nie przeszedł — sprawdź sesję / pola |
| Email nie dochodzi | Ops: SMTP na VPS (human secrets) — nie Gate D |

**Evidence:** COI-CMD-SMTP-01 CLOSE · D0.9 escalation.

---

## Scenariusz 5 — Emergency no-laptop

**Cel:** Z telefonu panować nad kolejką (ADR D0.6 hub, nie merge OS).

| Krok | Działanie | Oczekiwany wynik |
|------|-----------|------------------|
| 1 | TG `/commander` na telefonie | Signed link → Home |
| 2 | (Opcja) Add to Home Screen / PWA | Ikona; theme dark |
| 3 | Touch CTA ≥44px | Potwierdź lead jedną ręką |
| 4 | Hop mapa (OS/VCMS) | Basic Auth u hosta; **powrót** → JWT w Commanderze zostaje |

**Nigdy w tej instrukcji:** komendy mint/recover, tokeny w screenach, sekrety w VCMS.

**FAIL → co robić**

| Objaw | Akcja |
|-------|--------|
| Link wygasł (15 min) | Nowe `/commander` w TG |
| Stary UI bez polish | Hard refresh; tip SoT na VPS |

**Evidence:** MOBILE-02 LIVE · UX-03 hops 401 Basic Auth OK · POLISH P5.

---

## Mapa systemu (hops)

| Cel | URL | Notatka |
|-----|-----|---------|
| Commander (hub) | https://api.zzpackage.flexgrafik.nl/commander/ | Bieżąca sesja |
| Agent OS | https://os.flexgrafik.nl | Basic Auth |
| VCMS | https://cmd.flexgrafik.nl | Basic Auth |
| VCMS docs | https://cmd.flexgrafik.nl/docs/ | Ten ekosystem |
| Wizard | https://zzpackage.flexgrafik.nl/wizard/ | Ścieżka zakupu |
| DA health | https://api.zzpackage.flexgrafik.nl/api/v1/design-agent/health | JSON probe |

Toast przy hopie: „Otwieram… (sesja Commander zostaje)”.

---

## STOP — twarde zakazy

- **Gate D** / Mollie LIVE top-up — parked, bez GO+budget  
- Sekrety, `.env`, mint/recover w repo lub chacie  
- Merge Agent OS ↔ jadzia „dla wygody”  
- Autonomiczny deploy produkcji bez GO (Zasada 11)  
- Fałszywy Dowódca PASS na MBA  

---

## Źródła (jadzia-core)

Ścieżki lokalne workspace (nie serwowane przez VCMS):

```text
C:\Users\FlexGrafik\FlexGrafik\github\jadzia-core\docs\design\coi-commander\UX-DOGFOOD-PHONE.md
C:\Users\FlexGrafik\FlexGrafik\github\jadzia-core\docs\handoffs\2026-07-18-coi-cmd-ux-polish-01-CLOSE.md
C:\Users\FlexGrafik\FlexGrafik\github\jadzia-core\docs\handoffs\2026-07-18-coi-cmd-ops-guide-01-BLAST.md
```

Gate: `COI-CMD-OPS-GUIDE-01`.
