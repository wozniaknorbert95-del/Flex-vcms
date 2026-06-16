---
status: "[STABLE]"
title: "VCMS Manifesto � dlaczego ten system istnieje"
updated: "2026-04-09"
---

# VCMS Manifesto

**VCMS** (Vibe Coding Mastery System) to **lokalny system operacyjny** do pracy z AI nad ekosystemem FlexGrafik: regu?y, checklisty i artefakty, kt�re utrzymuj? porz?dek mi?dzy sesjami � nie kolejny kurs.

## Trzy zasady

1. **Jedno ?r�d?o prawdy** � brain + todo + handoff na modu?; reszta to mirror lub archiwum.
2. **Jedna sesja = jeden modu? = jeden diff** (1-1-1); deploy zawsze r?cznie przez Dow�dc?.
3. **Koniec sesji = handoff** � bez raportu wiedza ginie; `SESSIONANCHOR` + `NEXT` = jedna rzecz.

## Co VCMS robi w praktyce

- **Dokumentacja** (VitePress) � SOP, playbooki, zasady, profile agent�w.
- **Orchestrator** � `node tools/vcms-scan.js` ? indeks, mapa, konflikty, strony repo (w tym sam **flex-vcms** w `repos.yaml`).
- **KODA** � mentor w przegl?darce (opcjonalnie backend AI).

## Gdzie zacz??

- Start: [Poradnik u?ytkownika](/PORADNIK_UZYTKOWNIKA)
- Zasady: [Global Rules](/core/global-rules)
- Chaos: [If lost](/if-lost)
- Skan: [Quickstart](/core/quickstart)

## Ekosystem

?cie?ki modu?�w i canonical brain/todo: `repos.yaml`. Plan pi?ciu faz: [plan ekosystemu](/plans/flex-vcms-ecosystem-5-phase-plan).
