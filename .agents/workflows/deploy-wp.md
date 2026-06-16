---
description: Przygotowanie deploy WordPress (Cyber-Folks) — Zasada 11, Dowódca wykonuje komendy.
---

# /deploy-wp

## Goal

Wygenerować **checklistę i komendy** deploy WP — agent **nie wykonuje** SSH/git na produkcji.

## Input

- `VERDICT: PASS ✅` z `/audit-red-team` w bieżącej sesji (lub jawne OVERRIDE Dowódcy).
- Target: repo modułu WP (np. zzpackage, flexgrafik-nl) — ścieżka z `repos.yaml`.
- Znane: `[sciezka-wp]`, `[sciezka-projektu]`, `[domena]`, metoda deploy (GHA vs git pull).

## Agent procedure

### KROK 1 — Gate

- Brak PASS → STOP, wymuś `/audit-red-team`.
- Potwierdź Zasada 11: **AWAIT_COMMANDER_EXECUTION**.

### KROK 2 — Backup (komendy dla Dowódcy)

```bash
TS=$(date +%Y%m%d-%H%M%S)
cp -a [sciezka-wp] [sciezka-wp]-backup-$TS
```

### KROK 3 — Deploy (wybierz kanon modułu)

**zzpackage kanon:** GitHub Actions — nie sugeruj surowego git pull jeśli moduł wymaga GHA.

**Ogólny WP (git na serwerze):**

```bash
cd [sciezka-projektu]
git pull origin main
```

### KROK 4 — Cache

- WP-Rocket / LiteSpeed purge — instrukcja z modułu docelowego.
- Smoke: `curl -f https://[domena]`

### KROK 5 — Manual verify (checklist)

- [ ] Frontend ładuje się
- [ ] Admin panel OK
- [ ] Feature z BLAST Success Criteria
- [ ] `wp-content/debug.log` bez nowych CRITICAL

### KROK 6 — Rollback (jeśli FAIL)

```bash
rm -rf [sciezka-wp]
cp -a [sciezka-wp]-backup-$TS [sciezka-wp]
```

## Do

- Wypisz gotowe komendy w bloku do skopiowania.
- Oznacz każdy krok `[ ]` dla Dowódcy.

## Don't

- **NIE uruchamiaj** deploy autonomicznie.
- Nie pomijaj backupu.
- Nie deploy bez audytu PASS.

## Output

```text
AUDIT: PASS ✅ (verified)
DEPLOY_METHOD: [GHA|git-pull|other]
COMMANDS: [fenced block — Dowódca wykonuje]
SMOKE_CHECKLIST: [...]
ROLLBACK: [fenced block]

AWAIT_COMMANDER_EXECUTION: YES

---
CURRENT_STAGE: F5-Launch
RECOMMENDED_NEXT: /handoff
WHY_NEXT: Po smoke przez Dowódcę — zamknij sesję stanem
---
```

## Done when

Komendy i checklist gotowe; Dowódca potwierdził wykonanie smoke (w kolejnej turze lub handoff).
