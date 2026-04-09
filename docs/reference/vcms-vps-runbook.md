---
status: "[STABLE]"
title: "VCMS VPS Runbook — Command Center (Node + PM2 + Nginx)"
updated: "2026-04-09"
---

# VCMS VPS Runbook

Operacyjny opis wdrożenia **flex-vcms Command Center** na VPS: Express serwuje zbudowany **VitePress** (`docs/.vitepress/dist`) i endpointy KODY (`/api/chat`, `/api/knowledge`). **Jadzia-Core** (np. FastAPI na porcie **8000**) to osobny proces — w tym repozytorium go nie zmieniamy; ważna jest tylko **rozdzielność portów** i reverse proxy.

Bezpieczeństwo i sekrety: [security policy](/core/security-policy).

## Architektura (logiczna)

| Warstwa | Rola | Port (przykład) |
|---------|------|------------------|
| Jadzia-Core | API / logika poza tym repo | **8000** (nginx osobny vhost; nie opisujemy tu) |
| VCMS Node (PM2 `vcms-core`) | `server.js`, static `dist`, `/api/*` | **8001** (`127.0.0.1` — tylko lokalnie na VPS) |
| Nginx | TLS, Basic Auth, `proxy_pass` do Node | **443** (publicznie) |

Referencja proxy do Node: [VCMS-nginx.conf](./VCMS-nginx.conf) — `proxy_pass http://127.0.0.1:8001`.

## Ścieżki na VPS

Wartości domyślne jak w `ecosystem.config.js` w root repozytorium (plik obok `server.js`):

- Katalog aplikacji (PM2 `cwd`): `/var/www/vcms/current`
- Logi PM2: `/var/www/vcms/logs/vcms-error.log`, `vcms-out.log`

Na serwerze **musisz** mieć strukturę zgodną z `server.js`:

- `server.js`, `package.json`, `package-lock.json`, `ecosystem.config.js` w `cwd`
- Zbudowany frontend: `docs/.vitepress/dist` (względem `cwd`)

**Build VitePress nie uruchamia się na VPS** — `vitepress` jest `devDependency`; produkcyjnie uruchamiasz `npm run docs:build` **na maszynie developerskiej**, potem synchronizujesz `dist` (skrypt PowerShell w repo: `scripts/Deploy-VPS.ps1`).

## Zmienne środowiskowe (nazwy — bez wartości w repo)

| Zmienna | Gdzie | Uwagi |
|---------|--------|--------|
| `NODE_ENV` | VPS | `production` |
| `PORT` | VPS | Domyślnie **8001** (jak w `ecosystem.config.js`) |
| `VCMS_DIR` | VPS | Katalog root aplikacji Node (często = `cwd`) — `server.js` używa jako bazy ścieżek |
| `AGENT_CONTEXT_PATH` | VPS | Katalog kontekstu dla API (np. `.../deploy-context`); **nie** commituj treści z sekretami |
| `ALLOWED_ORIGINS` | VPS | Opcjonalnie: lista CORS po przecinku |
| `GEMINI_API_KEY` | VPS | Wyłącznie w pliku `.env` na serwerze; **nigdy** w git |

Plik `.env` trzymasz tylko na VPS (uprawnienia `600`). Szablon nazw możesz trzymać w notatkach poza repo lub w password managerze.

## Kolejność pierwszego wdrożenia

1. **Nginx:** vhost + TLS (Let’s Encrypt) + **Basic Auth** (`htpasswd`) — szablon: [VCMS-nginx.conf](./VCMS-nginx.conf). `reload nginx` po walidacji `nginx -t`.
2. **Katalogi na VPS:** `mkdir -p /var/www/vcms/current/docs/.vitepress` oraz katalog logów zgodny z `ecosystem.config.js`.
3. **Wrzutka plików:** `server.js`, `package.json`, `package-lock.json`, `ecosystem.config.js`, cały katalog `docs/.vitepress/dist` (np. `scripts/Deploy-VPS.ps1`).
4. **Zależności produkcyjne:** w `cwd`: `npm ci --omit=dev` (wymaga `package-lock.json`).
5. **PM2:** z katalogu zawierającego `ecosystem.config.js`:  
   `pm2 start ecosystem.config.js` przy pierwszym razie, potem `pm2 reload ecosystem.config.js --update-env`.
6. **Smoke:** [checklista produkcyjna](/checklists/vcms-prod-smoke).

## Telefon (klient)

- Wejście wyłącznie przez **HTTPS** na domenę wskazaną w Nginx + **Basic Auth**.
- Lokalnego `node tools/vcms-scan.js` na telefonie **nie** wymagamy — skan i edycja `repos.yaml` zostają na laptopie.
- Po wdrożeniu wykonaj [checklistę mobile](/reference/vcms-vps-runbook#weryfikacja-mobile-ph4-011) (PH4-011 — ręcznie).

## Weryfikacja mobile (PH4-011) {#weryfikacja-mobile-ph4-011}

Na prawdziwym urządzeniu (iOS/Android): zaloguj się przez przeglądarkę, sprawdź czytelność dokumentacji i flow KODY. Wynik zapisz w `docs/handoffs/` lub `docs/study/study-index.md` (data, urządzenie, PASS/FAIL, NEXT).

## Deploy z Windows

- Skrypt (root repo, nie w `docs/`): `scripts/Deploy-VPS.ps1`.
- Parametry: **`-SshTarget`** (wymagany, np. `root@cmd.example.com`), **`-RemotePath`** (domyślnie `/var/www/vcms/current`), **`-SkipBuild`** (jeśli `dist` już zbudowany), **`-WhatIf`** — tylko wypisuje plan (bez `npm`, `scp`, `ssh`).
- Przykład: `.\scripts\Deploy-VPS.ps1 -SshTarget 'root@host' -WhatIf` → potem ten sam bez `-WhatIf`.
- Uwierzytelnianie SSH: **bez** haseł w repozytorium — `ssh-agent`, klucz lub `~/.ssh/config`.
- Wymagania lokalne: **OpenSSH** (`scp`, `ssh` w PATH), **Node/npm** do `npm run docs:build`.

## Smoke, rollback, incydenty {#smoke-rollback-incydenty}

- Krótka lista kontrolna: [/checklists/vcms-prod-smoke](/checklists/vcms-prod-smoke).
- Rollback: przywróć poprzednią kopię katalogu `docs/.vitepress/dist` (i ewentualnie `server.js`) z backupu, potem `pm2 reload ecosystem.config.js`.

## Bramka `verify:scan` (laptop / CI, nie VPS)

`npm run verify:scan` sprawdza spójność artefaktów skanu z gitem po zmianach w `repos.yaml` / `scan-rules.json` / `tools/vcms-scan.js`. Uruchamiaj **lokalnie lub w pipeline** przed merge — **nie** jest krokiem wdrożenia na serwer. Szczegóły: [Workflow Manual — Rytm orchestratora](/core/workflow-manual#rytm-orchestratora).

## Powiązane pliki w repo

- `ecosystem.config.js` (root) — PM2
- `server.js` (root) — port, `/health`, static, API
- [VCMS-nginx.conf](./VCMS-nginx.conf) — referencja Nginx (wklej na serwer, nie jako route VitePress)
