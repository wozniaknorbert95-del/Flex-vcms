# Brain ZZP — ZZPACKAGE.FLEXGRAFIK.NL
## Źródło prawdy dla modułu Wizard B2B | V3.0 | 02.04.2026

---

## IDENTITEIT

**Domein:** zzpackage.flexgrafik.nl (Staging: staging.zzpackage.flexgrafik.nl)
**Platform:** WordPress + WooCommerce (Headless/Ajax Wizard)
**Hosting:** Cyber-Folks (s34.cyber-folks.pl:222)
**Database:** `uhqsycwpjz_zzpackage` (User: `uhqsycwpjz_zzpackage`)
**Database Password:** `LP7innj-K9kxWc.-`
**Repo:** github.com/wozniaknorbert95-del/flexgrafik-nl
**Rol:** Główny silnik sprzedażowy (7-etapowy konfigurator B2B dla dekarzy i stolarzy).

---

## DOEL & BIZNES

- Średnia wartość zamówienia (AOV): 400-700 EUR.
- Tylko produkty wirtualne z wliczonym VAT (21% BTW).
- Minimalna wartość koszyka do checkoutu to 199 EUR.
- Wszystkie wygenerowane oferty opierają się na SSoT (Single Source of Truth) JSON Master Table.

---

## KRITIEKE ISSUES & RETROSPEKTYWA (Bezpieczeństwo)

> [!CAUTION]
> **AWARIA MIGRACJI (Kwiecień 2026)**
> Poprzednia agencja nadpisała konfiguracje i bazy danych (m.in. staging pod `krzysztofwozniak.pl`), co wywołało załamanie całej infrastruktury.
> **OBOWIĄZUJE CAŁKOWITY ZAKAZ** przerzucania/klonowania środowisk stagingowych na produkcje poprzez bezmyślne kopiowanie katalogów `public_html/`. 
> Zawsze należy zaktualizować wpis `siteurl` oraz `home` w tabelach `wp_options` bazy danych, jeżeli już odbywa się ręczna migracja.

---

## DO'S & DON'TS
✅ Pilnować SSoT `product-master-table.json`.
✅ Zachować mroczny, ekskluzywny design (Dark Premium).
❌ ZAKAZ używania Elementora.
❌ ZAKAZ kopiowania plików `wp-config.php` pomiędzy różnymi domenami.
