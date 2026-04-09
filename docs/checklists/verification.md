---
status: "[STABLE]"
title: "Verification — która checklista i kiedy"
updated: "2026-04-09"
---

# Verification — która checklista i kiedy

Ten plik **nie** zastępuje bramek Fazy 3. Służy do tego, żeby od razu wiedzieć, **którą weryfikację** otworzyć.

## Orchestrator (`flex-vcms`) — Faza 3 (kanoniczne bramki)

Gdy zamykasz pracę nad warstwą orchestracji, skanem, dokumentacją VitePress i kontraktami w tym repo — użyj:

- **[Phase 3 Verification — Quality Gates + DoD](/checklists/phase-3-verification)** — PASS/FAIL bez interpretacji (wejścia/wyjścia skanu, artefakty, smoke testy).

Powiązane scenariusze ręczne:

- [Phase 3 test scenarios](/checklists/phase-3-test-scenarios)

## Ogólna / legacy weryfikacja

Starsze lub modułowe checklisty (deploy, pre-commit, „czy wszystko żyje” poza bramkami Phase 3) są w tym samym katalogu, np.:

- [Pre-commit](/checklists/pre-commit)
- [Prep deploy](/checklists/prep-deploy)

Jeśli dokument nie wymienia explicite „Phase 3”, traktuj go jako **kontekstowy** — nie jako zamiennik [phase-3-verification](/checklists/phase-3-verification) dla orchestratora.

## Szybki sygnał po skanie

Po `node tools/vcms-scan.js` sprawdź `docs/ecosystem/conflicts.md`: **Conflicts: 0** przed merge’em zmian w mapie ekosystemu.
