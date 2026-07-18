---
status: "[ACTIVE]"
title: "COI-KNOW-02 — PROOF P1 (cmd KB + Deploy GO)"
gate: "VCMS-KB-IA-01"
updated: "2026-07-18"
---

# COI-KNOW-02 — PROOF P1

## Git / deploy

| Item | Value |
|------|-------|
| PR | [#28](https://github.com/wozniaknorbert95-del/Flex-vcms/pull/28) merge `ec427e9` |
| Deploy | `Deploy-VPS.ps1` exit 0 (~2 min) |
| Health | `{"status":"OK"}` |
| Docs smoke | handbook=200 study-index=200 |

## LIVE post-deploy (:8001)

| Path | HTTP |
|------|------|
| `/docs/` | 200 |
| `/docs/study/coi-commander-ops-handbook` | 200 |
| `/docs/study/surfaces-map` | 200 |
| `/docs/study/study-index` | 200 |

Home dist: `href="/docs/study/..."` (naprawione; brak bare `/study/`).  
Nav zawiera „COI Commander” (COI count ≥ 2 na home).

## Discoverability

- Hero + OPS sidebar + Quick Access → handbook  
- Handbook CTA → `https://api.zzpackage.flexgrafik.nl/commander/`  
- surfaces-map LIVE  

## NEXT

→ P2 global-rules pointer · P3–P6 SoT per repo.
