---
status: "[STABLE]"
title: "Feature Loop — Pelny Cykl Zycia Feature"
---

# &#x1F504; Feature Loop — Pelny Cykl Zycia Feature

> Ten playbook to kompletna mapa jak zaimplementowac KAZDY nowy feature.
> Od pomyslu do produkcji. Krok po kroku. Zero zgadywania.

::: info Kiedy uzywac
Uzyj gdy zaczynasz cokolwiek nowego: nowy krok Wizarda, nowa sekcja UI,
nowa integracja API, nowy plugin. Nawet jesli to "mala zmiana".
:::

---

## Faza 1 — START SESJI

### Krok 1.1 — Uruchom VCMS Cockpit

```powershell
# W katalogu vcms:
npm run docs:dev
# Otwiera localhost:5173 — Twoje centrum dowodzenia
```

### Krok 1.2 — Otwieraj sesje z /vibe-init

Wpisz AG:

```
/vibe-init
```

AG przeczyta:
- `PRD-core.md` — projekt i stack
- `flex-vcms-todo.json` (VCMS) lub canonical `todo.json` / `audit-todo.json` modułu — aktualne zadania
- `global-rules.md` — zasady systemu

AG odpowie w 2 zdaniach: co rozumie jako cel sesji.

::: danger
NIE pozwol AG pisac kodu zanim nie potwierdzisz celu sesji.
Nawet jedno zdanie poprawki zaoszczedzi 30 minut cofania zmian.
:::

### Krok 1.3 — Potwierdz lub popraw cel

- Jesli dobrze rozumie → "OK, zacznijmy"
- Jesli zle → "Nie, dzisiaj robimy X, nie Y"

---

## Faza 2 — PLANOWANIE FEATURE

### Krok 2.1 — Uruchom BLAST

Opisz feature w jednym zdaniu i wpisz:

```
/blast [opisz feature]
```

Przyklad:
```
/blast zaimplementuj Step 4 Wizard — wybor rozmiaru folii
```

AG przygotuje analize BLAST:

| Litera | Pytanie AG | Co dostaniesz |
|--------|-----------|---------------|
| **B** – Background | Co rozwiazujemy? | Kontekst i problem |
| **L** – Limitations | Co nas ogranicza? | Zakres plikow, tech constraints |
| **A** – Actions | Co konkretnie robimy? | Lista krokow implementacji |
| **S** – Success | Jak wyglada DONE? | Definicja sukcesu |
| **T** – Tests | Jak testujemy? | Smoke test + weryfikacja |

### Krok 2.2 — Review planu BLAST

Sprawdz:
- [ ] Plan nie wychodzi poza zakres (scope creep check)
- [ ] Pliki do modyfikacji sa rozsadne (nie "wszystkie")
- [ ] Nie ma schema change bez PRD-schema.md update
- [ ] Jest branch do pracy (nie `main`)

### Krok 2.3 — Zatwierdz lub negocjuj

- Wszystko OK → "Zatwierdzone, zaczynamy"
- Za duzy scope → "To za duzo. Podziel na 2 mniejsze kroki"
- Zly branch → "Pracujemy na branchu `feat/[nazwa]`, nie na main"

::: tip Zasada
Im mniejszy zakres jednego /blast, tym mniejsze ryzyko regresji.
Duze feature = wiele malych /blast → wiele malych commitow.
:::

---

## Faza 3 — IMPLEMENTACJA (Zasada 1-1-1)

### Krok 3.1 — AG implementuje JEDNEN modol

AG pisze kod dla pierwszego punktu z listy Actions.
Dostarczy:
- Pelny diff (co sie zmienia, co jest nowe)
- Instrukcje wdrozenia (jak wgrac, gdzie skopiowac)
- Oczekiwany wynik (co powinno dzialac po wdrozeniu)

### Krok 3.2 — Ty wdrazasz

1. Skopiuj diff do pliku lub uruchom komende AG
2. Sprawdz w przegladarce / terminalu ze funkcja dziala
3. Dopiero po weryfikacji → mow AG "OK, nastepny krok"

::: danger NIE RoB TEGO
- NIE mow "zrob wszystko i powiedz mi jak bedzie gotowe"
- NIE zignorowasz weryfikacji miedzy krokami
- NIE zatwierdzaj kroku ktorego nie przejrzales
:::

### Krok 3.3 — Powtarzaj az do DONE

```
AG implementuje krok N
    → Ty wdrazasz
    → Ty weryfikujesz
    → "OK, nastepny krok"
AG implementuje krok N+1
    → ...
```

---

## Faza 4 — AUDYT PRZED DEPLOY

