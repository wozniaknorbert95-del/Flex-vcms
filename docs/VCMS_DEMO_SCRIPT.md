---
status: "[CANONICAL]"
title: "VCMS Demo Script — 75 seconds (subtitle pipeline)"
date: "2026-06-16"
---

# VCMS Demo Script (75s) — No voice, burned-in subtitles

Portfolio video for `videos.vcms` in `services` proof manifest. **No microphone** — English subtitles are burned in automatically via the ASS pipeline.

## Quick start (automated — no manual recording)

1. **One command** (Playwright capture + ASS burn-in):
   ```powershell
   cd flex-vcms
   npx playwright install chromium   # once per machine / after playwright upgrade
   npm run demo:all
   ```
   Outputs:
   - `docs/demo/input.mp4` — raw 1080p screen capture (~66–75s)
   - `docs/demo/final-portfolio-demo.mp4` — portfolio-ready (subtitles + ambient bed)

2. **Tune timings** (optional) in [`demo-config.json`](./demo/demo-config.json) — adjust each `"time": [start, end]` if you change choreography in `tools/record-demo.js`.

**Rebuild only** (skip re-record): `npm run build:demo` (requires existing `input.mp4`).

Optional ambient bed: run `powershell tools/fetch-demo-ambient.ps1` or see [`AMBIENT_LICENSE.md`](./demo/AMBIENT_LICENSE.md). File: `docs/demo/ambient.mp3` (gitignored).

## Demo v2 checklist (terminal UI + EN locale)

Before `npm run demo:all`:

- [ ] Terminal theme visible at `http://127.0.0.1:8001/` (`theme-terminal.css`)
- [ ] English UI for capture: recorder opens `?locale=en` automatically (`VCMS_DEMO_LOCALE`)
- [ ] Subtitles: Arial **40px**, outline 2 — see `demo-config.json` → `style`
- [ ] Ambient: `docs/demo/ambient.mp3` present (regenerate via `tools/fetch-demo-ambient.ps1`)

Daily Dowódca UI stays Polish (default `?locale=pl` or no query).

## Prerequisites (agent / CI)

- VCMS reachable at `http://127.0.0.1:8001` (script starts server if needed)
- `npm run scan` runs automatically before capture
- KODA: `OPENROUTER_API_KEY` in `.env` for live chat reply in the Lab tab

## Choreography (what to show)

| Block | Action |
|-------|--------|
| Dashboard | Ecosystem strip (8 repos), Context Health, SSoT Conflicts = 0 |
| Terminal | `npm run scan` → wait for `Conflicts: 0` |
| Proof | Action Log (JSONL) or `docs/ecosystem/conflicts.md` |
| KODA | Tab KODA → ask "How many repos?" → show reply |
| Boundary | Click **Agent Boundaries** (VCMS = governance, Agent OS = execution) |

## Subtitle copy (English B2B)

Edit text in `docs/demo/demo-config.json` → `subtitles[]`. Default lines:

1. Most see the website. This is the governance layer behind it.
2. VCMS orchestrates 8 repositories, enforcing a Single Source of Truth.
3. Before any deployment, a system-wide scan is executed.
4. It detects code drifts across canonical brains, backlogs, and guardrails.
5. Zero conflicts means we are clear to ship. Every action is secured in the audit log.
6. KODA, our read-only RAG assistant, analyzes the ecosystem context in real-time.
7. But AI doesn't publish autonomously. The system proposes; a human approves.
8. Fewer surprises. Controlled changes. Documented handovers.

## Pipeline (technical)

| Step | Tool |
|------|------|
| Screen capture | `tools/record-demo.js` (Playwright → `input.mp4`) |
| Full pipeline | `npm run demo:all` (= record + build) |
| Config | `docs/demo/demo-config.json` |
| ASS generation | `tools/build-demo.js` (in-memory → `.generated-subtitles.ass`) |
| Normalize | FFmpeg `scale` + `pad` → 1920×1080 |
| Subtitles | FFmpeg `ass` filter (BorderStyle 3, Arial 40px, marginV 60) |
| Audio | `ambient.mp3` @ 0.12 + fade in/out; fallback pink noise |
| FFmpeg binary | `ffmpeg-static` + `@ffprobe-installer/ffprobe` (npm, no system PATH) |

Custom config path:

```powershell
node tools/build-demo.js --config docs/demo/demo-config.json
```

## Words to avoid (on-screen copy / portfolio)

- "Enterprise-grade", "fully autonomous", "AI replaces developers"
- Fake metrics or Run Scan on prod VPS

## After build

1. Upload `final-portfolio-demo.mp4` to Vimeo / YouTube (unlisted) or self-host
2. `services/src/content/proof.ts`: `videos.vcms.url` + `ready: true`
3. Redeploy services (manual — Zasada 11)
4. `VCMS_DOD_SCORECARD.md` §D → GO

## Related

- [demo-config.json](./demo/demo-config.json)
- [VCMS_SALES_REPORT.md](/VCMS_SALES_REPORT) §5
- [SCAN-REPORT.md](./demo/SCAN-REPORT.md)
- [hitl-demo.md](./demo/hitl-demo.md)
