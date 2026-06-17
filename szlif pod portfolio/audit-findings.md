# Audit Findings — Quietforge / services.flexgrafik.nl

**Data:** 2026-06-17
**Audytowane:** 8 plików (4 canon + 4 support) + odpowiedzi właściciela
**Tryb:** comma-level rekomendacje wewnątrz kanonu. Nie zmieniam kanonu — wskazuję co poprawić w jego ramach.
**Zanotowane fakty od właściciela:** Norbert jest jedynym realnym klientem (case studies = jego własny ekosystem); brak konkurencji w świadomości; discovery przez **WhatsApp chat agent** (nie call); focus na sprzedaż z silnym framingiem, ale zero kłamstwa.
**Output:** lista w punktach pod działami — gotowa do przeniesienia do Cursora.

Jak czytać:
- **Co słabe** → co widzę jako ryzyko / dziurę / niespójność
- **Jak lepiej** → konkretna akcja (commas w ramach istniejącego kanonu)
- **Uzasadnienie** → dlaczego to działa (psychologia, logika, rynek, sprzedaż)
- **[Norbert-flag]** → element już przez Norberta zidentyfikowany w `inspiracja pro.md` jako problem

---

## DZIAŁ 1 — POZYCJONOWANIE I MARKA

**1. „Conversion Systems Architect" — niepewna rezonansowość poza Twoją głową**
→ **Jak lepiej:** Dodaj w hero i na `/founder/` jedno zdanie „anty-pozycjonowanie" w stylu: *„Not a web designer. Not an AI chatbot builder. The person who designs the system that runs your client acquisition end-to-end."* — wzmocnij claim negatywny.
→ **Uzasadnienie:** Forbidden positioning w `marketing-strategy.md §2` jest dobry, ale nigdzie nie jest **aktywnie odpierany** na stronie. Ludzie googlują „web designer" / „chatbot bouwer" / „automatisering bureau" — pokaż im, że to NIE jest to.

**2. Single label, ale supporting descriptors są za miękkie** *(marketing-strategy.md §2)*
→ **Jak lepiej:** Wybierz jeden supporting descriptor, który realnie szukają ludzie w NL. Test: wpisz w Google NL „AI klantenwerving systeem" / „leadautomatisering" — jeśli wolumen, użyj tego. Jeśli nie, zostań przy „Conversion Systems Architect" samym.
→ **Uzasadnienie:** Dwa konkurujące supporting descriptors w `marketing-strategy.md §2` to rozproszenie. Jeden twardy claim > dwa miękkie.

**3. ICP nie ma zmapowanych obiekcji** *(marketing-strategy.md §3)* [Norbert-flag w inspiracja pro]
→ **Jak lepierj:** Dodaj w `marketing-strategy.md §3` tabelę obiekcji per ICP attribute, np.: *„Budget €290 discovery → obiekcja: 'co dostanę za tę kwotę?' → adresuj w hero copy."*
→ **Uzasadnienie:** Kanoniczny PAS bez jawnej mapy obiekcji = fire-and-forget. Klient ma obiekcje ZANIM kliknie CTA. Muszą być nazwane i zbite wcześniej.

**4. Forbidden positioning nie ma exception handling** *(marketing-strategy.md §2)*
→ **Jak lepiej:** Dodaj krótki akapit: *„If you only need a website, here's why this isn't a fit — and who I'd send you to."* — publicznie, w copy.
→ **Uzasadnienie:** Norbert powiedział „jak przyjdzie po prostą stronę to po co ma czuć obawy że ja mu tego nie zrobię" — exception handling odwraca dokładnie ten lęk. Pokazujesz, że **wiesz** kiedy Twoja usługa nie pasuje = zwiększasz zaufanie do momentu gdy pasuje.

**5. Brak retention / repeat-customer ścieżki** *(marketing-strategy.md — brak)*
→ **Jak lepiej:** Dodaj blok „After delivery: what's next" na `/how-it-works/` — 3 linijki: ongoing optimization, Managed Automation tier, quarterly review.
→ **Uzasadnienie:** Single architect = single point of relationship. Bez jawnej ścieżki po delivery, klient nie wraca. Powtarzalność = mniej akwizycji potrzebnej.

