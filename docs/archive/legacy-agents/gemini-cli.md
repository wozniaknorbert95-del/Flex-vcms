---
status: "[STABLE]"
title: "Gemini CLI — warstwa wykonawcza"
updated: "2026-04-09"
---

# Gemini CLI — warstwa wykonawcza

W modelu FlexGrafik **Gemini CLI** to **Execution layer**: konkretne kroki, skrypty, deploy-polecenia przygotowane przez AG — uruchamiane przez Dowódcę (Zasada 11).

## Granice (zgodnie z global-rules)

- **Może:** generować diffy, komendy SCP/SSH, checklisty, walidacje lokalne.
- **Nie może:** samodzielnie deployować na produkcję; edytować `.env` / sekrety; omijać `/audit-red-team` przy 🔴.

## Context packet (minimalny start)

Przed zadaniem wykonawczym załaduj:

1. [Global Rules](/core/global-rules) — szczególnie Zasada 11 i 1-1-1.
2. [Prep deploy](/checklists/prep-deploy) — jeśli dotyczy wdrożenia.
3. Canonical **brain + todo** modułu (z [mapy ekosystemu](/ecosystem/map) / repo page).

Szablon startowy: [Session Brief](/templates/tmpl-session-brief) (sekcja dla Gemini CLI).

## Współpraca z AG

- **AG (Antigravity):** orchestracja, BLAST, scope, review.
- **Gemini CLI:** wykonanie po zatwierdzonym planie; raportuje blokady do Dowódcy / AG.

## Powiązane

- [Agent boundaries](/agents/agent-boundaries)
- [Orchestration commands](/core/orchestration-commands)
- [Security policy](/core/security-policy)
