---
status: "[DRAFT]"
title: "PH4-011 — wynik testu mobile (Command Center prod)"
---

# PH4-011 — weryfikacja mobile (prod)

> Skopiuj ten plik do `docs/handoffs/` z nazwą `YYYY-MM-DD-ph4-011-mobile.md` albo dopisz skrót do `docs/study/study-index.md`.  
> Acceptance: zadanie **PH4-011** w root `flex-vcms-todo.json`.

## SESSIONANCHOR

- **DATA:** YYYY-MM-DD
- **URL_PROD:** https://… (domena za Nginx + Basic Auth)
- **URZADZENIE:** np. iPhone 15 / Android 14 + Chrome
- **WYNIK:** PASS | FAIL

## Checklist (binarnie)

- [ ] Logowanie Basic Auth działa
- [ ] Strona główna docs (VitePress) czytelna bez poziomego scroll-only UI
- [ ] Nawigacja sidebar / menu dotykowe OK
- [ ] KODA: wysłanie jednej wiadomości lub kontrolowany błąd (bez wycieku sekretów)

## FAIL (jeśli dotyczy)

- **Ekran / komponent:** …
- **NEXT:** jedno konkretne zadanie follow-up

## Notatki

(krótko: co było nietypowe)
