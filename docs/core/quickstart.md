---
status: "[STABLE]"
title: "Quickstart — Orchestrator (flex-vcms) in 3+3"
updated: "2026-04-09"
---

# Quickstart — Orchestrator (flex-vcms) in 3+3

Użyj tego gdy startujesz **nową sesję** albo wracasz po przerwie. To jest skrót (nie pełny SOP).

---

## 3 komendy (PowerShell)

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
node tools\vcms-scan.js
git status
```

Oczekiwane: skan kończy się `Conflicts: 0`, a `git status` nie pokazuje przypadkowych zmian.

---

## 3 pliki do otwarcia (w tej kolejności)

1) `docs/ecosystem/conflicts.md`\n
   - jeśli `Conflicts found > 0` → **STOP** (najpierw porządek, potem feature)\n
2) `docs/ecosystem/map.md`\n
   - wybierz repo docelowe (1-1-1) i przejdź do repo page\n
3) `docs/ecosystem/report.md`\n
   - zobacz `NEXT (1 rzecz)` + snapshot gates\n

---

## Ostatni handoff (gdzie jest i co ma)

- Otwórz `docs/handoffs/` i wybierz najnowszy plik.\n
- Sprawdź w nim `SESSIONANCHOR`:\n
  - `NEXT` ma być **dokładnie 1 rzecz**\n
  - `BLOCKER` ma być `Brak` albo 1 linia\n

SSoT formatu: `docs/core/session-anchor-and-handoff-spec.md`.

---

## STOP rules (2 linie)

- Jeśli jakikolwiek gate jest FAIL → **STOP** (napraw gate, potem kontynuuj).\n
- Jeśli pojawi się sekret / `.env*` / dane wrażliwe → **STOP** (polityka: `docs/core/security-policy.md`).

---

## Copy/paste: Start nowej sesji

Wklej to do nowego czatu jako start:

```
/vibe-init
Cel sesji: <NEXT=1 z report/handoff>
Ograniczenia: lokalnie Windows, bez produkcji, bez serwisów zewnętrznych, PR-only workflow, 1-1-1.
Najpierw: node tools/vcms-scan.js, potem conflicts=0, potem map/repo page.
```

