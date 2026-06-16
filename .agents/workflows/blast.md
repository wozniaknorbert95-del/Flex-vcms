---
description: BLAST framework — plan techniczny zakotwiczony w pliku, nie tylko w czacie.
---

# /blast

## Goal

Utworzyć trwały kontrakt techniczny (BLAST) przed implementacją, aby zapobiec driftowi kontekstu.

## Input

Zaakceptowany cel sesji z `/vibe-init` (Feature/Bugfix) lub ticket Dowódcy.

## Agent procedure

1. **Background** — kontekst, problem, moduł z `repos.yaml`.
2. **Limitations** — min. 3 potencjalne punkty awarii (techniczne, czasowe, zakres plików).
3. **Actions** — atomowe kroki jako checklista `[ ]`.
4. **Success** — kryteria binarne Pass/Fail (nie „działa lepiej”).
5. **Tests** — jak zweryfikujemy (lokalnie, scan, smoke URL).
6. **Anchor** — zapisz BLAST do **jednego** z:
   - `.cursor/current-task.md` (preferowane w sesji Cursor), lub
   - `docs/handoffs/YYYY-MM-DD-<topic>-blast.md` (gdy praca dokumentacyjna / długi orchestrator).
7. **Czekaj** na zatwierdzenie Dowódcy przed F3-Implement (chyba że Fast-Track wyjątek z vibe-init).

## Do

- Trzymaj plan w pliku — każdy krok implementacji odnosi się do checklisty.
- Aktualizuj anchor gdy plan ewoluuje.
- Dla zmian `repos.yaml` / skanera: uwzględnij commit artefaktów po `vcms-scan.js`.

## Don't

- Nie zostawiaj planu wyłącznie w historii czatu.
- Nie implementuj przed zatwierdzeniem (standard path).
- Nie łam Zasady 1-1-1 (jeden task, jeden DoD).

## Output

```text
BLAST_ANCHOR: [.cursor/current-task.md | docs/handoffs/...]
CRITICAL_CONSTRAINT: [jedna rzecz która może wszystko zepsuć]
ACTIONS_COUNT: [N]
DOD: [1 zdanie Pass/Fail]

---
CURRENT_STAGE: F2-Design
RECOMMENDED_NEXT: F3-Implement (po zatwierdzeniu Dowódcy)
WHY_NEXT: Plan zakotwiczony — można wykonywać checklistę
---
```

## Done when

Plik anchor istnieje, Success Criteria są binarne, Dowódca zatwierdził (lub Fast-Track udokumentowany).
