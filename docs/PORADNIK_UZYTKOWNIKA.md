---
status: "[STABLE]"
title: "Poradnik Użytkownika — Start Tutaj"
---

# 🚀 Poradnik Użytkownika — Zacznij Tutaj

> Wróciłeś po przerwie? Zaczynasz od zera? Ten dokument to Twój **punkt startowy**.
> Czytaj od góry do dołu. Nie pomijaj.

---

## Co to jest VCMS?

**Vibe Coding Mastery System** to Twój osobisty system operacyjny dla pracy z AI.
Zamiast każdą sesję zaczynać od zera i tłumaczyć agentowi wszystko od nowa, VCMS zapewnia że:

- Agenty (AG, Gemini) **zawsze znają reguły gry** — nie trzeba im tłumaczyć od zera
- Każda sesja ma **jasny start i jasny koniec** — wiesz gdzie jesteś
- **Żadna wiedza nie ginie** między sesjami — handoff to obowiązek
- Deploy na produkcję jest **zawsze kontrolowany przez Ciebie** — agenty nigdy nie deployują autonomicznie

---

## 🔁 JAK DZIAŁA SESJA — Krok po Kroku

### KROK 1 — Otwórz sesję komendą `/vibe-init`

Wpisz to Antigravity (AG) na początku **KAŻDEJ** sesji:

```
/vibe-init
```

AG przeczyta PRD-core.md, todo.json i powie Ci w 2 zdaniach co rozumie jako cel sesji.
**Zatwierdź lub popraw** zanim AG napisze JAKIKOLWIEK kod.

---

### KROK 2 — Zanim zaczniecie feature: `/blast`

```
/blast [opisz krótko co chcesz zrobić]
```

AG używa frameworka BLAST, żeby zaplanować pracę:

| Litera | Co to | Po co |
|--------|-------|-------|
| **B** — Background | Kontekst, co rozwiązujemy | Żeby AG rozumiał problem |
| **L** — Limitations | Ograniczenia, zakres plików | Żeby AG nie wychylał się poza scope |
| **A** — Actions | Konkretne kroki implementacji | Żebyś wiedział co się będzie dziać |
| **S** — Success | Definicja DONE | Żeby wiedzieć kiedy skończyć |
| **T** — Tests | Jak weryfikujemy że działa | Żeby nie wychodzić bez smoketest |

::: info
**Zawsze zatwierdź plan BLAST** zanim AG napisze pierwszą linię kodu.
Bez zgody Twojej = AG nie pisze kodu.
:::

---

### KROK 3 — Implementacja: Zasada 1-1-1

AG implementuje **JEDEN moduł na raz**.

```
1 moduł → 1 diff → 1 wdrożenie → sprawdź → powtórz
```

Ty wdrażasz. Sprawdzasz. Dopiero potem AG robi następny element.

::: danger ZAKAZANE
Nigdy nie mów "zrób wszystko naraz".
To jest przepis na regresje, konflikty i utratę kontroli nad projektem.
:::

---

### KROK 4 — Przed deploy: `/audit-red-team`

```
/audit-red-team
```

AG "atakuje" swój własny kod jak red team. Sprawdza:
- 🔒 Security (sekrety w kodzie, walidacja inputów, SQL injection)
- 📡 Reliability (co gdy API nie odpowie, co przy duplikacji)
- 🗄️ Data (backup przed migracją, rollback możliwy?)
- 🌐 WordPress (wp-config.php poza repo, PHP zwalidowany?)

Wynik: **🟢 Gotowe / 🟡 Drobne uwagi / 🔴 Blokuje deploy**

::: warning
**Tylko 🟢 jedzie na produkcję.** Przy 🔴 — najpierw naprawa, potem audit ponownie.
:::

---

### KROK 5 — Deploy ZAWSZE ręcznie przez Ciebie

AG przygotuje gotowe komendy przez `/deploy-cf` lub `/deploy-wp`.
**Ty je uruchamiasz.** AG NIGDY nie deployuje autonomicznie.

