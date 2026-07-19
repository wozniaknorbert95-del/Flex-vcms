---
status: "[STABLE]"
title: "Handoff — Faza 2: Repo Pages + Dashboard Links"
updated: "2026-04-09"
---

## Co dowiezione
- Generator `node tools/vcms-scan.js` generuje teraz dodatkowo: `docs/ecosystem/repos/*.md` (po 1 stronie na repo z `repos.yaml`).
- `docs/ecosystem/map.md` ma nowa kolumne **Repo page** z linkami do per‑repo stron.
- Repo pages pokazuja wprost: canonical brain/todo, guardrails, handoffs readiness, oraz **last_handoff** (najnowszy plik po mtime, jesli istnieje).
- Slugi sa deterministyczne i odporne na kolizje (suffix `-2`, `-3`, ...).
- Raporty `.md` sa deterministyczne miedzy uruchomieniami: timestamp w frontmatter pochodzi ze stabilnego “ostatniego mtime” (nie z czasu uruchomienia skanu).

## Jak uruchomic
PowerShell:
1) `Set-Location "C:\\Users\\FlexGrafik\\Desktop\\flex-vcms"`
2) `node tools\\vcms-scan.js`

## Gdzie klikac (VitePress)
- Mapa: `docs/ecosystem/map.md`
- Repo pages: `docs/ecosystem/repos/*.md`

## Co dalej (ale NIE dodawac jeszcze do todo)
- Po akceptacji Fazy 2: dopiero wtedy dopisujemy pelne zadania Fazy 3 do `flex-vcms-todo.json`.

