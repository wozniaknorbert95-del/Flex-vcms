# Brain APP — APP.FLEXGRAFIK.NL

## Źródło prawdy dla modułu Game / PWA | v1.9 | 2026-07-06

---

## IDENTITEIT

**Domein:** app.flexgrafik.nl
**Platform:** React 19 + Vite 6 (TypeScript)
**Hosting:** Cyber-Folks (s34.cyber-folks.pl:222)
**Database:** `uhqsycwpjz_app` (User: `uhqsycwpjz_app`)
**Database Password:** _(patrz `SECURITY.md` i `.env.example` — nie w repo)_
**Repo:** github.com/wozniaknorbert95-del/app.flexgrafik.nl
**Rol:** Platforma grywalizacji (Bouwplaats Chaos), lead magnet i hub dla mobilnych użytkowników.
**Status:** v1.0.0 — patrz `CHANGELOG.md`

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

### Huidige implementatie (99% compleet)

- ✅ Canvas-based game engine met physics (gravity, jump, collision)
- ✅ Coyote time (10 frames)
- ✅ Web Audio API geluidseffecten (12 slang voice lines + procedural tones)
- ✅ Challenge overlays (BossFight, TapMash, Balance, Choice, Narrative)
- ✅ HUD — health, score, level progress, belasting-aura
- ✅ Leaderboard component met season support
- ✅ Bouwpas gate (Registratie + Turnstile)
- ✅ 5 act-narrative level definities in levels.ts (Acts 1-5: Klusser, Reputatie, Professionalisering, Expansie, Belasting-Eindbaas)
- ✅ Level challenges + reward unlocks
- ✅ GA4 event tracking + Sentry error monitoring
- ✅ MainMenu V5.3 (zzpackage branding, reward cards)
- ✅ PWA — service worker met 4 cache strategies (immutable/nav/static/fonts)
- ✅ beforeinstallprompt + InstallPrompt component ("+ Installeren")
- ✅ Offline fallback (cached index.html)
- ✅ SW lifecycle: skipWaiting, clients.claim, cache versioning (v1), on-update GA4 event
- ✅ Build + deploy: `npm run build`, `scripts/deploy_all.ps1` (Zasada 11)

### Mobile playfield lift & thumb zone (2026-06)

- **Doel:** duimzone onderaan viewport tijdens spelen; playfield omhoog op viewports `max-width: 768px`.
- **Ratio:** playfield = **70%**, thumb zone = **30%** — `PLAYFIELD_LIFT_MOBILE_DVH = 30`
- **Golden Rule scherm skakania:** aktywny gameplay/platformy = **60% viewportu**, clearance/tlo bez platform = **10% viewportu**, czarne pole/fade/thumb zone = **30% viewportu**. Platformy nie mogą schodzić do dolnej krawędzi 70% playfield; gracz podczas spadania może przejść przez 10% clearance i znika/umiera dopiero za granicą czarnej strefy (70% viewportu). Istniejące tło parallax (gradient + sylwetki + budynek FlexGrafik fg) kotwiczy się na dole canvasu/playfield (granica 70% / początek czarnej strefy), nie na floor platform (60%). Bez włączania osobnej warstwy proceduralnej.
- **Code:** `src/config/gameLayout.ts`, `GameContainer` wrappers `#game-root` / `#game-playfield` / `#thumb-rest-zone`, CSS `src/styles/_game.css`.
- **Physics contract:** kolizje/platformy używają floor 60%; fall/death boundary używa 70%; jump-tap op **playfield én thumb zone** (70% + 30%, `#game-root` input target).
- **Canvas clearing:** `ctx.clearRect` dekt `CANVAS_HEIGHT + PLAYER_SIZE * 3` af zodat geen ghost fragments onder het speelveld overblijven.
- **Overflow guard:** `.game-playfield` heeft `overflow: hidden` + canvas heeft `clipPath: 'inset(0)'`.

### PWA (Service Worker)

