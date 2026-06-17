---
session: "Cleanup Session 1 — Inventory & Candidates"
mode: "Conservative (Requires Proof of Unused)"
date: "2026-06-17"
scan_status: "Conflicts: 0 ✅"
---

# Cleanup Session 1 — Candidates Inventory

## Overview

Inventory scan completed. **Mode: Conservative** — only candidates with hard evidence of being unused.
Scanning for: dead tools, exposed secrets, orphaned files, unused docs, deprecated scripts.

---

## 🚨 CRITICAL — Secrets Found

### Candidate: `.env` and `.env.keys`

| Field | Evidence |
|-------|----------|
| **What** | `.env` and `.env.keys` files in repo root |
| **Problem** | Contains encrypted API keys (GEMINI_API_KEY, OPENROUTER_API_KEY) |
| **Location** | Root: `.env:8,10` and `.env.keys:1,7` |
| **Status in .gitignore?** | Should be in `.gitignore` already (standard Node practice) |
| **Evidence** | - Secrets in plaintext matching `GEMINI_API_KEY`, `OPENROUTER_API_KEY` |
| **Risk** | **HIGH** — If accidentally committed, keys are exposed |
| **Action** | ✅ Must verify `.env` and `.env.keys` in `.gitignore`; if tracked, remove from history (BFG/git-filter). Today: record finding + confirm gitignore. |
| **Next** | Do NOT execute history rewrite in this session (requires Dowódca approval) |

---

## 📦 Dead Tools & Unused Scripts

### Candidate: `tools/remote-sync-helper.js`

| Field | Evidence |
|-------|----------|
| **What** | Tool file in `tools/remote-sync-helper.js` |
| **Problem** | No references found anywhere in the codebase |
| **Checked** | Searched all `.js`, `.json`, `package.json` scripts, docs, handoffs for imports/calls |
| **Result** | Zero references to `remote-sync-helper` or its functions |
| **Location** | `tools/remote-sync-helper.js` (11.2 KB) |
| **Evidence** | `grep` output: no matches in repo (except this finding doc) |
| **Decision** | **Candidate for removal** — no active code path uses it |
| **Risk** | LOW — removing unused helper won't break anything |

---

## 📄 Dead & Orphaned Documentation

### Candidate: `docs/archive/setup-structure.js`

| Field | Evidence |
|-------|----------|
| **What** | JavaScript file in `docs/archive/` (should be markdown or doc) |
| **Problem** | Mixed media type; appears to be scaffolding from old setup, not active docs |
| **Location** | `docs/archive/setup-structure.js` |
| **Evidence** | File is `.js` in a docs folder (uncommon), contains placeholder comments referencing old agents (Gemini CLI, Antigravity) |
| **Decision** | **Candidate for removal** — old scaffolding, no references in active code |
| **Risk** | LOW — docs/archive is already isolated from active code |

### Candidate: `docs/archive/vibe-code-website-plan.txt`

| Field | Evidence |
|-------|----------|
| **What** | Plan file in `docs/archive/` |
| **Problem** | Plain `.txt` file (no `.md`), references "vibe-code website" — not in active repos or scope |
| **Location** | `docs/archive/vibe-code-website-plan.txt` |
| **Evidence** | Filename + archive folder + no references in `repos.yaml` or active backlog |
| **Decision** | **Candidate for removal** — archived, out of scope |
| **Risk** | LOW — already in archive |

### Candidate: `docs/archive/todo-10-orphan.json` and `docs/archive/todo-root-legacy-2026-04-04.json`

| Field | Evidence |
|-------|----------|
| **What** | Legacy TODO backlog files |
| **Problem** | Orphaned, superseded by `flex-vcms-todo.json` |
| **Location** | `docs/archive/todo-10-orphan.json`, `docs/archive/todo-root-legacy-2026-04-04.json` |
| **Evidence** | Filenames indicate "legacy", archive folder, no active references in scripts/workflows |
| **Decision** | **Candidate for removal** — superseded by canonical `flex-vcms-todo.json` |
| **Risk** | LOW — backups exist in git history |

### Candidate: `docs/archive/ph4-011-antigravity-execution-plan.md`

| Field | Evidence |
|-------|----------|
| **What** | Plan for deprecated "Antigravity" stack |
| **Problem** | References old tech stack (Antigravity, Gemini CLI) — migrated to OpenCode + Cursor + OpenRouter |
| **Location** | `docs/archive/ph4-011-antigravity-execution-plan.md` |
| **Evidence** | Content says "Antigravity items cancelled" + archive folder + no active references in current workflows |
| **Decision** | **Candidate for removal** — superseded by current stack, already archived |
| **Risk** | LOW — historical only, git history preserved |

### Candidate: Untracked file `szlif pod portfolio/audit-findings.md`

| Field | Evidence |
|-------|----------|
| **What** | Untracked directory + file: `szlif pod portfolio/audit-findings.md` |
| **Problem** | Appears in `git status --porcelain` as untracked (`??`), not in `.gitignore` |
| **Location** | Root: `szlif pod portfolio/audit-findings.md` |
| **Evidence** | `git status` output: `?? "szlif pod portfolio/audit-findings.md"` |
| **Decision** | Depends on Dowódca: keep as WIP or add to `.gitignore` and clean? For now: **hold** — not in active tracking, mark for discussion |
| **Risk** | LOW — local WIP, check with Dowódca if should be persisted or gitignored |