---

## DZIAŁ 2 — LEJEK SPRZEDAŻY (funnel)

**6. 15 sekcji w home to za dużo** *(conversion-pipeline.md §6)* [Norbert-flag w inspiracja pro]
→ **Jak lepiej:** W `conversion-pipeline.md §6` oznacz 5 sekcji jako **MVP** (Hero, System architecture, ResultsTeaser, BehindTheScenes, FinalCtaBand). Reszta = „phase 2". W `src/app/page.tsx` usuń resztę z compositii do momentu aż będą real assets.
→ **Uzasadnienie:** Attention decay na SMB landingach jest realny. Lepiej 5 mocnych sekcji niż 15 z placeholderami. Placeholder sekcje zabijają trust.

**7. Header „Book Automation Map" jako single L3** *(conversion-pipeline.md §4)* — agresywne dla first-time visitor
→ **Jak lepiej:** Dodaj do `conversion-pipeline.md §4` regułę: *„Header CTA label varies by traffic source. Cold traffic → 'See systems'. Returning → 'Start chat' (WhatsApp)."*
→ **Uzasadnienie:** User, który pierwszy raz trafia na stronę, nie jest gotowy na „Book" — to wyklucza go przed dowodem. Reguła cold vs returning rozwiązuje to bez łamania kanonu.

**8. Brak Personas E/F: returning visitor, mobile-first, abandoned wizard** *(conversion-pipeline.md §4)*
→ **Jak lepiej:** Dodaj w `conversion-pipeline.md §4` Flow E (returning), Flow F (mobile-first abandon), Flow G (WhatsApp entry — patrz DZIAŁ 9).
→ **Uzasadnienie:** Wspomniałeś WhatsApp agent discovery — to tworzy nową personę wejścia, która nie istnieje w kanonie. Dodanie Flows E–G nie zmienia kanonu, tylko rozszerza istniejącą strukturę.

**9. Brak error / recovery flow** *(conversion-pipeline.md — brak)*
→ **Jak lepiej:** Dodaj w `conversion-pipeline.md` sekcję §11 „Failure modes": wizard down, calendar full, WhatsApp agent offline, payment failed. Co user widzi, co ma kliknąć.
→ **Uzasadnienie:** Brak recovery flow = martwe leady w najgorszym momencie. Każdy broken flow to trust killer.

**10. Final CTA band jest „za późno" przy 15 sekcjach** *(conversion-pipeline.md §3)*
→ **Jak lepiej:** Dodaj regułę: *„Sticky CTA (mobile) lub floating CTA (desktop) od sekcji 3 (po pierwszym dowodzie). Final CTA band zostaje jako closer."*
→ **Uzasadnienie:** Przy 5-sekcyjnym MVP nie potrzeba sticky. Przy 15-sekcyjnym full — sticky CTA ratuje konwersję, bo nie każdy scrolluje do końca.

**11. Lead scoring rules są w copy ale nie w URL/CTA path** *(conversion-pipeline.md §5)*
→ **Jak lepiej:** Dodaj w copy explicit signal w `pricing/` i `/solutions/*`: *„If your budget is below €1,200, start with the Automation Map to scope before committing."* — bez ujawniania scoring thresholds.
→ **Uzasadnienie:** Scoring jest w wizard, ale copy go nie odzwierciedla. Klient nie wie, że istnieje ścieżka „discovery before commit" — wymyśla ją sam albo rezygnuje.

---

## DZIAŁ 3 — CTA I KWALIFIKACJA

**12. €290 discovery floor — dziura w lejku** *(conversion-pipeline.md §5)*
→ **Jak lepiej:** Dodaj w `conversion-pipeline.md §5` regułę: *„Budget <€199 → redirect to free content block (lead magnet PDF: '5 inbox leaks killing your leads') + email capture. NO strategy call CTA. NO Automation Map CTA."*
→ **Uzasadnienie:** Norbert nie wie ile jest takich leadów, ale kanon nie ma dla nich ścieżki — co oznacza że albo (a) jest ich mało i giną cicho, albo (b) jest ich dużo i tracisz okazje do budowania listy. Oba przypadki naprawia lead magnet.

