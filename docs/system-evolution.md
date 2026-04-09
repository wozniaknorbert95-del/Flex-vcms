---
status: "[STABLE]"
title: "Ewolucja systemu — z Lab do Core"
updated: "2026-04-09"
---

# Ewolucja systemu — jak przenosić eksperymenty do Core

VCMS ma warstwy:

| Warstwa | Gdzie | Rola |
|---------|--------|------|
| **Lab** | [lab-index](/lab/lab-index) | Szybkie testy, prompty, pomysły |
| **Reference** | `docs/reference/*` | Słowniki, wzorce, antywzorce |
| **Core** | `docs/core/*` | Kontrakty, polityki, SOP entrypointy |
| **Playbooki** | `docs/playbooks/*` | Powtarzalne procedury |

## Ścieżka promocji (checklista)

1. **Dowód** — ten sam workflow zadziałał w 2+ sesjach bez poprawek „na żywca”.
2. **Dokument** — nowa lub zaktualizowana strona w docelowej sekcji (PL lub EN wg [Global Rules](/core/global-rules) dla UI vs docs).
3. **Link zwrotny** — w Lab dopisz „Promoted → [link]” przy starym wpisie.
4. **Skan** — po zmianach canonical w modułach: `node tools\vcms-scan.js` (jeśli dotyczy ekosystemu).

## Czego nie robić

- Nie kopiuj ściany tekstu z czatu do Core bez skrótu i struktury.
- Nie zmieniaj `global-rules.md` bez jawnej decyzji Dowódcy.

---

*Ten dokument jest krótkim mostem między [Lab](/lab/lab-index) a produkcyjną dokumentacją.*
