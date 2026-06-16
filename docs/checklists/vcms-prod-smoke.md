---
status: "[STABLE]"
title: "VCMS Command Center — smoke prod + rollback"
updated: "2026-06-16"
---

# VCMS Command Center — smoke (produkcja)

Checklista po deployu na VPS (Nginx → Node/PM2 na **8001**). Szczegóły architektury: [VPS runbook](/reference/vcms-vps-runbook).

Przykłady `curl` z Basic Auth z env (bez haseł w repo): [PH4-011 / smoke curl](/reference/ph4-011-smoke-curl).

**Czas:** docelowo poniżej 5 minut. Każdy punkt ma wynik **TAK / NIE**.

---

## Zanim zaczniesz

- [ ] Masz działający URL (HTTPS) i dane do **Basic Auth** z Nginx.
- [ ] Na serwerze PM2 pokazuje proces **`vcms-core`** jako `online` (`pm2 list` po SSH).

---

## Smoke — HTTP

Wykonaj z maszyny z dostępem do URL (lub przez `curl` z nagłówkiem auth):

- [ ] **`GET /health`** (bez auth, jeśli Nginx nie chroni wyjątku — u Ciebie zwykle całość za auth): odpowiedź **200**, JSON z polami `status`, `uptime`, `timestamp` (zgodnie z `server.js`).
- [ ] **Strona główna dokumentacji** (po zalogowaniu do Basic Auth): ładuje się HTML VitePress (brak komunikatu „Brak GUI…”).
- [ ] **`GET /api/knowledge`** (z limitem globalnym API): odpowiedź **200** (JSON kontekstu) lub **500** z ciałem `{"error":"..."}` — oba traktuj jako **świadomy** wynik serwera (ważne: nie timeout, nie 502 z Nginx bez proxowania).
- [ ] **`GET /api/v1/status`**: odpowiedź **200**, JSON z polami `status`, `uptime`, `knowledge`, `version` — **bez** pola `llm` (Swiss Watch SW-2).

Jeśli któryś krok kończy się **502/504**: sprawdź `pm2 logs vcms-core` i `nginx -t`.

---

## Swiss Watch UI (prod — `https://cmd.flexgrafik.nl`)

Po hard refresh (Ctrl+Shift+R). Każdy punkt **TAK / NIE**:

1. [ ] Dashboard **15+ min** otwarty — brak toastów „limit API”; uptime rośnie.
2. [ ] **Quick Access → User Guide** — Poradnik w zakładce Baza Wiedzy (iframe).
3. [ ] **Quick Access → Docs Home** — `/docs/` w iframe.
4. [ ] **Quick Access → System Map** — `ecosystem/map` w iframe.
5. [ ] **Governance → Portfolio Truth** — `VCMS_PORTFOLIO_TRUTH` w iframe.
6. [ ] **Governance → Readiness Audit** — `VCMS_READINESS_AUDIT` w iframe.
7. [ ] **Context Health** — ~14 pigułek, zielone LED (healthy).
8. [ ] **Ecosystem** — 8 repo **REMOTE**, konsola przeglądarki **0 errors**.
9. [ ] **Run Scan** — przycisk **disabled** na prod + tooltip „npm run scan” (SW-1).
10. [ ] **Laptop:** `npm run scan` → `Conflicts: 0` w `docs/ecosystem/conflicts.md`.

**Gate Loom:** 10/10 TAK → Dowódca nagrywa według `docs/VCMS_DEMO_SCRIPT.md`.

---

## Smoke — KODA (opcjonalnie)

Wymaga `OPENROUTER_API_KEY` lub `GEMINI_API_KEY` w `.env` na serwerze (chmod 600).

```bash
curl -u USER:PASS -X POST https://cmd.flexgrafik.nl/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","parts":[{"text":"Co to VCMS?"}]}]}'
```

Oczekiwane: `200` + `message.parts[0].text` lub kontrolowany `502` gdy brak/wadliwy klucz upstream.

---

## Rollback (gdy smoke FAIL)

1. Zatrzymaj ruch (opcjonalnie): wyłącz vhost lub zwróć `503` w Nginx.
2. Przywróć **poprzednią kopię** katalogu `docs/.vitepress/dist` (oraz ewentualnie `server.js` / `package.json` jeśli je zmieniano) z backupu na serwerze.
3. `cd` do `cwd` PM2 → `pm2 reload ecosystem.config.js --update-env`.
4. Powtórz sekcję smoke od **`/health`**.

Szczegół: [VPS runbook — Smoke, rollback](/reference/vcms-vps-runbook#smoke-rollback-incydenty).

---

## Następny krok (NEXT=1 — PH4-011)

Gdy cała sekcja smoke ma **TAK**: weryfikacja na **prawdziwym telefonie** (docs + KODA). Zapis wyniku: szablon [PH4-011 mobile (prod)](/templates/tmpl-ph4-011-mobile).

---

## Powiązane

- [Prep deploy (moduły Woo)](/checklists/prep-deploy) — **nie** zastępuje tej listy dla Command Center.
