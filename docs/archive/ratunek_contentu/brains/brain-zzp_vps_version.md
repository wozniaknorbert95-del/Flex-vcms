# Brain ZZP ΓÇö ZZPACKAGE.FLEXGRAFIK.NL
## ┼╣r├│d┼éo prawdy dla modu┼éu Wizard B2B | V3.0 | 02.04.2026

---

## IDENTITEIT

**Domein:** zzpackage.flexgrafik.nl (Staging: staging.zzpackage.flexgrafik.nl)
**Platform:** WordPress + WooCommerce (Headless/Ajax Wizard)
**Hosting:** Cyber-Folks (s34.cyber-folks.pl:222)
**Database:** `uhqsycwpjz_zzpackage` (User: `uhqsycwpjz_zzpackage`)
**Database Password:** `LP7innj-K9kxWc.-`
**Repo:** github.com/wozniaknorbert95-del/flexgrafik-nl
**Rol:** G┼é├│wny silnik sprzeda┼╝owy (7-etapowy konfigurator B2B dla dekarzy i stolarzy).

---

## DOEL & BIZNES

- ┼Ürednia warto┼¢─ç zam├│wienia (AOV): 400-700 EUR.
- Tylko produkty wirtualne z wliczonym VAT (21% BTW).
- Minimalna warto┼¢─ç koszyka do checkoutu to 199 EUR.
- Wszystkie wygenerowane oferty opieraj─à si─Ö na SSoT (Single Source of Truth) JSON Master Table.

---

## KRITIEKE ISSUES & RETROSPEKTYWA (Bezpiecze┼ästwo)

> [!CAUTION]
> **AWARIA MIGRACJI (Kwiecie┼ä 2026)**
> Poprzednia agencja nadpisa┼éa konfiguracje i bazy danych (m.in. staging pod `krzysztofwozniak.pl`), co wywo┼éa┼éo za┼éamanie ca┼éej infrastruktury.
> **OBOWI─äZUJE CA┼üKOWITY ZAKAZ** przerzucania/klonowania ┼¢rodowisk stagingowych na produkcje poprzez bezmy┼¢lne kopiowanie katalog├│w `public_html/`. 
> Zawsze nale┼╝y zaktualizowa─ç wpis `siteurl` oraz `home` w tabelach `wp_options` bazy danych, je┼╝eli ju┼╝ odbywa si─Ö r─Öczna migracja.

---

## DO'S & DON'TS
Γ£à Pilnowa─ç SSoT `product-master-table.json`.
Γ£à Zachowa─ç mroczny, ekskluzywny design (Dark Premium).
Γ¥î ZAKAZ u┼╝ywania Elementora.
Γ¥î ZAKAZ kopiowania plik├│w `wp-config.php` pomi─Ödzy r├│┼╝nymi domenami.
