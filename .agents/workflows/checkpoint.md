---
description: VCMS Vibe Coach — kontrola postępu nauki/operacji (0-10, jeden krok 15-60 min).
---

# /checkpoint

## Goal

Zweryfikować postęp względem planu/handoffu i wyznaczyć **jeden** następny krok (15-60 min).

## Input

Żądanie Dowódcy `/checkpoint`, sesja szkoleniowa, lub przegląd tygodniowy (light).

## Agent procedure

1. **Co miało być zrobione** — z ostatniego `docs/handoffs/` lub BLAST anchor.
2. **Co zostało zrobione** — pytaj Dowódcę, weryfikuj fakty (pliki, scan, commity).
3. **Ocena 0-10** — surowo, z 1 zdaniem uzasadnienia.
4. **Gdzie utknąłeś** — diagnoza przyczyny (blokada, scope, narzędzie).
5. **Jeden następny krok** — konkretny, 15-60 min max.
6. Opcjonalnie: zapis krótkiej notatki w `docs/journal/` (jeśli Dowódca chce).

## Do

- Krótko. Bez lania wody.
- Odnieś się do `flex-vcms-todo.json` jeśli aktywny backlog.

## Don't

- Nie rozpoczynaj nowego dużego feature w tym kroku.
- Nie oceniaj bez faktów.

## Output

```text
PLANNED: [...]
DONE: [...]
SCORE: [0-10] — [uzasadnienie]
STUCK: [diagnoza lub NONE]
NEXT_STEP_15_60MIN: [jedna rzecz]

---
CURRENT_STAGE: F6-Iterate
RECOMMENDED_NEXT: [/vibe-init | kontynuacja z handoff]
WHY_NEXT: [1 zdanie]
---
```

## Done when

SCORE + NEXT_STEP_15_60MIN wypisane; Dowódca potwierdził zrozumienie.
