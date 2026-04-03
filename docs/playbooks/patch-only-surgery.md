---
status: "[STABLE]"
title: "Patch-Only Surgery — Tryb Awaryjny"
---

# &#x1F489; Patch-Only Surgery — Tryb Awaryjny

> **To nie jest normalny feature loop.**
> Patch-Only Surgery to tryb gdy cos jest zepsute na produkcji i musisz naprawic to
> bez dodawania czegokolwiek nowego. Chirurgiczne ciecie. Zero scope creep. Minimum zmian.

::: danger Kiedy uzywac tego playbuka
- Cos przestalo dzialac na produkcji po Twoim ostatnim deploy
- Klient zglosil blad w dzialajacym wczesniej module
- Krytyczny bug blokuje proces sprzedazy (Wizard nie przesyla zamowien, cart sie resetuje, itp.)

NIE uzywaj gdy:
- Chcesz "przy okazji" poprawic jeszcze cos innego
- Problem nie jest krytyczny (moze poczekac do normalnej sesji)
:::

---

## PRZED ZACZECIEM — Freeze Scope

Zanim dotkniesz kodu, podpisz ze soba kontrakt:

```
SCOPE FREEZE — Patch-Only Surgery
=================================
Problem do naprawienia:  [JEDNO zdanie]
Pliki ktore moge dotknac: [lista — max 3 pliki]
Co jest POZA zakresem:   [wszystko inne]
Rollback trigger:        [kiedy wycofuje zmiany]
```

Zapisz to. Wklej AG na poczatku sesji.

---

## Faza 1 — DIAGNOZA (nie dotykaj kodu)

### Krok 1.1 — Zbierz fakty

```
/debug
```

AG przeprowadzi przez 5 krokow. NIE skipuj zadnego:

```
KROK 1 — Zbierz dane
  - Jaki dokladny blad? (pelny stack trace)
  - Kiedy sie pojawil? (po jakiej zmianie)
  - Czy deterministyczny? (zawsze / czasami / raz)
  - Srodowisko? (local / staging / prod)

KROK 2 — Sprawdz logi
  Jadzia VPS:
    tail -50 /root/jadzia/logs/jadzia-error.log
  WordPress:
    wp-content/debug.log

KROK 3 — Izoluj problem
  - Ktory konkretny modul / funkcja / linia?

KROK 4 — Root cause (1 zdanie)
  "Blad wynika z X, poniewaz Y (dowod z logow)"

KROK 5 — Propozycja naprawy
  AG czeka na Twoje zatwierdzenie
```

### Krok 1.2 — Scope check po diagnozie

Zanim zatwierdzisz naprawe, sprawdz:

- [ ] Naprawa dotyka tylko plikow z listy Scope Freeze?
- [ ] Naprawa jest minimalna (nie refaktoryzacja)?
- [ ] Rollback jest mozliwy (plik backupowany / git revert)?
- [ ] Root cause jest znany i udowodniony (nie zgadywanie)?

Jesli jakikolwiek punkt jest NIE → wstrzymaj sie i wyjasniej z AG.

---

## Faza 2 — BACKUP (OBOWIAZKOWY)

::: warning
Bez backupu nie ma deploy. Bez wyjaktu.
:::

### Krok 2.1 — Backup plikow na serwerze

```bash
# SSH na Cyber-Folks
ssh -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -p 222 uhqsycwpjz@s34.cyber-folks.pl

# Backup z timestamp
TS=$(date +%Y%m%d-%H%M%S)
cp /home/uhqsycwpjz/domains/[domena]/public_html/wp-content/themes/[motyw]/[plik.php] \
   /home/uhqsycwpjz/domains/[domena]/public_html/wp-content/themes/[motyw]/[plik.php].backup-$TS
```

### Krok 2.2 — Zapisz timestamp backupu

Notuj: `backup-[TIMESTAMP]` — bedzie potrzebny przy rollback.