```powershell
# Przykład — AG przygotuje, Ty uruchamiasz:
scp -i C:\Users\FlexGrafik\.ssh\cyberfolks_key -P 222 deploy.tar.gz ...
```

---

### KROK 6 — Zakończ sesję: `/handoff`

```
/handoff
```

AG zapisze raport sesji:
- Co zrobiono (lista zmian)
- Stan obecny (branch, ostatni commit)
- Co niedokończone (i dlaczego)
- **Następny krok** (1 zdanie na start kolejnej sesji)

::: danger
Bez handoffu — wiedza ginie między sesjami.
To obowiązek, nie opcja. AG przypomni jeśli spróbujesz zakończyć bez handoffu.
:::

---

## 🧭 MAPA KOMEND — Slash Commands

| Komenda | Kiedy używać | Co robi |
|---------|-------------|---------|
| `/vibe-init` | **Start KAŻDEJ sesji** | Czyta kontekst projektu, proponuje cel, czeka na zatwierdzenie |
| `/blast` | Przed każdym nowym featurem | Analiza BLAST + plan → czeka na zatwierdzenie |
| `/audit-red-team` | Przed każdym deploy | Red team audyt bezpieczeństwa i zgodności |
| `/deploy-cf` | Deploy na Cyber-Folks | Przygotowuje komendy SCP + SSH |
| `/deploy-wp` | Deploy WordPress | Backup → pull → smoke test |
| `/debug` | Gdy coś nie działa | 5-krokowa diagnostyka root cause, nie zgaduje |
| `/context-reset` | AG kręci się w kółko (>2 próby) | Reset — AG tłumaczy problem i nowe podejście |
| `/handoff` | **Koniec KAŻDEJ sesji** | Raport + commit + push |

---

## ⚡ 3 ZŁOTE ZASADY

::: tip ZASADA 1 — Plan przed kodem
Zawsze `/blast` przed implementacją. Zawsze czekaj na zatwierdzenie planu.
Kod bez planu = chaos i regresje.
:::

::: tip ZASADA 2 — Zasada 1-1-1
Jeden moduł. Jeden diff. Jedno wdrożenie. Sprawdź. Powtarzaj.
Nie "wszystko naraz" — nigdy.
:::

::: tip ZASADA 3 — Deploy to Ty, nie AG
AG daje gotowe komendy. Ty je uruchamiasz. Ty masz kontrolę.
Nigdy odwrotnie.
:::

---

## 🗺️ Mapa Strony — Co gdzie znajdziesz

| Sekcja | Zawartość |
|--------|-----------|
| [⚙️ CORE](/core/global-rules) | Nienaruszalne zasady systemu V4.0 |
| [🤖 AGENTS](/agents/agent-boundaries) | Kto co może — granice agentów |
| [📘 PLAYBOOKS](/playbooks/feature-loop) | Pełne opisy operacji krok po kroku |
| [☑️ CHECKLISTS](/checklists/prep-deploy) | Listy do zaklikania przed deploy i commitem |
| [📚 REFERENCE](/reference/glossary) | Słownik, złote prompty, antywzorce |
| [📝 TEMPLATES](/templates/tmpl-session-log) | Gotowe szablony YAML do sesji i incydentów |
| [📔 JOURNAL](/journal/logs-index) | Rejestr operacyjny — historia sessions |
| [🧪 LAB](/lab/lab-index) | Poligon promptów i eksperymentów |
| [🧠 STUDY](/study/study-index) | Systematyczna nauka technologii |

---

## 🆘 Pomoc — Gdzie szukać?

| Sytuacja | Gdzie iść |
|----------|----------|
| Chaos i nie wiesz co robić | [→ if-lost.md](/if-lost) |
| Coś się zepsuło w kodzie | Wpisz `/debug` |
| Agent się gubi i powtarza | Wpisz `/context-reset` |
| Chcesz poznać zasady systemu | [→ global-rules.md](/core/global-rules) |
| Chcesz wiedzieć co może AG | [→ agent-boundaries.md](/agents/agent-boundaries) |
| Chcesz rozumieć jak rozmawiać z AG | [→ antigravity.md](/agents/antigravity) |
