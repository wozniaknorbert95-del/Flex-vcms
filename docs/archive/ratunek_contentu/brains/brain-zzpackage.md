# Brain ZZP — ZZPACKAGE.FLEXGRAFIK.NL
## Źródło prawdy dla modułu sklepu | V3.1 | 02.04.2026

---

## 1. IDENTITEIT & INFRASTRUCTUUR

**Domein:** zzpackage.flexgrafik.nl (Staging: staging.zzpackage.flexgrafik.nl)
**Platform:** WordPress + WooCommerce (Headless/Ajax Wizard)
**Hosting:** Cyber-Folks (s34.cyber-folks.pl:222)
**Database:** `uhqsycwpjz_zzpackage` (User: `uhqsycwpjz_zzpackage`)
**Database Password:** `LP7innj-K9kxWc.-`
**Repo:** github.com/wozniaknorbert95-del/flexgrafik-nl
**Rol:** Główny silnik sprzedażowy (7-etapowy konfigurator B2B dla dekarzy i stolarzy).
**Theme:** flexgrafik-wizard-theme (custom, klassiek — geen Elementor, geen hello-theme child)
**BTW:** 21% inclusief in alle prijzen
**Verzending:** Geen — alle producten zijn virtueel in WooCommerce
**KvK:** 89057554

---

## 1A. KRITIEKE ISSUES & RETROSPEKTYWA (Bezpieczeństwo)

> [!CAUTION]
> **AWARIA MIGRACJI (Kwiecień 2026)**
> Poprzednia agencja nadpisała konfiguracje i bazy danych (m.in. staging pod `krzysztofwozniak.pl`), co wywołało załamanie całej infrastruktury.
> **OBOWIĄZUJE CAŁKOWITY ZAKAZ** przerzucania/klonowania środowisk stagingowych na produkcje poprzez bezmyślne kopiowanie katalogów `public_html/`. 
> Zawsze należy zaktualizować wpis `siteurl` oraz `home` w tabelach `wp_options` bazy danych, jeżeli już odbywa się ręczna migracja.

---

## 2. MERK-IDENTITEIT & POSITIONERING

### FlexGrafik (hoofdmerk — productiestudio)
- **URL:** flexgrafik.nl
- **Rol:** Studio hoofdmerk, portfolio, referenties, productieproces
- **Inhoud:** "Over ons", productieproces, gereedschap (Mimaki, 3M, Oracal), klantbeoordelingen
- **Toon:** Lokale partner, vakman, expert

### ZZPBranding (submerk — webshop)
- **URL:** zzpackage.flexgrafik.nl
- **Rol:** Online winkel met de **Wizard als enig aankooppad**
- **Inhoud:** 7-staps Wizard, dynamisch formulier na betaling, social proof, FAQ
- **Toon:** Gespecialiseerde ZZP-partner, "Bouw jouw professionele uitstraling"

### App FlexGrafik (leadgeneratie-spel)
- **URL:** app.flexgrafik.nl
- **Rol:** Lead generation, community building, engagement
- **Status:** 🔴 In aanbouw
- **Mechanisme:** Skill-based game, maandelijkse ranglijst, prijs = brandingpakket

---

## 3. HET PROBLEEM DAT WIJ OPLOSSEN

De Nederlandse ZZP-markt telt meer dan 1,5 miljoen eenmanszaken. Veel vakmensen — vooral in bouw, installatie, tuinonderhoud, schoonmaak, transport — leveren beter werk dan de concurrent, maar verliezen opdrachten omdat ze er niet professioneel uitzien.

**Typisch scenario:**
- Witte, ongemarkeerde bus rijdt voor bij een villa van 2 miljoen euro
- Vakman in privékleding, zonder logo, zonder visitekaartje
- Klant ziet een "anonieme klusjesman" in plaats van een "professioneel bedrijf"
- Uurtarief: €40/u in plaats van mogelijke €65/u

**Ons antwoord:** Eén wizard, één leverancier, zeven dagen — en de vakman oogt als een bedrijf dat hogere tarieven rechtvaardigt.

> *"Bouw jouw professionele uitstraling in 5 minuten — wij maken het in 10 dagen."*

---

## 4. MISSIE & VISIE

### Missie
Elke ambitieuze ZZP'er in Nederland toegang geven tot een professioneel, samenhangend uiterlijk — zonder bureau, zonder vijf leveranciers en zonder maandenlang wachten.

**Concreet resultaat voor de klant:**
- Herkenbare bus als 24/7 reclame (400–500 km/dag = gratis marketing)
- Mogelijkheid om het tarief 10–20% te verhogen na rebranding
- Overstap van particuliere klanten (B2C) naar zakelijke contracten (B2B)
- Opdrachten "van de straat" zonder provisie aan platforms (Werkspot, Marktplaats)