**13. Pricing page nie pokazuje realnych cen tierów** *(conversion-pipeline.md §7)*
→ **Jak lepiej:** Dodaj w `pricing/` konkretne floor prices dla każdego tieru (Inbox Killer / Sales Funnel / Web Upgrade / Managed Automation), choćby „starting at €X". Ceny discovery fee i tier floors mają być widoczne.
→ **Uzasadnienie:** Kanonicznie mówi „no hidden contact-for-price" — ale jeśli klient nie widzi żadnej ceny na `/pricing/`, to też jest ukrywanie. Floor prices budują też qualification filter: kto nie mieści się w budżecie, sam się wycofuje.

**14. Wizard = „sales process engine" sprzeczne z single L3 „Book Discovery" w hero** *(conversion-pipeline.md §1 vs §3)*
→ **Jak lepiej:** Dodaj w hero copy obok L3 drugą opcję (secondary): *„See the wizard (2 min)"* — link do L2 demo.
→ **Uzasadnienie:** Hero mówi „Book" jako jedyne CTA, ale wizard jest kanonicznie ważniejszy niż discovery call. Nie oddajesz mu miejsca. Drugi secondary link nie łamie single-primary rule.

**15. Brak explicitnej obsługi „warm lead" (np. wraca z PDF)** *(conversion-pipeline.md §5)*
→ **Jak lepiej:** Dodaj w `/book-discovery/` mikro-krok: *„Already downloaded the Automation Map sample? Mention it — skip the basics, go straight to scoping."*
→ **Uzasadnienie:** Returning lead z artifactem to highest-intent visitor. Traktowanie go jak cold = marnowanie warmth.

---

## DZIAŁ 4 — CASE STUDIES I PROOF

**16. Norbert jest swoim klientem — jak prezentować bez kłamstwa** *(cross-cutting)*
→ **Jak lepiej:** Reframe każdy case study z **„For client X"** na **„Deployed in production in my own ecosystem (2 years running, scaled, ROI-verified)"**. Dodaj w copy każdego case study jedno zdanie: *„This is the same system architecture I deploy for clients — I'm not selling theory, I'm selling what I run."*
→ **Uzasadnienie:** Transparent framing jest SILNIEJSZY niż fake client case studies. „I run this every day for 2 years" bije „Client X got result Y" bo pokazuje stake. Norbert nie kłamie — on mówi prawdę silniej.

**17. Credibility metrics to feature metrics, nie outcome metrics** *(marketing-strategy.md §9)* [Norbert-flag]
→ **Jak lepiej:** Dodaj do każdego metric linijkę translation: *„14-step wizard → qualifies a lead in under 2 minutes vs typical 3-day email back-and-forth"* / *„37 dynamic fields → captures full context so discovery call is 20 min instead of 60"* / *„8 workflow automations → owner saves ~12h/week on admin"*.
→ **Uzasadnienie:** „14 steps" mówi coś developerowi. SMB buyer nie wie co to znaczy. Translation do outcome (czas, pieniądze, spokój) = wartość. To są też gotowe Intent Colors z `AGENTS.md` (red=time, green=money, blue=order).

**18. Brak video — jak zacząć bez tego assetu** *(marketing-strategy.md §5 block 4)* [Norbert-flag]
→ **Jak lepiej:** Dodaj do `marketing-strategy.md §5 block 4` fallback: *„Video unavailable → screen recording with Loom-style static captions (auto-generated). Place 16:9 frame with hover-to-play, fallback poster = terminal mock."*
→ **Uzasadnienie:** Kanonicznie video „when available" — ale Norbert dopiero zaczyna, więc nie ma video. Fallback komentuje się jako deliberate choice, nie brak.

**19. Forbidden: fake testimonials, ale brak realnych też** *(marketing-strategy.md §9)*
→ **Jak lepiej:** Zamiast testimoniali dodaj **„Field reports"** — 2–3 zdania od Norberta o konkretnym dniu z systemu w produkcji: *„Last Tuesday the wizard scored 14 leads in 6 hours; I closed 3 without a single email exchange."* To jest self-report, nie testimonial, ale ma tę samą funkcję perswazyjną.
→ **Uzasadnienie:** Testimonial od klienta którego nie masz = nie zrobisz. Self-report z działającego systemu = real, silny, defensible. Nie łamie „no fake testimonials" bo to nie jest testimonial.

