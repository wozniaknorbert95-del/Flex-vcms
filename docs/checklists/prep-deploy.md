---
status: "[STABLE]"
title: "Prep-Deploy Checklist — Przed Kazdym Deployem"
---

# &#x2705; Prep-Deploy Checklist

> Przejdz KAZDY punkt zanim wyslasz cokolwiek na produkcje.
> Jeden pominiety punkt moze kosztowac godziny przywracania.

::: danger Zasada bezwzgledna
Jesli JAKIKOLWIEK punkt ma odpowiedz NIE lub NIE WIEM → **STOP. Nie deployjuj.**
Najpierw wyjasniej, potem deploy.
:::

---

## SEKCJA 1 — Gotowos Kodu

- [ ] **Audit red-team przeszedl** — wynik `/audit-red-team` to &#x1F7E2; (nie &#x1F534; ani &#x1F7E1; z blokerami)
- [ ] **Wszystkie zmiany sa w feature branchu** — NIE w `main` bezposrednio
- [ ] **Diff jest przeglądniety** — wiem co dokladnie jest zmienione (`git diff`)
- [ ] **Nie ma sladow debugowania** — brak `console.log`, `var_dump`, `die()`, `dd()` w kodzie
- [ ] **Nie ma sekretow w kodzie** — brak API keys, hasel, tokenow wklejonych "na szybko"
- [ ] **Pliki excludowane** — `wp-config.php`, `.htaccess`, `.sql` NIE sa w paczce deploy

---

## SEKCJA 2 — Weryfikacja Biznesowa

- [ ] **Feature dziala lokalnie** — przetestowalem na local/staging przed wejsciem na prod
- [ ] **Wizard flow nie jest zepsuty** — jesli robiles zmiany w JS, przeszedl caly Wizard od kroku 1
- [ ] **Cart nie resetuje sie** — sticky cart nadal wyswietla wybrane produkty
- [ ] **Minimum checkout 199 EUR trzyma** — flow nie pozwala na zakonczenie zamowienia ponizej progu
- [ ] **Jezyk NL zachowany w UI** — zaden nowy tekst nie jest po polsku ani angielsku w UI klienta

---

## SEKCJA 3 — Gotowos Serwera

- [ ] **Backup zrobiony** — przed deploy wykonal backup plikow z timestamp na serwerze
- [ ] **Timestamp backupu zapisany** — notuje go tutaj: `backup-____________________`
- [ ] **SSH dziala** — potrafilem sie polaczyc przez SSH (`ssh -i ... -p 222 ...@s34.cyber-folks.pl`)
- [ ] **Serwer odpowiada** — przed deploy strona zwraca 200 (`(Invoke-WebRequest ...).StatusCode`)

---

## SEKCJA 4 — Gotowos Rollback

- [ ] **Rollback plan znany** — wiem jak cofnac te zmiane (backup-timestamp lub git revert)
- [ ] **Rollback przetestowany mentalnie** — przejechalem w glowie scenariusz rollback
- [ ] **Kontakt awaryjny znany** — wiem jak zadzwonic/napisac do Cyber-Folks support gdy backup trzeba odtworzyc z ich snapshota

---

## SEKCJA 5 — Handoff i Git

- [ ] **todo.json jest aktualny** — taski z tej sesji sa zaktualizowane
- [ ] **Commit message gotowy** — mam przygotowany commit z prefiksem `feat:` lub `fix:`
- [ ] **Branch name poprawny** — nie deployjuje z branchu `main` bez PR
- [ ] **Handoff zrobiony lub zaplanowany** — `/handoff` po udanym deploy

---

## Wynik Checklisty

Policz punkty:

| Wynik | Status |
|-------|--------|
| Wszystkie &#x2705; | &#x1F7E2; DEPLOY GO |
| Jeden lub wiecej &#x274C; | &#x1F534; STOP — napraw przed deployem |

---

## Po Udanym Deploy

- [ ] Smoke test OK (StatusCode 200)
- [ ] Recznie sprawdzilem zmieniony feature
- [ ] `/handoff` wykonany
- [ ] Commit z `feat:` lub `fix:` zrobiony i pushowany
- [ ] PR otwarty (jesli praca na feature branchu)

---

## Powiazane Dokumenty

| Dokument | Link |
|----------|------|
| Deploy krok po kroku | [manual-release.md](/playbooks/manual-release) |
| Checklista przed commitem | [pre-commit.md](/checklists/pre-commit) |
| Tryb awaryjny | [patch-only-surgery.md](/playbooks/patch-only-surgery) |
