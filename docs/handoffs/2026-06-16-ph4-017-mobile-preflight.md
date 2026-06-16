# PH4-017 PREFLIGHT — Real Device Mobile Test (4G/5G)

**Date:** 2026-06-16  
**Status:** READY FOR DOWÓDCA (5–10 min na telefonie)  
**Blocked on:** Norbert — wymaga fizycznego urządzenia na komórkowej sieci

## SESSIONANCHOR

PROJECT: flex-vcms  
PHASE: 4  
MODULE: flex-vcms  
NEXT: Wypełnij ten test na telefonie → `docs/handoffs/2026-06-16-ph4-017-mobile-real.md`  
BLOCKER: Agent nie ma dostępu do Twojego telefonu ani sieci 4G/5G  

## CO JUŻ GOTOWE (agent)

- Prod hardening DONE (PH4-016) — 13/13 audit PASS (2026-06-16 06:15 UTC)
- Weekly audit cron aktywny na VPS
- URL prod: **https://cmd.flexgrafik.nl** (TLS + Basic Auth)

## TWOJA PROCEDURA (krok po kroku)

### Przed testem

1. **Wyłącz Wi-Fi** na telefonie — tylko **4G lub 5G**
2. **Nie używaj** hosts-file / VPN / DNS override
3. Otwórz **Chrome lub Safari** (prywatna karta opcjonalnie)

### Test (5 min)

| # | Akcja | PASS jeśli |
|---|--------|------------|
| 1 | Wejdź na `https://cmd.flexgrafik.nl` | Popup Basic Auth się pojawia |
| 2 | Zaloguj (`dowodca` + hasło) | Strona docs się ładuje |
| 3 | Scroll dokumentacji | Brak poziomego scroll-only UI |
| 4 | Otwórz menu / sidebar (dotyk) | Nawigacja działa |
| 5 | Wyślij 1 wiadomość do KODY (jeśli dostępna) | Odpowiedź lub kontrolowany błąd (nie 500) |

### Po teście

Skopiuj szablon `docs/templates/tmpl-ph4-011-mobile.md` → zapisz jako:

```
docs/handoffs/2026-06-16-ph4-017-mobile-real.md
```

Wypełnij: URZĄDZENIE, WYNIK (PASS/FAIL), checklistę, ewentualny NEXT.

## WERYFIKACJA PROD (agent — przed Twoim testem)

```
Weekly audit: 13/13 PASS (2026-06-16)
vcms-scan: Conflicts 0
vcms-core: online na VPS
```

## NEXT po PASS

- Oznacz PH4-017 → DONE w `flex-vcms-todo.json`
- Następny fokus: **zzpackage** (Wizard / Cash Engine) lub backlog z meta

## NEXT po FAIL

- Jeden konkretny ekran/komponent w handoff
- Osobna sesja UX fix (nie mieszaj z Wizardem)
