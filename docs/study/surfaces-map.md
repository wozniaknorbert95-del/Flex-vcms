---
status: "[ACTIVE]"
title: "Mapa powierzchni — kiedy czego używać"
updated: "2026-07-19"
gate: "ECO-POLISH-01"
---

# Mapa powierzchni

Jedna strona: **gdzie jesteś** i **co otworzyć**.

| Potrzeba | Otwórz | Auth |
|----------|--------|------|
| Priorytety dnia / lead / Marketing HITL | [COI Commander](https://api.zzpackage.flexgrafik.nl/commander/) | TG `/commander` lub JWT |
| Docs, scan, KODA, ten handbook | [VCMS cmd](https://cmd.flexgrafik.nl/) → Baza Wiedzy | Basic Auth |
| Misja agenta / approve diff | [Agent OS](https://os.flexgrafik.nl/) | Basic Auth |
| Zakup klienta | [Wizard](https://zzpackage.flexgrafik.nl/wizard/) | — |

## Zasada

- **Commander** = hub operacyjny dnia (UI na `api.zzpackage…`, **nie** na cmd).
- **cmd** = governance + Knowledge Base (ta dokumentacja).
- Instrukcja Commandera: [COI Commander — ops handbook](./coi-commander-ops-handbook.md).

## Archive (nie czytaj default)

- `docs/archive/**` = cold history (PH4, Phase3, journal/lab, stare handoffs).
- **Nie** w LIVE sidebar/nav; VitePress `srcExclude` — nie buduje się do `/docs/`.
- Szukaj tylko gdy dochodzisz evidence z handoffa / gita — nigdy jako entrypoint sesji.

## Learning (nie mylić)

| Track | Gdzie (SoT) | Na cmd |
|-------|-------------|--------|
| Skill map T1–T7 | vibe-coach `docs/study-index.md` | [pointer](./study-index.md) |
| AI MBA W00–W52 | jadzia-core `docs/learning/` | [AI OS Knowledge](/ecosystem/ai-os-knowledge) |
