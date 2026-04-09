---
status: "[STABLE]"
title: "Antywzorce — czego unikać w VCMS i przy AI"
updated: "2026-04-09"
---

# Antywzorce

Krótka lista **zachowań**, które kosztują czas i pieniądze. Pełniejsze zasady: [Global Rules](/core/global-rules).

## Praca z agentami

| Antywzorzec | Dlaczego źle | Zamiast |
|-------------|--------------|---------|
| „Zrób wszystko naraz” | Regresje, brak weryfikacji | 1 moduł, 1 diff, 1 deploy ([Feature Loop](/playbooks/feature-loop)) |
| Kod bez `/blast` | Scope creep, halucynacje | Zatwierdzony plan przed kodem |
| Koniec sesji bez handoffu | Utrata kontekstu | `/handoff` + [format](/core/session-anchor-and-handoff-spec) |
| Deploy przy 🔴 z audytu | Ryzyko prod | Tylko 🟢; [prep-deploy](/checklists/prep-deploy) |

## Orchestrator (flex-vcms)

| Antywzorzec | Zamiast |
|-------------|---------|
| Feature przy `Conflicts > 0` | Najpierw `node tools/vcms-scan.js`, potem naprawa SSoT |
| Edycja `.cursor/plans/*` w PR | Trzymaj się `docs/core/*` jako SSoT |
| Sekrety w repo / w kontekście czatu | [Security policy](/core/security-policy) |

## Nauka (Dowódca)

| Antywzorzec | Zamiast |
|-------------|---------|
| Kurs „na zapas” | Mikro-lekcja przy realnym zadaniu ([study-index](/study/study-index)) |
| 10 rzeczy na raz w kolejce | Max 3 pozycje w Study Queue |

---

*Rozszerzaj ten plik pojedynczymi, konkretnymi wpisami po incydentach — bez lania wody.*