---

## 🛠 Dependency & Package Hygiene

### Finding: `ffmpeg` and `ffprobe` binaries in `node_modules`

| Field | Evidence |
|-------|----------|
| **What** | Large binary files: `ffmpeg.exe` (78.96 MB), `ffprobe.exe` (77.24 MB) |
| **Location** | `node_modules/@ffprobe-installer/win32-x64/ffprobe.exe`, `node_modules/ffmpeg-static/ffmpeg.exe` |
| **Problem** | These are dev dependencies pulled during install; not tracked in repo (already in `.gitignore`), but do not commit `node_modules` |
| **Status** | ✅ OK — these are in `node_modules`, which is gitignored. No action needed for cleanup today. |

---

## 📋 Untracked/Ignored Files Summary

Output of `git clean -ndX` (dry-run of ignored files):
- `.cursor/` — IDE config (should stay in `.gitignore`) ✅
- `.env` — secrets (should stay in `.gitignore`) ✅
- `.env.keys` — secrets (should stay in `.gitignore`) ✅
- `.opencode/` — local config (should stay in `.gitignore`) ✅
- `data/README.md`, `data/governance-audit.jsonl`, `data/vcms.db` — local runtime (should stay in `.gitignore`) ✅
- `docs/.vitepress/cache/`, `docs/.vitepress/dist/` — build artifacts (should stay in `.gitignore`) ✅
- `docs/demo/` media files — build outputs (should stay in `.gitignore`) ✅
- `logs/` — runtime logs (should stay in `.gitignore`) ✅
- `node_modules/` — dependencies (should stay in `.gitignore`) ✅

**All ignored files are correctly in `.gitignore`.** ✅ No action needed.

---

## 🗑 Untracked Files Not in `.gitignore`

### Finding: Modified tracked files

Output of `git status --porcelain`:
- `data/vcms-index.json` — ✅ Generated by scan, expected to be dirty
- `deploy-context/conflicts-snapshot.json` — ✅ Generated, expected dirty
- `docs/ecosystem/*` — ✅ Generated by scan, expected dirty

**All are from `vcms-scan.js` output — normal state.** ✅ No cleanup action needed.

---

## Summary Table: Candidates for Removal (Conservative Mode)

| File/Dir | Size | Type | Evidence | Priority |
|----------|------|------|----------|----------|
| `tools/remote-sync-helper.js` | 11 KB | Dead Tool | No references in repo | MEDIUM |
| `docs/archive/setup-structure.js` | ~5 KB | Dead Docs | Old scaffolding, refs to deprecated agents | LOW |
| `docs/archive/vibe-code-website-plan.txt` | ~2 KB | Dead Docs | Out-of-scope, .txt in docs | LOW |
| `docs/archive/todo-10-orphan.json` | ~3 KB | Dead Docs | Superseded by `flex-vcms-todo.json` | LOW |
| `docs/archive/todo-root-legacy-2026-04-04.json` | ~5 KB | Dead Docs | Legacy, superseded | LOW |
| `docs/archive/ph4-011-antigravity-execution-plan.md` | ~8 KB | Dead Docs | Migrated stack, archived | LOW |

---

## 🔐 Secrets Security Check

**Status:** `.env` and `.env.keys` are protected (gitignored).
**Action:** Verify they remain in `.gitignore`. If ever added to staging, immediate remediation required.

---

## ✅ Definition of Done (Cleanup Inventory Phase)

- [x] Scan executed: Conflicts: 0
- [x] Secrets scanned: `.env`/`.env.keys` found (already protected)
- [x] Dead code identified: `tools/remote-sync-helper.js` (no refs)
- [x] Orphaned docs cataloged: 5 files in `docs/archive/`
- [x] Build artifacts: all correctly gitignored
- [x] Candidate table generated with evidence
- [ ] Dowódca approval for removals (next step)

---

## Next Step (Await Dowódca Decision)

1. **Do you approve removal of candidates listed above?** (Require explicit yes/no)
2. **Should `szlif pod portfolio/` be added to `.gitignore` or kept as WIP?**
3. **Once approved: execute atomic commits** (chore(cleanup): ...) per candidate.

**No code changes until approval received.**

---

## Execution Plan (When Approved)

**Commit 1:** `chore(cleanup): remove unused tools/remote-sync-helper.js`
- Evidence: No references in repo code or docs
- Impact: Zero — tool not called anywhere

**Commit 2:** `chore(cleanup): remove legacy docs from docs/archive/`
- Files: `setup-structure.js`, `vibe-code-website-plan.txt`, `todo-10-orphan.json`, `todo-root-legacy-2026-04-04.json`, `ph4-011-antigravity-execution-plan.md`
- Evidence: All in `docs/archive/` (isolated); superseded or out-of-scope
- Impact: Zero — no active references

**Commit 3:** `chore(git): verify .env/.env.keys in .gitignore` (if needed)
- Verify `.env` and `.env.keys` are in `.gitignore`
- If missing, add immediately

---

**Awaiting approval. Session paused at Inventory phase.**