### Visie
FlexGrafik streeft naar de positie van marktleider in ZZP-branding in de regio Rotterdam en Randstad.

**Langetermijn:**
- Lokale dominantie: herkenbare klantenvloot op straat in Rotterdam
- AI-ecosysteem (Jadzia): technologisch voorsprong door automatisering van orderverwerking, contentgeneratie en leadgeneratie
- Opschalen buiten Rotterdam (Randstad, heel Nederland)
- FlexGrafik als case study "vibe-coding" — bedrijf gerund door één persoon met hulp van AI-agents

---

## 5. DOELKLANTEN — 10 PERSONA'S IN 3 SEGMENTEN

| Segment A: Starters (100–500 €) | Segment B: Groeiers (500–2 500 €) | Segment C: Professionals (3 000+ €) |
|---|---|---|
| Starter Bouw | Groeier Installateur | Professional met Vloot |
| Starter Schoonmaak | Groeier Schilder | Professional Dakdekker |
| Starter Hovenier | Groeier Transport | |
| Starter Multi-Trade | Groeier Aannemer | |

---

## 6. WIZARD — ENIG AANKOOPPAD

> **PIVOT v4.0:** De Wizard is de ENIGE manier om te kopen. Geen pakketten, geen shop page, geen browse. Alles gaat via de Wizard.

### Filosofie

FlexGrafik is afgestapt van voorgedefinieerde pakketten en gebruikt een **geavanceerde configurator** die:
- De klant door logische fases van beeldopbouw leidt (geen productcategorieën)
- De waarde van het winkelmandje in real-time toont
- Checkout blokkeert onder **€199** (minimale bestelwaarde, niet onderhandelbaar)
- Een **gepersonaliseerd briefingformulier** genereert NA de betaling
- 60% minimale marge garandeert

### Prijsrange

| Min | Max | Sweet spot |
|-----|-----|------------|
| 199 € | 1 500+ € | 400–700 € |

### 7 Stappen

```text
STAP 0: INTRO
"In 5 minuten bouw je jouw professionele uitstraling"
→ Progress bar, geschatte tijd, live mandje: €0

STAP 1: FUNDAMENT (Branding)
"Elke professional begint met een sterk logo"
□ Logo Master File (€90)
□ Visitekaartjes
□ Offerte + Factuur Templates (€69)
□ Social media kit
→ Optie: "Ik heb al een logo" → skip

STAP 2: JOUW VOERTUIG
"Jouw bus rijdt 100+ km per dag. Dat is gratis reclame."
→ Type voertuig (Bestelbus / Bedrijfswagen / Pick-up / Geen)
→ Type reclame (Magneten / Stickers / Partial Wrap / Volledige Wrap / Raamfolie)
→ Dynamische opties op basis van keuze

STAP 3: WERKKLEDING
"Kleding maakt de vakman. Letterlijk."
→ Aantal medewerkers [1] [2-3] [4+]
→ T-shirts, Polo's, Hoodies, Softshell, Broeken, Veiligheidsvesten
→ Accessoires: Baseball caps, Beanies

STAP 4: ZICHTBAARHEID OP LOCATIE (Signing & Banners)
"Laat zien dat jij hier aan het werk bent"
→ "Wij werken hier" borden, A3/A2 borden, Spandoeken, Roll-up banners, QR-codes

STAP 5: GEREEDSCHAP & MATERIAAL STICKERS
"Jouw gereedschap is jouw visitekaartje"
→ Gereedschapsstickers, Batterij-SET, Helm-SET, Sticker-visitekaartjes

STAP 6: PREMIUM EXTRAS (Stickers & Accessoires)
"De finishing touch"
→ Werkrugzak, Thermotas, Thermosflessen, Pennen, Mokken, HTV personalisatie namen

STAP 7: SAMENVATTING & CHECKOUT
→ Productlijst met prijzen
→ Als <199€: blokkade + productsugesties
→ Als ≥199€: knop [AFREKENEN] → Mollie
```

### Wizard UX Regels

| Regel | Implementatie |
|-------|---------------|
| **Progress bar** | Altijd zichtbaar, 7 stappen |
| **Live mandje** | Sticky rechtsboven, real-time |
| **Smart defaults** | Populaire opties voorgeselecteerd |
| **Skip allowed** | Elke stap kan worden overgeslagen |
| **Terugnavigatie** | Altijd mogelijk om terug te gaan |
| **Mobile-first** | 70% verkeer is mobiel |
| **Minimum €199** | Harde blokkade op checkout |

