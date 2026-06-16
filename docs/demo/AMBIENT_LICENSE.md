# Demo ambient audio — license

## Track used in `final-portfolio-demo.mp4`

| Field | Value |
|-------|--------|
| **Title** | VCMS Demo Ambient Bed (synthetic) |
| **Source** | Generated locally via `ffmpeg` lavfi (`sine` + `anoisesrc` brown noise) |
| **Author** | FlexGrafik VCMS pipeline |
| **License** | Original composition — no third-party copyright. Safe for portfolio / B2B demo. |
| **Regenerate** | See command in `tools/fetch-demo-ambient.ps1` |

## Usage

- File path: `docs/demo/ambient.mp3` (gitignored — regenerate before `npm run demo:all`)
- Mixed at `ambientVolume` from `docs/demo/demo-config.json` (default `0.12`)
- Fade in/out applied in `tools/build-demo.js`

## Alternative (manual)

You may replace `ambient.mp3` with any royalty-free instrumental track. Update this file with title, author, URL, and license terms.
