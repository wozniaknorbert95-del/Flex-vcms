---
status: "[DRAFT]"
title: "Phase 3 — Manual Test Scenarios (Orchestration Workflow)"
updated: "2026-04-09"
---

# Phase 3 — Manual Test Scenarios (Orchestration Workflow)

> Ten dokument jest **SSoT** dla manualnych scenariuszy testowych workflow Orchestratora (`flex-vcms`).
> Cel: **powtarzalność operacyjna** (krok po kroku) + **PASS/FAIL bez zgadywania**.

---

## Scope / Constraints

- **Platforma**: lokalnie na Windows (PowerShell).
- **Bez serwisów zewnętrznych**: żadnych zależności od usług online.
- **Bez produkcji**: brak deployu, brak działań na środowiskach produkcyjnych.
- **Read-only first**: skan jest **read-only** wobec repo modułów (zob. polityka bezpieczeństwa).
- **STOP rule**: jeśli jakikolwiek gate/scenariusz jest FAIL → **STOP**, naprawa, potem powtórka.

## Must-link (SSoT dependencies)

- Quality Gates / DoD: [`docs/checklists/phase-3-verification.md`](phase-3-verification.md)
- Operations contracts (OP-001..OP-006): [`docs/core/orchestration-commands.md`](../core/orchestration-commands.md)
- Security policy: [`docs/core/security-policy.md`](../core/security-policy.md)
- Session Anchor + Handoff spec: [`docs/core/session-anchor-and-handoff-spec.md`](../core/session-anchor-and-handoff-spec.md)
- SOP / Entry point: [`docs/PORADNIK_UZYTKOWNIKA.md`](../PORADNIK_UZYTKOWNIKA.md)
- Recovery protocol: [`docs/if-lost.md`](../if-lost.md)

---

## Shared setup (wspólne dla wszystkich scenariuszy)

### Konwencje środowiska

- **WORKSPACE_ROOT**: `C:\Users\FlexGrafik\Desktop\flex-vcms`
- **ECOSYSTEM_ROOT** (z `repos.yaml`): `C:\Users\FlexGrafik\FlexGrafik\github`

