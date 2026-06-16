# PROOF ASSETS INVENTORY — What We Have vs. What We Need
## Sales Enablement Checklist | June 15, 2026

---

## INVENTORY: PROOF ASSETS BY TYPE

### 🖼️ SCREENSHOTS & UI MOCKUPS

| Asset | Repository | Status | Quality | Action |
|-------|------------|--------|---------|--------|
| Wizard 7-step flow | zzpackage | ✅ EXISTS | PROD | Export @ 375px + 1440px |
| Checkout VCA | zzpackage | ✅ EXISTS | PROD | Record demo video (2 min) |
| Game entry gate | app.flexgrafik | ✅ EXISTS | PROD | Screenshot on 3 devices |
| Game level 1–5 | app.flexgrafik | ✅ EXISTS | PROD | Video walkthrough (3 min) |
| Leaderboard UI | app.flexgrafik | ✅ EXISTS | MVP | Add real data screenshot |
| Homepage portfolio | flexgrafik-nl | ✅ EXISTS | BETA | Mobile + desktop versions |
| VCMS dashboard | flex-vcms | ✅ EXISTS | PROD | Record walkthrough (5 min) |
| Command Center | flex-vcms | ✅ EXISTS | PROD | Show health indicators |
| Agent-OS task list | agent-os | ✅ EXISTS | MVP | Add approval flow demo |
| Agent-OS-UI detail | agent-os-ui | ✅ EXISTS | MVP | Show code diff viewer |

**TOTAL: 10 / 10 exists. ACTION: Export + format for sales deck (1 day)**

---

### 📊 PERFORMANCE METRICS

| Metric | Repository | Status | Unit | Value | Proof |
|--------|------------|--------|------|-------|-------|
| Test Coverage | app.flexgrafik | ✅ DOCUMENTED | % | 209/209 | todo.json line 10 |
| TypeScript Errors | app.flexgrafik | ✅ DOCUMENTED | Count | 0 | todo.json line 11 |
| Security CVEs | app.flexgrafik | ✅ DOCUMENTED | Count | 0 | todo.json line 12 |
| Bundle Size | app.flexgrafik | ✅ DOCUMENTED | KB | 456 JS, 140 gzip | brain.md |
| Scan Determinism | flex-vcms | ✅ DOCUMENTED | Test | TS-005 PASS | flex-vcms-todo.json PH3-016 |
| Conflicts Detection | flex-vcms | ✅ DOCUMENTED | Count | 0 | map.md |
| Session Success Rate | flex-vcms | ✅ DOCUMENTED | % | 100% | docs/handoffs |
| API Health | flex-vcms | ✅ DOCUMENTED | Status | HTTP 200 | server.js /health |
| Agent E2E Tests | agent-os | ✅ DOCUMENTED | Test | PASS | SESSION-ANCHOR.md line 13 |
| Token Budget | agent-os | ✅ DOCUMENTED | Tokens | 50k/task | SESSION-ANCHOR.md line 15 |

**TOTAL: 10 / 10 exists. ACTION: Compile into 1-page metrics sheet (2 hours)**

---

### 📹 VIDEOS & DEMOS

| Video Type | Repository | Status | Duration | Owner | Action |
|------------|------------|--------|----------|-------|--------|
| Wizard walkthrough | zzpackage | ❌ MISSING | 2 min | Frontend | Record this week |
| Checkout process | zzpackage | ❌ MISSING | 90 sec | Frontend | Record this week |
| Game playthrough | app.flexgrafik | ❌ MISSING | 3 min | Frontend | Record this week |
| Order workflow | jadzia-core | ❌ MISSING | 3 min | Backend | Create from logs |
| Agent execution | agent-os | ❌ MISSING | 5 min | Backend | Record with narration |
| Customer testimonial | flexgrafik-nl | ❌ MISSING | 2 min | Marketing | Interview 1–2 customers |
| Dashboard tour | flex-vcms | ❌ MISSING | 3 min | DevOps | Record with commentary |

**TOTAL: 0 / 7 exist. ACTION: Allocate 1 week to video recording**

---

### 📄 DOCUMENTATION & CASE STUDIES

| Document | Repository | Status | Pages | Action |
|----------|------------|--------|-------|--------|
| Wizard UX audit | zzpackage | ✅ EXISTS | 10 | Extract key findings for sales |
| Case study: Design brief → delivery | jadzia | ❌ MISSING | 3–5 | Create from order logs |
| Case study: 5 ZZP brand transformations | flexgrafik-nl | ❌ MISSING | 3–5 | Interview customers |
| Product roadmap (Phase 1–5) | flexgrafik-meta | ✅ EXISTS | 5 | Polish for external audience |
| API documentation | agent-os | ⚠️ PARTIAL | 10 | Expand endpoint docs |
| Competitive analysis | All | ❌ MISSING | 2–3 | Create matrix vs. competitors |
| ROI calculator | All | ❌ MISSING | 1 | Build interactive model |
| Security audit report | flex-vcms | ✅ EXISTS | 10 | Summarize for prospects |

