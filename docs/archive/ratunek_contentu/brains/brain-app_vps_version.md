# Brain App ΓÇö APP.FLEXGRAFIK.NL
## ┼╣r├│d┼éo prawdy dla modu┼éu gry | V2.0 | 18.03.2026

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
spelen de game, en worden potenti├½le klanten via follow-up emails + kortingscodes.

### Kernfuncties
1. **Lead capture** ΓÇö Registratieformulier: naam, email, telefoon (optioneel)
2. **Engagement** ΓÇö Mario-style platformgame over het ZZP-leven in NL
3. **Competitie** ΓÇö Maandelijks leaderboard met echte prijs
4. **Conversie** ΓÇö Kortingscodes voor de Wizard (zzpackage)

---

## GAME MECHANIEK

### Type
Mario-style side-scrolling platformer ("Bouwplaats Chaos: ZZP Blitz")

### Huidige implementatie (85% compleet)
- Γ£à Canvas-based game engine met physics (gravity, jump, collision)
- Γ£à Coyote time (10 frames)
- Γ£à Web Audio API geluidseffecten (4 geluiden)
- Γ£à Leaderboard component
- Γ£à Registratie gate ("Brama Wej┼¢ciowa")
- Γ£à 15+ level definities in levels.ts
- Γ£à Deploy script (deploy.py)
- Γ£à GA4 event tracking

### Nog te doen (24 taken in todo.json)
**Fase 1 ΓÇö Core alignment:**
- [ ] 6 spelstatistieken: reputatie, contacten, professionaliteit, financi├½n, merk, energie
- [ ] Nieuwe entity types (mentoren, vijanden, bosses)
- [ ] Placeholder assets vervangen door echte sprites

**Fase 2 ΓÇö Level systeem:**
- [ ] 5 niveaus met doelen (niet meer endless runner)
- [ ] Boss: Belastingdienst (Level 5)
- [ ] Thematische achtergronden per level

**Fase 3 ΓÇö Polish:**
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
- **Doeltaal:** Nederlands (NL) ΓÇö vertalil na afronden development
- **UI teksten:** "BRAMA WEJ┼ÜCIOWA" ΓåÆ "REGISTRATIE", "Graj o Nagrody" ΓåÆ "Speel voor Prijzen"
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

Code moet verhuizen van `bouwplaats-chaos` ΓåÆ `app.flexgrafik.nl`:
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
- **Deploy:** `npm run build` ΓåÆ upload `dist/` ΓåÆ Cyber-Folks

### Sleutelbestanden
- `App.tsx` ΓÇö Hoofdcomponent (menu, game, leaderboard)
- `components/GameCanvas.tsx` ΓÇö Game engine + render loop
- `constants.ts` ΓÇö Scoring, physics, assets configuratie
- `levels.ts` ΓÇö Level definities
- `types.ts` ΓÇö TypeScript interfaces
- `gameMessages.ts` ΓÇö In-game berichten
- `services/` ΓÇö Analytics, API calls

---

## ≡ƒÜ¿ DEPLOY RULES (KRYTYCZNE ΓÇö po incydencie 2026-03-20)

### ΓÜá∩╕Å W┼üA┼ÜCIWY KATALOG SERWERA

```
Γ¥î B┼ü─ÿDNY:  /home/uhqsycwpjz/domains/app.flexgrafik.nl/public_html/
Γ£à W┼üA┼ÜCIWY: /home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/
```

> Domena `app.flexgrafik.nl` jest **subdomen─à** skonfigurowan─à jako alias katalogu `flexgrafik.nl/public_html/app/`.
> NIE istnieje jako osobna domena z w┼éasnym `public_html`.
> Pomylenie tych katalog├│w = deploy do miejsca kt├│re serwer ignoruje.

### ΓÜá∩╕Å ARCHITEKTURA: VITE BUILD (nie no-build)

```
Γ¥î B┼ü─ÿDNIE: wgranie surowych plik├│w .tsx na serwer
Γ£à W┼üA┼ÜCIWIE: npm run build ΓåÆ wgranie zawarto┼¢ci dist/ na serwer
```

**Prawid┼éowy flow deployu:**
```bash
# Krok 1: Build
cd c:\Users\FlexGrafik\FlexGrafik\github\app.flexgrafik.nl
npm run build
# ΓåÆ generuje dist/ z index.html + assets/index-[HASH].js

# Krok 2: Upload dist/ do w┼éa┼¢ciwego katalogu
# Cel: /home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/
# (przez SSH/SFTP/deploy.py)

# Krok 3: Zachowaj .htaccess na serwerze (nie nadpisuj)
```

### ΓÜá∩╕Å .htaccess WYMAGANY dla LiteSpeed

Serwer Cyber-Folks z LiteSpeed **wymaga** pliku `.htaccess` w katalogu aplikacji.
Bez niego: assety PNG/webp daj─à HTTP 404, SPA routing nie dzia┼éa.

W┼éa┼¢ciwy `.htaccess` jest w repo: `public/.htaccess`
Po buildzie trafia do: `dist/.htaccess` (Vite kopiuje z `public/`)
Na serwerze: `/home/uhqsycwpjz/domains/flexgrafik.nl/public_html/app/.htaccess`

Kluczowe dyrektywy:
```apache
AddType application/javascript .js .mjs
AddType image/webp .webp
# + RewriteRule dla SPA routing
```

### ΓÜá∩╕Å ASSETY ΓÇö stan po audycie 2026-03-20

| Asset | Status | ┼Ücie┼╝ka |
|---|---|---|
| `sprite-player-main.png` | Γ£à AKTYWNY (380KB, player1.png) | `public/assets/` |
| `player.png` | Γ¥î USUNI─ÿTY (stary 500KB placeholder) | ΓÇö |
| `platform.png` | Γ¥î BRAKUJE w repo ΓÇö fallback emoji ≡ƒÅù∩╕Å | ΓÇö |
| `ui-logo-flexgrafik.webp` | Γ£à AKTYWNY | `public/assets/` |
| `ui-sublogo-zzpackage.png` | Γ£à AKTYWNY | `public/assets/` |
| `item-branding-box.png` | Γ£à AKTYWNY | `public/assets/` |

### ΓÜá∩╕Å WERYFIKACJA PO DEPLOYU

```powershell
# Sprawd┼║ kluczowe URL:
Invoke-WebRequest "https://app.flexgrafik.nl/assets/sprite-player-main.png" -Method Head
# Oczekiwane: 200, ~380307B

# Sprawd┼║ czy NL:
(Invoke-WebRequest "https://app.flexgrafik.nl/").Content | Select-String "lang=|Word een slimme"
# Oczekiwane: lang="nl", "Word een slimme ZZP-er"
```

---

## DO'S & DON'TS

Γ£à Lead capture VOOR gameplay (registratie gate)
Γ£à Maandelijkse prijzen met echte waarde
Γ£à Kortingscodes die naar de Wizard leiden
Γ£à Mobile-first design (touch/tap controls)
Γ£à Fair play (anticheat in Game Master agent)

Γ¥î GEEN pay-to-play of microtransacties
Γ¥î GEEN data verkoop (privacy NL/EU compliant)
Γ¥î GEEN gameplay zonder registratie (behalve "Gast" mode)
Γ¥î GEEN Pools op live versie (na vertaling)
