---
status: "[DEMO — synthetic fixture]"
title: "Conflict example — DUPLICATE_TODO (demo)"
date: "2026-06-16"
---

# Conflict example (synthetic)

> **To jest fixture demonstracyjny** — nie odzwierciedla aktualnego stanu ekosystemu.  
> Live scan: `npm run scan` → [`conflicts.md`](../ecosystem/conflicts.md) (obecnie **Conflicts: 0**).

## Scenario

Dwa repozytoria deklarują ten sam `task_id` z różnym statusem w canonical backlogach.

## Sample output (Markdown)

```markdown
## DUPLICATE_TODO — blocking (demo)

| Field | Value |
|-------|-------|
| task_id | `WIZ-042` |
| repo_a | zzpackage.flexgrafik.nl — status: `IN_PROGRESS` |
| repo_b | flexgrafik-nl — status: `DONE` |
| severity | **blocking** (planned — today binary) |
| recommendation | Align status in canonical `audit-todo.json` / `todo.json`; re-run scan |

### Why it matters

A client-facing deploy could ship wizard copy that contradicts portal messaging — caught before merge, not after production.
```

## How to show in demo

1. Explain that live ecosystem currently shows **0 conflicts** (healthy).
2. Open this file to show **what VCMS would flag** when drift occurs.
3. Say: *„The system proposes a fix; a human approves what ships.”*

## Related

- [SCAN-REPORT.md](./SCAN-REPORT.md)
- [governance-audit-log-sample.md](./governance-audit-log-sample.md)