**TOTAL: 4 / 8 exist. ACTION: Create top 3 missing (2 weeks)**

---

### 💻 CODE SAMPLES & ARCHITECTURE

| Asset | Repository | Status | Location | Action |
|-------|------------|--------|----------|--------|
| Wizard component library | zzpackage | ✅ EXISTS | assets/css/zzp-*.css | Extract & document |
| Game physics engine | app.flexgrafik | ✅ EXISTS | src/engine/ | Create architecture diagram |
| Agent state machine | jadzia-core | ✅ EXISTS | agent/state.py | Extract diagram + pseudocode |
| VCMS orchestration | flex-vcms | ✅ EXISTS | tools/vcms-scan.js | Create data flow diagram |
| API examples | agent-os | ✅ EXISTS | docs/api-examples.md | Expand with curl examples |

**TOTAL: 5 / 5 exist. ACTION: Extract to public GitHub pages (1 week)**

---

### 📈 BUSINESS METRICS (CUSTOMER-FACING)

| Metric | Repository | Status | Current | Target | Proof |
|--------|------------|--------|---------|--------|-------|
| Monthly orders | zzpackage | ✅ TRACKED | 30–40 | 100+ | Mollie data (internal) |
| Average order value | zzpackage | ✅ TRACKED | €400–500 | €600+ | audit-todo.json |
| Mobile conversion | app.flexgrafik | ⚠️ BASIC | ~5% | 10%+ | GA4 (needs setup) |
| Leaderboard activation | app.flexgrafik | ⚠️ BASIC | ~20% | 40%+ | GA4 events |
| Lead cost (CAC) | flexgrafik-nl | ❌ MISSING | Unknown | <€2 | SEO metrics needed |
| Customer LTV | flexgrafik-nl | ❌ MISSING | Unknown | €1,200+ | Retention data needed |

**TOTAL: 3 / 6 documented. ACTION: Set up GA4 dashboard + create tracking (1 week)**

---

### 🏆 CERTIFICATIONS & THIRD-PARTY VALIDATION

| Certification | Repository | Status | Score | Action |
|---------------|------------|--------|-------|--------|
| Google PageSpeed (mobile) | flexgrafik-nl | ❌ MISSING | TBD | Run Lighthouse |
| WCAG 2.1 Accessibility | app.flexgrafik | ❌ MISSING | TBD | Run axe DevTools |
| npm audit (security) | app.flexgrafik | ✅ PASS | 0 CVEs | Screenshot for sales |
| TypeScript strict mode | app.flexgrafik | ✅ PASS | 0 errors | Screenshot for sales |
| Pytest coverage | agent-os | ✅ PASS | >80% | Generate HTML report |
| Playwright tests | app.flexgrafik | ✅ PASS | 209/209 | Screenshot results |

**TOTAL: 4 / 6 obtained. ACTION: Generate missing 2 (1 day)**

---

## SALES MATERIALS TO CREATE (Priority Order)

### 🔴 CRITICAL (Needed before first sales call)

1. **One-Pagers per Product** (1 page each, 7 products)
   - What it does (1 sentence)
   - Business model (revenue type)
   - Key metrics (3–5 proof points)
   - Customer segment
   - Price/ACV
   - CTA (demo, trial, consultation)
   - **Effort:** 3 hours
   - **Owner:** Marketing + Product

2. **Competitive Analysis Matrix** (1 page)
   - 7 products vs. 5 alternatives each
   - Feature comparison
   - Pricing comparison
   - Differentiation column
   - **Effort:** 4 hours
   - **Owner:** Product Manager

3. **Customer Testimonials** (3–5 quotes)
   - From real customers (Mollie, WordPress hosts, etc.)
   - With screenshots of results
   - Attribution (name, company, title)
   - **Effort:** 1 week (interview + video recording)
   - **Owner:** Marketing

---

### 🟡 HIGH PRIORITY (Needed within 2 weeks)

