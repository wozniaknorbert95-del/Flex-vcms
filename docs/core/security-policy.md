---
status: "[STABLE]"
title: "Security Policy — Orchestrator (flex-vcms)"
updated: "2026-04-09"
---

# Security Policy — Orchestrator (flex-vcms)

Ten dokument jest kanoniczną polityką bezpieczeństwa dla pracy lokalnej z Orchestratorem `flex-vcms`.
Cel: **minimalizować ryzyko wycieku sekretów i przypadkowych błędów operacyjnych** bez dokładania złożoności narzędziowej.

---

## 1) Zakres i definicje

### Co chronimy

- **Sekrety**: hasła, tokeny API, klucze prywatne, cookies/session, credentials.
- **Konfiguracje produkcyjne**: pliki typu `wp-config.php`, ustawienia serwerów, dane dostępowe.
- **Dane wrażliwe**: anything customer-identifying / billing / private logs.

### Read-only first

- Default: planujemy i weryfikujemy na artefaktach (`docs/`, `data/`) bez dotykania repo modułów.
- Zmiany w kodzie modułów (w `C:\Users\FlexGrafik\FlexGrafik\github\...`) dopiero po planie i w ramach 1-1-1.

---

## 2) Absolutne zakazy (P0)

### Nigdy nie skanujemy / nie commitujemy / nie udostępniamy

Zgodnie z `scan-rules.json` oraz checklistami:

- `.env`, `.env.local`, `.env.production`, **wszystkie** `.env*`
- `wp-config.php`
- kluczy SSH (`id_rsa`, `.pem`) i jakichkolwiek credentials
- plików binarnych/archiwów (`.zip/.tar/.gz/.7z/...`)
- katalogów technicznych/tymczasowych: `.git`, `node_modules`, `dist/build`, cache, `archive/_legacy/backup`

### Produkcja

- Deploy na produkcję jest **manual-only** (Zasada 11). Agenty nie wykonują deployu autonomicznie.

---

## 3) Dozwolone źródła danych (whitelist)

Orchestrator ma prawo bazować (czytać/indeksować/omawiać) wyłącznie na tym, co jest zgodne z `scan-rules.json`:

- pliki i katalogi: `docs/core`, `docs/handoffs`, `.cursor/rules`, `system/audit`, oraz kanoniczne pliki brain/todo
- rozszerzenia: `.md`, `.mdc`, `.json`, `.yml`, `.yaml`, `.txt`
- limit rozmiaru pojedynczego pliku: **1 MB**

Wszystko poza whitelistą traktuj jako **out of scope** dla Orchestratora (chyba że Dowódca zdecyduje inaczej).

---

## 4) Least Privilege — kontekst dla agentów

### Zasada

Agent dostaje **minimalny** kontekst potrzebny do zadania, nie dump całego repo.

### Zakazane wzorce

- wklejanie całych `.env*` lub `wp-config.php` do czatu
- kopiowanie logów zawierających tokeny / sesje
- przekazywanie całych katalogów, jeśli wystarczy 1 plik lub 1 funkcja

### Context Packet (praktyczny standard)

- 1–3 pliki z `docs/` + 1 artefakt skanu (np. `docs/ecosystem/conflicts.md`)
- 1 repo page (`docs/ecosystem/repos/<slug>.md`) jeśli decyzja dotyczy repo

---

## 5) Wykryto sekret — mini playbook incydentu (P0)

### STOP conditions (natychmiast)

Jeśli widzisz sekret w pliku / diff / czacie:

- **STOP**: nie commituj, nie pushuj, nie kopiuj dalej.

### Minimalny proces

1) **Izolacja**: usuń sekret z miejsca ekspozycji (nie wklejaj ponownie).
2) **Sanity check**: sprawdź czy sekret nie trafił do:\n
   - historii git\n
   - handoffów\n
   - artefaktów `docs/` / `data/`\n
3) **Rotacja**: rotacja klucza/tokena jest akcją Dowódcy (nie automatu).
4) **Raport**:\n
   - wpis w `docs/journal/` (co się stało, gdzie, jaki impact)\n
   - handoff z BLOCKER/impact + NEXT (1 rzecz)\n

Recovery i procedury awaryjne: [if-lost.md](/if-lost)\n
Pre-commit guard: [pre-commit.md](/checklists/pre-commit)

---

## 6) Minimalne kontrole przed zamknięciem sesji (P0)

- [ ] Brak `.env*` i innych sekretów w `git status` (nie dodawaj do repo).
- [ ] Brak tokenów/sekretów w diff (przejrzyj `git diff` / `git diff --staged`).
- [ ] `node tools\vcms-scan.js` → `Conflicts: 0` (Orchestrator jest spójny).
- [ ] Handoff ma `VERIFY` i oczekiwany wynik.
- [ ] Link do tej polityki jest w manualach (CORE + poradnik) — jedna prawda, bez duplikacji.

---

## 7) Integracja z Quality Gates (Phase 3)

- Ta polityka jest dowodem dla **Gate 0 (Safety)** w: [phase-3-verification.md](/checklists/phase-3-verification)
- Jest komplementarna do: [pre-commit.md](/checklists/pre-commit)

---

## How to verify (lokalnie, bez produkcji)

1) Otwórz `scan-rules.json` i sprawdź, że denylist zawiera `.env*` i `wp-config.php`.
2) Uruchom skan:\n
   - `Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"`\n
   - `node tools\vcms-scan.js`\n
3) Sprawdź `docs/ecosystem/conflicts.md` → `Conflicts found: 0`.
4) Przed commitem przejdź: [pre-commit.md](/checklists/pre-commit).

