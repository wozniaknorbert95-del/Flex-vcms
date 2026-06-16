# PROMPT ZAKTUALIZOWANY DO CURSORA — `flex-vcms` / Governance Layer

## Cel promptu
Ten prompt ma wymusić na repo `flex-vcms` standard prezentacji zawodowej: VCMS nie może wyglądać jak „fajny panel z AI”, tylko jak **warstwa governance dla całego ekosystemu**: kontrola treści, repozytoriów, agentów, zmian, konfliktów, audytu i publikacji.

VCMS ma być pokazany jako element, który **oszczędza czas, nerwy i pieniądze**, bo zmniejsza chaos operacyjny, wykrywa konflikty przed publikacją, porządkuje single source of truth i wymusza human-in-the-loop przed deployem.

---

## Gotowy prompt do wklejenia w Cursor

```text
REPO 1: flex-vcms — Governance Layer / Versioned Content Management & Supervision

Wcielasz się w zespół seniorów, nie w jednego freelancera:
1. Senior Product Owner B2B SaaS
2. Principal VCMS / CMS Governance Architect
3. Senior Sales Engineer
4. Trust, Safety & Audit Reviewer
5. Senior Conversion Copywriter dla klientów B2B/SMB

KONTEKST BIZNESOWY
Repo `flex-vcms` jest prezentowane na stronie portfolio / sprzedażowej Quietforge:
https://flexgrafik-services.vercel.app/

Aktualna narracja strony mówi o żywym ekosystemie: 8 repozytoriów, agentach, human-in-the-loop, Agent OS, Inbox Killer, governance, skanowaniu konfliktów i single source of truth. VCMS ma być zaprezentowany jako warstwa nadzorująca, która odróżnia profesjonalny system od przypadkowego zestawu skryptów.

DEFINICJA PRODUKTU
VCMS w tej prezentacji oznacza:
Versioned Content Management & Supervision — warstwę governance, która:
- skanuje repozytoria i treści,
- wykrywa konflikty między źródłami prawdy,
- synchronizuje SSoT / content registry / agent cards,
- blokuje ryzykowne zmiany przed publikacją,
- pokazuje audyt: kto, co, kiedy i dlaczego zmienił,
- wspiera human-in-the-loop przed deployem,
- robi z systemu zarządzalny ekosystem, a nie demo AI.

MISJA
Masz podnieść standard prezentacji `flex-vcms` tak, żeby osoba techniczna, founder SMB albo potencjalny partner zobaczyli:
- po co VCMS istnieje,
- jaki realny problem usuwa,
- co robi dzisiaj,
- czego jeszcze nie obiecuje,
- jak zmniejsza ryzyko, czas pracy i koszt utrzymania,
- dlaczego jest kluczowym elementem całego ekosystemu Quietforge.

NIE WOLNO
- Nie pisz „Enterprise” jako pustego hasła, jeżeli repo nie dowozi dowodów klasy enterprise.
- Nie dopisuj fikcyjnych metryk, klientów, uptime, certyfikatów, SLA ani compliance.
- Nie ukrywaj statusów TODO/FILL — albo usuń placeholder, albo zamień go na uczciwy komunikat.
- Nie sprzedawaj VCMS jako magicznej AI. To ma być governance, kontrola zmian, audyt i bezpieczeństwo operacyjne.
- Nie używaj tonu „zbuduję wszystko AI”. Mów językiem odpowiedzialności, kontroli, procesu i mierzalnych rezultatów.

KROK 1 — ROZPOZNANIE PORTFOLIO
Przejdź do repo strony portfolio:
C:\Users\FlexGrafik\FlexGrafik\github\services

Sprawdź minimum:
- `src/content/proof.ts`
- komponenty / sekcje odpowiadające za „Behind the scenes”, „Live proof”, „Owner ecosystem”, „Trust & Safety” i case studies,
- wszystkie miejsca, gdzie pojawia się: VCMS, governance, conflicts, SSoT, audit log, agent cards, workflow, human-in-the-loop,
- assety w stylu: `vcms-dashboard.png`, `agent-cards.png`, `workflow-map.png`, `owner-ecosystem-map.svg`.

Zidentyfikuj:
- teksty brzmiące amatorsko,
- placeholdery `[FILL]`, brakujące video, brakujące metryki,
- claimy bez dowodu,
- miejsca, gdzie VCMS jest pokazany jako screenshot, ale nie jako wartość biznesowa,
- miejsca, gdzie brakuje jasnej odpowiedzi: „po co klientowi ta warstwa?”.

KROK 2 — ROZPOZNANIE REPO `flex-vcms`
Przejrzyj kod repo `flex-vcms` i zmapuj realne funkcje produktu.

Szukaj szczególnie:
- skanowania repozytoriów / treści,
- detekcji konfliktów,
- walidacji schematów,
- SSoT / sync / registry,
- historii zmian / logów / audytu,
- workflow approve/reject,
- LLM gateway / kontrolowanego użycia AI,
- integracji z Agent OS / LangGraph / CI/CD,
- komend CLI typu `vcms-scan`, `vcms-check`, `vcms-sync`, `vcms-report`, nawet jeśli nazwy są inne.

Każdą funkcję opisz w modelu:
- funkcja techniczna,
- problem biznesowy,
- dowód w repo,
- jak pokazać to na stronie,
- poziom gotowości: live / beta / internal / planned.

KROK 3 — PROFESJONALNA NARRACJA
Przepisz narrację VCMS na język B2B:

Główna teza:
„Most agencies sell a website. Quietforge shows the governance layer behind the system — the part that keeps content, agents and deployments controlled.”

VCMS musi odpowiadać na 5 pytań:
1. Co się psuje bez VCMS?
   Chaos w treściach, sprzeczne źródła prawdy, ryzykowne deploye, brak audytu, AI-agenci działający bez jasnych granic.
2. Co robi VCMS?
   Skanuje, porównuje, wykrywa konflikty, wymusza review, dokumentuje zmiany.
3. Dlaczego klient ma to obchodzić?
   Mniej błędów, szybsze utrzymanie, mniej stresu przed publikacją, łatwiejszy handover, większa kontrola nad AI.
4. Jak udowodnić, że działa?
   Dashboard, komenda skanu, raport konfliktów, audit log, workflow approve/reject, mapa powiązań repo.
5. Czego jeszcze nie obiecywać?
   Nie obiecywać compliance enterprise, SLA, SOC2, ISO, pełnego self-healing bez dowodów.

KROK 4 — ZMIANY W PREZENTACJI NA STRONIE
Przygotuj konkretne rekomendacje copy i struktury dla strony portfolio.

Minimalna sekcja VCMS na stronie powinna mieć strukturę:

A. Headline
„The governance layer behind the system.”

B. Subheadline
„VCMS scans content, repos and agent rules before changes reach production — so your business does not depend on memory, screenshots or one developer’s inbox.”

C. Three business outcomes
- Fewer surprises before deploy — conflicts are visible before they become client-facing bugs.
- Faster changes with control — AI can draft and refactor, but review gates decide what ships.
- Easier handover — rules, content sources and activity logs are documented instead of trapped in someone’s head.

D. Proof block
Show four assets only if each is real:
- VCMS dashboard — current scan status, repo coverage, conflict count.
- Conflict report — example of detected mismatch and recommended resolution.
- Agent cards — role, scope, permissions, approval gate.
- Activity audit log — who changed what, when, and why.

E. Honest status line
„Live in owner ecosystem. Selected modules are production; some supervision features are internal and improving. No fabricated metrics.”

KROK 5 — VIDEO / LOOM SCRIPT 75 SEKUND
Napisz profesjonalny skrypt nagrania Foundera.

Wymagany flow:
0–8 s: pokaż mapę ekosystemu i powiedz, że to nie jest tylko strona — to system z governance.
8–20 s: pokaż dashboard VCMS: repo coverage, last scan, conflict count.
20–35 s: uruchom komendę skanu lub pokaż raport: `npm run vcms:scan` / `node scripts/vcms-scan.js` / realna komenda z repo.
35–50 s: pokaż wykryty konflikt albo przykład SSoT mismatch: co VCMS blokuje i dlaczego.
50–62 s: pokaż human approval gate / agent card / audit log.
62–75 s: zakończ wartością biznesową: mniej chaosu, mniej ryzykownych deployów, szybszy handover, klient nadal ma kontrolę.

Styl wypowiedzi:
- spokojny, rzeczowy, bez przechwałek,
- maksymalnie 120–140 słów,
- żadnych „AI zrobi wszystko”,
- mów: „system proposes, human approves”.

KROK 6 — ROADMAPA 30 DNI
Zaproponuj tylko 3 funkcje, które są technicznie konkretne i realistyczne.
Każda funkcja musi mieć:
- opis,
- powód biznesowy,
- pliki / obszary do zmiany,
- test akceptacyjny,
- jak pokazać ją na stronie.

Preferowane funkcje:
1. Conflict Severity Matrix
   Klasyfikacja konfliktów: info / warning / blocking.
2. Audit Event Export
   Eksport logów zmian do JSON/CSV/Markdown dla handoveru i review.
3. SSoT Health Score
   Prosty wynik kondycji repo: scan coverage, unresolved conflicts, stale content, missing owner.

KROK 7 — DOSTARCZENIE PLIKÓW
W repo `flex-vcms` utwórz:
`docs/VCMS_SALES_REPORT.md`

Plik musi zawierać:
1. Executive summary: czym jest VCMS i dlaczego ma sens biznesowy.
2. Lista realnych funkcji z repo + dowody w plikach.
3. Plan optymalizacji prezentacji na stronie portfolio.
4. Gotowe copy do sekcji VCMS na stronie.
5. Skrypt video 75 sekund.
6. Roadmapa 30 dni — 3 funkcje.
7. Ryzyka reputacyjne: co wygląda amatorsko i jak to naprawić.
8. Lista zmian do wykonania w repo `services`.
9. Definition of Done dla prezentacji VCMS.

DODATKOWO, jeśli masz dostęp do repo `services`, zaproponuj konkretne zmiany w plikach content/components jako patch lub lista edycji.

KRYTERIA JAKOŚCI
Raport ma być bezlitosny, ale konstruktywny.
Każdy claim musi mieć jeden z trzech statusów:
- PROVEN — widać w repo / na stronie,
- DEMO — da się pokazać, ale nie obiecywać jako pełna produkcja,
- PLANNED — roadmapa, bez udawania że działa.

Jeżeli czegoś nie ma w kodzie, napisz to wprost. Profesjonalizm polega na jasnych granicach, nie na większych obietnicach.
```

