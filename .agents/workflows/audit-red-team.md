---
description: Adversarial audit przed deployem — tylko raport, bez patchy w tym kroku.
---

# /audit-red-team

## Goal

Znaleźć luki, regresje i naruszenia global-rules **zanim** Dowódca uruchomi deploy (Zasada 11).

## Input

Ukończona implementacja (checklisty w BLAST anchor `[x]`) lub plan dużej zmiany przed kodem.

## Agent procedure

1. **Adversarial review** — „jak to zepsuć?” (edge cases, nulls, race, partial deploy).
2. **Regression** — konflikt z `docs/ecosystem/conflicts.md`, istniejące repo pages.
3. **Global rules** — jeśli dostępne: `../../flexgrafik-meta/docs/core/global-rules.md` (pricing, deploy policy).
4. **VCMS-specific** — czy scan był po zmianach; czy `repos.yaml` spójny.
5. **Verdict** — binarny `PASS ✅` lub `FAIL ❌` + lista CRITICAL/HIGH/MEDIUM/LOW.

## Do

- Bądź krytyczny; przy FAIL podaj konkretne kroki naprawy.
- Sprawdź wszystkie `[ ]` w BLAST anchor — jeśli zostały, verdict = FAIL.

## Don't

- **ZABRONIONE** wprowadzanie poprawek kodu w tym kroku (tylko raport).
- Nie dawaj PASS przy otwartych CRITICAL.
- Nie deployuj (Zasada 11).

## Output

```text
VULNERABILITIES:
[CRITICAL] - ...
[HIGH] - ...
[MEDIUM] - ...
[LOW] - ...

REGRESSION_RISK: [Low|Med|High]
VERDICT: [PASS ✅ | FAIL ❌]

---
CURRENT_STAGE: F4-Test
RECOMMENDED_NEXT: [/deploy-cf | /deploy-wp | /blast | /debug]
WHY_NEXT: [PASS → deploy prep | FAIL → fix plan]
---
```

## Done when

Verdict wypisany; przy FAIL — zero deploy prep.
