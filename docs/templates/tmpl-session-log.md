---
status: "[STABLE]"
title: "Session Log Template (VCMS-compatible)"
updated: "2026-04-09"
---

# SESSION LOG — [YYYY-MM-DD] — [TEMAT]

> **Kopiuj to dla każdej sesji. Plik trafia do: `docs/journal/YYYY-MM-DD-<topic>.md`**
> Więcej: `docs/core/session-anchor-and-handoff-spec.md`

---

## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: [numer fazy]
MODULE: [nazwa modułu, np. flex-vcms]
WORKSPACE_ROOT: C:\Users\FlexGrafik\Desktop\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
VERIFY: node tools\vcms-scan.js
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/ecosystem/map.md; docs/ecosystem/repos/*.md
CONFLICTS: [0 albo N]
LAST_HANDOFF: docs/handoffs/[YYYY-MM-DD]-[topic].md
NEXT: [jedna rzecz]
BLOCKER: Brak

---

## CEL SESJI

- [cel 1]
- [cel 2]

---

## LOG (chronologicznie)

- [HH:MM] — [co zrobione / obserwacja]
- [HH:MM] — [co zrobione / obserwacja]

---

## OUTCOME

| Element | Status |
|---------|--------|
| [cel 1] | DONE / SKIP / FAIL |
| [cel 2] | DONE / SKIP / FAIL |

**Efekt netto:** [1–2 zdania co realnie zmieniło się w systemie]

---

## NEXT (1 rzecz)

[dokładnie 1 zadanie; skopiuj to samo do handoffu]

---

## Linki do artefaktów sesji

- Handoff: `docs/handoffs/[YYYY-MM-DD]-[topic].md`
- Konflity: `docs/ecosystem/conflicts.md`
- Mapa: `docs/ecosystem/map.md`