---

## Uzasadnienie zawodowe

### Dlaczego ten prompt jest ostrzejszy niż poprzedni
Poprzedni prompt dobrze wyczuwał kierunek „Governance Layer”, ale za mocno opierał się na haśle „Enterprise B2B”. W profesjonalnej sprzedaży technologii w 2026 roku samo słowo „enterprise” bez dowodów działa przeciwko founderowi. Profesjonalista pyta: gdzie są logi, workflow, audyt, role, rollback, statusy funkcji, dowody i ograniczenia?

### Co zmienia nowy prompt
- Wymusza mapowanie funkcji na realny problem biznesowy.
- Wprowadza statusy claimów: PROVEN / DEMO / PLANNED.
- Każe usunąć lub uczciwie opisać placeholdery `[FILL]`.
- Przenosi narrację z „AI zbudowało” na „system kontroluje zmianę”.
- Chroni reputację foundera: pokazuje praktyczne doświadczenie i system thinking, ale bez udawania korporacyjnego compliance.

### Standard profesjonalny dla VCMS
Zawodowy VCMS nie jest „panelem”. To warstwa, która daje:
- kontrolę wersji,
- kontrolę publikacji,
- kontrolę źródeł prawdy,
- kontrolę agentów,
- audyt i odpowiedzialność,
- możliwość handoveru.

Jeżeli te elementy są jasno pokazane, VCMS ma sens jako część ekosystemu. Jeżeli są ukryte, wygląda jak amatorski dashboard.
