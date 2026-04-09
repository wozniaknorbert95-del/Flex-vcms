---
status: "[STABLE]"
title: "PH4-011 — operator runbook (deploy → smoke → mobile → backlog)"
updated: "2026-04-11"
---

# PH4-011 — jedna sciezka operatorska

Ten dokument spinacza kroki **poza agentem** (VPS, Basic Auth, telefon). Agenty wg `AGENTS.md` (root repo) i [Agent boundaries](/agents/agent-boundaries) nie wykonuja deployu na prod za Ciebie.

## Krok A — Prep

Wykonaj: [PH4-011 mobile prep](/checklists/ph4-011-mobile-prep).

## Krok B — Deploy (tylko jesli potrzebny)

1. `npm run docs:build`
2. `.\scripts\Deploy-VPS.ps1 -SshTarget '<twoj-host>' -WhatIf`
3. Ten sam polecenie **bez** `-WhatIf`

Szczegoly: [VPS runbook](/reference/vcms-vps-runbook).

## Krok C — Smoke PASS

Checklista: [vcms-prod-smoke](/checklists/vcms-prod-smoke).  
Przyklady HTTP z Basic Auth (bez sekretow w plikach): [ph4-011-smoke-curl](/reference/ph4-011-smoke-curl).

**STOP przy FAIL** — rollback wg smoke, potem powtorka smoke.

## Krok D — Mobile

1. Telefon: HTTPS + Basic Auth + docs + KODA (acceptance w `flex-vcms-todo.json` → PH4-011).
2. Wypelnij: [handoff mobile](../handoffs/2026-04-10-ph4-011-mobile.md) (`WYNIK`, checklisty, przy FAIL jeden NEXT).

## Krok E — Zamkniecie backlogu

Tylko gdy smoke = **PASS** i mobile = **PASS**: [ph4-011-close-backlog](./ph4-011-close-backlog.md).
