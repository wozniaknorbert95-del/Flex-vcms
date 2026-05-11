# Brain APP — APP.FLEXGRAFIK.NL
## Źródło prawdy dla modułu Game / PWA | v1.5+ | 2026-05-09

---

## IDENTITEIT

**Domein:** app.flexgrafik.nl
**Platform:** Vanilla JS + PWA / Lite WordPress (Backend)
**Hosting:** Cyber-Folks (s34.cyber-folks.pl:222)
**Database:** `uhqsycwpjz_app` (User: `uhqsycwpjz_app`)
**Database Password:** *(niet in repo — team password manager of `.env` / hosting panel; zie `.env.example`)*
**Repo:** github.com/wozniaknorbert95-del/app.flexgrafik.nl
**Rol:** Platforma grywalizacji (Bouwplaats Chaos), lead magnet i hub dla mobilnych użytkowników.

---

## DOEL

De game is een **lead magnet** voor FlexGrafik. Spelers registreren met naam + email,
spelen de game, en worden potentiële klanten via follow-up emails + kortingscodes.

### Kernfuncties
1. **Lead capture** — Registratieformulier: "Bouwpas" (Bouwplaats-przepustka) — naam, email, telefoon (optioneel)
2. **Engagement** — Mario-style platformgame over het ZZP-leven in NL
3. **Competitie** — Maandelijks leaderboard met echte prijs
4. **Conversie** — Kortingscodes voor de Wizard (zzpackage)

---

## GAME MECHANIEK

### Type
Mario-style side-scrolling platformer ("Bouwplaats Chaos: ZZP Blitz")

### Huidige implementatie (85% compleet)
- ✅ Canvas-based game engine met physics (gravity, jump, collision)
- ✅ Coyote time (10 frames)
- ✅ Web Audio API geluidseffecten (4 geluiden)
- ✅ Leaderboard component
- ✅ Bouwpas gate (Registratie)
- ✅ 15+ level definities in levels.ts
- ✅ Build + deploy: `npm run build`, `scripts/deploy_all.ps1` (Zasada 11)
- ✅ GA4 event tracking

### Geheimen / omgeving

- Geen wachtwoorden, API-keys of HMAC-secrets in markdown of gecommitte bestanden.
- Lokale secrets: kopieer `.env.example` → `.env` (`.env` staat in `.gitignore`).
- **Turnstile (publieke site key):** `VITE_TURNSTILE_SITE_KEY` — alleen voor `npm run build` / deploy (statisch ingebakken). Zonder key: prod-build toont waarschuwing; **gast-flow** en Playwright `test:e2e:prod` blijven bruikbaar. Echte registratie-flow test je met key in `.env` vóór `deploy_all.ps1`.

### Productie-backlog (detail)
Strategische taken en sprint-status staan in **`todo.json`** (`future_sprints`, `repo_health.next_action`). De onderstaande bullets zijn **historisch / roadmap** — niet als realtime checklist gebruiken.

**Roadmap (samenvatting):**
- Langlopend: asset-optimalisatie (o.a. PNG naar WebP — `S-PERF-ASSETS`), pixel-art (`SG`, blok op Adobe-levering).
- Handmatige QA: TB-12 device-pass (`repo_health.next_action`).

---

## BELONINGEN

### Maandprijs (bepaald door Norbert)
- Fysiek product uit productierestanten (elke maand anders)
- Voorbeeld: magneetbord set, bedrukkte hoodie, stickerpakket
- Winnaar = hoogste score, tie-break = snelste tijd
- 7 dagen om prijs op te halen

### Kortingscodes
- Alle deelnemers ontvangen korting op de Wizard
- Code: "GAME10" (10% korting) of vergelijkbaar
- Geldig voor 48 uur na maandafsluiting

---

## TAAL

- **Speler-UI:** Nederlands (NL) — entry gates, overlays, leaderboard, menu.
- **Code/comments:** Engels

---

## VISUELE EENHEID

