---
status: "[DEMO — fixture, not production log]"
title: "Governance audit log — sample events"
date: "2026-06-16"
---

# Governance audit log (sample)

> **DEMO fixture** — ilustruje docelowy format Audit Event Export (roadmap 30d).  
> Produkcja dziś: handoffy markdown + `docs/audits/latest-verification.md` (ops security).

## Format (planned: JSONL)

Each line = one event: `timestamp`, `actor`, `action`, `target`, `reason`, `evidence`.

```jsonl
{"ts":"2026-06-16T08:40:17Z","actor":"vcms-scan","action":"ECOSYSTEM_SCAN","target":"8 repos","reason":"scheduled weekly review","evidence":"docs/ecosystem/conflicts.md","conflicts":0}
{"ts":"2026-06-16T07:00:00Z","actor":"weekly-audit","action":"PROD_VERIFY","target":"cmd.flexgrafik.nl","reason":"PH4-018 cron","evidence":"docs/audits/latest-verification.md","result":"12 PASS"}
{"ts":"2026-06-16T06:57:26Z","actor":"deploy","action":"CONTEXT_BUNDLE_SWAP","target":"deploy-context","reason":"Deploy-VPS.ps1 post-P0","evidence":"deploy-context/manifest.json"}
{"ts":"2026-06-16T06:30:00Z","actor":"dowodca","action":"HANDOFF_CLOSED","target":"P0-portfolio-honesty","reason":"session complete","evidence":"docs/handoffs/2026-06-16-p0-portfolio-honesty.md"}
```

## Markdown view (for portfolio)

| When | Who | What | Why |
|------|-----|------|-----|
| 2026-06-16 08:40 | vcms-scan | Ecosystem scan (8 repos) | Weekly SSoT check — 0 conflicts |
| 2026-06-16 07:00 | weekly-audit | Prod security verify | PH4-018 — PASS |
| 2026-06-16 06:57 | deploy | Context bundle swap | Post-P0 deploy |
| 2026-06-16 06:30 | dowódca | Handoff P0 closed | Portfolio honesty sprint |

## Portfolio disclaimer

Use with caption: *Sample governance events — production trail is handoffs + scan artifacts today; JSONL export on roadmap.*
