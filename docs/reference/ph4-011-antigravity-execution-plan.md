---
status: "[STABLE]"
title: "PH4-011 — plan wykonania dla Antigravity (deploy + smoke + mobile + backlog)"
updated: "2026-04-12"
---

# PH4-011 — plan wykonania dla Antigravity

Ten dokument jest **jednym SSoT** dla sesji, w której Antigravity (AG) prowadzi Dowódcę przez **deploy (opcjonalnie) → smoke → mobile → ewentualne zamknięcie PH4-011**.

Powiazane (czytaj przed startem):

- [Operator runbook](/reference/ph4-011-operator-runbook)
- [Mobile prep](/checklists/ph4-011-mobile-prep)
- [Smoke checklist](/checklists/vcms-prod-smoke)
- [Smoke curl + env](/reference/ph4-011-smoke-curl)
- [Zamknięcie backlogu + anty-wzory](/reference/ph4-011-close-backlog)
- [Handoff mobile (do wypełnienia)](../handoffs/2026-04-10-ph4-011-mobile.md)
- Jakość raportów: [Session Anchor spec — §4](/core/session-anchor-and-handoff-spec#4-raporty-agentow-audyt-read-only-jakosc-minimalna)

---

## 1) Zasady twarde (nie do negocjacji)

1. **Sekrety:** hasła Basic Auth i klucze API **tylko** w zmiennych środowiskowych bieżącej sesji PowerShell (`$env:...`). **Zakaz** zapisu haseł w repo, w plikach `.md`, w commitach.
2. **Smoke:** odpowiedź **401 bez nagłówka Authorization** **nie** jest „PASS smoke” — to co najwyżej potwierdzenie, że Nginx wymaga auth. Pełny PASS = punkty z [vcms-prod-smoke](/checklists/vcms-prod-smoke) z wynikiem **TAK** (z auth).
3. **Mobile:** acceptance zadania **PH4-011** w pliku `flex-vcms-todo.json` wymaga **fizycznego** iOS lub Android. **Zakaz** zamykania PH4-011 na podstawie emulatora, „Chromium w terminalu”, headless automation jako zamiennika telefonu.
4. **Backlog:** `PH4-011` → `DONE` **tylko** gdy jednocześnie: smoke **PASS** + mobile **PASS** + wypełniony handoff z **konkretnym modelem urządzenia** (np. „iPhone 14, Safari”) i datą testu.
5. **Skan:** po `node tools/vcms-scan.js` — w raporcie podaj **`git status`** (czysty / lista plików). Nie commituj zmian w `docs/ecosystem/*` ani `data/vcms-index.json`, jeśli **nie** było świadomej zmiany `repos.yaml` / skanera (wtedy `npm run verify:scan` + świadomy commit).

---

## 2) Wejście od Dowódcy (przed Fazą 0)

Dowódca musi potwierdzić w czacie (wystarczy krótko):

- [ ] Mam działające **SSH** na właściwy host deployu (`-SshTarget`, np. `root@185.243.54.115` lub host z DNS).
- [ ] Mam **login/hasło** Basic Auth (wpiszę je sam w `$env`, nie wklejam do AG w treści trwałej).
- [ ] Docelowy URL prod do smoke: **preferowane `https://cmd.flexgrafik.nl`** (HTTPS). Użycie samego `http://IP` tylko jeśli Dowódca wyraźnie mówi, że tak testuje ten sam vhost.
- [ ] Rozumiem, że **ja** wykonam kroki na **fizycznym telefonie**; AG tylko **prowadzi checklistę** i zapisuje moje odpowiedzi w handoffie.

---

## 3) Faza 0 — higiena repo (pierwsza komenda)

Na maszynie Dowódcy, w root `flex-vcms`:

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
git status -sb
```

- Jeśli widzisz zmiany w `data/vcms-index.json` lub `docs/ecosystem/*` **bez** świeżej edycji registry: **nie kontynuuj** do commita PH4-011 — najpierw `git restore` tych plików (jak w [close-backlog — po skanie](/reference/ph4-011-close-backlog)) albo świadomy commit skanu.
- Zapisz w raporcie końcowym: branch (`git branch --show-current`) i skrót `git status`.

---

## 4) Faza 1 — build lokalny i deploy

### 4.1 Build

```powershell
npm run docs:build
```

Oczekiwanie: koniec bez błędu; istnieje `docs\.vitepress\dist`.

### 4.2 WhatIf

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Deploy-VPS.ps1 -SshTarget '<SSH_TARGET>' -WhatIf
```

Podstaw **dokładny** `<SSH_TARGET>` zatwierdzony przez Dowódcę.

### 4.3 Deploy rzeczywisty (tylko na wyraźne polecenie Dowódcy)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Deploy-VPS.ps1 -SshTarget '<SSH_TARGET>'
```

Po deploy (Dowódca może wkleić wynik):

```bash
ssh <SSH_TARGET> "pm2 list"
```

Oczekiwanie: proces **`vcms-core`** — `online`.

W raporcie: **DEPLOY wykonano / pominięto** + jedno zdanie uzasadnienia.

---

## 5) Faza 2 — smoke prod (obowiązkowa bramka)

### 5.1 Przygotuj env (Dowódca w tej samej sesji PowerShell)

Wzorzec: [ph4-011-smoke-curl](/reference/ph4-011-smoke-curl).

```powershell
$env:VCMS_BASE_URL = "https://cmd.flexgrafik.nl"
$env:VCMS_BASIC_USER = "<login>"
$env:VCMS_BASIC_PASS = "<haslo>"
```

### 5.2 Wykonaj cztery strzały i zapisz wynik (TAK/NIE + HTTP + skrót ciała)

| # | Cel | Oczekiwane przy PASS |
|---|-----|----------------------|
| 1 | `GET /health` | **200**, JSON z polami typu `status`, `uptime`, `timestamp` |
| 2 | Strona główna | **200**, HTML VitePress (nie strona błędu „gołego” Nginx) |
| 3 | `GET /api/knowledge` | **200** JSON lub **500** z `{"error":...}` — świadomy wynik aplikacji, nie 502 |
| 4 | `POST /api/chat` z pustym JSON | **400** walidacji |

Komendy kopiuj z [ph4-011-smoke-curl](/reference/ph4-011-smoke-curl) (dostosuj `VCMS_BASE_URL` jeśli Dowódca testuje inny host).

**STOP:** jeśli którykolwiek punkt ≠ TAK — **nie przechodź do Fazy 3**. Raport: **SMOKE FAIL**, sekcja diagnostyka (propozycja: `pm2 logs vcms-core`, `nginx -t`), rollback wg [vcms-prod-smoke](/checklists/vcms-prod-smoke).

Po smoke:

```powershell
Remove-Item Env:VCMS_BASIC_USER, Env:VCMS_BASIC_PASS -ErrorAction SilentlyContinue
```

---

## 6) Faza 3 — mobile (tylko po SMOKE PASS)

AG **nie** symuluje telefonu. Protokół:

1. Dowódca na **fizycznym** urządzeniu otwiera **`https://cmd.flexgrafik.nl`** (lub URL z Fazy 2).
2. Loguje się Basic Auth.
3. Sprawdza po kolei: czytelność docs, dotyk sidebar/menu, **KODA** — jedna wiadomość lub kontrolowany błąd **bez** wycieku sekretów w UI.
4. Dowódca na głos (w czacie): **PASS** lub **FAIL** + przy FAIL jeden konkretny ekran/komponent + jeden NEXT.

AG aktualizuje [2026-04-10-ph4-011-mobile.md](../handoffs/2026-04-10-ph4-011-mobile.md):

- `DATA` — data testu
- `URL_PROD` — faktyczny URL
- `URZADZENIE` — **konkretny model** (np. „Samsung Galaxy S23, Chrome 124”) — **wymagane**
- `WYNIK` — PASS lub FAIL
- checklisty `[x]` / `[ ]` zgodnie z odpowiedziami Dowódcy
- przy FAIL: wypełniona sekcja FAIL + jeden NEXT

Frontmatter `status`: `[DONE]` tylko przy **PASS**; przy FAIL zostaw `[PENDING_OPERATOR]` lub ustaw opisowy status zgodnie z konwencją repo.

---

## 7) Faza 4 — zamknięcie `flex-vcms-todo.json` (tylko przy obu PASS)

Wykonaj dokładnie procedurę z [ph4-011-close-backlog](/reference/ph4-011-close-backlog):

- `PH4-011`: `"status": "DONE"`, `"done_at": "YYYY-MM-DD"` (data testu mobile)
- `note`: krótka linia z dowodem na handoff mobile

**Zakaz** zmiany `PH4-011` na DONE, jeśli mobile nie było na fizycznym urządzeniu — patrz [anty-wzory](/reference/ph4-011-close-backlog).

Potem:

```powershell
npm run docs:build
git add flex-vcms-todo.json docs/handoffs/2026-04-10-ph4-011-mobile.md
git status -sb
```

Commit z jasnym opisem (np. `docs(ph4-011): mobile PASS evidence + close backlog`). Push / PR wg workflow Dowódcy.

---

## 8) Faza 5 — skan (opcjonalnie)

Tylko jeśli w tej sesji zmieniano `repos.yaml`, `scan-rules.json` lub `tools/vcms-scan.js`:

```powershell
node tools\vcms-scan.js
npm run verify:scan
git status -sb
```

W raporcie: `Conflicts: N` oraz czy drzewo jest czyste po zamierzonym commicie.

---

## 9) Format raportu końcowego AG (wklej na koniec sesji)

Użyj **spójnej daty** (`DATA_RAPORTU` = dzień zakończenia sesji). `NEXT` = **jedno zdanie, jedna akcja** (np. „Dowódca wykonuje Fazę 3 na iPhone i potwierdza PASS w czacie”).

```markdown
## RAPORT AG — PH4-011 (wg ph4-011-antigravity-execution-plan)

### SESSIONANCHOR (skrót)
- REPO: flex-vcms
- DATA_RAPORTU: YYYY-MM-DD
- session_anchor.id: (z flex-vcms-todo.json)
- BRANCH: (git branch --show-current)

### Wynik
- DEPLOY: Wykonano / Pominięto — (1 zdanie)
- SMOKE: PASS / FAIL — (tabela skrótów #1–#4)
- MOBILE: PASS / FAIL / NIE WYKONANO — URZADZENIE: …
- PH4-011 w todo: DONE / TODO — uzasadnienie

### Git / skan
- git status (przed commitem): …
- verify:scan (jeśli dotyczy): …

### NEXT (jedna rzecz)
- …
```

---

## 10) Szybka lista zakazów (dla AG)

- Zamykaj PH4-011 jako DONE bez **fizycznego** telefonu w opisie dowodu.
- Traktuj sam **401** bez pełnej checklisty smoke jako sukces produktu.
- Wklejaj hasła do plików repo lub do commitów.
- Commituj „szum” po skanie bez zmiany registry.
- Pisz `NEXT` jako ukrytą listę wielu kroków w jednym zdaniu (§4 spec).

---

## Prompt startowy (wklejka jednolinijkowa do AG)

> Wykonaj **od początku do końca** plan z pliku `docs/reference/ph4-011-antigravity-execution-plan.md` na maszynie Dowódcy: Faza 0→5, przestrzegaj zakazów z §1 i §10, na końcu wklej raport z §9. Nie ustawiaj PH4-011 na DONE bez mojego potwierdzenia mobile na fizycznym telefonie z modelem w handoffie.
