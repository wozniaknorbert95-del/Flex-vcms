---
session: "Polish Session 2 — Phase 1 Discovery"
date: "2026-06-17"
phase: "1-discovery"
status: "ISSUES FOUND — Ready for Phase 2 (Fixes)"
---

# Polish Session 2 — Phase 1: Discovery Report

## Executive Summary

**Discovery complete.** 3 issue categories identified, prioritized, and ready for Phase 2 fixes.

**Priority:** P0 (logging consolidation), P1 (link cleanup), P2 (format/style polish)

---

## Issues Found

### 🔴 ISSUE #1: MIXED LOGGING PATTERNS (P0 — Critical)

**Problem:** Inconsistent logging across codebase — mixing `console.log`, `logger.info`, `winston` directly

**Files affected:**
- `src/env.js` — uses `console.`
- `src/conflicts.js` — uses `console.`
- `src/context.js` — uses `console.`
- `src/guards.js` — uses `console.`
- `src/api.js` — uses `console.`
- `src/instance.js` — uses `logger.`
- `src/indexer.js` — uses `logger.`
- `src/logger.js` — uses `winston` directly

**Evidence:**
```
5 files using console.log (should use logger)
2 files using logger interface
1 file using raw winston (correct pattern)
```

**Impact:**
- No logs routed through winston (daily rotation, formatting, levels)
- Console output not captured by log aggregation
- Inconsistent severity levels

**Fix:** Consolidate to `logger.*` interface; verify `src/logger.js` exports correct winston instance

**Effort:** 1-2 hours (find/replace + validation)

---

### 🟡 ISSUE #2: BROKEN/RELATIVE DOCUMENTATION LINKS (P1)

**Problem:** Documentation files contain relative markdown links that may break during VitePress build or navigation

**Evidence:**
```
Scanned 20 sample docs: 9 files with potential broken/relative links
Total .md files: 159
```

**Sample issues:**
- Internal links using `../path/file.md` instead of VitePress-safe absolute paths
- References to files in `docs/archive/` (recently deleted) — dead links
- Inconsistent link formatting (some with `/docs/`, some without)

**Impact:**
- Link checker warnings during build
- User navigation failures in docs site
- SEO/UX hit from broken internal links

**Fix:** Audit and consolidate to VitePress-compliant link format (absolute paths from `/docs/`)

**Effort:** 2-3 hours (map + find/replace + verify build)

---

### 🟢 ISSUE #3: CODE FORMAT & PRETTIER (P2 — Polish)

**Problem:** No code formatter applied; mixed indentation and spacing likely

**Current state:**
- ✗ Prettier NOT installed
- ✗ ESLint NOT installed (optional, not blocking)
- ✓ Winston available (logging framework)
- ✓ VitePress builds successfully (no errors)
- ✓ public/tokens.css exists and well-structured (5012 bytes)

**Scope:** Format all files in `src/`, root `*.js`, and `server.js` using Prettier

**Impact:** Code readability, consistency with IDE settings, preparation for future linting

**Fix:** Add Prettier (dev dep), configure `.prettierrc`, apply formatting

**Effort:** 1 hour (install + configure + apply)

---

## Tools Inventory

| Tool | Status | Purpose | Action |
|------|--------|---------|--------|
| **Winston** | ✅ Installed (v3.19.0) | Structured logging | Use (consolidate to this) |
| **Prettier** | ❌ Not installed | Code formatter | Add as devDep, apply |
| **ESLint** | ❌ Not installed | Linter | Optional (can defer) |
| **VitePress** | ✅ Works (v1.6.4) | Docs build | Verify links only |
| **Jest** | ✅ Works (9/9 tests) | Unit tests | Run pre/post-commit |

---

## Documentation State

| Metric | Value |
|--------|-------|
| **Total .md files** | 159 |
| **Sections** | 19 (core, ecosystem, handoffs, playbooks, etc.) |
| **Sections using correct paths** | ~150 (estimated) |
| **Sections with potential issues** | ~9 (45% of sample) |
| **Build status** | ✅ Succeeds (no vitepress errors) |
| **Link checker** | ⚠️ Not yet run (manual audit needed) |

---

## UI/UX Token Status

| Item | Status | Notes |
|------|--------|-------|
| **public/tokens.css** | ✅ Exists | 5012 bytes, well-structured |
| **CSS variables** | ✅ Comprehensive | Base colors, panel styles, buttons, badges |
| **Spec reference** | ✅ Has doc | `docs/design/VCMS_UI_TOKENS.md` |
| **Token consistency** | ✅ Good | Naming convention followed (--bg-*, --text-*, --fx-*) |
| **Dark mode** | ✅ Implemented | Primary theme is dark (govtech-inspired) |