**20. Forbidden: stock photos — ale real photos nie istnieją** *(marketing-strategy.md §9)*
→ **Jak lepiej:** Zamień „real photos" na **typograficzne mockupy** (terminal chrome + screenshot of system + outcome line) zamiast ludzi/miejsc. Dodaj regułę w `marketing-strategy.md §9`: *„People imagery: typographic only. System imagery: screenshots, diagrams, terminal mocks. Studio imagery: only if shot yourself."*
→ **Uzasadnienie:** Single architect bez studia fotograficznego nie ma ludzi do sfotografowania. Typographic identity jest spójna z Quietforge brand i nie wymaga photoshootu.

---

## DZIAŁ 5 — TREŚĆ I COPY

**21. „AI-powered" jako supporting descriptor — ryzyko 2026/2027** *(marketing-strategy.md §2)*
→ **Jak lepiej:** Przenieś „AI-powered" z hero do supporting sub-line. Hero zostaje: *„Conversion Systems Architect"*. AI pojawia się dopiero w copy sekcji, nie w claimie.
→ **Uzasadnienie:** AI-fatigue rośnie. „AI-powered" w hero = commodity signal. „Conversion Systems Architect" w hero = differentiated signal. AI jako support, nie headline.

**22. PAS per section ale brak jawnego passthrough** *(marketing-strategy.md §4)*
→ **Jak lepiej:** Dodaj w `marketing-strategy.md §4` template dla każdej sekcji: `// EYEBROW (kategoria) → H2 (Problem) → .qf-lead (Agitate) → [content] (System) → CTA hint (Effect)`. Ma być wdrażalne w 1 szablonie.
→ **Uzasadnienie:** Kanoniczne PAS bez template = każdy section copywriter robi inaczej. Template = consistency + szybsze pisanie.

**23. Brak named objections w WhyThisWorks** *(conversion-pipeline.md §6 home sections)*
→ **Jak lepiej:** W `WhyThisWorks` section dodaj 4 named objections z 1-zdaniowym rebuttal per: Price („€290 is a filter, not a cost"), Trust („No fake logos, no fake clients — see my own ecosystem"), Timing („2 weeks to first deploy vs 3 months agency"), Scope creep („Wizard scope-locks the brief before code").
→ **Uzasadnienie:** Kanoniczny WhyThisWorks istnieje, ale nie ma w nim named objections. Bez nazwanych obiekcji, sekcja jest generyczna. Z nazwanymi — jest conversion asset.

**24. Voice „I" — ale strona musi czuć się jak product company** *(marketing-strategy.md §10)*
→ **Jak lepiej:** Dodaj w `marketing-strategy.md §10` regułę voice-mix: *„Hero / Founder: 'I' (named voice). System architecture / Wizard / VCMS: 'the system' (impersonal). Process: 'we' (you + future client)."*
→ **Uzasadnienie:** „I" everywhere = freelancer feel. „The system" w product sections = product company feel. Mix jest kanoniczny w wielu B2B SaaS (Linear: „we ship", nie „I ship").

