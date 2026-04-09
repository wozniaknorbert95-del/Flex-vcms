---
status: "[STABLE]"
title: "PH4-011 — przygotowanie okna testu mobile (prep)"
updated: "2026-04-11"
---

# PH4-011 — prep przed testem na telefonie

Cel: mieć **pewność**, że prod jest gotowy do smoke i mobile, zanim otwierasz przeglądarkę na urządzeniu.

Pelna sekwencja (deploy → smoke → mobile → zamkniecie backlogu): [Operator runbook — PH4-011](/reference/ph4-011-operator-runbook).

## 1) Dostep i tozsamosc prod

- [ ] Znasz **URL HTTPS** docelowy (np. `https://cmd.flexgrafik.nl` — patrz [VCMS-nginx.conf](/reference/VCMS-nginx.conf)).
- [ ] Masz **login/haslo Basic Auth** z Nginx (nie zapisuj ich w repo).
- [ ] Mozesz wejsc na strone z laptopa (opcjonalnie) — potwierdza, ze DNS/TLS dziala.

## 2) SSH i stan VPS

- [ ] Masz dzialajace **SSH** do hosta uzywanego w `Deploy-VPS.ps1` (`-SshTarget` — u Ciebie moze byc inny niz przyklad z runbooka).
- [ ] Po SSH: `pm2 list` — proces **`vcms-core`** jest `online`.
- [ ] Wiesz gdzie jest **cwd** aplikacji (domyslnie `/var/www/vcms/current` — [VPS runbook](/reference/vcms-vps-runbook)).

## 3) Czy deploy jest potrzebny?

Nie wdrazaj „na slepo”. Minimalna heurystyka:

- [ ] Na laptopie: `git fetch origin` i upewnij sie, ze pracujesz na commicie, ktory **chcesz** miec na prod.
- [ ] Na VPS (SSH): porownaj **date / wersje** plikow w `cwd` (np. `server.js`, fragment `dist/index.html`) z oczekiwanym stanem z repo — lub uzyj wlasnego skrotu (np. `git rev-parse HEAD` jesli na serwerze jest git mirror; jesli nie — fingerprint plikow).
- [ ] Jesli prod jest nieaktualny: najpierw `Deploy-VPS.ps1` **-WhatIf**, potem deploy **bez** `-WhatIf` ([VPS runbook — Deploy z Windows](/reference/vcms-vps-runbook#deploy-z-windows)).

## 4) Build lokalny przed deployem

- [ ] W root repo: `npm run docs:build` (VitePress musi wygenerowac `docs/.vitepress/dist`).

## 5) Bramka przed telefonem

- [ ] Przeszedles cala [VCMS prod smoke](/checklists/vcms-prod-smoke) do **TAK** (pomoc: [Smoke — przyklady curl](/reference/ph4-011-smoke-curl)).
- [ ] Dopiero wtedy: test na **prawdziwym telefonie** i wypelnienie [handoff mobile](../handoffs/2026-04-10-ph4-011-mobile.md).

## Powiazane

- [Szablon wyniku mobile](/templates/tmpl-ph4-011-mobile)
- [Preflight 2026-04-10](../handoffs/2026-04-10-ph4-011-preflight.md)
- [Zamkniecie PH4-011 w backlogu](/reference/ph4-011-close-backlog) (po PASS)