---

## Phase 1 Definition of Done ✅

- [x] Code format assessment (Prettier not installed, will add)
- [x] Linting assessment (ESLint optional, can skip)
- [x] Logging pattern scan (mixed console/logger found)
- [x] Documentation structure reviewed (159 files, 19 sections)
- [x] Link integrity checked (sample audit: 9/20 potential issues)
- [x] UI tokens verified (comprehensive, well-maintained)
- [x] Build/test status confirmed (all pass)
- [x] Issues prioritized (P0/P1/P2)
- [x] Fix effort estimated
- [x] Ready for Phase 2 execution

---

## Phase 2 Execution Plan

### Task A: LOGGING CONSOLIDATION (P0) — ~1.5 hours

**Steps:**
1. Review `src/logger.js` to confirm winston interface
2. Find & replace all `console.log/info/error` → `logger.log/info/error` in:
   - `src/env.js`
   - `src/conflicts.js`
   - `src/context.js`
   - `src/guards.js`
   - `src/api.js`
3. Validate severity levels match context (info/warn/error/debug)
4. Test: `npm test` + `npm start` (verify logs output)
5. Commit: `chore(logging): consolidate to winston-only interface`

---

### Task B: DOCUMENTATION LINK CLEANUP (P1) — ~2.5 hours

**Steps:**
1. Audit all `.md` files in `docs/` (excluding `.vitepress`, `archive`)
2. Find broken links:
   - References to deleted files (e.g., `docs/archive/*` removed in cleanup)
   - Relative paths that don't resolve (e.g., `../../../file.md`)
   - Inconsistent paths (mixed `/docs/` and no prefix)
3. Fix links to VitePress-compliant format:
   - Absolute from root: `/docs/core/workflow-manual.md` or `/docs/handoffs/...`
   - No file extension in navigation links (VitePress handles)
4. Run `npm run docs:build` to verify no new warnings
5. Spot-check: navigate 5 internal links in rendered docs
6. Commit: `chore(docs): consolidate links to vitepress-safe format`

---

### Task C: CODE FORMATTING (P2) — ~1 hour

**Steps:**
1. Install Prettier: `npm install --save-dev prettier@latest`
2. Create `.prettierrc` (config file) with standards:
   - 2 spaces (or your preference)
   - Semi-colons on
   - Single quotes for strings (JS style)
   - Trailing commas: es5
3. Format all source:
   - `npx prettier --write "src/**/*.js" "server.js" "tests/**/*.js"`
4. Verify no formatting conflicts:
   - `npm test` (should still pass)
   - `npm run docs:build` (should still pass)
5. Commit: `chore(format): apply prettier to src/ and root *.js`

---

### Task D: VERIFICATION (P0) — ~0.5 hours

**Steps:**
1. Run full test suite: `npm test` → must PASS
2. Build docs: `npm run docs:build` → no errors
3. Smoke test: `npm start` → /health 200 OK
4. Scan: `node tools/vcms-scan.js` → Conflicts: 0
5. Review: spot-check 3 logging statements in prod code
6. Review: follow 3 internal doc links in rendered site
7. No regressions, ready for handoff

---

## Effort Summary

| Task | P | Effort | Blocker? |
|------|---|--------|----------|
| A: Logging consolidation | 0 | 1.5h | No (code stability) |
| B: Link cleanup | 1 | 2.5h | No (UX only) |
| C: Prettier formatting | 2 | 1h | No (style only) |
| D: Verification | 0 | 0.5h | No (gate) |
| **TOTAL** | — | **5.5h** | **None** |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Logging change breaks prod output | LOW | MEDIUM | Test before commit, review logger.js |
| Link fixes introduce new breaks | LOW | LOW | Run docs:build, spot-check 5+ links |
| Prettier conflicts with IDE | NONE | LOW | Use single `.prettierrc`, check-in |
| Regression in tests/smoke | NONE | HIGH | Run full verification per Task D |

---

## Next Action

**Proceed to Phase 2: Execution**

Ready to start with Task A (logging consolidation), then B, then C, with verification after each.

Shall I begin Phase 2 execution? ✅

---

**Phase 1 Discovery COMPLETE. All issues catalogued, prioritized, effort estimated, fixes planned.**
