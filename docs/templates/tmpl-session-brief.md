---
status: "[STABLE]"
title: "Session Brief + Context Packet Template (Orchestrator)"
updated: "2026-04-09"
---

# SESSION BRIEF — [YYYY-MM-DD] — [TEMAT]

> **Jak używać:**
> Wklej ten blok jako START PROMPTU do nowego czatu (AG / Gemini CLI).
> Wypełnij pola w `[...]`. Nie zmieniaj kluczy — muszą być maszynowo parsowalne.
>
> SSoT: `docs/core/session-anchor-and-handoff-spec.md`

---

## BLOK STARTOWY (copy/paste do nowego czatu)

```
/vibe-init

## SESSIONANCHOR
PROJECT: flex-vcms
PHASE: [numer, np. 3]
MODULE: [nazwa, np. flex-vcms | zzpackage.flexgrafik.nl]
WORKSPACE_ROOT: C:\Users\FlexGrafik\Desktop\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
VERIFY: node tools\vcms-scan.js
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/ecosystem/map.md; docs/ecosystem/repos/*.md
CONFLICTS: [0]
LAST_HANDOFF: docs/handoffs/[YYYY-MM-DD-topic].md
NEXT: [jedyna rzecz do zrobienia]
BLOCKER: Brak

## CEL SESJI
[1 zdanie: co chcesz osiągnąć]

## OGRANICZENIA
- Windows lokalnie, PowerShell
- PR-only workflow (bez bezpośrednich pushów do main)
- 1-1-1 (jeden moduł, jedna sesja)
- Bez deploy na produkcję
- Bez edycji .cursor/plans/*
- SSoT w docs/core/*

## TASK
Task ID: [np. PH3-001 lub free-form]
Title: [tytuł zadania]

## KONTEKST DODATKOWY
[opcjonalnie: co jest niejasne, co jest blokadą, co wymaga decyzji]
```

---

## CONTEXT PACKET (lista plików do załadowania)

> Załaduj te pliki przed pierwszą odpowiedzią asystenta.
> Minimalne = **P0**. Opcjonalne = P1.

### P0 — zawsze

| Plik | Opis |
|------|------|
| `docs/core/global-rules.md` | Twarde zasady — zawsze obowiązują |
| `docs/core/workflow-manual.md` | SOP sesji + jak zaczynamy/kończymy |
| `docs/ecosystem/conflicts.md` | Aktualne konflikty (musi być 0) |
| `docs/ecosystem/report.md` | Dashboard: NEXT + Gates |
| `docs/handoffs/<latest>.md` | Ostatni handoff (SESSIONANCHOR + NEXT) |

### P1 — dla modułu (wybierz odpowiedni)

| Plik | Kiedy |
|------|-------|
| `docs/ecosystem/repos/<module>.md` | Zawsze gdy masz wybrany moduł |
| `docs/ecosystem/map.md` | Gdy planujesz między modułami |
| `flex-vcms-todo.json` | Gdy pracujesz z backlogiem |
| `repos.yaml` | Gdy dodajesz / zmieniasz moduł |
| `docs/core/security-policy.md` | Przed każdą operacją na plikach |

### P1 — dla Gemini CLI (execution)

| Plik | Kiedy |
|------|-------|
| `docs/core/orchestration-commands.md` | Gdy wykonujesz OP-001..OP-006 |
| `docs/checklists/phase-3-verification.md` | Przed/po sesji Gate check |
| `docs/core/quickstart.md` | Nowa sesja / powrót po przerwie |

---

## WALIDACJA SESJI (przed zamknięciem)

- [ ] `node tools\vcms-scan.js` → `Conflicts: 0`
- [ ] Handoff zapisany w `docs/handoffs/YYYY-MM-DD-<topic>.md`
- [ ] Wpis w `docs/journal/YYYY-MM-DD-<topic>.md` (z szablonu `tmpl-session-log.md`)
- [ ] `NEXT` = dokładnie 1 rzecz w handoffie
- [ ] `report.md` zaktualizowany jeśli zmienił się stan gates / NEXT
