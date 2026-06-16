---
date: "2026-06-16"
session: "VCMS-VIDEO — Dowódca (DEFERRED)"
audience: "Norbert Wozniak"
status: "READY TO RECORD"
---

# Handoff — Video demo 75s (ostatnia faza)

## Warunek startu — SPEŁNIONY

VCMS polish (P2-01..04, P1 docs) zakończony. Swiss Watch gate 10/10.

**Video nie blokuje już pracy developerskiej** — to jedyny krok do DoD §D FULL GO.

## Narzędzie nagrywania (dowolne)

| Tool | OK? |
|------|-----|
| Loom | Tak — najszybszy embed |
| Vimeo / YouTube unlisted | Tak |
| OBS / ShareX / Win+G | Tak — upload potem embed URL |
| Chrome DevTools Recorder | Tak — krótkie klipy |

DoD wymaga **treści** z [`VCMS_DEMO_SCRIPT.md`](../VCMS_DEMO_SCRIPT.md), nie konkretnego vendora.

## Checklist przed nagraniem (5 min)

- [ ] `npm run scan` → Conflicts: 0
- [ ] Hard refresh `https://cmd.flexgrafik.nl` — SSoT Conflicts = 0
- [ ] Terminal + browser przygotowane (skrypt timeline)
- [ ] [`hitl-demo.md`](../demo/hitl-demo.md) — handoff folder lub Agent OS

## Po nagraniu

1. Upload → skopiuj **embed URL**
2. `services/src/content/proof.ts`:
   ```ts
   vcms: { url: "https://...", duration: "75s", poster: null, ready: true }
   ```
3. Redeploy services (Zasada 11)
4. Zaktualizuj `VCMS_DOD_SCORECARD.md` §D → **GO**
5. `flex-vcms-todo.json` → `VCMS-VIDEO` status DONE

## W nagraniu

**Pokazuj:** mapa → dashboard (Conflicts 0) → `npm run scan` → conflicts.md → HITL handoff

**Unikaj:** KODA chat, Run Scan na prod, metryki LLM
