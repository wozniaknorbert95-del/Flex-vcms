---
status: "[ACTIVE]"
title: "COI-KNOW-02 — PROOF P0 (LIVE cmd + drift 8 repo)"
gate: "COI-KNOW-02"
updated: "2026-07-18"
---

# COI-KNOW-02 — PROOF P0

## T1–T6 LIVE (VPS localhost :8001, 2026-07-18)

| ID | Path | HTTP | Werdykt |
|----|------|------|---------|
| T1 | `/` | 200 | PASS (dashboard) |
| T2 | `/docs/` | 200 | PASS |
| T3 | `/study/coi-commander-ops-handbook` | **500** | **FAIL** — poza `base:/docs/` |
| T4 | `/docs/study/coi-commander-ops-handbook` | 200 | PASS (treść LIVE) |
| T5 | Nav/sidebar „COI Commander” | — | **FAIL** — brak w themeConfig |
| T6 | Home card href | — | **FAIL** — dist ma `href="/study/..."` |

Public HTTPS: wszystkie ścieżki **401** Basic Auth (oczekiwane; brama żyje).

## Root cause (kod)

- `docs/index.md` raw HTML: `/study/...` i `/docs/ecosystem/...`
- `docs/.vitepress/config.mts`: brak grupy OPS / study
- `ignoreDeadLinks: true` (maskowało rotę)

## R1–R8 inventaryzacja tipów (workspace)

| Repo | Tip | Brain | Todo | Największy drift |
|------|-----|-------|------|------------------|
| flex-vcms | `cc627fb` | brain.md (updated 2026-06-16) | flex-vcms-todo.json | home broken links; brain vs study 07-18 |
| jadzia-core | `c87d9b5` | brain.md | todo.json | KNOW index bez cmd surfaces |
| flexgrafik-meta | `432b133` | master-plan | todo.json (2026-05) | global-rules fork w VCMS |
| vibe-coach | `e2ecef6` | **brak** | **brak** | META task niedomknięty |
| zzpackage | `ebe799c` | MASTER-BRAIN | audit-todo **+** ops/todo | drugi backlog |
| app.flexgrafik.nl | `eced699` | brain.md | todo.json | card freshness |
| flexgrafik-nl | `f596566` | brain.md | todo.json | card freshness |
| agent-os | `4134131` | SESSION-ANCHOR | todo.json | anchor data vs tip |
| agent-os-ui | `cab3ccb` | **brak** | todo.json | thin-client brain missing |

## NEXT

→ P1: fix cmd IA + Deploy GO.
