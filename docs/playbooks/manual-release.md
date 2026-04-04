---
status: "[STABLE]"
title: "Manual Release — Deploy na Cyber-Folks"
---

# &#x1F680; Manual Release — Deploy na Cyber-Folks

> Kompletna instrukcja deploy na serwer produkcyjny.
> KAZDY deploy jest manualny. KAZDY. Bez wyjatkow.

::: danger Zasada 11 — Manual Deploy
Agenty przygotowuja komendy. **TY je uruchamiasz.**
Nigdy odwrotnie. AG nie ma dostepu do serwera produkcyjnego.
:::

---

## Dane Serwera (Referencja)

| Parametr | Wartosc |
|----------|---------|
| Host | `s34.cyber-folks.pl` |
| Port SSH | `222` |
| Uzytkownik | `uhqsycwpjz` |
| Klucz SSH | `C:\Users\FlexGrafik\.ssh\cyberfolks_key` |

**Sciezki docelowe na serwerze:**

| Domena | Sciezka |
|--------|---------|
| `flexgrafik.nl` (motyw child) | `/home/uhqsycwpjz/domains/flexgrafik.nl/public_html/wp-content/themes/flexgrafik-child/` |
| `zzpackage.flexgrafik.nl` (Wizard) | `/home/uhqsycwpjz/domains/zzpackage.flexgrafik.nl/public_html/wp-content/themes/flexgrafik-wizard-theme/` |
| `app.flexgrafik.nl` (Gry/Apps) | `/home/uhqsycwpjz/domains/app.flexgrafik.nl/public_html/` |

---

## KROK 1 — PRZED DEPLOYEM (Checklista)

Zanim ruszysz z deploy, przejdz cala checklist:

✅ → [prep-deploy.md](/checklists/prep-deploy)

Jesli jakikolwiek punkt jest NIE → **STOP**. Nie deployjuj.

---

## KROK 2 — BACKUP NA SERWERZE

::: warning
Bez backupu = deploy zablokowany. Zawsze najpierw backup.
:::

```bash
# Podjlacz sie SSH
ssh -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -p 222 uhqsycwpjz@s34.cyber-folks.pl

# Stworz backup z timestamp (zastap [DOMENA] i [MOTYW])
TS=$(date +%Y%m%d-%H%M%S)
SCIEZKA="/home/uhqsycwpjz/domains/[DOMENA]/public_html/wp-content/themes/[MOTYW]"
cp -r $SCIEZKA ${SCIEZKA}-backup-$TS

# Zapisz timestamp! Bedzie potrzebny przy rollback.
echo "Backup: ${SCIEZKA}-backup-$TS"
```

---

## KROK 3 — PRZYGOTOWANIE ARCHIWUM (Lokalnie)

AG przygotuje liste plikow. Ty pakujesz archiwum:

```powershell
# W PowerShell, w katalogu repozytorium:
# Przyklad dla flexgrafik-child:
tar -czvf deploy_update.tar.gz `
  flexgrafik-child/front-page.php `
  flexgrafik-child/style.css

# Przyklad dla wizard-theme:
tar -czvf deploy_update.tar.gz `
  flexgrafik-wizard-theme/wizard-step-2.js `
  flexgrafik-wizard-theme/functions.php
```

::: warning ZAKAZ
Nigdy nie wgrywaj przez to narzedzie:
- `wp-config.php`
- `.htaccess`
- Rzutow `.sql`

Grozi nadpisaniem bazy danych lub konfiguracji serwera.
:::

---

## KROK 4 — WYSYLKA ARCHIWUM (SCP)

```powershell
# Wyslij archiwum na serwer (zastap [SCIEZKA_DOCELOWA])
scp -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -P 222 `
  deploy_update.tar.gz `
  uhqsycwpjz@s34.cyber-folks.pl:[SCIEZKA_DOCELOWA]
```

Przykladowe wartosci `[SCIEZKA_DOCELOWA]`:
```
# flexgrafik.nl:
/home/uhqsycwpjz/domains/flexgrafik.nl/public_html/wp-content/themes/flexgrafik-child/

# zzpackage:
/home/uhqsycwpjz/domains/zzpackage.flexgrafik.nl/public_html/wp-content/themes/flexgrafik-wizard-theme/
```