4. **Case Studies** (1–2 pages each, 3 total)
   - Problem (customer's situation)
   - Solution (how product fixed it)
   - Results (metrics: time saved, revenue gained)
   - Quote + logo
   - **Effort:** 2 weeks (customer interviews)
   - **Owner:** Marketing + Sales

5. **Sales Deck** (15–20 slides)
   - Company overview (1 slide)
   - Market opportunity (2 slides)
   - Products (1 slide per product = 7 slides)
   - Traction (metrics, customers, revenue)
   - Roadmap (next 12 months)
   - CTA (demo, partnership, investment)
   - **Effort:** 1 week
   - **Owner:** Marketing + Sales

6. **ROI Calculator** (interactive or spreadsheet)
   - For each product: input baseline + see payback period
   - Based on real data (zzpackage AOV, agent-os automation savings, etc.)
   - **Effort:** 3 days
   - **Owner:** Finance + Product

---

### 🟢 MEDIUM PRIORITY (Needed within 4 weeks)

7. **Video Demos** (1 per product, 2–5 min each)
   - Screen recording + narration
   - Show key features
   - End with CTA
   - **Effort:** 1 week (recording + editing)
   - **Owner:** Marketing + Frontend

8. **Pricing Page** (for SaaS products)
   - Tiers (Starter, Professional, Enterprise)
   - Feature matrix
   - FAQ (billing, support, customization)
   - **Effort:** 3 days
   - **Owner:** Product + Finance

9. **Customer Success Stories** (1 per product, 500 words each)
   - Customer profile
   - Challenge they faced
   - Solution implemented
   - Results (quantified)
   - Quote + headshot
   - **Effort:** 2 weeks (interviews)
   - **Owner:** Marketing

---

## PROOF ASSET COMPILATION CHECKLIST

### Week 1: Quick Wins (Low effort, high impact)

- [ ] Export wizard screenshots @ 375px + 1440px
- [ ] Screenshot game on iPhone + Android
- [ ] Compile metrics sheet (10 items)
- [ ] Run Lighthouse audit (PageSpeed)
- [ ] Generate pytest HTML report
- [ ] Take screenshots of npm audit PASS, TypeScript 0 errors

**Owner:** Frontend (2 days) + DevOps (1 day)

---

### Week 2–3: Case Studies & Videos

- [ ] Record wizard walkthrough video (2 min)
- [ ] Record game playthrough video (3 min)
- [ ] Record agent execution demo (5 min)
- [ ] Interview 2–3 customers (1 hr each)
- [ ] Create 1–2 case study documents
- [ ] Record customer testimonial video (2 min)

**Owner:** Marketing (1 week) + Frontend (3 days)

---

### Week 4: Sales Materials

- [ ] Create 7 product one-pagers
- [ ] Build competitive matrix
- [ ] Create ROI calculator
- [ ] Assemble sales deck (15 slides)
- [ ] Write pricing proposal template
- [ ] Create FAQ document

**Owner:** Marketing (1 week) + Product Manager (3 days)

---

## METRICS: WHAT TO TRACK GOING FORWARD

### Product-Specific Dashboards

**Zzpackage:**
- Daily orders + revenue
- Avg order value + AOV trend
- Conversion rate (entry → checkout)
- Mobile vs. desktop split
- Top products by revenue

**App.flexgrafik:**
- DAU (daily active users)
- Session duration (avg)
- Level completion rate (per level)
- Leaderboard engagement
- Coupon redemption rate

**Jadzia-Core:**
- Tasks created / completed per day
- Average task completion time
- Error/rejection rate
- Automation savings (hours/week)
- Customer satisfaction (CSAT)

**Agent-OS:**
- Active agents / tasks
- Token usage (per task)
- Success rate (plan → approve)
- Rejection rate + reasons
- Cost per task (LLM tokens)

**Flex-VCMS:**
- Session success rate
- Average session duration
- Handoff compliance (%)
- Conflicts detected + prevented
- Deployment frequency

---

## SUMMARY: EFFORT & TIMELINE

| Category | Effort | Timeline | Priority |
|----------|--------|----------|----------|
| Screenshots & exports | 2 days | Week 1 | 🔴 CRITICAL |
| Metrics compilation | 3 days | Week 1 | 🔴 CRITICAL |
| Testimonial videos | 1 week | Week 2–3 | 🟡 HIGH |
| Case studies | 2 weeks | Week 2–4 | 🟡 HIGH |
| Sales deck | 1 week | Week 3–4 | 🟡 HIGH |
| One-pagers | 3 days | Week 4 | 🟡 HIGH |
| Competitive matrix | 1 day | Week 4 | 🟡 HIGH |
| Detailed docs | 2 weeks | Week 2–6 | 🟢 MEDIUM |
| Video demos | 1 week | Week 3–5 | 🟢 MEDIUM |
| **TOTAL** | **~8 weeks** | **6 weeks aggressive** | — |

---

## INVESTMENT NEEDED

| Item | Cost | Owner | Timeline |
|------|------|-------|----------|
| Video recording + editing (contractor) | €2,000–3,000 | Marketing | 2 weeks |
| Customer interviews (product manager time) | Salary (internal) | Product | 3 weeks |
| Sales deck design (contractor) | €1,000–1,500 | Marketing | 1 week |
| Competitive research (analyst) | €1,000–2,000 | Product | 1 week |
| **TOTAL** | €5,000–7,500 | — | **6 weeks** |

---

**ROI: Creating professional proof assets costs €5K–7.5K and 6 weeks. Each sales deal (avg €10K–50K) closes at 2–3x higher rate with strong proof assets.**

---

**Next Step:** Present this checklist to Dowódca for prioritization.

**Questions?** See full audit: `docs/audit/PROFESSIONAL-CAPABILITY-INVENTORY-2026-06-15.md`

---

**Last Updated:** 2026-06-15  
**Maintained By:** Sales Enablement Team