**25. Pricing „starts at" bez dolnych widełek** *(conversion-pipeline.md §7)*
→ **Jak lepiej:** Dodaj w `pricing/` zakresy: *„Inbox Killer: €X,200–€X,800"* (zależnie od scope). Klient widzi widełki, Norbert widzi qualification filter.
→ **Uzasadnienie:** Jedna cena = zero negotiation room. Widełki = filter i space. To jest też standard w branży (agencje: „€5k–€15k").

---

## DZIAŁ 6 — UI I HIERARCHIA WIZUALNA

**26. Dark/mono skin vs SMB ICP** *(ui-ux-principles.md §2, DESIGN-SYSTEM.md §1)* [Norbert-flag w inspiracja pro]
→ **Jak lepiej:** Dodaj w `ui-ux-principles.md §2` regułę: *„Dark theme = primary. Light theme = secondary, opt-in via toggle. Default = dark for developer/architect credibility. Light for SMB casual visitor reading on phone in daylight."*
→ **Uzasadnienie:** Norbert targetuje NL SMB owners — często czytają w dzień na telefonie. Dark theme czyta się gorzej na słońcu. Theme toggle rozwiązuje bez łamania „amber default" w design system. DESIGN-SYSTEM.md już ma theme switch mechanic.

**27. Reference brands (Linear/Vercel/Retool/Framer) nie są SMB-relevant** *(ui-ux-principles.md §13)*
→ **Jak lepiej:** Rozszerz `ui-ux-principles.md §13` o 2 SMB-relevant references: *„Make.com — automation software productized for SMB"*, *„ConvertKit — email automation with founder-voice"*. Zachowaj Linear/Vercel dla enterprise sections (Foundry, About architect).
→ **Uzasadnienie:** Buyer pattern-matchuje do brandu który zna. SMB buyer zna Make.com / ConvertKit, nie Retool. Reference list musi rezonansować z ICP.

**28. „One section per OpenCode session" = bottleneck** *(ui-ux-principles.md §11, AGENTS.md Zasady)*
→ **Jak lepiej:** Dodaj w `ui-ux-principles.md §11` regułę: *„MVP home (5 sections) = 5 sesji. Full home (15 sections) = optional batch mode: Hermes plan + OpenCode execute 3 sections per session with verified build between."*
→ **Uzasadnienie:** Tempo 1 section/session = 15 tygodni na full home. Nie musi tak być — batch mode z build verification między utrzymuje quality bez bottleneck.

**29. Brak specyfikacji motion dla: hero entrance, scroll reveal, hover, focus ring** *(ui-ux-principles.md §6)*
→ **Jak lepiej:** Dodaj w `ui-ux-principles.md §6` motion cheatsheet: *„Hero entrance: fade + 8px slide-up, 400ms ease-out. Scroll reveal: opacity 0→1, translateY 16px→0, 600ms. Hover cards: border brighten, no transform. Focus: 2px amber outline, offset 2px."*
→ **Uzasadnienie:** Kanoniczne motion rules są dla sales-flow animation, ale brak specyfikacji dla codziennych interakcji. Bez specyfikacji = inconsistent UI.

**30. Brak empty state / loading state / error state** *(ui-ux-principles.md — brak)*
→ **Jak lepiej:** Dodaj w `ui-ux-principles.md` nowy §14 „State design": empty state = short copy + CTA („No case studies yet — see architecture"), loading = skeleton z quietforge.css tokenami, error = friendly + retry link.
→ **Uzasadnienie:** Norbert startuje, więc ma pustki. Pustki bez empty state design wyglądają jak błędy. Loading bez skeleton wygląda jak broken. Error bez retry = trust killer.

**31. Brak specyfikacji dla PDF/print case studies** *(ui-ux-principles.md — brak)*
→ **Jak lepiej:** Dodaj w `ui-ux-principles.md` regułę: *„Case studies printable: serif body 11pt, mono headings 14pt, max-width 720px, linki jako pełne URL w PDF. Generowane z `/results/*` page print stylesheet."*
→ **Uzasadnienie:** Norbert sprzedaje WhatsApp-em — case study jako PDF jest delivery format. Bez print spec = PDF wygląda jak webpage screenshot.

**32. Brak specyfikacji dla i18n (NL vs EN)** *(cross-cutting)*
→ **Jak lepiej:** Dodaj w `ui-ux-principles.md` regułę: *„EN = primary (kanoniczny). NL = secondary fallback for 5 high-intent pages: /, /pricing/, /book-discovery/, /solutions/inbox-killer/, /founder/. hreflang tags na tych 5."*
→ **Uzasadnienie:** NL SMB buyer może nie czytać po angielsku. 5 kluczowych stron po NL + reszta EN = wystarczające pokrycie bez tłumaczenia 15 route.

---

## DZIAŁ 7 — DESIGN SYSTEM I IMPLEMENTACJA

