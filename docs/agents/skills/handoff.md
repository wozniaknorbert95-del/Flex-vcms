---
status: "[STABLE]"
title: "Skill: /handoff"
updated: "2026-05-11"
trigger: "/handoff"
owner: "Senior Agency (AG)"
spec_ref: "docs/core/session-anchor-and-handoff-spec.md"
---

# Skill: `/handoff`

> Wywołanie: wpisz `/handoff` na końcu sesji.
> AG wykonuje poniższe kroki **bez pytania** o potwierdzenie każdego z nich.

---

## Co robi `/handoff`

### Krok 1 — Exit Checklist (BRAIN.md §8, 30 sekund)

AG weryfikuje binarnie:

| Punkt | Sprawdzenie |
|-------|------------|
| 1-1-1 | Sesja miała jedno zadanie — jest domknięte lub BLOCKED z opisem |
| Backlog | `flex-vcms-todo.json` ma zaktualizowane `meta.updated`, `meta.next`, `meta.workstream` |
| Handoff | Plik w `docs/handoffs/YYYY-MM-DD-<temat>.md` będzie zapisany (ten krok) |
| Scan gate | `node tools/vcms-scan.js` → Conflicts: 0 |
| Deploy | Jeśli był deploy: smoke `/health` → 200 i checklista `prep-deploy.md` |

Jeśli którykolwiek punkt = NIE → **STOP**, AG raportuje blokadę, nie zapisuje handoffu.

---

### Krok 2 — Generuj plik handoffu

AG tworzy `docs/handoffs/YYYY-MM-DD-<temat>.md` wg tego szablonu:

```markdown
---
status: "[DONE]"
title: "<YYYY-MM-DD> — <temat sesji>"
session: "<rola agenta i zakres>"
---

## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: <numer>
MODULE: flex-vcms
WORKSPACE_ROOT: C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms
BRANCH: <branch>
HEAD: <git rev-parse --short HEAD>
CONFLICTS: 0
LAST_HANDOFF: docs/handoffs/<poprzedni plik>.md
NEXT: <jedno zdanie — pierwsze zadanie następnej sesji>
BLOCKER: <Brak | opis>

---

## CO ZROBIONE

<lista: co było zrobione w tej sesji — konkretne artefakty, komendy, wyniki>

## STAN PROD (jeśli dotyczy)

<tabela: endpoint | status | uwaga>

## NEXT

<Rank 1 — task_id + opis + komendy do uruchomienia>
<Rank 2 (opcjonalnie) — parallel task>

## BLOCKER

<Brak lub opis>

## Komendy weryfikacyjne

<blok komend do wklejenia w PowerShell lub SSH>
```

---

### Krok 3 — Aktualizuj backlog

AG wykonuje w `flex-vcms-todo.json`:
- `meta.updated` → ISO timestamp teraz
- `meta.workstream` → 1-zdaniowy opis stanu po sesji
- `meta.next.task_id` → task_id następnego zadania
- `meta.next.title` → tytuł
- `meta.next.before_you_start` → co sprawdzić przed startem

---

### Krok 4 — Commit + push (opcjonalnie, jeśli Dowódca powie "commit")

```powershell
git add docs/handoffs/<plik>.md flex-vcms-todo.json
git commit -m "docs: handoff <YYYY-MM-DD> <temat>"
git push
```

Bez commitu jeśli Dowódca nie potwierdził — AG pyta raz.

---

## Walidacja PASS/FAIL (wg session-anchor-and-handoff-spec.md)

| Kryterium | PASS |
|-----------|------|
| SESSIONANCHOR obecny | wszystkie klucze wypełnione |
| NEXT >= 1 wpis | konkretny task_id |
| Conflicts: 0 | potwierdzony scanem |
| Brak sprzeczności z backlogiem | meta.next === handoff NEXT |
| Plik w docs/handoffs/ | zapisany przed końcem sesji |

---

## Przykład wywołania

```
/handoff
```

AG odpowiada:
1. Exit checklist (tabela PASS/FAIL)
2. Plik handoffu (ścieżka + zawartość)
3. Diff backlogu (meta.next przed/po)
4. "Commitować?" (czeka na TAK/NIE)