### OP-001 (scan) — referencyjnie

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
node tools\vcms-scan.js
```

### Oczekiwane artefakty po OP-001

- `data/vcms-index.json`
- `docs/ecosystem/conflicts.md`
- `docs/ecosystem/map.md`
- `docs/ecosystem/repos/*.md`

---

## Scenario template (canonical)

Każdy scenariusz ma identyczną strukturę:

- **ID**: `TS-001`…
- **Name**
- **Purpose (1 zdanie)**
- **Preconditions**
- **Steps**
- **Expected artifacts**
- **PASS criteria** / **FAIL criteria**
- **Related ops**
- **Related gates**
- **Recovery**

---

## TS-001

- **ID**: `TS-001`
- **Name**: Happy path (end-to-end)
- **Purpose (1 zdanie)**: Potwierdzić, że cały workflow działa E2E: scan → conflicts=0 → map → repo page → handoff-validate.
- **Preconditions**:
  - Zgodność z polityką bezpieczeństwa: [`docs/core/security-policy.md`](../core/security-policy.md)
  - Dostępny Node.js oraz możliwość uruchomienia OP-001.
  - Pracujesz lokalnie w `C:\Users\FlexGrafik\Desktop\flex-vcms` (PowerShell).
- **Steps**:
  1. Uruchom OP-001 (scan) zgodnie z kontraktem w [`docs/core/orchestration-commands.md`](../core/orchestration-commands.md).
  2. Sprawdź, że istnieją artefakty: `data/vcms-index.json`, `docs/ecosystem/conflicts.md`, `docs/ecosystem/map.md`, `docs/ecosystem/repos/*.md`.
  3. OP-002: otwórz `docs/ecosystem/conflicts.md` i odczytaj wynik.
  4. Potwierdź, że raport zawiera wartość **`Conflicts found: 0`**.
  5. OP-003: otwórz `docs/ecosystem/map.md` i potwierdź, że istnieje tabela **„Where is the truth (canonical pointers)”**.
  6. OP-004: otwórz jedną repo page `docs/ecosystem/repos/<slug>.md` i potwierdź kompletność sekcji (Gate 4):
     - `Canonical pointers (truth)`
     - `Status` (Guardrails present / Handoffs ready / Last handoff)
     - `Quick links (by file type)`
  7. OP-005: znajdź najnowszy plik w `docs/handoffs/` i zwaliduj go wg [`docs/core/session-anchor-and-handoff-spec.md`](../core/session-anchor-and-handoff-spec.md).
- **Expected artifacts**:
  - `data/vcms-index.json` istnieje.
  - `docs/ecosystem/conflicts.md` istnieje i zawiera **`Conflicts found: 0`**.
  - `docs/ecosystem/map.md` istnieje i zawiera tabelę **„Where is the truth (canonical pointers)”**.
  - `docs/ecosystem/repos/<slug>.md` istnieje i zawiera wymagane sekcje Gate 4.
  - Najnowszy `docs/handoffs/*.md` spełnia minimalny format (SESSIONANCHOR + sekcje wymagane).
- **PASS criteria**:
  - Wszystkie kroki 1–7 spełnione, a walidacje są jednoznaczne (bez wyjątków).
- **FAIL criteria**:
  - Brak któregokolwiek artefaktu po OP-001.
  - `Conflicts found` ≠ 0.
  - Brak wymaganych sekcji mapy lub repo page.
  - Handoff nie spełnia minimalnej specyfikacji.
- **Related ops**: OP-001, OP-002, OP-003, OP-004, OP-005
- **Related gates**: Gate 1, Gate 2, Gate 3, Gate 4, Gate 6
- **Recovery**:
  - Zastosuj protokół ratunkowy: [`docs/if-lost.md`](../if-lost.md)
  - Jeśli brakuje artefaktów → wróć do OP-001 i napraw root-cause (Node/FS/inputs) przed kontynuacją.

---

## TS-002

- **ID**: `TS-002`
- **Name**: Conflicts > 0 (STOP)
- **Purpose (1 zdanie)**: Wymusić zachowanie STOP/GO: jeśli konflikty > 0, workflow zatrzymuje się na naprawie, bez „jazdy dalej”.
- **Preconditions**:
  - OP-001 wykonane w tej samej sesji.
  - Istnieje `docs/ecosystem/conflicts.md`.
- **Steps**:
  1. Otwórz `docs/ecosystem/conflicts.md`.
  2. Odczytaj wartość `Conflicts found: N`.
  3. Jeśli \(N > 0\) → **STOP**: nie przechodź do selekcji repo ani planowania feature.
  4. Zastosuj rekomendacje naprawcze opisane w `docs/ecosystem/conflicts.md` (bez „wymyślania”).
  5. Po naprawie uruchom ponownie OP-001 i wróć do kroku 1.
- **Expected artifacts**:
  - `docs/ecosystem/conflicts.md` z wartością `Conflicts found: N` gdzie \(N > 0\) (stan wejściowy scenariusza).
  - Po naprawie: `docs/ecosystem/conflicts.md` z **`Conflicts found: 0`**.
- **PASS criteria**:
  - Workflow zatrzymany na konflikcie (STOP) i wznowiony dopiero po doprowadzeniu `Conflicts found` do 0.
- **FAIL criteria**:
  - Kontynuowanie do OP-003/OP-004 mimo \(N > 0\).
  - „Ominięcie” konfliktów bez wdrożenia zaleceń z raportu.
- **Related ops**: OP-001, OP-002
- **Related gates**: Gate 2
- **Recovery**:
  - Zastosuj protokół ratunkowy: [`docs/if-lost.md`](../if-lost.md)
  - Jeśli nie rozumiesz konfliktu → wróć do artefaktów i danych wejściowych (`repos.yaml`, `scan-rules.json`) zamiast zgadywać.

---

## TS-003

- **ID**: `TS-003`
- **Name**: Missing repo page / repo pages incomplete
- **Purpose (1 zdanie)**: Wykryć i obsłużyć sytuację, gdy brakuje `docs/ecosystem/repos/*.md` albo repo page nie spełnia kontraktu kompletności.
- **Preconditions**:
  - OP-001 wykonane.
  - Istnieje `docs/ecosystem/map.md` (Gate 3 wejściowo).
- **Steps**:
  1. Otwórz `docs/ecosystem/map.md`.
  2. Dla kilku linków `Repo page` (albo wszystkich, jeśli to szybkie) otwórz wskazane pliki w `docs/ecosystem/repos/`.
  3. Jeśli jakikolwiek `Repo page` link prowadzi do nieistniejącego pliku → **FAIL**.
  4. Dla każdej sprawdzanej repo page potwierdź obecność sekcji Gate 4:
     - `Canonical pointers (truth)`
     - `Status` (Guardrails present / Handoffs ready / Last handoff)
     - `Quick links (by file type)`
  5. Jeśli brakuje sekcji → **FAIL**.
  6. W przypadku FAIL: uruchom ponownie OP-001 i sprawdź, czy problem powtarzalny. Jeśli powtarzalny, traktuj jako defekt kontraktu (STOP) i naprawiaj przyczynę (inputs/scan) zamiast ręcznie „dopisując prawdę”.
- **Expected artifacts**:
  - `docs/ecosystem/map.md` z linkami `Repo page`.
  - `docs/ecosystem/repos/<slug>.md` istniejące dla linkowanych repo.
  - Repo pages zawierają wymagane sekcje Gate 4.
- **PASS criteria**:
  - Wszystkie sprawdzone repo pages istnieją i są kompletne wg Gate 4.
- **FAIL criteria**:
  - Brak pliku repo page.
  - Repo page bez wymaganych sekcji.
- **Related ops**: OP-001, OP-003, OP-004
- **Related gates**: Gate 3, Gate 4
- **Recovery**:
  - Zastosuj protokół ratunkowy: [`docs/if-lost.md`](../if-lost.md)
  - Wracaj do OP-001 i naprawiaj źródło problemu (inputs/scan), zamiast ręcznych obejść.

---

## TS-004

- **ID**: `TS-004`
- **Name**: Missing handoff / handoff invalid
- **Purpose (1 zdanie)**: Wymusić Gate 6: brak handoff lub handoff niezgodny ze specyfikacją jest FAIL i wymaga natychmiastowej korekty.
- **Preconditions**:
  - Folder `docs/handoffs/` istnieje (może być pusty).
  - Masz dostęp do kanonicznej specyfikacji: [`docs/core/session-anchor-and-handoff-spec.md`](../core/session-anchor-and-handoff-spec.md).
- **Steps**:
  1. Otwórz `docs/handoffs/` i znajdź najnowszy plik `docs/handoffs/*.md`.
  2. Jeśli nie istnieje żaden plik handoff → **FAIL** (Gate 6).
  3. W najnowszym handoff potwierdź wymagane sekcje w kolejności:
     - `SESSIONANCHOR`
     - `CO ZMIENIONE / WAŻNE`
     - `NEXT (1 rzecz)`
     - `BLOCKER`
     - `Weryfikacja`
  4. W `SESSIONANCHOR` potwierdź obecność wszystkich kluczy z kontraktu (m.in. `PROJECT`, `PHASE`, `MODULE`, `WORKSPACE_ROOT`, `ECOSYSTEM_ROOT`, `VERIFY`, `ARTIFACTS`, `CONFLICTS`, `LAST_HANDOFF`, `NEXT`, `BLOCKER`).
  5. Potwierdź, że `NEXT` jest **dokładnie 1 rzecz** (jedno zdanie, bez list).
  6. Potwierdź, że `VERIFY` jest wykonalne lokalnie i ma oczekiwany wynik (np. conflicts=0, jeśli to warunek sesji).
- **Expected artifacts**:
  - `docs/handoffs/*.md` (co najmniej 1 plik).
  - Najnowszy handoff spełnia minimalne sekcje i `SESSIONANCHOR` keys.
- **PASS criteria**:
  - Najnowszy handoff spełnia wymagania 2.1–2.3 specyfikacji i przechodzi PASS/FAIL walidację Gate 6.
- **FAIL criteria**:
  - Brak handoffów.
  - Brak wymaganych sekcji/kluczy.
  - `NEXT` zawiera więcej niż jedną rzecz.
  - Brak komendy `VERIFY` lub brak spodziewanego wyniku.
- **Related ops**: OP-005
- **Related gates**: Gate 6
- **Recovery**:
  - Zastosuj protokół ratunkowy: [`docs/if-lost.md`](../if-lost.md)
  - Utwórz/popraw handoff zgodnie z [`docs/core/session-anchor-and-handoff-spec.md`](../core/session-anchor-and-handoff-spec.md) i powtórz walidację.

---

## TS-005

- **ID**: `TS-005`
- **Name**: Determinism fail (2× OP-001, no changes)
- **Purpose (1 zdanie)**: Wykryć niedeterministyczne różnice w raportach, gdy OP-001 uruchamiane jest dwa razy bez zmian wejściowych.
- **Preconditions**:
  - Brak zmian w repo pomiędzy uruchomieniami (jak w OP-006).
  - OP-001 działa lokalnie (PowerShell).
- **Steps**:
  1. Uruchom OP-001 (Run 1).
  2. Bez zmieniania jakichkolwiek plików (w tym w `ECOSYSTEM_ROOT`) uruchom OP-001 ponownie (Run 2).
  3. Porównaj treść (diff) dla:
     - `docs/ecosystem/conflicts.md`
     - `docs/ecosystem/map.md`
     - jednej wybranej `docs/ecosystem/repos/<slug>.md`
  4. Jeśli jest diff → zidentyfikuj źródło różnic:
     - Czy różnica wynika z **mtime** w repo (np. „stableUpdatedAt”), czy z realnej **treści**?
     - Czy różnica jest dopuszczalna wg Gate 5 (nie jest „czas uruchomienia”)?
  5. Jeśli nie potrafisz jednoznacznie wyjaśnić diff → **FAIL** (nie akceptuj „na oko”).
- **Expected artifacts**:
  - Dwa uruchomienia OP-001 wykonane bez zmian wejściowych.
  - Raporty `docs/ecosystem/conflicts.md`, `docs/ecosystem/map.md` i jedna repo page porównane między Run 1 i Run 2.
- **PASS criteria**:
  - Brak „losowych” zmian w raportach między Run 1 i Run 2.
  - Jeśli występują różnice, są **jednoznacznie** przypisane do dopuszczalnych przyczyn (mtime vs treść) i nie naruszają Gate 5.
- **FAIL criteria**:
  - Dowolna niewyjaśniona różnica w raportach między uruchomieniami bez zmian wejściowych.
  - Akceptacja diff bez identyfikacji źródła.
- **Related ops**: OP-001, OP-006
- **Related gates**: Gate 5
- **Recovery**:
  - Zastosuj protokół ratunkowy: [`docs/if-lost.md`](../if-lost.md)
  - Wróć do kontraktu OP-006 w [`docs/core/orchestration-commands.md`](../core/orchestration-commands.md) i ustal źródło zmian (mtime vs treść) zanim zaakceptujesz wynik.

---

## TS-006

- **ID**: `TS-006`
- **Name**: Plan-only session (no implementation)
- **Purpose (1 zdanie)**: Zakończyć sesję planem/raportem + handoff, bez zmian w kodzie repo modułów (brak side-effects).
- **Preconditions**:
  - Zgodność z [`docs/core/security-policy.md`](../core/security-policy.md) (read-only first).
  - Zasada 1-1-1 jest respektowana, ale w tym scenariuszu nie wchodzisz w implementację modułów.
- **Steps**:
  1. Uruchom OP-001 i wygeneruj artefakty Orchestratora.
  2. OP-002/OP-003/OP-004: podejmij decyzje wyłącznie na podstawie artefaktów (`conflicts.md`, `map.md`, repo page).
  3. Przygotuj plan/raport w dokumentacji Orchestratora (bez zmian w repo modułów).
  4. Zakończ sesję handoffem zgodnym ze specyfikacją i zwaliduj go (OP-005).
  5. Zweryfikuj, że nie powstały żadne side-effects w repo modułów w `ECOSYSTEM_ROOT` (tylko artefakty Orchestratora + dokumenty).
- **Expected artifacts**:
  - Artefakty OP-001: `data/vcms-index.json`, `docs/ecosystem/conflicts.md`, `docs/ecosystem/map.md`, `docs/ecosystem/repos/*.md`.
  - Najnowszy `docs/handoffs/*.md` przechodzi walidację Gate 6 (sekcje + `SESSIONANCHOR` keys + `NEXT` = 1).
  - Brak zmian w repo modułów (brak implementacji).
- **PASS criteria**:
  - Jest plan/raport + jest poprawny handoff z `NEXT` dokładnie 1.
  - Brak zmian w kodzie repo modułów (no side-effects).
- **FAIL criteria**:
  - Jakiekolwiek zmiany w repo modułów.
  - Brak handoff albo handoff niezgodny ze spec.
- **Related ops**: OP-001, OP-002, OP-003, OP-004, OP-005
- **Related gates**: Gate 0, Gate 1, Gate 2, Gate 3, Gate 4, Gate 6
- **Recovery**:
  - Zastosuj protokół ratunkowy: [`docs/if-lost.md`](../if-lost.md)
  - Cofnij się do artefaktów Orchestratora i zakończ sesję handoffem zgodnym z kontraktem (bez wchodzenia w implementację).