De game MOET visueel aansluiten bij het FlexGrafik ecosysteem:
- **Dark premium** achtergrond (consistent met zzpackage en flex)
- **FlexGrafik logo** prominent ("Powered by FlexGrafik")
- **Zelfde kleurenpalet:** dark bg, geel accent (#F4C430), cyan highlights
- **Favicon:** FlexGrafik "F" icoon

---

## MIGRATIE

Code moet verhuizen van `bouwplaats-chaos` → `app.flexgrafik.nl`:
1. Kopieer alle bestanden (behalve node_modules, .git, dist)
2. Update package.json naam
3. Fresh npm install
4. Build + deploy naar Cyber-Folks
5. Archiveer bouwplaats-chaos repo (read-only)

---

## TECHNISCHE STACK

- **Framework:** React 19 + Vite 6
- **Taal:** TypeScript
- **Game engine:** Canvas API (geen externe game library)
- **State:** React hooks (useState, useRef)
- **Analytics:** GA4
- **Deploy:** `npm run build` → upload `dist/` → Cyber-Folks

### Sleutelbestanden
- `App.tsx` — Hoofdcomponent (menu, game, leaderboard)
- `src/components/game/ReactGameCanvas.tsx` — Game engine + render loop
- `src/components/screens/EntryGate.tsx` — Lead gate + Turnstile + prod test hooks
- `constants.ts` — Scoring, physics, assets configuratie
- `levels.ts` — Level definities
- `types.ts` — TypeScript interfaces
- `gameMessages.ts` — In-game berichten
- `services/` — Analytics, API calls

---

## 🚨 DEPLOY RULES (KRYTYCZNE — po incydencie 2026-03-20)

### ⚠️ WŁAŚCIWY KATALOG SERWERA

```
❌ BŁĘDNY:  /home/uhqsycwpjz/domains/app.flexgrafik.nl/public_html/
✅ WŁAŚCIWY: /home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/
```

> Domena `app.flexgrafik.nl` jest **subdomeną** skonfigurowaną jako alias katalogu `flexgrafik.nl/public_html/app/`.
> NIE istnieje jako osobna domena z własnym `public_html`.
> Pomylenie tych katalogów = deploy do miejsca które serwer ignoruje.

### ⚠️ ARCHITEKTURA: VITE BUILD (nie no-build)

```
❌ BŁĘDNIE: wgranie surowych plików .tsx na serwer
✅ WŁAŚCIWIE: npm run build → wgranie zawartości dist/ na serwer
```

**Prawidłowy flow deployu:**
```bash
# Krok 1: Build
cd c:\Users\FlexGrafik\FlexGrafik\github\app.flexgrafik.nl
npm run build
# → generuje dist/ z index.html + assets/index-[HASH].js

# Krok 2: Upload dist/ do właściwego katalogu
# Cel: /home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/
# (przez SSH/SFTP/deploy.py)

# Krok 3: Zachowaj .htaccess na serwerze (nie nadpisuj)
```

**Laatste prod-close (cache + Turnstile + E2E):** 2026-05-09 — `main` @ **c70e577**; `scripts/deploy_all.ps1`; na deploy **`npm run test:e2e:prod`** → **3/3**; hashed `/assets/index-*.js` → **`Cache-Control: public, max-age=31536000`** (LiteSpeed kan `immutable` uit de header-string strippen — gedrag blijft jaar-cache). Turnstile-widget gebruikt **`import.meta.env.VITE_TURNSTILE_SITE_KEY`** (build-time); localhost bypass mock-token. Handoff + checklist: `docs/handoffs/2026-05-09-prod-cache-turnstile-e2e-verify.md`.

**Eerdere verify milestone:** 2026-04-20 — `deploy_all.ps1` @ **18b6817**; post-deploy prod smoke 3/3. Audyt: `docs/handoffs/2026-04-20-audit-deploy-post-result-challenge-ux.md`.

### ⚠️ .htaccess WYMAGANY dla LiteSpeed

Serwer Cyber-Folks z LiteSpeed **wymaga** pliku `.htaccess` w katalogu aplikacji.
Bez niego: assety PNG/webp dają HTTP 404, SPA routing nie działa.

Właściwy `.htaccess` jest w repo: `public/.htaccess` (wersja **v1.8+**: długi cache dla fingerprintowanych assetów JS/CSS/obrazy/audio + nagłówki bezpieczeństwa tam gdzie wdrożone).
Po buildzie trafia do: `dist/.htaccess` (Vite kopiuje z `public/`)
Na serwerze: `/home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/.htaccess`

**Ważne operacyjnie:** nie utrzymuj osobnego `public/assets/.htaccess` w repo — krótszy cache tam **nadpisywał** politykę root po deployu. Skrypt `deploy_all.ps1` usuwa po rozpakowaniu ewentualny **`assets/.htaccess`** ze starej instalacji (`rm -f .../assets/.htaccess`).

Kluczowe dyrektywy (skrót):
```apache
AddType application/javascript .js .mjs
AddType image/webp .webp
# + RewriteRule dla SPA routing
# + Cache-Control / Expires dla hashed assets (root .htaccess)
```

### ⚠️ ASSETY — stan po audycie 2026-03-20

| Asset | Status | Ścieżka |
|---|---|---|
| `sprite-player-main.png` | ✅ AKTYWNY (380KB, player1.png) | `public/assets/` |
| `player.png` | ❌ USUNIĘTY (stary 500KB placeholder) | — |
| `platform.png` | ❌ BRAKUJE w repo — fallback emoji 🏗️ | — |
| `ui-logo-flexgrafik.webp` | ✅ AKTYWNY | `public/assets/` |
| `ui-sublogo-zzpackage.png` | ✅ AKTYWNY | `public/assets/` |
| `item-branding-box.png` | ✅ AKTYWNY | `public/assets/` |

### ⚠️ WERYFIKACJA PO DEPLOYU

```powershell
# Kluczowy asset (HEAD):
Invoke-WebRequest "https://app.flexgrafik.nl/assets/sprite-player-main.png" -Method Head

# Hashed JS bundle — rok cache (podmień nazwę pliku z index.html na prod):
curl.exe -sI "https://app.flexgrafik.nl/assets/index-<HASH>.js"
# Oczekiwane m.in.: Cache-Control: public, max-age=31536000

# Automatyczny prod-smoke (Playwright):
cd <repo>
npm run test:e2e:prod

# Sprawdź język strony:
(Invoke-WebRequest "https://app.flexgrafik.nl/").Content | Select-String "lang=|Word een slimme"
```

Pełniejsza checklista: `docs/handoffs/2026-05-09-prod-cache-turnstile-e2e-verify.md`.

---

## ODDZIELENIE KONTENERA

Moduł app jest technicznie odseparowany od silnika sklepowego zzpackage, aby zachować najwyższą wydajność (60 FPS w grach mobilnych). 
Wszelkie zasoby graficzne, skrypty fizyki i stany gry nie mogą ingerować w silnik eCommerce.
Baza danych została w pełni oddzielona. Wszelkie zapytania API (jeśli zachodzą) korzystają z wyciągniętych endpointów.

---

## DO'S & DON'TS

✅ Maksymalizowanie FPS i płynności animacji.
✅ Zachowywanie estetyki Dark Premium spójnej z wizytówką i sklepem.
❌ ZAKAZ dodawania ociężałych frameworków wizualnych.
