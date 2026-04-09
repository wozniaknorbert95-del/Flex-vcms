---
status: "[STABLE]"
title: "Phase Waivers — Single Register (SSoT)"
updated: "2026-04-09"
---

# Phase Waivers — Single Register (SSoT)

Ten dokument jest **jedynym miejscem prawdy** dla wyjątków od reguł faz (np. dopuszczenia pracy nad Phase 4+ zanim Phase 3 jest w pełni DONE).

Zasada: waiver jest rzadki, jawny i ma właściciela. Bez waivera — obowiązuje blokada.

---

## Scope

- Dotyczy: Orchestratora `flex-vcms` i procesu zarządzania fazami (Planner).
- Nie dotyczy: deploy na produkcję i zmian infrastruktury.

## Zależności (SSoT)

- Gates + reguła blokująca Phase 4+: [phase-3-verification.md](/checklists/phase-3-verification)
- Ownership & escalation (kto decyduje): [ownership-and-escalation.md](/core/ownership-and-escalation)
- Planner spec: [planner-spec.md](/core/planner-spec)

---

## Format waivera (minimalny, obowiązkowy)

Każdy waiver to jeden wpis w tabeli.

Pola wymagane:

- **id**: unikalny identyfikator (np. `WV-2026-04-09-01`)
- **phase**: np. `4`
- **reason**: dlaczego to konieczne (1–2 zdania, fakty)
- **impact**: `Low|Med|High`
- **owner**: `Dowódca` (domyślnie) lub jawnie inny owner
- **date**: `YYYY-MM-DD`
- **review_by**: data przeglądu albo warunek zamknięcia waivera

---

## Registry

> Jeśli tabela jest pusta, oznacza to: **brak waiverów**.

| id | phase | reason | impact | owner | date | review_by |
|----|-------|--------|--------|-------|------|----------|
| *(none)* |  |  |  |  |  |  |