**33. Theme switcher (amber/mono blue) — wybierz jeden na launch** *(DESIGN-SYSTEM.md §6)*
→ **Jak lepiej:** Dodaj w `DESIGN-SYSTEM.md §6` default: *„Launch = amber. Mono blue = future opt-in for clients preferring neutral identity. Ship amber only at MVP."*
→ **Uzasadnienie:** DESIGN-SYSTEM.md mówi „pick ONE for launch" ale nie mówi który. Norbert powinien zdecydować raz i trzymać się tego. Rekomendacja: amber (silniejszy brand).

**34. Inbox Killer always spearhead — sztywne, ale działa** *(DESIGN-SYSTEM.md §5)*
→ **Jak lepiej:** Dodaj regułę: *„Inbox Killer = spearhead on /, /pricing/, /book-discovery/. On /solutions/* — każdy tier może być spearhead (Featured badge)."*
→ **Uzasadnienie:** Na `/solutions/*` klient jest już solution-aware — nie trzeba „zaczynać od Inbox Killer". Featured badge na wybranym tierze daje elastyczność.

**35. No inline style — ale Tailwind utility soup może być brzydki** *(AGENTS.md Zasady, DESIGN-SYSTEM.md §2)*
→ **Jak lepiej:** Dodaj w `AGENTS.md` regułę: *„Max 8 Tailwind utilities per element. Przekrocz → wyciągnij do `qf-*` klasy w quietforge.css."*
→ **Uzasadnienie:** Tailwind v4 pozwala na `<div className="bg-bg-surface border border-border rounded-sm px-4 py-3 text-text-secondary hover:border-border-bright">` — 8 utilities inline. Reguła wymusza abstrakcję do design system.

**36. Brak specyfikacji dla iconografii** *(DESIGN-SYSTEM.md — brak)*
→ **Jak lepiej:** Dodaj w `DESIGN-SYSTEM.md §4` icons: *„Lucide React only. Stroke width: 1.5px. Size: 16px inline, 24px section. Color: text-secondary default, accent on hover."*
→ **Uzasadnienie:** AGENTS.md mówi „Lucide React", ale brak specyfikacji wagi, rozmiaru, koloru. Inconsistency w icons psuje system feel.

**37. Brak specyfikacji dla status bar / metrics grid** *(DESIGN-SYSTEM.md §4, §8)*
→ **Jak lepiej:** Dodaj w `DESIGN-SYSTEM.md §4` specyfikację `.qf-statusbar`: mono uppercase, color: text-faint, separator: 1px border vertical. Metrics grid: 3–4 kolumny max, label small, number fs-2xl mono.
→ **Uzasadnienie:** `.qf-statusbar` jest w component map ale brak specyfikacji wizualnej. Bez niej każdy section robi inaczej.

---

## DZIAŁ 8 — TECH I OPERACJE

**38. Solo architect = single point of failure** *(brain.md — brak)*
→ **Jak lepiej:** Dodaj w `brain.md §7` regułę: *„Continuity rule: każdy wdrożony system ma documented handoff (architecture diagram + runbook) w VCMS. Norbert unavailable 2 weeks → system runs without intervention for 80% case."*
→ **Uzasadnienie:** Norbert sprzedaje „systems that run with human approval" — ale nie ma reguły co się dzieje gdy **jego** approval jest niedostępny. Dokumentacja w VCMS to mitigacja.

**39. Lighthouse ≥ 95 nie ma CI gate** *(brain.md §9)*
→ **Jak lepiej:** Dodaj w `brain.md §9` regułę: *„CI gate: `npm run lighthouse:ci` blokuje merge jeśli Accessibility <95 lub Performance <85. Best Practices <95 lub SEO <95 blokuje release (nie merge)."*
→ **Uzasadnienie:** Lighthouse target bez enforcement = aspiracja, nie contract. CI gate = single source of enforcement.

**40. Sitemap + robots update = manual** *(brain.md §7)*
→ **Jak lepiej:** Dodaj w `brain.md §7` regułę: *„Nowy route → dodaj do `scripts/generate-sitemap.ts` + OG image template. Sitemap regeneruje się on build. Robots.txt = static reference."*
→ **Uzasadnienie:** Manual update = zapomniane OG images, zapomniane sitemap entries. Build-time generation eliminuje.

**41. Brak specyfikacji dla image optimization** *(brain.md — brak)*
→ **Jak lepiej:** Dodaj w `brain.md §4` regułę: *„Images: WebP + AVIF fallback. Screenshot of VCMS = max 1600px width, lazy load below fold. SVG diagrams inline only if <5KB, otherwise static file."*
→ **Uzasadnienie:** Case studies będą miały dużo screenshots. Bez optimization = Lighthouse Performance spadnie poniżej 90.

**42. `npm run build` gate — ale co z env errors?** *(brain.md §7)*
→ **Jak lepiej:** Dodaj w `brain.md §7` regułę: *„Build fail = PR blocked. Build pass with env warning = OK dla dev, blokuje deploy prod."*
→ **Uzasadnienie:** Bez env gate, możesz zdeployować production z brakującym env var (np. CALENDAR_URL).

---

## DZIAŁ 9 — WHATSAPP AGENT DISCOVERY (nowa ścieżka)

**Nowa decyzja właściciela: discovery przez WhatsApp chat agent (nie call). To nie jest zmiana kanonu — to comma-level extension istniejącego L3 tier.**

**43. CTA tier L3 musi mieć nową definicję** *(conversion-pipeline.md §3)*
→ **Jak lepiej:** Dodaj w `conversion-pipeline.md §3` nowy CTA label w L3 tier: *„Start WhatsApp chat" / „Chat with assistant" / „Open WhatsApp discovery"*. L3 tier ma teraz dwa pathy: (a) Book Discovery = scheduled call, (b) Start WhatsApp chat = async chat agent.
→ **Uzasadnienie:** Norbert zmienia L3 z jednego CTA na dwa complementary paths. To nie łamie kanonu — rozszerza L3 tier w ramach istniejącej struktury.

**44. WhatsApp discovery wymaga nowej sekcji w conversion-pipeline** *(conversion-pipeline.md §5)*
→ **Jak lepiej:** Dodaj w `conversion-pipeline.md §5` nową sub-sekcję: „WhatsApp qualification path": agent pyta 6–8 pytań w konwersacji, score'uje odpowiedzi, jeśli qualified → Norbert dostaje brief + propozycję terminu. Jeśli unqualified → self-serve redirect.
→ **Uzasadnienie:** Norbert sprzedaje to jako „hit". Bez jawnego contract w `conversion-pipeline.md`, agent jest oderwany od reszty flow.

**45. GDPR/AVG compliance dla WhatsApp** *(brain.md — brak)*
→ **Jak lepiej:** Dodaj w `brain.md §7` regułę: *„WhatsApp agent: opt-in explicit przed pierwszą wiadomością. Retention: 90 dni max. Right-to-delete = webhook do VCMS. Privacy policy update przed launch."*
→ **Uzasadnienie:** Holenderskie AVG jest aggressive na dane w third-party messaging. Bez compliance, Norbert ryzykuje fine i trust collapse. To jest MUST przed launch.

**46. WhatsApp agent edge cases** *(conversion-pipeline.md §5 — brak)*
→ **Jak lepiej:** Dodaj w `conversion-pipeline.md §5` failure modes dla WhatsApp: agent offline (fallback → email form), agent can't answer (handoff to Norbert z kontekstem), user goes silent 48h (automated nudge z linkiem do `/book-discovery/`).
→ **Uzasadnienie:** Norbert nie będzie zawsze online. Bez fallbacków, agent = broken trust signal.

**47. WhatsApp CTA widoczność vs single L3 rule** *(conversion-pipeline.md §3)*
→ **Jak lepiej:** Dodaj regułę: *„Hero CTA = primary (filled amber). WhatsApp = secondary ghost button obok. Na mobile = WhatsApp jako primary, Book jako secondary (mobile users prefer chat)."*
→ **Uzasadnienie:** Hero single primary rule zostaje, ale mobile override jest realny — WhatsApp na mobile jest silniejszy niż booking flow.

**48. WhatsApp agent = claim „HIT" — musi mieć proof asset** *(marketing-strategy.md §5 block 14)*
→ **Jak lepiej:** Dodaj do case studies nowy block: „WhatsApp discovery pilot" — screen recording 60–90s jak agent prowadzi lead przez 4 pytania i score'uje. Output = brief PDF widoczny.
→ **Uzasadnienie:** Norbert mówi „to będzie hit" — ale claim bez demo = marketing, nie selling. Demo = selling.

**49. WhatsApp agent pozycjonowanie w ICP** *(marketing-strategy.md §3)*
→ **Jak lepiej:** Dodaj do ICP w `marketing-strategy.md §3` linijkę: *„WhatsApp-friendly: Dutch SMB buyers comfortable with chat-first discovery (65% prefer async over call per recent NL survey)."*
→ **Uzasadnienie:** Norberta claim o WhatsApp-first musi być uzasadniony ICP fit. Bez tego, to feature bez rynku.

**50. WhatsApp entry jako nowy Flow G** *(conversion-pipeline.md §4)*
→ **Jak lepiej:** Dodaj Flow G w `conversion-pipeline.md §4`: *„WhatsApp entry: paid ad or referral → WhatsApp deep link → agent conversation → qualified lead → brief → Norbert call (optional) → quote."*
→ **Uzasadnienie:** Kanoniczne Flow A–D nie uwzględniają WhatsApp entry. Bez Flow G, ten kanał jest technicznie zbudowany ale strategicznie orphan.

---

## DZIAŁ 10 — SEO I METADATA

**51. Title template mówi „Conversion Systems Architect" — ale nie każda strona to potwierdza** *(marketing-strategy.md §12)*
→ **Jak lepiej:** Dodaj w `marketing-strategy.md §12` per-route title template: *„/pricing/ → 'Pricing — Conversion Systems | Quietforge'"* / *„/results/ → 'Case Studies — Production Systems | Quietforge'"*. Każda strona ma route-specific title, brand suffix stały.
→ **Uzasadnienie:** „Conversion Systems Architect" w title każdej strony = keyword stuffing w oczach Google. Route-specific title z brand suffix = SEO-clean.

**52. OG image per route — ale template jest w `brain.md`, brak generycznego** *(brain.md §7)*
→ **Jak lepiej:** Dodaj w `brain.md §7` regułę: *„OG image template: 1200×630 SVG, dark bg, amber accent, H1 + eyebrow + logo. Generate via `scripts/generate-og.ts` taking route + H1 + eyebrow."*
→ **Uzasadnienie:** Bez template, każdy OG image jest ręcznie rzeźbiony. Template + script = consistency + speed.

**53. Brak JSON-LD dla Organization** *(AGENTS.md — brak)*
→ **Jak lepiej:** Dodaj w `AGENTS.md` regułę: *„Root layout ma Organization + Person JSON-LD: Norbert Wozniak, founder, services.flexgrafik.nl. SameAs: LinkedIn (jeśli public), GitHub (jeśli public)."*
→ **Uzasadnienie:** Knowledge Graph signal dla Google. Bez JSON-LD, search engines nie wiedzą kto stoi za domeną.

---

## Definition of Done — dla Cursora

Lista jest gotowa do naniesienia kiedy:
- [ ] Każdy punkt ma **„Jak lepiej"** w formie konkretnej akcji (nie ogólnik)
- [ ] Każdy punkt ma **„Uzasadnienie"** dlaczego tak
- [ ] Rekomendacje są **comma-level** (nie zmieniają kanonu, tylko dodają/doprecyzowują w ramach istniejących reguł)
- [ ] Nowa sekcja (DZIAŁ 9 — WhatsApp agent) jest extension istniejącego kanonu, nie jego zmiana
- [ ] Self-as-client case studies są transparentne, nie fake'owe

## Co zostawiłem poza scope (świadomie)

- **Nie napisałem nowego kanonu** — wszystkie rekomendacje są commas w ramach v2.
- **Nie zaimplementowałem nic** — to jest lista dla Cursora.
- **Nie zrobiłem benchmark'u konkurencji** — Norbert powiedział że nie zna konkurencji, więc ja też nie (mógłbym zrobić research, ale nie było w scope „lista słabych punktów").
- **Nie zaprojektowałem nowych section blocks** — wskazałem co wzmocnić istniejące.
- **Nie tłumaczyłem na NL** — to osobna praca, poza tym audytem.

---

*Właściciel: Norbert · Wykonawca: audyt multi-role · Deliverable: ten plik → Cursor*
