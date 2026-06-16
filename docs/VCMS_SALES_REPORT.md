---
status: "[CANONICAL]"
title: "VCMS Sales Report — portfolio & B2B positioning"
date: "2026-06-16"
audience: "Founder, portfolio copy, sales engineers"
---

# VCMS Sales Report

Raport sprzedażowo-techniczny dla prezentacji **flex-vcms** na [Quietforge portfolio](https://flexgrafik-services.vercel.app/). Każdy claim ma status **PROVEN / DEMO / PLANNED**.

---

## 1. Executive summary

**VCMS** (Versioned Content Management & Supervision) to warstwa governance w ekosystemie FlexGrafik: skanuje 8 repozytoriów, wykrywa rozjazdy single source of truth, generuje mapę modułów i dokumentuje sesje przez handoffy. Działa lokalnie i na VPS jako command center (docs + dashboard).

**Problem biznesowy:** Bez warstwy nadzoru treści, backlogów i reguł agentów rośnie chaos — sprzeczne źródła prawdy, ryzykowne deploye, wiedza w głowie jednej osoby, brak śladu „kto co zatwierdził”.

**Wartość dla klienta SMB/B2B:**
- Mniej niespodzianek przed publikacją (konflikty widoczne przed deployem).
- Szybsze zmiany z kontrolą (AI proponuje; człowiek zatwierdza — w Agent OS).
- Łatwiejszy handover (mapa repo, raporty skanu, handoffy).

**Uczciwy status:** VCMS jest **dojrzałym orchestratorem operacyjnym** (PROVEN). Pełny governance product (severity matrix, JSON audit trail, approval UI w VCMS) jest **częściowo PLANNED** lub żyje w **agent-os-ui** (DEMO).

---

## 2. Realne funkcje + dowody w repo

| Funkcja | Problem biznesowy | Dowód (plik) | Portfolio | Status |
|---------|-------------------|--------------|-----------|--------|
| Ecosystem scan | Nie wiesz, czy repo są zsynchronizowane | `tools/vcms-scan.js`, `npm run scan` | Komenda w demo video | **PROVEN** |
| Conflict detection | Sprzeczne todo/brain/guardrails | `docs/ecosystem/conflicts.md` | Screenshot raportu | **PROVEN** |
| SSoT registry | Brak kanonicznych wskaźników | `repos.yaml`, `docs/ecosystem/repos/` | Mapa ekosystemu | **PROVEN** |
| Context bundle na VPS | Stara wiedza na serwerze | `tools/vcms-sync-context.js`, `deploy-context/` | Ops proof | **PROVEN** |
| Security ops audit | Prod bez twardych checków | `docs/audits/latest-verification.md`, PH4-018 | Trust section | **PROVEN** |
| Handoff trail | Brak śladu sesji | `docs/handoffs/` | Process proof | **PROVEN** |
| Dashboard | Brak jednego widoku | `public/index.html`, cmd.flexgrafik.nl | `vcms-dashboard.png` | **DEMO** |
| Human approval | AI bez bramki | `agent-os-ui` Mission Control | `agent-cards.png` | **DEMO** (nie VCMS UI) |
| Agent cards | Niejasne role agentów | `docs/agents/agent-boundaries.md` | PDF gratka | **DEMO** |
| Governance audit log | Brak „kto/co/kiedy” w JSON | brak w kodzie | `audit-log.png` not ready | **PLANNED** |
| Conflict severity | Wszystko binarne | brak | — | **PLANNED** |
| LLM gateway | Chat w command center | wyłączone `/api/chat` | usuń z copy | **PLANNED** |

---

## 3. Plan optymalizacji strony portfolio (`services`)

**Repo:** `C:\Users\FlexGrafik\FlexGrafik\github\services`

| Priorytet | Sekcja | Zmiana |
|-----------|--------|--------|
| P0 | Owner ecosystem | Usuń „LLM gateway” przy Flex-VCMS |
| P0 | Behind the scenes | 3 business outcomes + HITL line |
| P0 | Video slot | Ukryj gdy brak URL (nie pokazuj `[FILL]`) |
| P0 | Screen grid | Tylko `ready: true` assets |
| P1 | `vcmsDashboard.caption` | „Scan status, repo coverage, conflicts — governance orchestrator” |
| P1 | Nagranie 75s | Wypełnić `videos.vcms` po Loom |

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
VCMS dashboard — ecosystem scan status, 8-repo coverage, conflict target and review pointers in one place.

### Trust line
Live in the owner ecosystem. Selected modules are production; some supervision features are internal and improving. No fabricated metrics.

### HITL (wymagane zdanie)
**The system proposes; a human approves what ships.**

---

## 5. Skrypt video 75 sekund (Founder)

> „Most people see the website. What matters is the governance layer behind it. This is VCMS — the part of my ecosystem that checks repos and single sources of truth before changes reach production.
>
> Here you can see the scan: eight repositories, last check, and whether any conflicts would block a release.
>
> When I run `npm run scan`, the system compares canonical brains and backlogs across the ecosystem. If something drifts — a guardrail, a todo, a brain file — it gets flagged before deploy.
>
> This is not AI publishing by itself. The system proposes; a human approves what ships — in Agent OS and in every handoff.
>
> For a client, that means fewer surprises, faster controlled changes, and much less dependence on one person remembering everything.”

Szczegółowy flow klik-po-kliku: [`VCMS_DEMO_SCRIPT.md`](./VCMS_DEMO_SCRIPT.md).

---

## 6. Roadmapa 30 dni (3 funkcje)

### 6.1 Conflict Severity Matrix — PLANNED

| | |
|-|-|
| **Opis** | Klasyfikacja konfliktów: `info` / `warning` / `blocking` w `conflicts.md` i scan output |
| **Biznes** | Klient widzi, co blokuje release vs co jest kosmetyką |
| **Pliki** | `tools/vcms-scan.js`, `scan-rules.json`, `docs/ecosystem/conflicts.md` |
| **Test** | Sztuczny konflikt → 3 poziomy severity w raporcie |
| **Portfolio** | Screenshot raportu z kolorami severity |

### 6.2 Audit Event Export — PLANNED

| | |
|-|-|
| **Opis** | Append-only `data/governance-audit.jsonl` — scan runs, deploy markers, handoff links |
| **Biznes** | Handover i review bez grzebania w logach HTTP |
| **Pliki** | `tools/vcms-audit-log.js`, hook w `vcms-scan.js`, `docs/demo/governance-audit-log-sample.md` |
| **Test** | Po `npm run scan` nowy wpis JSONL z timestampem |
| **Portfolio** | Demo fixture oznaczony DEMO |

### 6.3 SSoT Health Score — PLANNED

| | |
|-|-|
| **Opis** | Prosty wynik 0–100: scan coverage, unresolved conflicts, stale context bundle age |
| **Biznes** | Jedna liczba dla foundera przed tygodniowym review |
| **Pliki** | `src/routes/api.js`, `public/app.js` |
| **Test** | API `/api/v1/status` zwraca `health_score` zgodny z conflicts=0 |
| **Portfolio** | Widget na dashboard screenshot |

---

## 7. Ryzyka reputacyjne

| Ryzyko | Mitigacja |
|--------|-----------|
| „LLM gateway” na stronie bez `/api/chat` | Usunięte w patch services; Portfolio Truth |
| Fake metrics na dashboardzie | Usunięte (P0) — Ecosystem Mode / Repo Count |
| HITL przypisane do VCMS UI | Copy: Agent OS + handoffy |
| `[FILL]` video publicznie | VideoSlot returns null when not ready |
| audit log screen bez assetu | Ukryty z grid; sample w docs/demo |
| Strategia ARR w `docs/audit/` | Nie linkować z portfolio; operator-only |
| Sprzeczne audyty FLASH vs latest | Banner superseded na starym raporcie |

---

## 8. Lista zmian w repo `services` (patch checklist)

Wykonane w Fazie 5 tej sesji — patrz commit w `services`:

1. `src/app/results/owner-ecosystem/page.tsx` — Flex-VCMS detail
2. `public/gratka/owner-ecosystem-map.md` — tabela Flex-VCMS
3. `public/gratka/owner-ecosystem-map.svg` — linia supervision
4. `src/content/proof.ts` — captions
5. `src/components/home/BehindTheScenes.tsx` — outcomes, HITL, filter screens, conditional video
6. `src/components/ui/VideoSlot.tsx` — hide when not ready

---

## 9. DoD GO / NO-GO snapshot

| Sekcja DoD | Po tej sesji | Bloker |
|------------|--------------|--------|
| A Strategia | **PARTIAL→GO** po deploy services | Deploy strony |
| B Dowody | **PARTIAL** | Governance audit log PLANNED (uczciwie) |
| C Copy | **GO** po patch | — |
| D Video | **NO-GO** | Dowódca: nagrać Loom, wypełnić `proof.vcms` |
| E Repo | **GO** | — |

**Werdykt sprzedażowy:** **Conditional GO** — można pokazywać VCMS jako governance orchestrator z disclaimerem; pełne GO na wszystkie 6 funkcji DoD §B po roadmap 30d.

---

## Powiązane

- [VCMS_DOD_SCORECARD.md](./VCMS_DOD_SCORECARD.md)
- [VCMS_PORTFOLIO_TRUTH.md](./VCMS_PORTFOLIO_TRUTH.md)
- [VCMS_DEMO_SCRIPT.md](./VCMS_DEMO_SCRIPT.md)
