---
status: "[CANONICAL]"
title: "VCMS Demo Script — 75 seconds"
date: "2026-06-16"
---

# VCMS Demo Script (75s)

Founder recording for portfolio (`videos.vcms` in `services` proof manifest).

## Setup (before record)

- Laptop, terminal, browser
- `cd flex-vcms && npm run scan` (fresh output)
- Optional: `npm start` → `http://localhost:8001/`
- Close notifications; zoom 100%

## Timeline

| Sec | Visual | Say |
|-----|--------|-----|
| 0–8 | Owner ecosystem map (services or `map.md`) | „Most people see the website. This is the governance layer behind it — eight repos, one system.” |
| 8–20 | Dashboard — Ecosystem tab or stat strip | „VCMS shows scan coverage, repo count, and whether we're in local or remote ops mode.” |
| 20–35 | Terminal: `npm run scan` → Conflicts: 0 | „One command scans every repo and writes a conflict report — before anything ships.” |
| 35–50 | Open `conflicts.md` + optional `conflict-example.md` | „When something drifts — duplicate todos, missing guardrails — it gets flagged. Here's what a conflict looks like.” |
| 50–62 | Agent OS screenshot or handoff folder | „AI doesn't publish alone. The system proposes; a human approves — in Agent OS and in every handoff.” |
| 62–75 | Back to dashboard or map | „For clients: fewer surprises, controlled changes, documented handover — not one person's memory.” |

## Words to avoid

- „Enterprise-grade”, „fully autonomous”, „AI replaces developers”
- „LLM gateway” (disabled in VCMS)

## After recording

1. Upload Loom/Vimeo (unlisted OK)
2. In `services/src/content/proof.ts`: set `videos.vcms.url` and `ready: true`
3. Redeploy services (manual)

## Related

- [VCMS_SALES_REPORT.md](../VCMS_SALES_REPORT.md) §5
- [SCAN-REPORT.md](./SCAN-REPORT.md)
