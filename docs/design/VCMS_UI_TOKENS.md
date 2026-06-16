---
status: "[CANONICAL]"
title: "VCMS Dashboard — UI Tokens & Design Rules"
date: "2026-06-16"
---

# VCMS UI Tokens

SSoT dla dashboardu (`public/`). VitePress (`/docs`) ma osobny theme — **nie mieszać** z tym plikiem.

## Intent

**flex-vcms** = governance / command center. Akcent **fiolet** (`--accent-primary`), nie emerald.

| Warstwa | Plik | Zakres |
|---------|------|--------|
| Tokeny bazowe + motyw app | `public/tokens.css` | `:root`, `body[data-app="flex-vcms"]` |
| Layout komponentów | `public/styles.css` | sidebar, grid, chat (legacy) |
| Markup | `public/index.html` | `data-app="flex-vcms"` na `<body>` |

## Wspólna baza (`:root`)

```css
--bg-base, --bg-elevated, --bg-muted
--border-subtle, --border-strong
--text-main, --text-muted, --text-soft, --text-danger
--fx-time, --fx-money, --fx-order, --fx-calm, --fx-efficiency
```

## Motyw flex-vcms

```html
<body data-app="flex-vcms">
```

```css
--accent-primary: #8b5cf6;
--accent-secondary: #4c1d95;
```

Alias `--accent` → `--accent-primary` (kompatybilność ze starym `styles.css`).

## Zakazy

- **Nie** używać emerald `#10b981` jako akcentu dashboardu.
- **Nie** dodawać drugiego koloru akcentu poza fioletem (przyciski CTA, active nav, brand icon).
- LEDy statusu **nie** używają akcentu fioletowego — tylko legenda `fx-*`.

## Panele governance

Sekcje zakresu / audytu:

```html
<div class="panel panel--governance">...</div>
```

Obrys: `--accent-secondary` + subtelny glow.

## Context Health — LEDy

| Status API | Klasa | Kolor (token) | Znaczenie |
|------------|-------|---------------|-----------|
| `healthy` | `led led--healthy` | `--fx-money` | SSoT &lt; 24h |
| `stale` | `led led--stale` | `--fx-calm` | Starsze niż 24h |
| `missing` | `led led--missing` | `--fx-time` | Brak pliku brain/todo |

Markup (generowany w `app.js` → `fetchHealth()`):

```html
<div class="status-pill">
  <span class="led led--healthy"></span>
  flex-vcms
</div>
```

## Przyciski

| Klasa | Użycie |
|-------|--------|
| `btn-primary` | CTA (Portfolio Truth, główne akcje) |
| `btn-outline` | Run Scan, Refresh Bridge, secondary |

## Przykład importu

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="styles.css">
```

`tokens.css` **zawsze przed** `styles.css`. Terminal v2 dodaje `theme-terminal.css` **po** `styles.css`.

## Terminal theme v2 (2026-06)

Dashboard portfolio / CLI vibe (OpenCode, Hermes, Gemini CLI).

| Reguła | Wartość |
|--------|---------|
| Font UI | `--font-mono` (JetBrains Mono) na całym `body[data-app="flex-vcms"]` |
| Border radius | `--radius-terminal: 3px` max na panelach, przyciskach, chat |
| Layout | `.vcms-shell` > `.vcms-terminal` — jedno okno terminala, topbar z kropkami |
| Nawigacja | `.vcms-nav__item` — pseudo-CLI `[ DASHBOARD ]` |
| Akcent | **Fiolet** `--accent-primary` — bez emerald z przykładów zewnętrznych |
| Przyciski | `.btn-cmd` — tekstowe komendy `> Run Scan` |
| Custom CSS slot | `public/theme-terminal.css` — Dowódca może dopisać krawędzie/odstępy |

Zakaz: duże `border-radius` (8px+), Inter/sans jako font główny dashboardu, sidebar jako primary nav (ukryty — nav w topbar).

## Weryfikacja (manual)

1. `npm start` → `http://localhost:8001/`
2. Akcent UI = fiolet (nav active, brand, CTA)
3. Context Health = zielony / żółty / czerwony LED (nie fiolet)
4. Zakładka Governance = `panel--governance` border
5. Mobile bottom-nav: active item w `--accent-primary`