---

## KROK 5 — ROZPAKOWANIE NA SERWERZE (SSH)

```bash
# Podjlacz sie SSH
ssh -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -p 222 uhqsycwpjz@s34.cyber-folks.pl

# Przejdz do sciezki docelowej i rozpakuj
cd [SCIEZKA_DOCELOWA]
tar -xzvf deploy_update.tar.gz
rm deploy_update.tar.gz

# Jesli tar stworzyl podkatalog z nazwa motywu, przegraj zawrtosc:
# cp -r flexgrafik-child/* . && rm -rf flexgrafik-child/
```

---

## KROK 6 — SMOKE TEST

```powershell
# Sprawdz status HTTP domeny po deploy
(Invoke-WebRequest -Uri "https://zzpackage.flexgrafik.nl/").StatusCode
# Oczekiwany wynik: 200

(Invoke-WebRequest -Uri "https://flexgrafik.nl/").StatusCode
# Oczekiwany wynik: 200
```

Jesli 200 → deploy udany. Idz do Kroku 7.
Jesli nie 200 → **ROLLBACK** (patrz nizej).

---

## KROK 7 — WERYFIKACJA RECZNIE

Po potwierdzeniu 200:

- [ ] Otworz strone w przegladarce — laduje sie normalnie?
- [ ] Sprawdz zmieniony feature — dziala zgodnie z definicja DONE?
- [ ] Sprawdz logi bledow WordPress — brak nowych bledow?
- [ ] Jesli Wizard — przejdz caly flow od kroku 1 do summary?

Jesli wszystko OK → deploy zakonczon pozytywnie.

---

## ROLLBACK — Gdy cos pojdzie nie tak

::: danger
Jesli smoke test lub weryfikacja recznie pokaze problem → NATYCHMIAST rollback.
Nie probuj naprawiac na zywym serwerze produkcyjnym.
:::

```bash
# Podjlacz sie SSH
ssh -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -p 222 uhqsycwpjz@s34.cyber-folks.pl

# Przywroc backup (TIMESTAMP z Kroku 2)
SCIEZKA="/home/uhqsycwpjz/domains/[DOMENA]/public_html/wp-content/themes/[MOTYW]"
rm -rf $SCIEZKA
cp -r ${SCIEZKA}-backup-[TIMESTAMP] $SCIEZKA

# Sprawdz ze strona dziala po rollback
```

```powershell
# Weryfikacja po rollback:
(Invoke-WebRequest -Uri "https://[domena]/").StatusCode
# Musi byc 200
```

Po udanym rollback → wrocic do debugowania (`/debug`), znalezc problem, naprawic, znowu deploy.

---

## KROK 8 — HANDOFF PO DEPLOY

```
/handoff
```

W handoffie zapisz:
- Ktore pliki wdrozono
- Timestamp deployu
- Wynik smoke test
- Czy wymagal rollback (TAK/NIE, powod)
- Nastepny krok

Commit po udanym deploy:

```bash
git add [wdrozone-pliki]
git commit -m "feat: [opis] — deployed to prod [data]"
git push origin [branch]
```

---

## Quick Reference — Deploy w 60 Sekund

```
1. Przejdz prep-deploy checklist
2. SSH → backup z timestamp
3. Lokalnie: tar plikow do wysylki
4. SCP: wysylka archiwum
5. SSH: rozpakowanie + rm archiwum
6. Smoke test: StatusCode == 200?
   TAK → weryfikacja recznie → DONE
   NIE → rollback → /debug → ponow
7. /handoff + commit
```

---

## Powiazane Dokumenty

| Dokument | Link |
|----------|------|
| Checklista przed deploy | [prep-deploy.md](/checklists/prep-deploy) |
| Tryb awaryjny | [patch-only-surgery.md](/playbooks/patch-only-surgery) |
| Pelny feature loop | [feature-loop.md](/playbooks/feature-loop) |
| Jesli produkcja nie dziala | [if-lost.md](/if-lost) |
