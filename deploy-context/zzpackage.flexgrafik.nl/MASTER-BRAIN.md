# MASTER-BRAIN.md | Single Source of Truth V4.0
## FlexGrafik Wizard Ecosystem | 06.04.2026

Ten plik to serce projektu. Łączy wizję biznesową, ofertę produktową i twarde zasady operacyjne.

---

## 1. MISJA I PROBLEM (Dlaczego istniejemy?)
**Problem:** Holenderski rynek ZZP (1.5 mln firm) cierpi na brak profesjonalnego wizerunku. Fachowcy (budowlanka, sprzątanie, transport) tracą zlecenia, bo wyglądają amatorsko.
**Rozwiązanie:** Jeden Wizard, jeden dostawca, 7 dni – kompletny branding B2B, który pozwala podnieść stawki o 20%.

---

## 2. MERK-IDENTITEIT (Brand)
- **Hoofdmerk:** FlexGrafik (Studio produkcyjne, portfolio).
- **Webshop:** ZZPBranding (zzpackage.flexgrafik.nl) – Wizard jako JEDYNA ścieżka zakupu.
- **Toon:** Specjalistyczny partner ZZP, "Build your professional look in 5 minutes".
- **Design:** Dark Premium (Ciemna paleta, Montserrat, brak Elementora).

---

## 3. WIZARD — 7 KROKÓW (Funnel Sprzedażowy)
1. **STAP 1: FUNDAMENT (Branding)** - Logo, wizytówki, szablony faktur.
2. **STAP 2: JOUW VOERTUIG (Car Branding)** - Oklejanie (DIY, Sety, Wraps).
3. **STAP 3: WERKKLEDING (Clothing)** - T-shirty, Polo, Hoodie, Softshell + Nadruki HTV.
4. **STAP 4: EERSTE INDRUK (Print)** - Wizytówki-naklejki, druk fizyczny.
5. **STAP 5: ZICHTBAARHEID (Visibility)** - Banery, spandoeki, tablice budowlane.
6. **STAP 6: GEREEDSCHAP (Tools)** - Naklejki na narzędzia, helmy, baterie.
7. **STAP 7: CHECKOUT** - Podsumowanie i płatność Mollie.

---

## 4. KATALOG PRODUKTÓW (Podsumowanie)
Pełna lista produktów znajduje się w `system/data/product-master-table.json`. Główne grupy:
- **Vehicle:** `NA-` (Stickers), `MA-` (Magnets), `NA-WRAP-` (Wraps).
- **Clothing:** `OC-` (Core), `OA-` (Acc), `HT-` (HTV Prints).
- **Foundation:** `F-001` (Logo), `DF-` (Digital Documents).
- **Visibility:** `TB-` (Bords), `BA-` (Banners), `SB-` (Signing).

---

## 5. ZASADY BIZNESOWE (Guardrails)
- **Minimum Checkout:** **199 €** (brutto). Blokada na etapie 7.
- **Minimum Margin:** **60%** na każdym pakiecie/produkcie.
- **Wizard-Only:** Brak klasycznego sklepu, brak listingu produktów.
- **Virtual Only:** Wszystkie produkty w WC są oznaczone jako wirtualne (brak kosztów wysyłki).

---

## 6. PROCES OPERACYJNY
1. **Wizard Select** -> 2. **Mollie Pay** -> 3. **Dynamic Form** (Briefing) -> 4. **Design** -> 5. **Production** -> 6. **Delivery**.

---

## 7. WYTYCZNE DLA AGENTÓW (Zasady Pracy)
- **SSoT-First:** Zmiana ceny? Tylko w `system/data/product-master-table.json`.
- **Zero Elementor:** Tylko customowy motyw `flexgrafik-wizard-theme`.
- **Language:** UI = NL, Kod/Dokumentacja = EN, Komunikacja = PL.
- **1-1-1:** Jedna zmiana -> jeden commit -> jeden deploy.
- **Handoff:** Obowiązkowy po każdej sesji.
