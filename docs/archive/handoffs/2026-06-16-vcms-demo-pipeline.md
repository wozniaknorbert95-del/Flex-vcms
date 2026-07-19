---
date: "2026-06-16"
task: "VCMS-VIDEO pipeline — Enterprise ASS build"
status: "DONE"
---

# Handoff — Automated Demo Video Pipeline

## CO zrobiono

| Artefakt | Opis |
|----------|------|
| `tools/build-demo.js` | ASS generator + FFmpeg 1080p normalize + ambient mix |
| `docs/demo/demo-config.json` | Elastyczne timingi napisów (EN B2B) |
| `npm run build:demo` | Jedna komenda build |
| `docs/VCMS_DEMO_SCRIPT.md` | Zaktualizowany pod pipeline bez głosu |
| devDeps | `ffmpeg-static`, `@ffprobe-installer/ffprobe`, `fluent-ffmpeg` |
| `tests/build-demo.test.js` | 3 testy ASS/config |

## Weryfikacja

- `npm test` → 9/9 PASS
- Smoke: 2560×1440 input → `final-portfolio-demo.mp4` 1920×1080, 8 ASS events, audio bed

## NASTĘPNY KROK (Dowódca)

1. Nagraj prawdziwe `docs/demo/input.mp4` (~75s, choreografia w `VCMS_DEMO_SCRIPT.md`)
2. Dostosuj `"time"` w `demo-config.json`
3. Opcjonalnie: `docs/demo/ambient.mp3`
4. `npm run build:demo` → upload → `proof.ts`
