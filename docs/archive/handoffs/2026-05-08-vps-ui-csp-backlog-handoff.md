---
status: "[STABLE]"
title: "2026-05-08 — VPS UI fix (CSP) + backlog deploy restored"
---

## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: 4
MODULE: flex-vcms
WORKSPACE_ROOT: C:\Users\FlexGrafik\FlexGrafik\github\Flex-vcms\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
BRANCH: feat/audit-3.0-knowledge-index
HEAD: 707034758d24703daae76ee35087bf946ffd2f2f
VERIFY: node tools\vcms-scan.js
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/ecosystem/map.md; docs/ecosystem/repos/*.md
CONFLICTS: (nie sprawdzono w tej sesji)
LAST_HANDOFF: docs/handoffs/2026-04-13-ph4-014-sync-complete.md
NEXT: Przywrócić pełną funkcjonalność produkcyjnego VCMS pod docelowym hostem + TLS (cmd.flexgrafik.nl) i zrobić smoke + test telefonu.
BLOCKER: DNS dla cmd.flexgrafik.nl / vcms.flexgrafik.nl zwraca NXDOMAIN lokalnie; bez hosta+TLS część hardeningu (CSP/headers) może degradować UX na IP.

## CO ZMIENIONE / WAŻNE

- **Naprawa “amatorkiego” wyglądu na IP**: problemem było CSP `upgrade-insecure-requests`, które wymuszało ładowanie assetów po HTTPS na `185.243.54.115` i blokowało CSS/JS.
  - Zmieniony plik: `src/middleware/guards.js` (ustawione `upgradeInsecureRequests: null`).
- **Backlog na dashboardzie**: `GET /api/v1/backlog` wcześniej dawał 404 na produkcji, bo deploy nie wysyłał `flex-vcms-todo.json` i `repos.yaml`.
  - Zmieniony plik: `scripts/Deploy-VPS.ps1` (dodane do listy plików kopiowanych).
- **Nowy, twardy brain VCMS**: dodany `BRAIN.md` jako kanon (bez wątków nauki; nauka = `vibe-coach`). `brain.md` zdegradowany do legacy pointer.

## NEXT (1 rzecz)

Ustawić docelowy host + TLS (cmd.flexgrafik.nl) i wykonać smoke PASS + test telefonu wg PH4-011.

## BLOCKER

DNS NXDOMAIN dla `cmd.flexgrafik.nl` / `vcms.flexgrafik.nl` (do potwierdzenia z rejestrem DNS / Cloudflare / dostawcą).

## Weryfikacja

- Otwórz `http://185.243.54.115/` (Basic Auth) i sprawdź, że UI ma styling (CSS/JS ładuje się 200).
- Sprawdź endpointy:
  - `GET /api/v1/status` → 200
  - `GET /api/v1/backlog` → 200
  - `GET /api/v1/ecosystem/status` → 200
- Lokalnie (przed większymi zmianami registry):
  - `node tools\vcms-scan.js` → oczekiwane: Conflicts: 0

