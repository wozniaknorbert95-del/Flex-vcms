---
description: Tygodniowy checkpoint postepu nauki i pracy Dowodcy
---

# /checkpoint — Kontrola Postepu

Uzyj gdy chcesz wiedziec gdzie stoisz. Lub gdy KODA zainicjuje sam
po 3+ dniach bez aktywnosci.

---

STOP. Nie piszemy kodu. Robimy rachunek sumienia.

Przeprowadz Dowodce przez nastepujace kroki:

## KROK 1 — CO MIALO BYC ZROBIONE

Przeczytaj:
1. Ostatni plik w `docs/handoffs/` — sekcja "Nastepny krok"
2. `flex-vcms-todo.json` (kanoniczny backlog VCMS) — taski IN_PROGRESS / TODO; opcjonalnie root `todo.json` tylko jako wskaźnik
3. Ostatnia sesja w `docs/journal/logs-index.md` (jesli istnieje)

Wypisz liste zobowiazan z poprzedniej sesji. Konkretnie.

## KROK 2 — CO ZOSTALO FAKTYCZNIE ZROBIONE

Zapytaj Dowodce:
"Co z tej listy faktycznie zrobiles od ostatniej sesji?"

Czekaj na odpowiedz. Nie zakladaj. Nie zgaduj.

## KROK 3 — OCENA WYKONANIA

Oblicz procent wykonania:
- 80-100% → Zielone. "Dobry tydzien. Temp utrzymuj."
- 50-79%  → Zolte. "Sredni tydzien. Co blokowalo?"
- 0-49%   → Czerwone. "Trzeba rozmowy. Co sie stalo?"

Podaj ocene 0-10 z jednozdaniowym uzasadnieniem.
Bez owijania w bawelne. Na faktach.

## KROK 4 — DIAGNOZA BLOKADY

Jesli sa niezrealizowane zobowiazania — zadaj jedno pytanie:
"Co konkretnie stanelo na przeszkodzie? Jedna rzecz."

Sluchaj odpowiedzi. Nastepnie:
- Blokada zewnetrzna (zycie, praca) → "OK. Jak to omijamy nastepnym razem?"
- Blokada wewnetrzna (strach, prokrastynacja) → "Rozumiem. Najmniejszy mozliwy krok: [X]."
- Brak jasnosci → "To moja wina. Wyjasnimy. Oto konkretny nastepny krok: [X]."

## KROK 5 — JEDEN KONKRETNY NASTEPNY KROK

Nie plan na tydzien. JEDEN krok.
Musi byc:
- Konkretny (nie "popracuj nad VitePress" — ale "dodaj strone glossary.md z 5 terminami")
- Mierzalny (wiem kiedy jest zrobiony)
- Realny (15-60 minut max)
- Powiazany z celem (MRR / nauka VCMS)

Zakoncz checkpoint:
"Twoj nastepny krok: [X]. Wracaj gdy skonczysz. Nie musisz robic nic wiecej."

---

## SKALA PILNOSCI (Uzywaj ikonki)

- &#x1F7E2; Zielone — wszystko idzie zgodnie z planem
- &#x1F7E1; Zolte — uwagi, wymaga rozmowy
- &#x1F534; Czerwone — problem, potrzeba interwencji

---

## PAMIEC DLA KODY

Po kazdym checkpoincie zapisz krotki wpis w `docs/study/study-index.md`:

```
## Checkpoint [DATA]
Wykonanie: [X]%  
Ocena: [N]/10
Blokada: [co stanelo]
Nastepny krok: [co ustalono]
```

