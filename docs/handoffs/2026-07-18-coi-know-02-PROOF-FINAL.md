---
status: "[ACTIVE]"
title: "COI-KNOW-02 — PROOF FINAL (honest DoD)"
gate: "COI-KNOW-02"
updated: "2026-07-18"
---

# COI-KNOW-02 — PROOF FINAL (uczciwy)

**VCMS-VIDEO nie jest meta.next** — uznane za **stale/obsolete** jako domyślny next (2026-07-18).  
Next: `IDLE-POST-KNOW-02` (wybór Dowódcy).

## LIVE verify (VPS :8001, re-check)

| Check | Result |
|-------|--------|
| `/` `/docs/` | 200 |
| `/study/coi-commander-ops-handbook` | **500** (oczekiwane — poza base; użytkownik nie idzie tu) |
| `/docs/study/coi-commander-ops-handbook` | 200 |
| `/docs/study/surfaces-map` | 200 |
| Home hrefs | `/docs/study/…` only |
| Nav „COI Commander” | present |
| `global-rules` | pointer → meta LIVE |
| study-index `C:\Users` | **0** |

## DoD per repo (honest)

### flex-vcms `VCMS-KB-IA-01`

- [x] LIVE docs + handbook 200
- [x] Home/nav/sidebar/Quick Access ≤2 klik
- [x] Zero bare `/study/*` na home; zero `/docs/docs/` w study-index
- [x] Sidebar OPS
- [x] PORTFOLIO collapsible
- [x] surfaces-map LIVE
- [x] Handbook CTA + „UI ≠ cmd”
- [x] global-rules pointer
- [~] `ignoreDeadLinks`: **nie** pełne `false` — whitelist archive + znane legacy (build PASS)
- [x] Deploy GO + Conflicts: 0
- [x] gate DONE; brain updated 2026-07-18

### flexgrafik-meta `META-KNOW-02`

- [x] pełne global-rules w meta
- [x] knowledge + process pointers → jadzia
- [x] §6 mirrors / VCMS pointer note
- [x] FIX-014 vibe-coach brain/todo → done
- [x] brak paste scorecard

### jadzia-core `COI-KNOW-02`

- [x] KNOW index: cmd surfaces + learning split + global-rules rule
- [x] PROCESS/scorecard bez paste
- [x] ADR nie w VCMS; OPERATOR-PLAYBOOK pointer
- [x] todo/AGENTS/session CLOSE
- [x] MBA ≠ vibe w KNOW index

### vibe-coach `VIBE-KNOW-01`

- [x] brain.md + todo.json
- [x] study-index refreshed; AG residual cleaned (verify)
- [x] VCMS study pointer relative; zero `C:\` w study-index
- [x] brak lekcji T1–T7 w VitePress
- [~] push remote: **brak origin** (commit lokalny only)

### zzpackage `ZZP-KNOW-01`

- [x] audit-todo kanon; ops/todo DEPRECATED + archive
- [x] MASTER-BRAIN nota KNOW-02
- [x] scan Conflicts 0 / cards refreshed
- [x] zero product-master w VCMS

### app / flexgrafik-nl

- [x] brain+todo już kanoniczne; cmd = pointer only (brak nowych duplikatów)

### agent-os `OS-KNOW-01`

- [x] SESSION-ANCHOR hygiene
- [x] surfaces-map hop os.flexgrafik.nl
- [~] push remote: **brak origin**

### agent-os-ui `OSUI-KNOW-01`

- [x] brain.md thin-client
- [x] repos.yaml canonical_brain → `brain.md` (VERIFY patch)
- [~] push remote: **brak origin**

## Program FINAL

| # | Check | Status |
|---|--------|--------|
| 1 | DoD 1–9 (z notami ~) | **PASS with notes** |
| 2 | cmd → handbook → hop Commander | **PASS** |
| 3 | brak pełnego global-rules na cmd | **PASS** |
| 4 | learning split | **PASS** |
| 5 | Conflicts: 0 | **PASS** |
| 6 | PARK nietknięty | **PASS** |
| — | meta.next ≠ VCMS-VIDEO | **PASS** (IDLE-POST-KNOW-02) |

## Tips

flex-vcms: post-VERIFY PR; jadzia `cd6a0aa`+; vibe/OS/UI lokalnie.
