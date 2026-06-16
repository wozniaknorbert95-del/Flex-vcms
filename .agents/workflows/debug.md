---
description: 5-krokowa diagnostyka — bez zgadywania i quick-fixów.
---

# /debug

## Goal

Izolować root cause z dowodem (logi, repro), nie zgadywać.

## Input

Błąd, regresja, failed test, lub loop (>2 próby bez postępu → rozważ `/context-reset`).

## Agent procedure

### KROK 1 — Zbierz dane

- Dokładny komunikat błędu / stack trace.
- Kiedy się pojawił (po jakiej zmianie)?
- Deterministyczny (zawsze / czasami)?
- Środowisko: local / VPS / prod.

### KROK 2 — Sprawdź logi

- VCMS Node: `logs/vcms-error.log`, PM2 na VPS (runbook).
- Ekosystem: `docs/ecosystem/conflicts.md` po `node tools\vcms-scan.js`.
- Cross-repo: logi modułu docelowego (WP `debug.log`, Jadzia journal — patrz target repo).

### KROK 3 — Izoluj

- Który moduł/plik/linia?
- Kod vs konfiguracja vs integracja?

### KROK 4 — Root cause

Jedno zdanie: „Błąd wynika z [X], ponieważ [dowód].”

### KROK 5 — Propozycja naprawy

- Konkretna zmiana.
- Jak zweryfikujemy (komenda, scan, curl).
- **Czekaj** na potwierdzenie Dowódcy przed zmianą (chyba że wyraźnie polecił fix).

## Do

- Dokumentuj każdy z 5 kroków w Output.
- Jeśli fix zmienia scope → `/blast` update anchor.

## Don't

- STOP — nie quick-fix bez repro.
- Nie deployuj na prod w tym kroku.

## Output

```text
ISSUE: [opis]
REPRO: [kroki]
ROOT_CAUSE: [1 zdanie + dowód]
PROPOSED_FIX: [konkret]
VERIFICATION: [komenda/krok]

---
CURRENT_STAGE: F4-Test
RECOMMENDED_NEXT: [/blast | implement fix | /audit-red-team]
WHY_NEXT: [po fix → audit przed deploy]
---
```

## Done when

Root cause ma dowód; Dowódca zatwierdził fix lub ścieżka eskalacji jest jasna.
