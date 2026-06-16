---
description: State transfer na koniec sesji — SESSIONANCHOR + DONE/LEFT/RISKS/V-FILES.
---

# /handoff

## Goal

Przekazać stan sesji następnemu agentowi bez utraty kontekstu (kontrakt, nie tylko commit).

## Input

Koniec pracy, zmęczenie kontekstu, lub przygotowanie do nowego czatu po deploy Dowódcy.

## Agent procedure

1. **Verify DoD** — czy BLAST / vibe-init DoD spełnione?
2. **Git snapshot** (jeśli dotyczy): branch, `git status --short`, ostatnie commity sesji.
3. **Zbierz DONE / LEFT / RISKS** — fakty, bez marketingu.
4. **V-FILES** — max 4 ścieżki do przeczytania w nowej sesji.
5. **SESSIONANCHOR** — kanoniczny blok (patrz `docs/core/session-anchor-and-handoff-spec.md`):

```text
## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: [3|...]
MODULE: [flex-vcms|target-repo]
WORKSPACE_ROOT: C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
VERIFY: node tools\vcms-scan.js
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/ecosystem/map.md
CONFLICTS: [0|N]
LAST_HANDOFF: docs/handoffs/YYYY-MM-DD-<topic>.md
NEXT: [dokładnie jedna rzecz]
BLOCKER: [Brak|opis]
```

6. **NEXT_COMMAND_FOR_NEW_AGENT** — jeden blok do wklejenia (np. `@vibe-init Kontynuuj z docs/handoffs/...`).
7. **Opcjonalnie** zapisz `docs/handoffs/YYYY-MM-DD-<topic>.md` (zalecane po deploy lub dużej sesji).
8. **Nadpisz** `.cursor/session-state.md` skrótem (jeśli istnieje katalog `.cursor`).

## Do

- Handoff ≠ sam commit. State transfer jest obowiązkowy.
- Po zmianach orchestratora: przypomnij `node tools\vcms-scan.js` w NEXT jeśli artefakty nieświeże.
- Commit/push **tylko** na wyraźną prośbę Dowódcy.

## Don't

- Epopeja — max zwięzły raport.
- Nie commituj sekretów ani `.env`.

## Output

```text
DONE: [...]
LEFT: [...]
RISKS: [...]
V-FILES: [1-4 paths]
NEXT_COMMAND_FOR_NEW_AGENT: [copy-paste prompt]

[SESSIONANCHOR block]

---
CURRENT_STAGE: F6-Iterate
RECOMMENDED_NEXT: [new session → /vibe-init]
WHY_NEXT: Sesja zamknięta — kontynuacja ze stanem
---
```

## Done when

SESSIONANCHOR + NEXT_COMMAND wypisane; opcjonalny plik w `docs/handoffs/` zapisany.
