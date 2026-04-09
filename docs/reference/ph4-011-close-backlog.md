---
status: "[STABLE]"
title: "PH4-011 — zamkniecie zadania w flex-vcms-todo.json (po PASS)"
updated: "2026-04-12"
---

# Zamkniecie PH4-011 w backlogu

Wykonuj **tylko** gdy:

- [vcms-prod-smoke](/checklists/vcms-prod-smoke) — wszystkie wymagane punkty **TAK**
- [Handoff mobile](../handoffs/2026-04-10-ph4-011-mobile.md) — `WYNIK: PASS` (lub FAIL z follow-up — wtedy **nie** zamykaj PH4-011 jako DONE)

### Co **nie** jest dowodem PASS (anty-wzor)

- Same `401` / brak auth na `curl` **bez** pelnej checklisty smoke (200 na `/health` z JSON, strona docs, `/api/knowledge`, `POST /api/chat` → 400) — patrz [vcms-prod-smoke](/checklists/vcms-prod-smoke).
- „Test mobile” na emulatorze przegladarki w CI / subagencie **zamiast** prawdziwego urzadzenia — narusza acceptance PH4-011 w `flex-vcms-todo.json`.
- Zamkniecie `PH4-011` w JSON **bez** spojnego, recznie wypelnionego handoffa mobile z konkretnym modelem telefonu i data.

## Edycja `flex-vcms-todo.json`

W tablicy `tasks` znajdz obiekt `"id": "PH4-011"` i:

1. Ustaw `"status": "DONE"`.
2. Dodaj pole `"done_at": "YYYY-MM-DD"` (data faktycznego PASS mobile).
3. W `"note"` dopisz na koncu krotka linie z dowodem, np. `Dowod mobile: docs/handoffs/2026-04-10-ph4-011-mobile.md (PASS YYYY-MM-DD).`

Opcjonalnie zaktualizuj `meta.plan_now.primary` / `meta.session_anchor`, zeby odzwierciedlic nastepny epik (po Twojej decyzji).

## PR

- `npm run docs:build`
- Commit + PR (PR-only workflow — patrz `AGENTS.md` w root repozytorium i [Agent boundaries](/agents/agent-boundaries)).
- Jesli w tym samym PR zmieniasz `repos.yaml` / skaner: `npm run verify:scan` przed merge.

## Po skanie lokalnym

Jesli uruchamiasz `node tools/vcms-scan.js`: sprawdz `git status` — nie commituj przypadkowych zmian w `docs/ecosystem/*` bez swiadomego skanu (Conflicts: 0).
