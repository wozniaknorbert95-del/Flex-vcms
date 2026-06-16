---
status: "[GENERATED — run npm run scan to refresh]"
title: "VCMS Scan Report — Demo Artifact"
---

# VCMS Scan Report (Demo)

> **Wygeneruj na żywo:** `npm run scan`  
> Ten plik opisuje artefakty do pokazania klientowi. Aktualne dane są w plikach poniżej.

## Jak uruchomić

```powershell
cd flex-vcms
npm run scan
```

## Artefakty do pokazania (w tej kolejności)

| # | Plik | Co pokazuje |
|---|------|-------------|
| 1 | [conflicts.md](../ecosystem/conflicts.md) | Konflikty SSoT (0 = zielone) |
| 2 | [map.md](../ecosystem/map.md) | 8 modułów, guardrails, readiness |
| 3 | `data/vcms-index.json` | Hash/mtime plików wiedzy (lokalnie) |
| 4 | [latest-verification.md](../audits/latest-verification.md) | Prod security PASS (ops) |

## Script demo (90s)

1. Terminal: `npm run scan` → pokaż `Conflicts: 0`
2. Otwórz `conflicts.md` w edytorze / VitePress
3. Otwórz `map.md` — pokaż mermaid + tabelę repo
4. Jednym zdaniem: *„VCMS skanuje ekosystem, wykrywa rozjazdy SSoT i generuje raport — zanim cokolwiek trafi na produkcję.”*

## Czego nie obiecywać w tym demo

- LLM chat (wyłączony)
- Approval workflow (Agent OS)
- Automatyczny deploy (manual only)