---

## 7. PRODUCTEN — CATALOGUS

77 SKU's verdeeld over categorieën:

| Cat. | Naam | Voorbeelden SKU |
|------|------|-----------------|
| 0 | FOUNDATION | F-001 Logo Master File |
| 1 | DOCUMENTEN DIGITAAL | DF-001/002/003 Offerte, Factuur, SET |
| 2 | AUTOSTICKERS | NA-001→006 Deuren, Achter, Raam, Partial Wrap |
| 3 | AUTOMAGNETEN | MA-001→006 Deuren, Achter, Sets |
| 4 | WERKSTICKERS | NS-001→006, NSP-001→006 |
| 5 | STICKER-VISITEKAARTJES | NW-001→003 (50/100/250 st.) |
| 6 | BORDEN & BANNERS | TB-001/002, BA-001/002 |
| 7 | WERKKLEDING CORE | OC-001→010 T-shirt, Polo, Hoodie, Softshell, Broek |
| 7a | WERKKLEDING ACCESSOIRES | OA-001/002 Pet, Beanie |
| 8 | HTV OPDRUKKEN | HT-001→003, HT-101→103 |
| 9 | PREMIUM ACCESSOIRES | AP-001→003 Rugzak, Tas, Thermos |
| 10 | VISITEKAARTJES | VK-001→003 |
| 11 | SOCIAL MEDIA KIT | SM-001→003 |
| 12 | SIGNING & BANNERS EXT | SB-001→006 Roll-ups, Spandoeken |

**Alle producten:** virtueel, geen verzendkosten in WC, BTW 21% inclusief.

---

## 8. CHECKOUT FLOW

```
Wizard selectie → "Afrekenen" knop
  → AJAX add-to-cart (alle geselecteerde producten)
  → Redirect /afrekenen/ (WooCommerce checkout)
  → Mollie (iDEAL, kaarten, PayPal)
  → Betaling OK → /bedankt/ (dynamisch formulier)
  → Webhook → Jadzia (jadzia.db + Telegram alert)
```

---

## 9. DYNAMISCH FORMULIER NA CHECKOUT (POST-PURCHASE)

### Mechanisme

Na een succesvolle Mollie-betaling komt de klant op `/bedankt?order_id=XXX`, waar de **Form Generator** automatisch:

1. Alle SKU's in de bestelling scant
2. Per SKU de vereiste briefingvelden ophaalt
3. Duplicaten verwijdert (bijv. logo-upload slechts één keer nodig)
4. Een gepersonaliseerd formulier genereert

### Formulierlogica