---

## Faza 3 — IMPLEMENTACJA PATCHA

### Krok 3.1 — Minimalna zmiana

AG pisze patch. Sprawdz ze:
- Zmiana dotyczy TYLKO zidentyfikowanego root cause
- Nie ma zadnego "przy okazji zaoptymalizuje X"
- Diff jest krotki (kilka linii, nie setki)

::: danger Scope Creep Alert
Jesli AG proponuje zmienic wiecej niz ustalone w Scope Freeze →
STOP. Powiedz: "Zostajemy w scope. Tylko naprawa [X], nic wiecej."
:::

### Krok 3.2 — Deploy patcha

AG przygotuje komendy (Ty je uruchamiasz):

```bash
# Skopiuj naprawiony plik na serwer
scp -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -P 222 [naprawiony-plik] \
    uhqsycwpjz@s34.cyber-folks.pl:[sciezka-na-serwerze]
```

---

## Faza 4 — WERYFIKACJA

### Krok 4.1 — Smoke test

```powershell
(Invoke-WebRequest -Uri "https://[domena]/").StatusCode
# Musi byc: 200
```

### Krok 4.2 — Test konkretnego bledu

Sprawdz recznie ze:
- [ ] Oryginalny problem juz nie wystepuje
- [ ] Strona laduje sie normalnie
- [ ] Inne funkcje (zamowienia, Wizard, cart) dzialaja poprawnie
- [ ] Brak nowych bledow w WordPress debug.log

### Krok 4.3 — Rollback Trigger

Jesli COKOLWIEK z listy powyzej jest NIE → **natychmiast rollback**.

```bash
# Przywroc backup
ssh -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -p 222 uhqsycwpjz@s34.cyber-folks.pl \
  "cp [plik.php.backup-TIMESTAMP] [plik.php]"
```

Nastepnie wrocic do Fazy 1 — Diagnoza.

---

## Faza 5 — COMMIT I HANDOFF

### Krok 5.1 — Commit z prefixem fix:

```bash
git add [naprawiony-plik]
git commit -m "fix: [opis bledu] — patch-only surgery [data]"
git push origin [branch]
```

### Krok 5.2 — Handoff

```
/handoff
```

W handoffie OBOWIAZKOWE sekcje:
- Root cause (1 zdanie)
- Zastosowana naprawa (co zmieniono)
- Czy zdiagnozowano korzenie problemu? (czy moze wrocic)
- Akcje prewencyjne (co zrobic zeby sie nie powtorzyl)

---

## Quick Reference — Patch Surgery w 30 Sekund

```
1. SCOPE FREEZE → zapisz problem, pliki, rollback trigger
2. /debug → zbierz logi, znajdz root cause
3. BACKUP → cp file.php file.php.backup-YYYYMMDD
4. MINIMAL PATCH → tylko to co konieczne
5. SMOKE TEST → 200 + recznie test bledu
6. ROLLBACK READY → jesli cos zle → przywroc backup
7. COMMIT fix: ... → /handoff
```

---

## Czego NIGDY nie robic podczas Surgery

::: danger
- NIE refaktoryzuj przy okazji
- NIE "poprawiaj" innych bledow ktore nie sa krytyczne
- NIE deployjuj bez backupu
- NIE ignoruj rollback triggera — jesli ustalisz i go naruszy → wycofaj sie
- NIE konczysz sesji bez `/handoff` i commitu
:::

---

## Powiazane Dokumenty

| Dokument | Kiedy |
|----------|-------|
| [if-lost.md](/if-lost) | Scenariusz A — produkcja nie dziala |
| [manual-release.md](/playbooks/manual-release) | Deploy i rollback szczegolowo |
| [feature-loop.md](/playbooks/feature-loop) | Normalny tryb pracy (nie awaryjny) |
| [prep-deploy.md](/checklists/prep-deploy) | Checklista przed deploy |
