---
description: Reset gdy agent się gubi (>2 próby) — zapis stanu, nowy czat.
---

# /context-reset

## Goal

Przerwać pętlę halucynacji / błędnych prób przez kompresję stanu i restart sesji.

## Input

>2 nieudane próby tego samego fixu, sprzeczne instrukcje w czacie, lub Dowódca wymusza reset.

## Agent procedure

1. **Podsumuj** (wysoka gęstość):
   - Cel sesji (1 zdanie).
   - Co zrobiono (fakty).
   - Co nie zadziałało i **dlaczego** (konkretnie).
   - Ostatni znany dobry stan (commit, plik, Conflicts:N).
2. **Zapisz** do `.cursor/session-state.md` (nadpisz) **oraz** opcjonalnie `docs/handoffs/YYYY-MM-DD-context-reset.md`.
3. **Skopiuj** kluczowe V-FILES (max 4 ścieżki).
4. **Instrukcja dla Dowódcy:** nowy czat → `/vibe-init` z odwołaniem do zapisanego stanu.
5. **STOP** — nie pisz nowego kodu w tej turze.

## Do

- Jeśli nie umiesz wypełnić „dlaczego poprzednie nie zadziałało” → RECOMMENDED_NEXT = `/debug`.

## Don't

- Nie kontynuuj implementacji w tym samym wątku po resecie.
- Nie kasuj `current-task.md` bez kopii w handoff.

## Output

```text
STATE_SAVED: [.cursor/session-state.md | docs/handoffs/...]
V-FILES: [1-4 paths]
RESUME_PROMPT: [gotowy blok do wklejenia w nowym czacie]

---
CURRENT_STAGE: recovery
RECOMMENDED_NEXT: [new chat → /vibe-init]
WHY_NEXT: Czysty kontekst — wczytaj zapisany stan
---
```

## Done when

Stan zapisany; Dowódca ma copy-paste prompt na nową sesję.
