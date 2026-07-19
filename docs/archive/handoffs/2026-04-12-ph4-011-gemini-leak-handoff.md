## SESSIONANCHOR

PROJECT: flex-vcms
PHASE: 4
MODULE: flex-vcms
WORKSPACE_ROOT: C:\Users\FlexGrafik\Desktop\flex-vcms
ECOSYSTEM_ROOT: C:\Users\FlexGrafik\FlexGrafik\github
VERIFY: node tools\vcms-scan.js
ARTIFACTS: data/vcms-index.json; docs/ecosystem/conflicts.md; docs/ecosystem/map.md; docs/ecosystem/repos/*.md
CONFLICTS: 0
LAST_HANDOFF: docs/handoffs/2026-04-12-ph4-011-gemini-leak-handoff.md
NEXT: Wgraj nowy GEMINI_API_KEY do .env na VPS, pm2 reload ecosystem.config.js --update-env, potwierdz POST /api/chat (curl + Basic Auth) bez 403 LEAKED.
BLOCKER: Gemini upstream 403 (klucz zgloszony jako wyciekly) — KODA nie odpowie do czasu nowego klucza w .env na VPS.

---

## CO ZMIENIONE / WAZNE

| Zrodlo / plik | Zmiana |
|---------------|--------|
| VPS `root@185.243.54.115` | `.env` zaktualizowany (GEMINI_API_KEY), chmod 600; `pm2 reload ecosystem.config.js --update-env`; `vcms-core` online |
| Upstream Gemini | Odpowiedz 403: klucz oznaczony jako wyciekly — aplikacja zwraca kontrolowany blad `LLM odrzucił wejście (Upstream zablokowany).` zamiast surowego komunikatu Google w UI |
| `flex-vcms-todo.json` | Istnieje zadanie **PH4-011-HOTFIX** (P0, TODO) pod wgranie nowego klucza i weryfikacje /api/chat |
| Skan lokalny (wczesniejszy) | `git status` moze pokazywac zmiany w `data/vcms-index.json` i `docs/ecosystem/*` — commit tylko przy swiadomej zmianie registry + `verify:scan` |

Co to zmienia:

- Front (VitePress, Basic Auth, Nginx) i Express przyjmuja zapytania; **blokada jest po stronie Google** na kluczu.
- Nastepna sesja zaczyna sie od **nowego klucza** wprowadzonego **bez publikowania** w czacie/repo (tylko VPS `.env`).

---

## NEXT (1 rzecz)

Wygeneruj nowy klucz API w Google AI Studio i wgraj go bezpiecznie na VPS do `.env`, potem `pm2 reload` z `--update-env` i zweryfikuj `POST /api/chat` (curl z Basic Auth).

---

## BLOCKER

Google: klucz API zgloszony jako wyciekly (403) — do usuniecia przez wgranie **nowego** klucza; nie uzywaj starego klucza ani nie wklejaj nowego w publicznych kanalach.

---

## Weryfikacja

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
node tools\vcms-scan.js
```

Oczekiwany wynik: `Conflicts: 0`.

Po naprawie klucza (na VPS / z laptopa z env):

- `GET /health` z auth — 200 + JSON.
- `POST /api/chat` z prawidlowym JSON `messages` — 200 i tresc modelu (lub kontrolowany blad upstream **inny** niz 403 LEAKED).

Szczegoly curl: [ph4-011-smoke-curl](/reference/ph4-011-smoke-curl).
