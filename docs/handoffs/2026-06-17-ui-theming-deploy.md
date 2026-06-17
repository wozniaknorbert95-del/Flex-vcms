---
status: "[COMPLETED]"
title: "UI Theming Fix & VPS Deployment Preparation"
date: "2026-06-17"
author: "Agent"
---

# Raport: UI Theming Fix & Deploy

## Zrealizowane zadania
1. **Theming Home Page (UI Fix)**:
   - Usunięto hardcodowane style inline z pliku `docs/index.md`.
   - Zastąpiono je klasami CSS powiązanymi z ekosystemem zmiennych VitePress i VCMS tokens.
   - Nowe style przeniesiono do `docs/.vitepress/theme/style.css`.
   - Rozwiązano problem niespójnego wyglądu strony głównej po zbudowaniu projektu.

2. **Ochrona plików (Guardrails)**:
   - Zweryfikowano `docs/ecosystem/conflicts.md` -> 0 konfliktów przed wykonaniem zmian.
   - Pliki zmodyfikowane to wyłącznie `docs/index.md` i `docs/.vitepress/theme/style.css`.

3. **Commit (Staging)**:
   - Utworzono poprawny commit konwencjonalny: `feat(ui): extract home page styles to VCMS theme`.

## Do wykonania przez Dowódcę (Handoff)
Zgodnie z Zasadą 11 (Agent NIGDY nie deployuje sam), kod został przygotowany. Dowódca musi uruchomić skrypt deploymentu.

### 1. Wykonaj pełny deployment:
Uruchom poniższe polecenie w terminalu PowerShell z korzenia repozytorium:

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget 'root@185.243.54.115'
```

### 2. Po deployu zweryfikuj:
1. Health check backendu:
   ```bash
   curl -s http://127.0.0.1:8001/health
   ```
2. Zaktualizowane style (frontend):
   - Odwiedź https://cmd.flexgrafik.nl/docs/ (Basic Auth) i upewnij się, że klasa np. `.dashboard-grid` ładuje się z `style.css`.

**Uwaga**: Skrypt `Deploy-VPS.ps1` zapewni odświeżenie plików root, przeładowanie pm2 (atomic swap) i zainstalowanie paczek npm. Do not use manual SCP.