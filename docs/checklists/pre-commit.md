---
status: "[STABLE]"
title: "Pre-Commit Checklist — Przed Kazdym Commitem"
---

# &#x1F4CB; Pre-Commit Checklist

> Sprawdz te punkty PRZED kazdym `git commit`.
> Commitment to Git to poczatek nieodwracalnej historii. Dbaj o jakosc.

::: info Kiedy uzywac
Przed kazdym commitem — nawet "malym". Nawet "tylko dokumentacja".
Zly commit w historii to problem dla przyszlego Ciebie.
:::

---

## SEKCJA 1 — Co commituje?

- [ ] **Przejrzalem diff** — uruchamiam `git diff --staged` i czytam kazda zmiane
- [ ] **Nie ma przypadkowych plikow** — sprawdzam `git status` czy nie dodano cos niepotrzebnego
- [ ] **Brak plikow IDE i OS** — nie ma `.DS_Store`, `Thumbs.db`, `.vscode/settings.json` (jesli nie naleza do repo)
- [ ] **Brak plikow .env** — zadne sekrety, klucze API, hasla nie ida do repo

---

## SEKCJA 2 — Jakosc Kodu

- [ ] **Brak sladow debugowania** — `console.log`, `var_dump`, `die()`, `dd()`, `print_r` usuniete
- [ ] **Brak zakomentowanego martwego kodu** — stary kod jest usuniety, nie zakomentowany
- [ ] **Komentarze po angielsku** — jesli sa komentarze w kodzie, sa po angielsku (nie po polsku)
- [ ] **Brak TODO bez ticketu** — `// TODO:` bez referencji do zadania jest zakazane

---

## SEKCJA 3 — Commit Message

- [ ] **Prefiks obowiazkowy** — zaczyna sie od `feat:`, `fix:`, `refactor:` lub `docs:`
- [ ] **Opis jest konkretny** — nie "update", "fix", "changes" — tylko co dokladnie
- [ ] **Jezyk angielski** — commit message po angielsku

Przyklady **dobrych** commit messages:
```
feat: add vehicle size selector to Wizard Step 4
fix: cart total reset after browser back navigation
refactor: extract STEP_CATALOG_MAP to config object
docs: fill Sprint 2 playbooks and checklists
```

Przyklady **zlych** commit messages:
```
update
fix bug
zmiany w js
poprawka
WIP
```

---

## SEKCJA 4 — Feature Branch

- [ ] **Pracuje na feature branchu** — sprawdzam `git branch` ze nie jestem na `main`
- [ ] **Branch name ma sens** — np. `feat/wizard-step-4`, `fix/cart-reset`, `docs/sprint-2`
- [ ] **Nie zamierzam pushowac bezposrednio na main** — pamieta o PR

---

## SEKCJA 5 — Dokumentacja i Kontekst

- [ ] **Handoff bedzie** — plan zrobienia `/handoff` po tej sesji (jesli to ostatni commit sesji)
- [ ] **Backlog zaktualizowany** — `flex-vcms-todo.json` (VCMS) / todo modułu — taski sa aktualne
- [ ] **Jesli schema change** — `PRD-schema.md` jest juz zaktualizowany PRZED tym commitem

---

## Wynik Checklisty

| Wynik | Akcja |
|-------|-------|
| Wszystkie &#x2705; | Commituj z czystym sumieniem |
| Jeden lub wiecej &#x274C; | Popraw przed commitem |

---

## Polecenia Pomocnicze

```bash
# Sprawdz co commit zawiera (przed git add):
git diff

# Sprawdz co jest staged (po git add, przed commit):
git diff --staged

# Sprawdz status repo:
git status

# Sprawdz na jakim jestes branchu:
git branch

# Pelny log ostatnich commitow:
git log --oneline -10

# Cofnij ostatni commit (zostaw zmiany w plikach):
git reset --soft HEAD~1
```

---

## Komisarz Commitu — Pytania Kontrolne

Zadaj sobie te pytania przed kazdym commitem:

1. **Gdyby ktos przeczytał ten commit za rok — zrozumie co robilam?**
2. **Czy moglbym z czystym sumieniem zrobic PR i wysłac kolegom do review?**
3. **Czy ten commit robi JEDNO konkretne rzecz?** (nie 5 niezwiazanych zmian)
4. **Czy w przypadku bledu moglbym zrobic `git revert` tego commita bezpiecznie?**

Jesli odpowiedz na 1 lub wiecej pytan to NIE → przerob commit.

---

## Powiazane Dokumenty

| Dokument | Link |
|----------|------|
| Checklista przed deployem | [prep-deploy.md](/checklists/prep-deploy) |
| Konwencja commitow | [global-rules.md](/core/global-rules) (sekcja 2.7) |
| Zasady branchingu | [global-rules.md](/core/global-rules) (sekcja 2.4) |
