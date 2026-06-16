---
status: "[CANONICAL]"
title: "VCMS Sales Report — portfolio & B2B positioning"
date: "2026-06-16"
session: "portfolio-szlif-1"
audience: "Founder, portfolio copy, sales engineers"
---

# VCMS Sales Report

Raport sprzedażowo-techniczny dla prezentacji **flex-vcms** na [Quietforge portfolio](https://flexgrafik-services.vercel.app/). Każdy claim ma status **PROVEN / DEMO / PLANNED**.

---

## 1. Executive summary

**VCMS** (Versioned Content Management & Supervision) to warstwa governance w ekosystemie FlexGrafik: skanuje 8 repozytoriów, wykrywa rozjazdy single source of truth, klasyfikuje konflikty (info / warning / blocking), generuje mapę modułów, appenduje zdarzenia governance do JSONL i dokumentuje sesje przez handoffy. Działa lokalnie i na VPS jako command center (`https://cmd.flexgrafik.nl`).

**Problem biznesowy:** Bez warstwy nadzoru treści, backlogów i reguł agentów rośnie chaos — sprzeczne źródła prawdy, ryzykowne deploye, wiedza w głowie jednej osoby, brak śladu „kto co zatwierdził”.

**Wartość dla klienta SMB/B2B:**
- Mniej niespodzianek przed publikacją (konflikty widoczne przed deployem).
- Szybsze zmiany z kontrolą (AI proponuje; człowiek zatwierdza — w Agent OS).
- Łatwiejszy handover (mapa repo, raporty skanu, handoffy, audit JSONL po skanie).

**Uczciwy status:** VCMS jest **dojrzałym orchestratorem operacyjnym** (PROVEN). HITL approval UI i agent cards żyją w **agent-os-ui** (DEMO). Health score widget i pełny audit export UI są **PLANNED**.

---

## 2. Realne funkcje + dowody w repo

| Funkcja | Problem biznesowy | Dowód (plik) | Portfolio | Status |
|---------|-------------------|--------------|-----------|--------|
| Ecosystem scan | Nie wiesz, czy repo są zsynchronizowane | `tools/vcms-scan.js`, `npm run scan` | Komenda w demo video | **PROVEN** |
| Conflict detection | Sprzeczne todo/brain/guardrails | `docs/ecosystem/conflicts.md` | `conflict-report.svg` (DEMO fixture) | **PROVEN** |
| Conflict severity matrix | Wszystko wygląda jak blocker | `scan-rules.json`, tally w `conflicts.md` | Tabela blocking/warning/info | **PROVEN** |
| SSoT registry | Brak kanonicznych wskaźników | `repos.yaml`, `docs/ecosystem/repos/` | Mapa ekosystemu | **PROVEN** |
| Context bundle na VPS | Stara wiedza na serwerze | `tools/vcms-sync-context.js`, `deploy-context/` | Ops proof | **PROVEN** |
| Security ops audit | Prod bez twardych checków | `docs/audits/latest-verification.md`, PH4-018 | Trust section | **PROVEN** |
| Handoff trail | Brak śladu sesji | `docs/handoffs/` | Process proof | **PROVEN** |
| Governance audit JSONL | Brak maszynowego śladu skanów | `tools/vcms-audit-log.js`, `GET /api/v1/audit-log` | Sample: `docs/demo/governance-audit-log-sample.md` | **DEMO** |
| Dashboard | Brak jednego widoku | `public/index.html`, cmd.flexgrafik.nl | `vcms-dashboard.png` | **DEMO** |
| KODA RAG assistant | Analiza kontekstu bez deployu | `src/logic/koda-chat.js`, `POST /api/chat` | Lab tab (wymaga klucza `.env`) | **DEMO** |
| Human approval | AI bez bramki | `agent-os-ui` Mission Control | `agent-cards.png` | **DEMO** (Agent OS, nie VCMS UI) |
| Agent cards (scoped rules) | Niejasne role agentów | `docs/agents/agent-boundaries.md` | PDF + prose | **DEMO** |
| Deep scan z VPS | Skan wymaga ścieżek dev | `repos.yaml` Windows paths → stub API | Nie obiecywać na prod demo | **DEMO** (laptop-only) |
| SSoT Health Score | Brak jednej liczby kondycji | brak w API | — | **PLANNED** |
| Audit export UI (CSV/MD) | Handover bez grzebania w JSONL | brak | — | **PLANNED** |

### Granice systemów (PROVEN — dokumentacja)

| System | Warstwa | Dowód |
|--------|---------|-------|
| **flex-vcms** | Nadzór / governance (read-only scan) | `docs/agents/agent-boundaries.md` |
| **agent-os-ui** | Egzekucja + HITL | Mission Control approve/reject |
| **KODA** | RAG read-only w VCMS | Nie zastępuje Agent OS; Zasada 11 |

---

## 3. Plan optymalizacji strony portfolio (`services`)

**Repo:** `C:\Users\FlexGrafik\FlexGrafik\github\services`

| Priorytet | Sekcja | Zmiana | Status sesji |
|-----------|--------|--------|--------------|
| P0 | Behind the scenes | Headline, outcomes, HITL, trust line | **DONE** |
| P0 | Video slot | Ukryj gdy brak URL (`VideoSlot` → null) | **DONE** |
| P0 | Screen grid | Tylko `ready: true` assets | **DONE** |
| P0 | Owner ecosystem | Flex-VCMS bez „LLM gateway” | **DONE** |
| P1 | `proof.ts` | Instrukcja upload video + `vcmsFeatureStatus` | **DONE** (sesja 1) |
| P1 | Pricing §F | Usuń „Enterprise-grade” bez dowodu | **DONE** (sesja 1) |
| P1 | Nagranie 75s | Wypełnić `videos.vcms.url` po uploadzie | **BLOCKED** — Dowódca |
| P2 | Pricing tiers | `[FILL]` widełki € — poza scope VCMS | Otwarte |

---

## 4. Gotowe copy na stronę (DoD)

### Headline
**The governance layer behind the system.**

### Subheadline
VCMS scans content, repos and agent rules before changes reach production — so the business does not depend on memory, screenshots or one developer's inbox.

### Three business outcomes
- **Fewer surprises before deploy** — conflicts are visible before they become client-facing bugs.
- **Faster changes with control** — AI can draft and refactor, but review gates decide what ships.
- **Cleaner handover** — rules, content sources and activity logs are documented instead of trapped in someone's head.

### Proof caption (dashboard)
VCMS dashboard — ecosystem scan status, 8-repo coverage, conflict severity and review pointers in one place.

### Trust line
Live in the owner ecosystem. Selected modules are production; some supervision features are internal and improving. No fabricated metrics.

### HITL (wymagane zdanie)
**The system proposes; a human approves what ships.**

### Feature status line (portfolio)
Scan & conflicts **PROVEN** · Audit JSONL & KODA **DEMO** · Health score & export UI **PLANNED**

---

## 5. Skrypt video 75 sekund (Founder)

> „Most people see the website. What matters is the governance layer behind it. This is VCMS — the part of my ecosystem that checks content, repos and agent rules before changes reach production.
>
> Here you can see the scan: eight repositories, last check, and whether any conflicts would block a release.
>
> When I run `npm run scan`, the system compares canonical brains and backlogs across the ecosystem. If something drifts — a guardrail, a todo, a brain file — it gets flagged with severity before deploy.
>
> This is not AI publishing by itself. The system proposes; a human approves what ships — in Agent OS and in every handoff.
>
> For a client, that means fewer surprises, faster controlled changes, and much less dependence on one person remembering everything.”

**Źródło nagrania (lokalnie, gitignored):** `flex-vcms/docs/demo/final-portfolio-demo.mp4` (~69s, `npm run demo:all`).

Szczegółowy flow klik-po-kliku: [`VCMS_DEMO_SCRIPT.md`](./VCMS_DEMO_SCRIPT.md).

---

## 6. Roadmapa 30 dni (3 funkcje)

### 6.1 Audit Event Export UI — PLANNED

| | |
|-|-|
| **Opis** | Endpoint + UI: eksport `governance-audit.jsonl` → Markdown/CSV dla handoveru |
| **Biznes** | Klient/partner dostaje czytelny trail bez grzebania w plikach |
| **Pliki** | `tools/vcms-audit-log.js`, `src/routes/api.js`, `public/app.js` |
| **Test** | `GET /api/v1/audit-log?format=markdown` zwraca tabelę |
| **Portfolio** | Screenshot export + caption DEMO |

### 6.2 SSoT Health Score — PLANNED

| | |
|-|-|
| **Opis** | Wynik 0–100: scan coverage, unresolved blocking conflicts, stale context bundle age |
| **Biznes** | Jedna liczba dla foundera przed tygodniowym review |
| **Pliki** | `src/routes/api.js`, `public/app.js`, `tools/vcms-scan.js` |
| **Test** | API status zwraca `health_score` spójny z conflicts=0 |
| **Portfolio** | Widget na dashboard screenshot |

### 6.3 Conflict drill-down in dashboard — PLANNED

| | |
|-|-|
| **Opis** | Klik konfliktu w UI → link do pliku + rekomendacja z `scan-rules.json` |
| **Biznes** | Mniej terminala, szybsza naprawa przed deployem |
| **Pliki** | `public/app.js`, `docs/ecosystem/conflicts.md` parser |
| **Test** | Sztuczny konflikt → UI pokazuje severity + fix hint |
| **Portfolio** | Screen z jednym blocking conflict (staging fixture) |

---

## 7. Ryzyka reputacyjne

| Ryzyko | Mitigacja |
|--------|-----------|
| „Enterprise-grade” na pricing bez dowodu | Zamienione na „Architecture built for control, priced for SMB” |
| HITL przypisane wyłącznie do VCMS UI | Copy: Agent OS + handoffy + zdanie HITL |
| `[FILL]` video publicznie | `VideoSlot` returns null when not ready |
| audit log screen bez assetu PNG | Ukryty (`auditLog.ready: false`); sample w docs/demo |
| KODA = magic AI deploy | Boundaries w `agent-boundaries.md`; read-only RAG |
| Deep scan na VPS bez laptopa | API stub + copy „run scan from dev machine” |
| Sprzeczność README vs kod (severity) | Zaktualizować `VCMS_PORTFOLIO_TRUTH.md` — severity jest PROVEN |
| Fake metrics na dashboardzie | Ecosystem Mode / Repo Count only |
| Strategia ARR w `docs/audit/` | Nie linkować z portfolio; operator-only |

---

## 8. Lista zmian w repo `services` (patch checklist)

### Wykonane wcześniej (Faza deploy-v2)
1. `src/components/home/BehindTheScenes.tsx` — outcomes, HITL, conditional video, screen filter
2. `src/components/ui/VideoSlot.tsx` — hide when not ready
3. `src/app/results/owner-ecosystem/page.tsx` — Flex-VCMS supervision wording
4. `public/gratka/owner-ecosystem-map.md` — tabela Flex-VCMS
5. `public/gratka/conflict-report.svg` — DEMO fixture

### Sesja portfolio-szlif-1 (ten patch)
6. `src/content/proof.ts` — `vcmsFeatureStatus`, video upload instructions, trust copy
7. `src/components/home/BehindTheScenes.tsx` — feature status badges (PROVEN/DEMO/PLANNED)
8. `src/app/pricing/page.tsx` — usunięcie „Enterprise-grade”

### Do zrobienia przez Dowódcę
9. Upload `final-portfolio-demo.mp4` → Loom/Vimeo/YouTube unlisted
10. Ustaw w `proof.ts`: `videos.vcms.url` + `ready: true`
11. Opcjonalnie: `poster: "/gratka/vcms-demo-poster.jpg"`

---

## 9. DoD GO / NO-GO snapshot

| Sekcja DoD | Po sesji 1 | Bloker |
|------------|------------|--------|
| A Strategia | **GO** | — |
| B Dowody techniczne | **CONDITIONAL GO** (5/6) | Audit log = DEMO nie PROVEN UI |
| C Copy | **GO** | Pricing `[FILL]` € poza VCMS |
| D Video | **GO** | Self-hosted `/gratka/vcms-demo.mp4` on services |
| E Repo | **GO** | — |

**Werdykt sprzedażowy:** **Full GO** — prezentacja VCMS gotowa. Roadmap produktowa (health score, export UI) pozostaje PLANNED.

### Checklist DoD (szczegóły)

**A. Strategia**
- [x] Jedna definicja VCMS
- [x] Governance layer, nie CMS
- [x] Wartość czas/nerwy/pieniądze
- [x] Brak pustego „enterprise” (po patch pricing)

**B. Dowody**
- [x] Dashboard + scan
- [x] Conflict detection + severity
- [x] SSoT registry
- [x] Audit log (DEMO — JSONL + sample)
- [x] Human approval (DEMO — Agent OS)
- [x] Agent cards (DEMO — boundaries doc + PNG)

**C. Copy**
- [x] Brak `[FILL]` w sekcji VCMS publicznej
- [x] PROVEN/DEMO/PLANNED visible
- [x] Screenshot captions

**D. Video**
- [x] Video hosted + `ready: true` — **GO** (`/gratka/vcms-demo.mp4`)

**E. Repo**
- [x] README + scan instruction
- [x] Przykładowy raport (`SCAN-REPORT.md`, `conflicts.md`)
- [x] Roadmapa 30d
- [x] Ten raport kanoniczny

---

## Powiązane

- [VCMS_DOD_SCORECARD.md](./VCMS_DOD_SCORECARD.md)
- [VCMS_PORTFOLIO_TRUTH.md](./VCMS_PORTFOLIO_TRUTH.md)
- [VCMS_DEMO_SCRIPT.md](./VCMS_DEMO_SCRIPT.md)
- [governance-audit-log-sample.md](./demo/governance-audit-log-sample.md)
