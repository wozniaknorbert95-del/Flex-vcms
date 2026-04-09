---
status: "[STABLE]"
title: "VCMS Command Center — smoke prod + rollback"
updated: "2026-04-09"
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
- [ ] **`POST /api/chat`** z pustym lub niepoprawnym JSON: oczekiwane **400** z komunikatem walidacji (patrz `server.js`). Nie wymaga klucza Gemini do sprawdzenia ścieżki walidacji.

Jeśli któryś krok kończy się **502/504**: sprawdź `pm2 logs vcms-core` i `nginx -t`.

---

## Smoke — KODY (opcjonalnie, z kluczem)

- [ ] Przy skonfigurowanym `GEMINI_API_KEY` na VPS: jedna krótka wiadomość przez UI KODY → odpowiedź asystenta lub kontrolowany błąd upstream (bez wycieku klucza w przeglądarce).

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