### Krok 4.1 — Uruchom Red Team

Gdy wszystkie kroki z BLAST sa zrobione:

```
/audit-red-team
```

AG sprawdzi:
- Bezpieczenstwo (sekrety, walidacja, XSS, SQL injection)
- Reliability (co gdy API nie odpowie, timeouty)
- Data (backup, mozliwy rollback)
- WordPress specific (wp-config, PHP walidacja)

### Krok 4.2 — Interpretacja wyniku

| Wynik | Co znaczy | Co robic |
|-------|-----------|---------|
| &#x1F7E2; Gotowe do produkcji | Wszystko OK | Idz do Fazy 5 |
| &#x1F7E1; Drobne uwagi | Niekrytyczne problemy | Napraw lub swiadomie zaakceptuj |
| &#x1F534; Blokuje deploy | Krytyczny problem | STOP. Napraw. Uruchom audit ponownie. |

::: warning
Przy &#x1F534; NIGDY nie deployjuj na sile.
AG podaje konkretna poprawke dla kazdego blokera.
:::

---

## Faza 5 — DEPLOY NA PRODUKCJE

### Krok 5.1 — Przejdz prep-deploy checklist

Zanim ruszysz z deployem:

➡ [prep-deploy.md](/checklists/prep-deploy)

Kazdy punkt musi byc odchaczony.

### Krok 5.2 — AG przygotowuje komendy

Powiedz AG:
```
/deploy-cf [lista plikow do wdrozenia]
```

AG przygotuje gotowe komendy SCP + SSH.
Ty je uruchamiasz. AG nie uruchamia ich autonomicznie.

### Krok 5.3 — Smoke test

Po deploy sprawdz:

```powershell
(Invoke-WebRequest -Uri "https://[domena]/").StatusCode
# Oczekiwany wynik: 200
```

Jesli 200 → deploy udany.
Jesli cos innego → rollback (patrz [manual-release.md](/playbooks/manual-release)).

---

## Faza 6 — ZAMKNIECIE SESJI

### Krok 6.1 — Handoff ZAWSZE

```
/handoff
```

AG przygotuje raport z:
- Lista zmian tej sesji
- Stan (branch, commit hash, testy)
- Co niedokonczone i dlaczego
- **Nastepny krok** (1 zdanie na start kolejnej sesji)

### Krok 6.2 — Commit i push

AG zaproponuje commit z prefiksem:

```bash
git add [pliki]
git commit -m "feat: [opis zmiany]"
git push origin [branch-name]
```

### Krok 6.3 — Zaktualizuj backlog

W repo **flex-vcms**: `flex-vcms-todo.json`. W **module** docelowym: canonical `todo.json` lub `docs/audit-todo.json`. Zamknij ukonczone taski; dodaj nowe jesli sie pojawily.

---

## &#x1F5FA; Mapa Calego Feature Loop

```
START
  |
  v
/vibe-init --> potwierdz cel sesji
  |
  v
/blast --> zatwierdz plan BLAST
  |
  v
Implementacja 1-1-1 (powtarzaj):
  AG pisze --> Ty wdrazasz --> Ty weryfikujesz --> OK
  |
  v
/audit-red-team --> tylko 🟢 idzie dalej
  |
  v
prep-deploy checklist
  |
  v
/deploy-cf --> TY uruchamiasz komendy
  |
  v
Smoke test (200 OK)
  |
  v
/handoff --> commit --> push
  |
KONIEC
```

---

## Najczestsze Przeszkody

| Problem | Objaw | Rozwiazanie |
|---------|-------|-------------|
| Scope creep | AG chce zmienic wiecej niz ustalono | Zatrzymaj, ogranicz do /blast scope |
| Zmeczenie weryfikacji | Pomijasz sprawdzenie krokow | Zrob przerwe, nie skipuj |
| AG sie gubi | Powtarza to samo | `/context-reset` |
| Deploy fail | StatusCode != 200 | Rollback z [manual-release.md](/playbooks/manual-release) |
| Brak handoffu | Zakonczyles sesje bez raportu | Wpisz `/handoff` teraz |

---

## Powiazane Dokumenty

| Dokument | Kiedy |
|----------|-------|
| [patch-only-surgery.md](/playbooks/patch-only-surgery) | Gdy feature to fix na produkcji |
| [manual-release.md](/playbooks/manual-release) | Deploy szczegolowy krok po kroku |
| [prep-deploy.md](/checklists/prep-deploy) | Checklista przed kazdy deploy |
| [agent-boundaries.md](/agents/agent-boundaries) | Co moze AG, co mozesz Ty |
