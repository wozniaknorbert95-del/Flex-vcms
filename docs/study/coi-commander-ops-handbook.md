---
status: "[ACTIVE]"
title: "COI Commander — Instrukcja obsługi (ops handbook)"
updated: "2026-07-19"
gate: "MKT-SHIP-01"
---

# COI Commander — Instrukcja obsługi

::: tip UI ≠ ta strona
To jest **instrukcja** w VCMS Knowledge Base (`cmd.flexgrafik.nl/docs/…`).  
**Interfejs Commandera** jest na: [https://api.zzpackage.flexgrafik.nl/commander/](https://api.zzpackage.flexgrafik.nl/commander/) (`#main` po zalogowaniu).  
Mapa powierzchni: [surfaces-map](./surfaces-map.md).
:::

**[→ Otwórz COI Commander](https://api.zzpackage.flexgrafik.nl/commander/)**

Profesjonalny playbook Dowódcy: **cold-open → jedna akcja → hop**.  
Język UI: **PL**. Treści biznesowe (Marketing body): **NL**.

| | |
|--|--|
| **Prod URL** | https://api.zzpackage.flexgrafik.nl/commander/ |
| **Tip evidence (UI polish)** | jadzia ≥ `8d40efc` LIVE (terminal chrome VCMS-style · Marketing OS strip od `c874999`) |
| **Auth** | Telegram `/commander` → jednorazowy link (15 min) · fallback: token JWT w panelu Sesja |
| **Dogfood / ADR SoT** | `jadzia-core/docs/design/coi-commander/` (nie kopiuj ADR do VCMS) |

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

## Scenariusz 3 — Start → Marketing (Marketing OS)

**Cel:** Rozróżnić **Organic HITL** (Commander) od **Paid / Instant Form** (Ads Manager) i wykonać jedną akcję organic bez mylenia powierzchni.

**North Star:** optymalizujemy pod **CPA_wizard** (koszt → wejście do Wizard), nie pod tanie kliknięcia.

| Krok | Działanie | Oczekiwany wynik |
|------|-----------|------------------|
| 1 | Nav **Marketing** (desktop lub bottom nav) | View Marketing; Start nieaktywny |
| 2 | Strip **Organic HITL** + linki START TUTAJ | Widoczny podział: organic = ten ekran; paid = Ads Manager (nie Commander) |
| 3 | Sprawdź kalendarz / empty / status | Copy PL, nie surowy error |
| 4 | (Opcja) szkic lub zaplanuj — HITL | Toast sukcesu; undo 60s gdy dotyczy approve |
| 5 | Paid / Instant Form / Custom Audience | **Poza Commanderem** — Meta Ads Manager (patrz OPERATOR-TODAY #1–4) |
| 6 | Wróć **Start** | Home ładuje się ponownie; sesja JWT OK |

**SoT Marketing OS (nie pełna kopia w VCMS):**

- `jadzia-core/docs/ops/marketing/OPERATOR-TODAY.md`
- Blob: [OPERATOR-TODAY.md](https://github.com/wozniaknorbert95-del/jadzia/blob/master/docs/ops/marketing/OPERATOR-TODAY.md)
- Kampania paste pack: `docs/ops/marketing/FB-FIRST-CAMPAIGN.md`

**FAIL → co robić**

| Objaw | Akcja |
|-------|--------|
| Brak stripu Organic HITL | Hard refresh Commander; tip VPS musi być ≥ `c874999` (`git rev-parse --short HEAD` w `/opt/jadzia`) |
| FB health bad | Nie forsuj publish; sprawdź token PAGE (osobny playbook) |
| Held banner | Szanuj hold — nie omijaj HITL |
| Chcesz odpalic € ads z Commandera | STOP — Ads Manager + OPERATOR-TODAY #4 (Dowódca) |

**Evidence:** MKT-SHIP-01 + CLOSEOUT-HONESTY-01 · tip ≥ `8d40efc` · strip `mkt-os-strip` / Organic HITL LIVE · terminal shell.

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
