---
status: "[STABLE]"
title: "Jeśli Jesteś Zgubiony — Protokół Ratunkowy"
---

# 🆘 Jeśli Jesteś Zgubiony — Protokół Ratunkowy

> Chaos na produkcji. Agent halucynuje. Nie wiesz co się dzieje.
> Czytaj od góry. Działaj krok po kroku. Nie panikuj.

---

## STOP. Trzy pytania diagnostyczne.

Zanim cokolwiek zrobisz, odpowiedz uczciwie:

1. **Czy produkcja działa?** — klienci mogą kupować na flexgrafik.nl / zzpackage?
2. **To regresja?** — coś działało, przestało działać po Twojej ostatniej zmianie?
3. **Masz backup?** — czy jest kopia pliku / bazy sprzed zmiany?

Odpowiedzi określają scenariusz. Idź do właściwego.

---

## 🔴 SCENARIUSZ A — Produkcja nie działa

::: danger PRIORYTET #1: PRZYWRÓĆ DZIAŁANIE
Nie debuguj przyczyny. Najpierw produkcja musi działać.
:::

**Kroki:**

1. Znajdź ostatni backup na Cyber-Folks → DirectAdmin → File Manager
2. Przywróć backup (patrz sekcja `ROLLBACK` w [deploy-wp](/playbooks/manual-release))
3. Sprawdź czy działa — uruchom w PowerShell:
   ```powershell
   (Invoke-WebRequest -Uri "https://zzpackage.flexgrafik.nl/").StatusCode
   ```
4. Oczekiwany wynik: **200**
5. Jeśli 200 → produkcja żyje. Dopiero teraz uruchom `/debug` żeby znaleźć przyczynę.

::: warning
Jeśli nie masz backupu → zadzwoń na wsparcie Cyber-Folks.
Cyber-Folks robi automatyczne snapshoty co 24h.
:::

---

## 🟡 SCENARIUSZ B — Agent halucynuje / kręci się w kółko

**Objawy:** AG proponuje to samo rozwiązanie po raz trzeci. AG "zapomniał" o global-rules. Odpowiedzi są coraz bardziej ogólne.

**Akcja:**
```
/context-reset
```

Agent zatrzyma się i wyjaśni krok po kroku:
- Co próbuje osiągnąć (cel w 1 zdaniu)
- Co już próbował (lista podejść)
- Dlaczego nie zadziałało (konkretna przyczyna)
- Nowe podejście (inne niż poprzednie)

Jeśli po **2 próbach** `/context-reset` nadal bez postępu:
→ **Zacznij nową sesję** i wpisz `/vibe-init` od zera.

---

## 🟡 SCENARIUSZ C — Nie wiem co robić następne

Nie ma paniki. Trzy kroki:

1. Otwórz `flex-vcms-todo.json` (repo VCMS) — szukaj statusu `TODO` / `IN_PROGRESS` lub najnowszego handoffu
2. Otwórz najnowszy plik w `docs/handoffs/` — znajdź sekcję "Następny krok"
3. Jeśli oba puste → powiedz AG dokładnie to:

   ```
   Przeczytaj `flex-vcms-todo.json` i `docs/core/global-rules.md`.
   Powiedz mi top 3 priorytety na tę sesję w kolejności ważności.
   ```

---

## 🟡 SCENARIUSZ D — Błąd w kodzie, nie wiem dlaczego

```
/debug
```

AG NIE zgaduje i NIE robi "quick fix". Przeprowadzi Cię przez 5 kroków:

| Krok | Co robi |
|------|---------|
| **Krok 1 — Zbierz dane** | Jaki błąd? Kiedy się pojawił? Deterministyczny? |
| **Krok 2 — Sprawdź logi** | Jadzia VPS + WordPress debug.log |
| **Krok 3 — Izoluj** | Który moduł / funkcja / linia |
| **Krok 4 — Root cause** | "Błąd wynika z X, ponieważ Y" (dowód z logów) |
| **Krok 5 — Naprawa** | Konkretna zmiana — AG czeka na Twoje zatwierdzenie |

---

## ⛔ Czego NIGDY nie robić w kryzysie

::: danger
- NIE pushuj bezpośrednio na `main` pod presją czasu
- NIE rób "szybkiego fixa" bez `/debug` — to mnożnik problemów
- NIE pozwól AG deployować autonomicznie — Ty uruchamiasz komendy
- NIE ignoruj 🔴 z `/audit-red-team` — to blokada deploy, nie sugestia
- NIE rób zmian na serwerze produkcyjnym bez backupu
:::

---

## 📍 Lokalizacja logów awaryjnych

| System | Gdzie szukać |
|--------|-------------|
| **Jadzia (VPS)** | `tail -50 /root/jadzia/logs/jadzia-error.log` |
| **Jadzia (systemd)** | `journalctl -u jadzia -n 50` |
| **WordPress** | `wp-content/debug.log` |
| **Cyber-Folks** | DirectAdmin → Error Logs |
| **Git historia zmian** | `git log --oneline -20` |
| **Ostatni deploy** | `docs/handoffs/` → najnowszy plik |

---

## 🔗 Linki ratunkowe

| Zasób | Link |
|-------|------|
| Zasady systemu | [global-rules.md](/core/global-rules) |
| Granice agentów | [agent-boundaries.md](/agents/agent-boundaries) |
| Profil AG | [antigravity.md](/agents/antigravity) |
| Deploy CF | [manual-release.md](/playbooks/manual-release) |
| Poradnik startowy | [PORADNIK_UZYTKOWNIKA.md](/PORADNIK_UZYTKOWNIKA) |
