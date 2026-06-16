# Handoff — VCMS Demo v2 (terminal UI + EN + subtitles + ambient)

**Date:** 2026-06-16  
**Module:** flex-vcms `public/` + demo pipeline  
**Status:** DONE

## Co zrobiono

### Faza 1 — Terminal UI
- `public/theme-terminal.css` — CLI frame (topbar dots, command nav, log-style panels)
- `public/index.html` — `.vcms-shell` / `.vcms-terminal` layout
- `public/tokens.css` — `--font-mono`, `--radius-terminal`, `--panel-terminal`
- `docs/design/VCMS_UI_TOKENS.md` — sekcja Terminal theme v2

### Faza 2 — Locale EN (demo only)
- `public/locale.js` + `public/locales/en.json` + `pl.json`
- `public/app.js` — `t()`, API `?locale=`
- `src/routes/api.js` — `uncleTipsEn`, `pickUncleTip(req)`
- `tools/record-demo.js` — `DEMO_URL` z `?locale=en`

### Faza 3 — Video pipeline
- `demo-config.json` — Arial 40px, outline 2, marginV 60, ambientVolume 0.12
- `tools/build-demo.js` — audio fade in/out
- `docs/demo/AMBIENT_LICENSE.md` + `tools/fetch-demo-ambient.ps1`

### Faza 4 — Nagranie v2
- `npm run demo:all` — SUCCESS
- `input.mp4`: 1920×1080, ~69s, ~3.5 MB
- `final-portfolio-demo.mp4`: ~69s, ~4 MB, ASS + ambient

## Komendy

```powershell
cd flex-vcms
powershell tools/fetch-demo-ambient.ps1   # jeśli brak ambient.mp3
npm run demo:all                          # pełny pipeline
npm run build:demo                        # tylko napisy + audio
```

Preview EN: `http://127.0.0.1:8001/?locale=en`

## Testy

`npm test` → 9/9 PASS

## Następny krok (Dowódca)

1. Obejrzeć `docs/demo/final-portfolio-demo.mp4`
2. Opcjonalnie dopisać własny CSS w `theme-terminal.css`
3. Upload video + `proof.ts` (manual deploy — Zasada 11)
