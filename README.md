# 🛠️ VCMS — Local-First Gateway & Orchestrator

VCMS (Command Center) to serce Twojego ekosystemu. Pełni rolę bezpiecznej bramki LLM (Gateway), rejestru modułów oraz centralnego punktu prawdy (SSoT).

## 🚀 Szybki Start (Junior Vibecoder)

Jeśli właśnie sklonowałeś to repozytorium, wykonaj te 3 kroki:

1.  **Zainstaluj zależności**:
    ```powershell
    npm install
    ```
2.  **Skonfiguruj klucze (Dotenvx)**:
    Poproś Dowódcę o `DOTENV_PUBLIC_KEY` lub wklej swój klucz do `.env` i uruchom:
    ```powershell
    npx dotenvx encrypt
    ```
3.  **Sprawdź zdrowie ekosystemu**:
    ```powershell
    node tools\vcms-scan.js
    ```
    Oczekiwany wynik: `Conflicts: 0`.

## 📂 Gdzie jest PRAWDA? (SSoT)

- **Backlog całego ekosystemu**: [flex-vcms-todo.json](flex-vcms-todo.json)
- **Kontrakt operacyjny Dowódcy**: [brain.md](brain.md)
- **Mapa modułów**: [docs/ecosystem/map.md](docs/ecosystem/map.md)
- **Handoffy z sesji**: [docs/handoffs/](docs/handoffs/)

## 🛡️ Zasady Gry (Guardrails)

1.  **Zasada 1-1-1**: 1 sesja = 1 moduł = 1 zadanie.
2.  **Brak sekretów**: Nigdy nie commituj jawnych kluczy w `.env`. Używaj `dotenvx`.
3.  **Manual Deploy**: Deploy na VPS wykonuje tylko Dowódca (lub za jego wyraźną zgodą).

## 📊 Monitoring

Gateway posiada dashboard dostępny lokalnie:
`http://localhost:8001/dashboard.html`

---
*V6.5 Swiss Watch Standard — FlexGrafik V4.0*
