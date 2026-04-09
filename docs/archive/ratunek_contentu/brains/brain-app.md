# Brain App — APP.FLEXGRAFIK.NL
## Źródło prawdy dla modułu gry | V2.0 | 18.03.2026

---

## IDENTITEIT

**Domein:** app.flexgrafik.nl
**Platform:** React 19 + Vite + TypeScript
**Hosting:** Cyber-Folks (s34.cyber-folks.pl:222, statische bestanden)
**Repo:** github.com/wozniaknorbert95-del/app.flexgrafik.nl
**Oorspronkelijk repo:** bouwplaats-chaos (code moet verhuizen)

---

## DOEL

De game is een **lead magnet** voor FlexGrafik. Spelers registreren met naam + email,
spelen de game, en worden potentiële klanten via follow-up emails + kortingscodes.

### Kernfuncties
1. **Lead capture** — Registratieformulier: naam, email, telefoon (optioneel)
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
- ✅ Registratie gate ("Brama Wejściowa")
- ✅ 15+ level definities in levels.ts
- ✅ Deploy script (deploy.py)
- ✅ GA4 event tracking

### Nog te doen (24 taken in todo.json)
**Fase 1 — Core alignment:**
- [ ] 6 spelstatistieken: reputatie, contacten, professionaliteit, financiën, merk, energie
- [ ] Nieuwe entity types (mentoren, vijanden, bosses)
- [ ] Placeholder assets vervangen door echte sprites

**Fase 2 — Level systeem:**
- [ ] 5 niveaus met doelen (niet meer endless runner)
- [ ] Boss: Belastingdienst (Level 5)
- [ ] Thematische achtergronden per level

**Fase 3 — Polish:**
- [ ] HUD met 6 statistieken
- [ ] Narratieve berichten in-game
- [ ] Social share na game over
- [ ] Beloningen + leaderboard prijzen

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

- **Huidige staat:** Pools (voor Norbert's dev/testing)
- **Doeltaal:** Nederlands (NL) — vertalil na afronden development
- **UI teksten:** "BRAMA WEJŚCIOWA" → "REGISTRATIE", "Graj o Nagrody" → "Speel voor Prijzen"
- Code/comments: Engels

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
- `components/GameCanvas.tsx` — Game engine + render loop
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

### ⚠️ .htaccess WYMAGANY dla LiteSpeed

Serwer Cyber-Folks z LiteSpeed **wymaga** pliku `.htaccess` w katalogu aplikacji.
Bez niego: assety PNG/webp dają HTTP 404, SPA routing nie działa.

Właściwy `.htaccess` jest w repo: `public/.htaccess`
Po buildzie trafia do: `dist/.htaccess` (Vite kopiuje z `public/`)
Na serwerze: `/home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/.htaccess`

Kluczowe dyrektywy:
```apache
AddType application/javascript .js .mjs
AddType image/webp .webp
# + RewriteRule dla SPA routing
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
# Sprawdź kluczowe URL:
Invoke-WebRequest "https://app.flexgrafik.nl/assets/sprite-player-main.png" -Method Head
# Oczekiwane: 200, ~380307B

# Sprawdź czy NL:
(Invoke-WebRequest "https://app.flexgrafik.nl/").Content | Select-String "lang=|Word een slimme"
# Oczekiwane: lang="nl", "Word een slimme ZZP-er"
```

---

## DO'S & DON'TS

✅ Lead capture VOOR gameplay (registratie gate)
✅ Maandelijkse prijzen met echte waarde
✅ Kortingscodes die naar de Wizard leiden
✅ Mobile-first design (touch/tap controls)
✅ Fair play (anticheat in Game Master agent)

❌ GEEN pay-to-play of microtransacties
❌ GEEN data verkoop (privacy NL/EU compliant)
❌ GEEN gameplay zonder registratie (behalve "Gast" mode)
❌ GEEN Pools op live versie (na vertaling)