| Voorwaarde | Formulieractie |
|------------|----------------|
| F-001 (Logo) gekocht | Toon sectie logo-briefing (branche, stijl, kleuren, referenties) |
| F-001 NIET gekocht, maar andere producten WEL | Toon upload-veld logo (FILE) — VERPLICHT |
| NA-xxx of MA-xxx (voertuig) gekocht | Toon sectie voertuig (type, merk+model, tekst, foto's voor wrap) |
| OC-xxx (werkkleding) gekocht | Toon sectie maten (matrix per product), kleur, logopositie |
| DF-xxx (documenten) gekocht | Toon sectie bedrijfsgegevens (KvK, BTW, IBAN, adres) |
| HT-102/103 (personalisatie) gekocht | Toon velden voor namen (TEXT × aantal) |
| VK-xxx (visitekaartjes) gekocht | Toon sectie contactgegevens, gewenste indeling |
| SB-xxx (banners/signing) gekocht | Toon sectie afmetingen, tekst, logo plaatsing |
| SM-xxx (social media kit) gekocht | Toon sectie platforms, bio-tekst, handel |

---

## 10. OPERATIONEEL PROCES

```
STAP 1: WIZARD      → Klant configureert en bestelt
STAP 2: CHECKOUT     → Mollie betaling
STAP 3: BEDANKT      → Dynamisch briefingformulier
STAP 4: ONTWERP      → FlexGrafik maakt designs
STAP 5: REVISIE      → Klant geeft feedback (max. 2 rondes)
STAP 6: PRODUCTIE    → Druk, snij, montage
STAP 7: LEVERING     → Versturing of montage op locatie
STAP 8: FOLLOW-UP    → Review verzoek, upsell, referral
```

---

## 11. TECHNISCHE COMPONENTEN

### PHP Bestanden (Theme)

| Bestand | Functie |
|---------|---------|
| `front-page.php` | Landing page (hero, before/after, trust, reviews, CTA, The Game link, Knowledge Hub) |
| `page-wizard.php` | Wizard container + JS SPA applicatie |
| `page-bedankt.php` | Post-checkout dynamisch briefingformulier |
| `page-faq.php` | Veelgestelde vragen (NL) |
| `header.php` | Minimalistisch: logo + "Start Wizard →" CTA knop |
| `footer.php` | Links: FAQ, flexgrafik.nl, WhatsApp, app.flexgrafik.nl |
| `functions.php` | WC hooks, script enqueue, AJAX handlers, nonce validatie, Mollie config |
| `style.css` | Base styles + dark premium thema |
| `woocommerce/` overrides | Volledige overschrijving WC templates (minimalistisch checkout) |

### JavaScript Core

| Bestand | Functie |
|---------|---------|
| `zzp-wizard-core.js` | Wizard SPA logica (stappen, productkaarten, prijsberekening, min €199 check) |
| `zzp-checkout.js` | Cart → WooCommerce checkout bridge (AJAX add-to-cart) |
| `zzp-form-generator.js` | Dynamisch formulier generatie na betaling (per SKU briefingvelden) |

### CSS

| Bestand | Functie |
|---------|---------|
| `zzp-wizard.css` | Wizard styling (stappen, kaarten, progress bar, mobile-first) |
| `zzp-checkout.css` | Checkout pagina styling (Mollie, dark theme) |

---

## 12. SYSTEEMARCHITECTUUR & DEPLOOIREGELS (V4.0)

> In V4.0 zijn Elementor en het hello-theme child verwijderd. Het systeem draait op een **custom klassiek thema `flexgrafik-wizard-theme`**.

### Kerndoel
Snelheid, UX (Dark Premium) en stabiele flow: Landing Page → Wizard → Checkout → Thank You Form.

### Deploy Regels
- **UITSLUITEND HANDMATIG** door Norbert (Dowódca/Commander)
- Agent levert werkende codemodules af
- Deploy via Antigravity CLI (Norbert voert uit)
- **Regel 1-1-1:** Agent schrijft code → levert instructie/module → Norbert brengt live (Rsync/FTP)
- Agent verifieert `docs/todo.json` en verwijst naar taken daarin
- Zero stille verbeteringen — absolute controle over WordPress-architectuur

### Branches
- Feature branch ONLY — nooit direct op main
- Commit messages: `feat:`, `fix:`, `refactor:`, `docs:`

---

## 13. BEKENDE ISSUES (per 18.03.2026)

1. **Cart persistence bug** — Producten verdwijnen tussen Wizard → checkout
2. **iDEAL SVG 404** — Betaalpictogrammen ontbreken op checkout pagina
3. **Productafbeeldingen** — 77 SKU's, de meeste zonder afbeelding
4. **"VOLGENDE" knop stap 0** — Niet duidelijk genoeg als HTML button

---

## 14. CONTENT TAAL

| Context | Taal |
|---------|------|
| Live site (alle pagina's) | **Nederlands** |
| Code, comments, commits | **Engels** |
| Communicatie met Norbert | **Polski** |

---

## 15. DO'S & DON'TS — ABSOLUTE REGELS

### ✅ DO'S
- Wizard is het ENIGE aankooppad
- Minimum €199 altijd actief (hard block, niet onderhandelbaar)
- Minimale marge 60%
- Deploy via Antigravity CLI (Norbert handmatig)
- Feature branch only
- `brain-zzp.md` updaten VÓÓR code changes
- Elke sessie eindigt met `/handoff` en opslag in `docs/handoffs/`
- Schema change → `PRD-schema.md` update EERST

### ❌ DON'TS
- GEEN pakketten — nergens, nooit
- GEEN directe SSH edits door Jadzia
- GEEN Engels/Pools op de live site
- GEEN shop page browse (Wizard-only flow)
- GEEN stille verbeteringen — alles expliciet
- GEEN deploy zonder goedkeuring van Norbert

---

## 16. JADZIA INTEGRATIE

**Jadzia** is het centrale AI-brein van FlexGrafik, draaiend op een VPS.

| Component | Details |
|-----------|---------|
| Stack | Python + FastAPI + LangGraph + SQLite |
| Database | `jadzia.db` |
| Webhook | Ontvangt Mollie/WC webhooks na succesvolle betaling |
| Notificatie | Telegram alert bij nieuwe bestelling |
| Toekomst | Automatische orderverwerking, contentgeneratie, leadgeneratie |

---

## 17. ZAKELIJKE GUARDRAILS

| Guardrail | Waarde |
|-----------|--------|
| Minimum bestelling | **€199** (niet onderhandelbaar) |
| Minimale marge | **60%** |
| Pakketten vóór Build Your Own | Altijd |
| MRR doel Q4 2026 | **€3 000** |
