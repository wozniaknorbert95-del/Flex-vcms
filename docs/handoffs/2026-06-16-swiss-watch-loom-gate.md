---
date: "2026-06-16"
session: "Swiss Watch — Sesja 3 (Dowódca)"
audience: "Norbert Wozniak (Dowódca)"
status: "ACTION REQUIRED"
---

# Handoff — Loom 75s + services video (poza flex-vcms)

## Warunek startu

Swiss Watch Gate **10/10 TAK** na `https://cmd.flexgrafik.nl` — patrz `docs/checklists/vcms-prod-smoke.md`.

Agent **nie nagrywa** Loom — to zadanie Dowódcy.

## Zadanie 1: Loom 75s

1. Otwórz `docs/VCMS_DEMO_SCRIPT.md`
2. Nagraj ~75s pokazując:
   - `ecosystem/map` (Quick Access → System Map)
   - Dashboard (Ecosystem Mode, Context Health, brak toastów limitu)
   - Terminal laptop: `npm run scan` → `Conflicts: 0`
   - `docs/ecosystem/conflicts.md`
   - HITL: screenshot z `agent-os-ui` lub handoff markdown
3. **Nie pokazuj:** KODA chat, Run Scan na prod (disabled), metryki LLM

## Zadanie 2: repo `services`

Po uploadzie Loom:

1. Ustaw `videos.vcms.url` na URL Loom
2. Ustaw `ready: true` (lub odpowiednik w `VideoSlot.tsx` / config)
3. Deploy services na Vercel (osobna sesja, Zasada 11)

## Po zakończeniu

- Zaktualizuj `docs/VCMS_DOD_SCORECARD.md` §D → **GO**
- Werdykt portfolio: **FULL GO**
