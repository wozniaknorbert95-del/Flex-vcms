---
status: "[STABLE]"
title: "Granice Agentów — Kto co może"
---

# 🤖 Granice Agentów — Kto co może

> Ten dokument to twarda definicja uprawnień każdego agenta w ekosystemie FlexGrafik.
> Przekroczenie tych granic to błąd — zgłoś go do Dowódcy.

---

## Hierarchia Warstw

Ekosystem działa w 3 warstwach. Każda warstwa ma swoje uprawnienia i granice.

```
┌────────────────────────────────────────────────┐
│  DIRECTIVE LAYER — STRATEGIA                   │
│  Dowódca (Norbert) + Claude                    │
│  → Decyduje o kierunku, cenach, stacku, rules  │
├────────────────────────────────────────────────┤
│  ORCHESTRATION LAYER — PLANOWANIE              │
│  Antigravity (AG)                              │
│  → Planuje, recenzuje, blokuje naruszenia      │
├────────────────────────────────────────────────┤
│  EXECUTION LAYER — EGZEKUCJA                   │
│  Gemini CLI + Jadzia                           │
│  → Wykonuje konkretne zadania, raportuje       │
└────────────────────────────────────────────────┘
```

::: warning Zasada hierarchii
Execution Layer **NIE może** przeskakiwać ponad Strategię.
Agenty nie podejmują samodzielnych decyzji biznesowych ani architektonicznych.
:::

---

## 🛸 Antigravity (AG) — Orchetracja

### ✅ AG MOŻE:
- Generować kod, diffy, instrukcje — na podstawie zatwierdzonego planu
- Planować architekturę featurów przez framework BLAST
- Przygotowywać komendy deploy — ale **nie uruchamiać ich**
- Samodzielnie naprawiać błędy — maksymalnie **3 próby (self-healing)**
- Sugerować zmiany w `global-rules.md` — decyzja należy do Dowódcy
- Blokować rozwiązania łamiące global-rules i zgłaszać `KONFLIKT Z global-rules.md`
- Eskalować do Dowódcy gdy 3 próby self-healing zawiodły

### ❌ AG NIE MOŻE:
- Deployować na produkcję **autonomicznie** (Zasada 11)
- Pushować bezpośrednio na gałąź `main`
- Modyfikować schematu DB bez wcześniejszego wpisu w `PRD-schema.md`
- Stosować Elementor / page builderów (Zero Elementor)
- Forsować rozwiązań sprzecznych z global-rules
- Implementować "wszystkiego naraz" — blokuje zasada 1-1-1
- Samodzielnie zmieniać stack techniczny

---

## ⚙️ Gemini CLI — Egzekucja

Używasz Gemini CLI do lokalnych zadań budowania / generowania plików.

### ✅ GEMINI CLI MOŻE:
- Budować pliki i struktury katalogów wg blueprintu
- Uruchamiać skrypty lokalnie (`npm`, `composer`, `python`)
- Generować boilerplate na podstawie zatwierdzonych szablonów
- Czytać i modyfikować pliki lokalne

### ❌ GEMINI CLI NIE MOŻE:
- Podejmować samodzielnych decyzji architektonicznych
- Modyfikować `global-rules.md` bez decyzji Dowódcy
- Deployować na serwer produkcyjny
- Edytować plików WordPress przez SSH bez dyrektywy Dowódcy

---

## 🤖 Jadzia — AI Core (VPS)

Jadzia to Vice-Dyrektor ekosystemu. Orkiestruje dane w `jadzia.db`.

### ✅ JADZIA MOŻE:
- Orkiestrować dane i procesy w `jadzia.db`
- Automatyzować wewnętrzne procesy (powiadomienia, raporty)
- Generować logi, statystyki, podsumowania
- Komunikować się z AG przez MCP (tools, resources)

### ❌ JADZIA NIE MOŻE:
- Bezpośrednio edytować plików WordPress przez SSH
- Modyfikować motywów / pluginów WP bez Dowódcy
- Pushować kod na GitHub
- Podejmować decyzji cennikowych lub architektonicznych

---

## 👤 Dowódca (Norbert) — Wyłączne Prawa

Tylko Dowódca może podjąć te akcje:

| Akcja | Dlaczego wyłącznie Dowódca |
|-------|---------------------------|
| Deploy na produkcję (CF / VPS) | Zasada 11 — Manual Deploy |
| Zatwierdzanie merge do `main` | Branching & PR |
| Zmienianie `global-rules.md` | Single Source of Truth |
| Decyzje cennikowe / biznesowe | Directive Layer |
| Zmiana stack techniczny | Stabilność systemu |
| Zgoda na zmianę schematu DB | PRD-schema.md gate |

::: danger
Jeśli jakikolwiek agent **sugeruje** wykonanie działania z tej listy autonomicznie →
Zgłoś naruszenie i zignoruj propozycję.
Opis naruszenia zapisz w `docs/journal/`.
:::

---

## �� Tabela Uprawnień — Szybki Przegląd

| Akcja | Dowódca | AG | Gemini | Jadzia |
|-------|---------|----|----|--------|
| Deploy na produkcję | ✅ | ❌ | ❌ | ❌ |
| Push do `main` | ✅ | ❌ | ❌ | ❌ |
| Zmiana global-rules | ✅ | ❌ sugeruje | ❌ | ❌ |
| Generowanie kodu | ✅ | ✅ | ✅ | ❌ |
| Planowanie BLAST | ✅ | ✅ | ❌ | ❌ |
| Self-healing (3x) | — | ✅ | ❌ | ❌ |
| Edycja `jadzia.db` | ✅ | ❌ | ❌ | ✅ |
| Uruchamianie skryptów lokalnych | ✅ | ❌ | ✅ | ❌ |
