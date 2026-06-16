---
status: "[STABLE]"
title: "VCMS Orchestration Report"
updated: "2026-06-16"
---

# VCMS Orchestration Report

Manual operator dashboard — uzupełnij po większej sesji (3–5 min).

**Źródła prawdy:** `npm run scan` → [`conflicts.md`](./conflicts.md), [`map.md`](./map.md), [`repos/`](./repos/), handoffy.

---

## Header

| Pole | Wartość |
|------|---------|
| **Workspace** | `flex-vcms` (lokalnie) · `cmd.flexgrafik.nl` (prod) |
| **Latest handoff** | `docs/handoffs/` — ostatni plik z datą |
| **NEXT** | `flex-vcms-todo.json` → `meta.next` |
| **Conflicts** | Uruchom `npm run scan` — target **0** |

---

## Ecosystem (8 repo)

| Repo | Skan | Konflikty | Repo page |
|------|------|-----------|-----------|
| flex-vcms | ✅ | — | [open](./repos/flex-vcms) |
| zzpackage.flexgrafik.nl | ✅ | — | [open](./repos/zzpackage-flexgrafik-nl) |
| jadzia-core | ✅ | — | [open](./repos/jadzia-core) |
| app.flexgrafik.nl | ✅ | — | [open](./repos/app-flexgrafik-nl) |
| flexgrafik-nl | ✅ | — | [open](./repos/flexgrafik-nl) |
| flexgrafik-meta | ✅ | — | [open](./repos/flexgrafik-meta) |
| agent-os | ✅ | — | [open](./repos/agent-os) |
| agent-os-ui | ✅ | — | [open](./repos/agent-os-ui) |

Szczegóły: [`map.md`](./map.md) (generowany przez skan).

---

## Gates

| Gate | Komenda / plik | Ostatni wynik |
|------|----------------|---------------|
| SSoT conflicts | `npm run scan` | Conflicts: 0 |
| Scan artifacts | `npm run verify:scan` | lokalnie |
| Prod security | `docs/audits/latest-verification.md` | PASS |
| Swiss Watch UI | `docs/checklists/vcms-prod-smoke.md` | 10/10 |

---

## Powiązane

- [Portfolio Truth](../VCMS_PORTFOLIO_TRUTH.md)
- [DoD Scorecard](../VCMS_DOD_SCORECARD.md)