- **Bestand:** `public/sw.js`
- **Cache version:** `v4` (verhoog bij asset-wijzigingen om oude cache te flushen)
- **PRECACHE_URLS:** 23 kritische assets (HTML, manifest, logo's, sprites, platforms, rewards, slang_sprite + licensed `bgm_loop` MP3/OGG)
- **BGM:** `public/assets/audio/bgm_loop.{mp3,ogg}` — FlexGrafik Original (`BGM-LICENSE.md`); runtime via `BGMManager.ts`, duck/mute unchanged
- **4 cache strategies:**
  - `immutableStrategy` (hashed assets: JS/CSS) — Cache-First, never re-fetch if cached
  - `staticStrategy` (non-hashed images/audio) — Cache-First with network fallback
  - `navStrategy` (HTML navigations) — Network-First, offline fallback to cached index.html
  - `fontsStrategy` (Google Fonts CDN) — Stale-While-Revalidate
- **API bypass:** `/wp-json/`, `/fg-game-api.php` — never cached
- **beforeinstallprompt:** deferred in `src/main.tsx` → custom event `install-prompt-ready` → GA4 `app_installed` + `sw_update_available`
- **InstallPrompt component:** `src/components/ui/InstallPrompt.tsx` — "+ Installeren" button in MainMenu header (production only)
- **SW lifecycle:** install → skipWaiting + precache; activate → claim + cleanup old caches; fetch → 4 strategy routing; updatefound → GA4 event on new SW installed

### Geheimen / omgeving

- Geen wachtwoorden, API-keys of HMAC-secrets in markdown of gecommitte bestanden.
- Lokale secrets: kopieer `.env.example` → `.env` (`.env` staat in `.gitignore`).
- **Turnstile (publieke site key):** `VITE_TURNSTILE_SITE_KEY` — alleen voor `npm run build` / deploy (statisch ingebakken). Zonder key: prod-build toont waarschuwing; **gast-flow** en Playwright `test:e2e:prod` blijven bruikbaar. Echte registratie-flow test je met key in `.env` vóór `deploy_all.ps1`.

### Level-progressie (minScore invariant)

- Formule: `levelProgress = (score − levelStartScore) / (minScore_L − prevMinScore)` met `prevMinScore = minScore_{L-1}` (L1: 0).
- **Invariant:** `minScore_L` moet **strikt groter** zijn dan `minScore_{L-1}` — nooit verlagen onder vorig level (Sprint 6 regressie: L4=1800 < L3=2200 → instant LEVEL_FINISH).
- Actuele progen (`levels.ts`): L1=500, L2=1200, L3=2200, L4=3200, L5=4200.
- `LEVEL_THRESHOLDS` in `constants.ts` = progi wejścia (`[0, 500, 1200, 2200, 3200]`), sync met `minScore`.
- Runtime: bij `span <= 0` → `levelProgress = 0` (geen `Math.max(1, negatief)`).

### Pickup / Icon Program — CLOSED (2026-06-09)

- **Start docs:** `docs/README.md`
- **Gate:** `docs/audits/pickup-player-contract.md` (archived)
- **Macierz:** `docs/game-pickups-matrix.md` (archived)
- **UX tags:** `docs/strategy-marketing.md` §8
- **Kod:** `collisionClass` — WEATHER/DEBUFF/STAT_HIT/BUFF/ENEMY
- **Done:** L1, C-P0-01, C-P2-07, TB-12 PASS @0b876e4 (2026-06-09, post S17-W1)
- **Open:** C-P2-04 INSURANCE HUD only

### Productie-backlog (detail)

Strategische taken en sprint-status staan in **`todo.json`** (`future_sprints`, `repo_health.next_action`).

### S17-W6 — Wall-kick + pickup combo HUD (2026-06-11)

- **Wall-kick:** `PhysicsEngine.detectWallKick()` — runner-adapted brush off elevated platform side edges; `wallKickTimer` + `handleJump` in `ReactGameCanvas` (Modyfikacja Rdzenia).
- **Variable-jump:** already LIVE @ `e9c25a0` — `jumpHoldActive` + 35% gravity taper while ascending.
- **Combo HUD:** `pickupCombo` in `globalVars` → `UISnapshot` → `GameHUD` (×N COMBO); resets on damage/debuff or 2.5s timeout.

### S19 — GamePhase FSM + CI perf gates (2026-06-11)

- **FSM:** `src/engine/GamePhaseMachine.ts` + `gamePhaseGraph.ts` — all runtime `GamePhase` mutations go through `applyPhaseTransition()` (physics, canvas handle, engine loop). Dev E2E hooks use `force: true`.
- **UI safety net:** `useGameEngine` logs invalid snapshot phase jumps via `validateSnapshotPhaseTransition`.
- **CI budgets:** `lighthouse-budget.json` — `npm run check:bundle` (gzip regression +50 KB max) + `npm run lighthouse:ci` in GHA `ci.yml` and `production-deploy.yml`.
- **E2E perf:** `e2e/perf-helpers.ts` + prod-smoke LCP + RAF fps proxy tests.

**Roadmap (samenvatting):**

- Langlopend: pixel-art (`SG`, blok op Adobe-levering).
- Handmatige QA: TB-12 — **PASS 2026-06-09** @ `0b876e4` (Dowódca L1 mobile). **AUDIT-READY.**

---

## BELONINGEN

### Maandprijs (bepaald door Norbert)

- **Hoofdprijs:** bedrijfslogo van de maandwinnaar op een geselecteerd bouwplaats-platform in de game — zichtbaar voor alle spelers de volgende kalendermaand (vervangt demo-slot „Plaats voor jouw logo”).
- **Voorwaarde:** hoogste score van de kalendermaand onder spelers die minstens één levelbonus hebben geclaimd via ZZPackage-activatie (min. €199 incl. BTW).
- **Tie-break:** snelste speeltijd (kortste duur van de winnende run).
- **Fysieke bonus (optioneel):** product uit productierestanten (elke maand anders), bijv. magneetbord set of stickerpakket.
- **Technisch:** ranglijst-API groepeert scores per ISO-week (`getCurrentSeason`); maandwinnaar wordt handmatig bepaald aan einde kalendermaand.
- Contact winnaar binnen 10 werkdagen; logo alleen met merkrechtelijke toestemming.

### Level-beloningen (reward ladder)

- Level 1 = geen code (tutorial, geen reward)
- Level 2 = GAME10 (10% korting ZZP Wizard)
- Level 3 = STICKER1 (Stickerpakket PRO-ZZP)
- Level 4 = TSHIRT2 (T-shirt ZZP)
- Level 5 = WINNER (Hoodie PRO-ZZP)
- Game over fallback = GAME10 (10% korting)
- Geldig bij activatie ZZPackage, min. besteding €199 incl. BTW
- **Game→Wizard bridge:** token via `zzpackage` `/game-token`; bonus SKU + GAME10 op **/afrekenen/** (sidebar wizard stap 1 mag leeg). CTA: ranglijst `GameBonusCTA` na game over (niet level-complete overlay L3).

### Reward Display Consistency (2026-07-06)

**Problem:** Game Over overlay używał `getDisplayLevelFromScore(score)` (score-band heuristic), podczas gdy Leaderboard używał `promoWizardLevel(engineLevel, score)` (engine-first). Gracz z score 1800 na Level 3 widział GAME10 na Game Over, ale STICKER1 na Leaderboardzie.

**Rozwiązanie:**

- `GameContainer.tsx` przekazuje `currentLevelId` z engine snapshot do `NewGameOverOverlay` (SSoT)
- `NewGameOverOverlay.tsx` używa `currentLevelId` zamiast `getDisplayLevelFromScore(score)`
- `leadRewardTier.ts` używa `getDisplayLevelFromScore` jako fallback (backend = UI)
- "Troostprijs" renderowany TYLKO gdy `rewardInfo === null` (brak nagrody levelowej)
- Level 1: etykieta "Jouw bonus" zamiast "Troostprijs" (pozytywny ton)
- Level Complete: "AANKOOPBONUS ONTGRENDELD — LEVEL X" (jawne powiązanie)

**Files:** `GameContainer.tsx`, `NewGameOverOverlay.tsx`, `NewLevelCompleteOverlay.tsx`, `leadRewardTier.ts`

**Testy:** 225/225 vitest + 8/8 e2e prod-smoke ✅

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

## TECHNISCHE STACK

- **Framework:** React 19 + Vite 6
- **Taal:** TypeScript
- **Game engine:** Canvas API (geen externe game library)
- **State:** React hooks (useState, useRef)
- **Analytics:** GA4
- **Error monitoring:** Sentry (lazy-loaded, DSN in .env)
- **Deploy:** `npm run build` → upload `dist/` → Cyber-Folks
- **PWA:** Custom service worker (`public/sw.js`) met 4 cache strategies
- **Code quality:** husky + lint-staged (tsc + prettier), .editorconfig, .nvmrc (Node 22), .gitattributes, .prettierrc, browserslist

### Sleutelbestanden

| Bestand                                   | Functie                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `App.tsx`                                 | Hoofdcomponent (menu, game, leaderboard, install prompt)                      |
| `src/main.tsx`                            | Bootstrap: beforeinstallprompt, SW registration, Sentry init, error listeners |
| `src/config/constants.ts`                 | Scoring, physics, assets configuratie                                         |
| `src/config/levels.ts`                    | Level definities (5 acts)                                                     |
| `src/config/types.ts`                     | TypeScript interfaces (game, physics, level)                                  |
| `src/config/gameLayout.ts`                | Mobile playfield lift / thumb zone config                                     |
| `src/config/mainMenuCopy.ts`              | MainMenu V5.3 copy + branding                                                 |
| `src/config/wizardBridge.ts`              | Game→Wizard token bridge                                                      |
| `src/config/fgApi.ts`                     | API calls (start game, leaderboard)                                           |
| `src/config/gameMessages.ts`              | In-game berichten (NL)                                                        |
| `src/config/entryGateCopy.ts`             | Bouwpas registration copy                                                     |
| `src/components/game/ReactGameCanvas.tsx` | Game engine + render loop (LOCKED)                                            |
| `src/components/game/GameContainer.tsx`   | Playfield wrapper + thumb zone                                                |
| `src/components/game/GameHUD.tsx`         | HUD overlay (health, score, progress)                                         |
| `src/components/screens/EntryGate.tsx`    | Lead gate + Turnstile                                                         |
| `src/components/screens/MainMenu.tsx`     | Main menu + InstallPrompt + Leaderboard link                                  |
| `src/components/ui/InstallPrompt.tsx`     | "+ Installeren" PWA install button                                            |
| `src/components/ui/Leaderboard.tsx`       | Season leaderboard                                                            |
| `src/components/ui/GameBonusCTA.tsx`      | Game→Wizard CTA na game over                                                  |
| `src/engine/physics.ts`                   | Physics engine (gravity, collision, jump)                                     |
| `src/engine/GamePhaseMachine.ts`          | S19 FSM — validated GamePhase transitions                                     |
| `src/engine/gamePhaseGraph.ts`            | Allowed phase edges SSoT                                                      |
| `src/engine/CollisionSystem.ts`           | Entity collision detection                                                    |
| `src/engine/SpawnManager.ts`              | Entity spawn logic per level                                                  |
| `src/rendering/GameRenderer.ts`           | Canvas renderer                                                               |
| `src/rendering/BackgroundRenderer.ts`     | Parallax background                                                           |
| `src/rendering/SpriteAtlas.ts`            | Sprite sheet loader + animator                                                |
| `src/input/InputManager.ts`               | Keyboard + touch input                                                        |
| `src/audio/SoundSynth.ts`                 | Web Audio API synth + slang voice                                             |
| `src/services/AnalyticsManager.ts`        | GA4 + custom events                                                           |
| `src/services/storageService.ts`          | localStorage score + progress                                                 |
| `src/hooks/useGameEngine.ts`              | React hook → engine bridge                                                    |
| `src/hooks/useLevelChallenge.ts`          | Level challenge state machine                                                 |
| `src/utils/AssetLoader.ts`                | WebP/audio preloader                                                          |
| `src/styles/_game.css`                    | Game-specific styles (playfield, thumb zone)                                  |
| `src/styles/_variables.css`               | CSS custom properties (`--zzp-*`)                                             |
| `public/sw.js`                            | Service worker (4 strategies, precache, versioning)                           |
| `public/.htaccess`                        | LiteSpeed config (CSP v1.9, caching, SPA rewrite)                             |
| `public/manifest.json`                    | PWA manifest (icons, theme, screenshots)                                      |

### Nieuwe configuratiebestanden (2026-06-09)

| Bestand                                     | Functie                                                 |
| ------------------------------------------- | ------------------------------------------------------- |
| `.editorconfig`                             | Editor consistentie (spaces, charset, end-of-line)      |
| `.nvmrc`                                    | Node 22 (engine pin)                                    |
| `.gitattributes`                            | Git normalisatie (LF, binary, linguist)                 |
| `.prettierrc`                               | Prettier config (printWidth 100, singleQuote)           |
| `.husky/pre-commit`                         | Pre-commit hook: `npx lint-staged`                      |
| `CHANGELOG.md`                              | v1.0.0 volledige changelog                              |
| `SECURITY.md`                               | Security policy, CSP, vulnerability reporting           |
| `docs/MAINTENANCE.md`                       | Dev setup, commands, deploy instructies                 |
| `docs/README.md`                            | Canonical documentatie-index (vervangt POLISH-INDEX.md) |
| `.github/PULL_REQUEST_TEMPLATE.md`          | PR checklist (scope, lint, test, build)                 |
| `.github/ISSUE_TEMPLATE/bug_report.md`      | Bug report template                                     |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request template                                |

### Pluggable UI guardrail (v0.dev / Bolt.new)

- UI screens are replaceable skins. They should receive primitive DTO props + callback props only.
- Generated UI must not import game core files, physics, renderer, levels, services, analytics, or storage directly.
- `src/components/game/ReactGameCanvas.tsx` and `src/config/levels.ts` are locked unless Dowódca explicitly writes: `Modyfikacja Rdzenia`.
- External Tailwind output is allowed only as a prototype format. In this repo it must be mapped to vanilla CSS / `--zzp-*` tokens.

---

## CODE QUALITY

### Pre-commit hook (husky + lint-staged)

- `.husky/pre-commit` → `npx lint-staged`
- **lint-staged** (in `package.json`):
  - `*.{ts,tsx}` → `tsc --noEmit --pretty` (type-check)
  - `*.{ts,tsx,js,jsx,json,css,md}` → `prettier --write` (format)
- **Verplicht:** hook MOET passeren voor elke commit (Zasada 5)
- `npm run typecheck` alias voor `tsc --noEmit --pretty`
- `npm run format` alias voor `prettier --write`

### Test suite

- **Framework:** Vitest
- **Status:** 209/209 pass (34 files)
- **Key tests:** levelProgress regressie, physics collision, boss fight, gamePhaseGraph, GamePhaseMachine FSM, storage, snapshot delivery
- `npm run test` — run all
- `npm run test:e2e:prod` — Playwright E2E on production (incl. LCP + RAF fps proxy)
- `npm run check:bundle` — S19 gzip regression gate
- `npm run lighthouse:ci` — S19 Lighthouse budget on preview build

### Build

- `npm run build` → Vite 6 → output `dist/` (409 modules)
- `npm run preview` — preview build locally
- Hashed assets: `index-[HASH].js`, `index-[HASH].css` → year cache

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
npm run build
# → generuje dist/ z index.html + assets/index-[HASH].js

# Krok 2: Upload dist/ do właściwego katalogu
# Cel: /home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/
# (przez SSH/SFTP/deploy_all.ps1)

# Krok 3: Zachowaj .htaccess na serwerze (nie nadpisuj)
```

### Deploy script

`scripts/deploy_all.ps1` — kompleksowy deploy:

1. `npm run build`
2. SFTP upload `dist/*` → serwer
3. Cleanup starych `assets/.htaccess` na serwerze

**Laatste prod-close:** 2026-07-06 — `main` @ **6632d02** (reward display consistency P0-P4); deploy `scripts/deploy_all.ps1`. Git cleanup: 15 branches usunięte. Vitest 225/225, tsc clean, build 471 modules, prod-smoke 8/8. Reward SSoT: Game Over + Leaderboard + Backend tier spójne. Handoff: `docs/handoffs/2026-07-06-reward-display-consistency.md`. **PREV:** 2026-06-12 — 52c1e21 (icon-integrity-audit).

**Eerdere verify milestone:** 2026-06-01 — `fix/leaderboard-403-compound-bug` @ **e33d8e1**; `scripts/deploy_all.ps1`; vitest 91/91, tsc clean, vite build 384 mod. Health: app 200 OK, sprite 200 OK, `lang=nl` verified, `Cache-Control: public, max-age=31536000` on hashed JS. Chrome DevTools smoke: game loads (Level 1, HUD), alle assets 200 OK (sprites, platforms, icons, audio), API `fg/v1/start-game` 200 OK + `Cache-Control: no-store` + `Access-Control-Allow-Headers: Authorization, Content-Type, Cache-Control`. POST `/leaderboard` verified 200 + `{"id":4,"rank":1}`. DB contains entries. GET `/leaderboard?season=...` returns data in NL. 0 blocking errors. CSP warning (pre-existing, hash mismatch). Handoff: `docs/handoffs/2026-06-01-leaderboard-nonce-cache-buttons.md`.

**Latest deploy:** 2026-07-06 — `main` @ **6632d02** (reward display consistency P0-P4); deploy `scripts/deploy_all.ps1`; vitest 225/225, tsc clean, vite build 471 mod. Pre-deploy checklist: ✅ all GREEN. Post-deploy smoke: HTTP 200 OK on app.flexgrafik.nl, assets live, JS hash `CsBjo9Q_` z `Cache-Control: public, max-age=31536000`. E2E prod-smoke 8/8. Reward display: Game Over = Leaderboard = Backend tier (SSoT). Git cleanup: 15 branches usunięte. Next: monitor GA4 24-48h.

**Eerdere verify milestone:** 2026-05-26 — `main` @ **f2b0dd1**; `scripts/deploy_all.ps1`; vitest 91/91, tsc clean, vite build 381 mod. Health: app 200 OK, sprite 200 OK, `lang=nl` verified. Chrome DevTools smoke: game loads, alle assets 200 OK, API `fg/v1/start-game` 200 OK, GA4 events sent. 0 blocking errors. Handoff: `docs/handoffs/2026-05-26-deploy-f2b0dd1.md`.

### ⚠️ .htaccess WYMAGANY dla LiteSpeed

Serwer Cyber-Folks z LiteSpeed **wymaga** pliku `.htaccess` w katalogu aplikacji.
Bez niego: assety PNG/webp dają HTTP 404, SPA routing nie działa.

Właściwy `.htaccess` jest w repo: `public/.htaccess` (wersja **v1.9+**: CSP, długi cache dla fingerprintowanych assetów JS/CSS/obrazy/audio + nagłówki bezpieczeństwa).
Po buildzie trafia do: `dist/.htaccess` (Vite kopiuje z `public/`)
Na serwerze: `/home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/.htaccess`

**Ważne operacyjnie:** nie utrzymuj osobnego `public/assets/.htaccess` w repo — krótszy cache tam **nadpisywał** politykę root po deployu. Skrypt `deploy_all.ps1` usuwa po rozpakowaniu ewentualny **`assets/.htaccess`** ze starej instalacji (`rm -f .../assets/.htaccess`).

Kluczowe dyrektywy (skrót):

```apache
AddType application/javascript .js .mjs
AddType image/webp .webp
# + RewriteRule dla SPA routing
# + Cache-Control / Expires voor hashed assets (root .htaccess)
```

### ⚠️ ASSETY — stan po S-PERF-ASSETS + cleanup (2026-06-09)

| Asset                            | Status                                       | Ścieżka                    |
| -------------------------------- | -------------------------------------------- | -------------------------- |
| `sprite-player-main.webp`        | ✅ AKTYWNY (384×96 final strip)              | `public/assets/`           |
| `platform.webp`                  | ✅ AKTYWNY (placeholder WebP)                | `public/assets/`           |
| `platform-L1.webp` t/m `L5.webp` | ✅ AKTYWNY                                   | `public/assets/platforms/` |
| `ui-logo-flexgrafik.webp`        | ✅ AKTYWNY                                   | `public/assets/`           |
| `ui-sublogo-zzpackage.webp`      | ✅ AKTYWNY                                   | `public/assets/`           |
| `ui-partners-grayscale.webp`     | ✅ AKTYWNY                                   | `public/assets/`           |
| `bg_bouwplaats.webp`             | ✅ AKTYWNY (2300×1824 → 1440×1142, 198KB)    | `public/assets/`           |
| `bg_scaffolding.webp`            | ✅ AKTYWNY                                   | `public/assets/`           |
| `item-branding-box.webp`         | ✅ AKTYWNY                                   | `public/assets/`           |
| `zzpackage.webp`                 | ✅ AKTYWNY                                   | `public/assets/`           |
| `menu/reward-hoodie.webp`        | ✅ AKTYWNY                                   | `public/assets/menu/`      |
| `menu/reward-korting.webp`       | ✅ AKTYWNY                                   | `public/assets/menu/`      |
| `menu/reward-stickers.webp`      | ✅ AKTYWNY                                   | `public/assets/menu/`      |
| `menu/reward-tshirt.webp`        | ✅ AKTYWNY                                   | `public/assets/menu/`      |
| **30 ikony-gry**                 | ✅ AKTYWNY (WebP, emoji fallback verwijderd) | `public/assets/ikony-gry/` |

**Volledige lijst ikony-gry:** ally_client, ally_outfitter, boss_belastingdienst, broken_printer, bureaucracy, card, coffee, enemy_chaos, enemy_fuszerka, enemy_language_barrier, fuszerka, insurance, lost_client, magnet, material, mentor_accountant, mentor_branding, mentor_majster, mini_boss_bad_supervisor, mini_boss_tough_client, no_fuel, party, portfolio, powerup_znajomosci, rain, special_ideal_client, special_influencer, starter_pack, tools, website.

### ⚠️ SECURITY — CSP v1.9 (2026-05-30)

| Element           | Status                                                                    | Uwagi                                                                              |
| ----------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| CSP ENFORCING     | ✅ AKTYWNY                                                                | `.htaccess` v1.9 — script-src `'self'` + domeny zewnętrzne, **bez sha256 hash**    |
| GA4 inline        | ✅ EXTERNALIZED                                                           | `public/scripts/analytics-gtag.js`                                                 |
| Meta Pixel inline | ✅ EXTERNALIZED                                                           | `public/scripts/analytics-pixel.js`                                                |
| Security headers  | ✅ AKTYWNE                                                                | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Sentry DSN        | ✅ ENV-ONLY                                                               | `VITE_SENTRY_DSN` in `.env` (niet in repo)                                         |
| CSP open items    | ⚠️ `'unsafe-inline'` op style-src; e-mail in query param `buildWizardUrl` | TBD                                                                                |

### ⚠️ WERYFIKACJA PO DEPLOYU

```powershell
# Kluczowy asset (HEAD):
Invoke-WebRequest "https://app.flexgrafik.nl/assets/sprite-player-main.webp" -Method Head

# Hashed JS bundle — jaar cache (podmień nazwę z index.html op prod):
curl.exe -sI "https://app.flexgrafik.nl/assets/index-<HASH>.js"
# Oczekiwane m.in.: Cache-Control: public, max-age=31536000

# Service worker geregistreerd?
curl.exe -s "https://app.flexgrafik.nl/sw.js" | Select-String "CACHE_VERSION"

# Automatische prod-smoke (Playwright):
cd <repo>
npm run test:e2e:prod

# Controleer taal:
(Invoke-WebRequest "https://app.flexgrafik.nl/").Content | Select-String "lang=|Word een slimme"
```

Pełniejsza checklista: `docs/MAINTENANCE.md` i `docs/handoffs/2026-05-09-prod-cache-turnstile-e2e-verify.md`.

---

## MIGRATIE (GESLOTEN)

Code is verhuisd van `bouwplaats-chaos` → `app.flexgrafik.nl`. Oude repo is archived (read-only). Nieuwe features ontwikkel je alleen in deze repo.

---

## ODDZIELENIE KONTENERA

Moduł app jest technicznie odseparowany od silnika sklepowego zzpackage, aby zachować najwyższą wydajność (60 FPS w grach mobilnych).
Wszelkie zasoby graficzne, skrypty fizyki i stany gry nie mogą ingerować w silnik eCommerce.
Baza danych została w pełni oddzielona. Wszelkie zapytania API (jeśli zachodzą) korzystają z wyciągniętych endpointów.

---

## DO'S & DON'TS

✅ Maksymalizowanie FPS i płynności animacji.
✅ Zachowywanie estetyki Dark Premium spójnej z wizytówką i sklepem.
✅ Aktualizuj `brain.md` bij elke significante verandering in architectuur of workflow.
✅ Utrzymuj SSoT: `docs/README.md` jest canonical entry point — nie czytaj `docs/archive/` w codziennej pracy.
❌ ZAKAZ dodawania ociężałych frameworków wizualnych.
❌ ZAKAZ commitowania do main — zawsze feature branch.
❌ ZAKAZ deployu bez zgody Dowódcy (Zasada 11).
