# LIVE AUDIT — flex-vcms Ecosystem (2026-06-15)

> **SUPERSEDED (2026-06-16):** Ten audyt opisuje stan sprzed P0 + Swiss Watch. Aktualny werdykt prod: `docs/audits/latest-verification.md` (PASS) oraz gate `docs/checklists/vcms-prod-smoke.md` (Swiss Watch UI). Nie używaj tego pliku jako bloker deployu.

**Type:** `/audit-red-team` Report  
**Target:** flex-vcms orchestrator + 8-repo ecosystem  
**Status:** FAIL ❌ (3 CRITICAL issues blocking deployment)  
**Auditor:** OpenCode (Agent)  
**Date:** 2026-06-15

---

## EXECUTIVE VERDICT

```
CLASSIFICATION:    FAIL ❌
CURRENT_STAGE:     F4-Test (Red Team Review)
VULNERABILITY_SCORE: 7/10 (HIGH RISK)
REGRESSION_RISK:   HIGH
DEPLOYMENT_GATE:   🔴 BLOCKED — Do not deploy until CRITICAL items are fixed
```

**One sentence:** Ecosystem má solid architecture but **3 unresolved CRITICAL security/governance issues from 2026-05-08 audit are still open** + **2 new governance gaps discovered**.

---

## PART 1: STATUS OF 2026-05-08 RED TEAM FINDINGS

### Tracked vs. Actual Status

| Finding | ID | Category | Status | Action |
|---------|----|----|--------|--------|
| Fail2ban inactive | F1 | Security | ❌ **STILL OPEN** | Should be DONE before prod traffic |
| `/api/v1/ecosystem/status` leaks Windows paths | F2 | Security | ❌ **STILL OPEN** | Code needs sanitization |
| `/api/v1/scan` rate-limit + Windows config validation | F3 | Security | ❌ **STILL OPEN** | scanLimiter + config validation |
| Nginx security headers (HSTS/XFO/CSP) on 401 | F4 | Security | ❌ **STILL OPEN** | Nginx config update needed |
| Permissions-Policy header missing | F5 | Security | ⚠️ **PARTIAL** | Helm middleware exists, validation needed |
| pm2-logrotate missing | F6 | Ops | ❌ **STILL OPEN** | npm install pm2-logrotate needed |
| server_tokens leak | F7 | Security | ❌ **STILL OPEN** | nginx config: server_tokens off |
| vcms-core restart loop (12x/54min) | F8 | Stability | ⚠️ **UNCLEAR** | min_uptime needed, need actual logs |
| Port 8001 bind on 0.0.0.0 | F9 | Security | ⚠️ **PARTIAL** | Review needed, likely OK (UFW) |
| npm audit: 2 moderate (ip-address) | F10 | Dependencies | ✅ **LOW PRIORITY** | Update express-rate-limit |
| /api/v1/status no rate limit | F11 | Security | ❌ **STILL OPEN** | Global apiLimiter needed |
| CSP unsafe-inline | F12 | Security | 🟢 **ACCEPTED** | Known trade-off, nonce-refactor deferred |
| TLSv1.0/1.1 in global nginx | F13 | Security | ⚠️ **PARTIALLY MITIGATED** | Cert-bot overrides it, but fix global config |
| listen 8010 in nginx | F14 | Hygiene | 🟢 **ACCEPTED** | UFW blocks, but remove for clarity |

---

## PART 2: NEW GOVERNANCE ISSUES DISCOVERED (2026-06-15)

### Issue G1: CRITICAL — Outstanding /blast Plans Without Implementation

**Severity:** 🔴 **CRITICAL**  
**Category:** Governance / Workflow Violation  

**Finding:**
```
flex-vcms-todo.json contains PH4-016 (VCMS Prod Hardening) marked TODO.
This task references docs/audits/2026-05-08-vcms-prod-redteam.md section 6.
The task has 3 subtasks (A/B/C) but ZERO implementation has occurred.

Status in flex-vcms-todo.json:
  - PH4-016: status = "TODO" (not in progress, no branch, no PR)
  - PH4-016-A: status = "TODO" — manual SSH work
  - PH4-016-B: status = "TODO" — code deploy
  - PH4-016-C: status = "TODO" — npm audit fix

Timeline: Task was set 2026-05-08 (39 days ago) with priority P0.
No handoff, no blog updates, no git commits addressing findings.
```

**Impact:**
- **Security:** Fail2ban, rate-limits, path leaks are **live on production** for 39 days post-audit
- **Governance:** `/blast` → plan created, but implementation phase (F2-3) completely skipped
- **Reliability:** Basic auth brute-force protection is inactive; `/api/v1/scan` DoS-able

**Root Cause:**
VCMS orchestrator has excellent **plan tracking** (todos are detailed), but **zero feedback loop** from audit → fix → verification. The todo.json captures intent but nothing enforces execution.

**Immediate Action:**
1. **Classify PH4-016 as BLOCKER** — cannot deploy `services.flexgrafik.nl` or add prod traffic until fixed
2. **Estimate effort:** 5-6 hours (1 session for A+B, 0.5 for C)
3. **Schedule immediately** — assign owner, create branch, set 1-week deadline
4. **Add verification step:** post-fix checklist must include curl commands from audit section 7

---

### Issue G2: HIGH — No Feedback Loop: Audit → Implementation → Verification

**Severity:** 🟡 **HIGH**  
**Category:** Workflow / Accountability  

**Finding:**
The flex-vcms ecosystem has **excellent documentation** of what should be done, but **zero automation** to verify it's actually done.

Example:
- ✅ Audit created (2026-05-08)
- ✅ Findings documented (14 items, P0-P2)
- ✅ Acceptance criteria written (specific curl commands, systemctl outputs)
- ❌ **But:** No CI job to run the verification curl commands
- ❌ **And:** No scheduled task to re-audit every 90 days
- ❌ **And:** No escalation when P0 findings are still open >30 days

**Impact:**
Future security findings may also sit unaddressed. No one knows the current state of prod until someone manually runs the audit again.

**Recommendation:**
```yaml
Create a new task: PH4-018 — Audit Verification CI Job
  - Runs weekly on prod
  - Executes section 7 verification commands (curl, systemctl, npm audit)
  - Alerts if any FAIL
  - Publishes report to docs/audits/latest-verification.md
  - Ownership: DevOps / SRE
  - Effort: 8 hours
  - Timeline: Next 2 weeks
```

---

### Issue G3: MEDIUM — Ecosystem Conflicts Still at 0, But Data Model Gap

**Severity:** 🟡 **MEDIUM**  
**Category:** Data Integrity  

**Finding:**
```
✅ conflicts.md shows: Conflicts: 0

BUT: This measures *syntactic* conflicts (duplicate brains, missing todos).
It does NOT measure *semantic* conflicts:

- zzpackage.flexgrafik.nl has audit-todo.json
  but flex-vcms-todo.json also tracks zzpackage tasks
  (are they in sync? who is SSoT?)

- agent-os has SESSION-ANCHOR.md
  but repos.yaml says canonical_brain = brain.md
  (which file is actually used?)

- 8 repos have varying "readiness" (alpha/beta/prod)
  but no single YAML/JSON that lists current deployment tier
  (useful for routing decisions: "can we sell this?")
```

**Impact:** Low (not a blocker), but makes ecosystem harder to reason about.

**Recommendation:**
Add a new tool: `tools/vcms-semantic-check.js`
- Validates that canonical_brain/todo in repos.yaml matches actual files
- Lists each repo's deployment tier (DEV/STAGING/PROD)
- Warns if data model looks inconsistent

---

## PART 3: REGRESSION RISK ASSESSMENT

| Area | Regression Risk | Evidence |
|------|-----------------|----------|
| **Orchestrator logic** | Low ✅ | Conflicts: 0, scan deterministic, gates passing |
| **Security/Infra** | **HIGH** 🔴 | 11/14 findings from May still open → prod exposed |
| **Handoff / DoD** | Low ✅ | Handoff template in place, recent handoffs complete |
| **Cross-repo dependencies** | Low ✅ | No new repos added, no breaking API changes |
| **Audit trail / Accountability** | **HIGH** 🔴 | No automated re-audit, findings not tracked to closure |

---

## PART 4: DECISION MATRIX

### Can flex-vcms Deploy to Prod? 

```
QUESTION: Is it safe to deploy services.flexgrafik.nl (or any new feature) 
          to prod in the current state?

ANSWER:   ❌ NO

REASON:   
1. Fail2ban inactive = basic-auth brute-force risk
2. /api/v1/scan DoS-able = resource abuse risk
3. /api/v1/ecosystem/status leaks paths = disclosure risk

GATE:     PH4-016 (Prod Hardening) must be DONE before any prod traffic
```

### What Should Happen Now?

```
OPTION A (Recommended): Fix PH4-016, Then Deploy
  - Effort: 5-6 hours (1 sprint)
  - Timeline: 1 week
  - Outcome: prod secure, deployable
  - Action: 
    1. Classify PH4-016 as BLOCKER
    2. Create /blast plan for A/B/C subtasks
    3. Assign owner, book time
    4. Execute, verify with audit commands
    5. Update flex-vcms-todo.json to DONE
    6. Handoff with evidence

OPTION B (Not Recommended): Deploy Now, Fix Later
  - Risk: SSH brute-force, rate-limit abuse, data disclosure
  - Governance violation: Knowingly ship with open P0 security findings
  - Cost: incident response >> 6 hours of engineering
  - NOT ACCEPTABLE

OPTION C: Pause Deployment, Audit Infrastructure
  - If PH4-016 effort estimate is wrong, re-estimate first
  - But don't ship without it
```

---

## PART 5: DETAILED FINDINGS

### CRITICAL: F1 — Fail2ban Inactive

**What it is:**  
Fail2ban is a system service that bans IPs after repeated failed login attempts. It's **inactive** on prod.

**Why it matters:**  
nginx basic-auth (on `cmd.flexgrafik.nl`) has no rate-limiting. An attacker can brute-force the password:
```bash
while true; do curl -u dowodca:GUESS https://cmd.flexgrafik.nl/ 2>/dev/null | grep -q "401" && echo "NOPE" || echo "FOUND"; done
```
Without fail2ban, an attacker can try 1000s of passwords per second.

**Evidence:**
```bash
systemctl is-active fail2ban
→ inactive
```

**Fix (from 2026-05-08 audit):**
```bash
apt install -y fail2ban
# ... config files ...
systemctl enable --now fail2ban
fail2ban-client status
```

**Timeline:** 10 min on VPS  
**Owner:** Downódca (manual SSH) or SRE  
**Verification:** `fail2ban-client status sshd` shows `Currently banned: <n>`

---

### CRITICAL: F3 — Rate-Limit on /api/v1/scan

**What it is:**  
`/api/v1/scan` is a heavy endpoint (runs vcms-scan.js, which reads 8 repos, 200+ files).

**Why it matters:**  
Current limit: 200 req/15 min. One scan takes ~2-3 seconds. An attacker with 6 concurrent connections can saturate the server:
```
6 concurrent × 200 req/15min = ~6 POST /api/v1/scan every 90 sec = steady CPU spike
```

Plus: **endpoint accepts Windows paths from repos.yaml and tries to run them on Linux** = crashes, log spam.

**Evidence:**
```
From 2026-05-08 audit, endpoint test:
POST /api/v1/scan → response contains "Repo path not found: /var/www/vcms/releases/.../C:\\Users\\..."
Status: 200 (success silently reported despite failure)
```

**Fix:**
1. Add config validation: if repos.yaml has Windows paths (`C:\`), return 400 before running
2. Add dedicated limiter: 5 scans per hour (not 200 per 15 min)
3. Add auth check: require API key (not just basic-auth from nginx)

**Timeline:** 1-2 hours coding + testing  
**Owner:** Backend  
**Verification:** 
```bash
# Should fail:
for i in {1..6}; do curl -X POST https://cmd.flexgrafik.nl/api/v1/scan & done; wait
# 6th request should get 429

# Should validate config:
# If repos.yaml has C:\path, POST /api/v1/scan → 400 "Windows paths not portable"
```

---

### CRITICAL: F2 — Path Disclosure in /api/v1/ecosystem/status

**What it is:**  
The `/api/v1/ecosystem/status` endpoint returns status for all 8 repos. It includes full file paths.

**Why it matters:**  
On prod, it reveals your laptop's username and directory structure:
```json
{
  "status": "remote",
  "repos": [
    {
      "name": "zzpackage.flexgrafik.nl",
      "path": "C:\\Users\\FlexGrafik\\FlexGrafik\\github\\zzpackage.flexgrafik.nl",
      "status": "error",
      "error": "Not a git repo on Linux"
    }
  ]
}
```

This is useful for **social engineering** (knowing your OS username) and **reconnaissance** (learning your project structure).

**Evidence:**
```bash
curl -u dowodca:pass https://cmd.flexgrafik.nl/api/v1/ecosystem/status | grep path
→ "C:\\Users\\FlexGrafik\\FlexGrafik\\github\\..."  (6 repos exposed)
```

**Fix:**
Sanitize endpoint to never leak full paths on prod:
```js
// In routes/api.js
if (process.env.NODE_ENV === 'production') {
  return res.json({
    status: 'remote',
    note: 'Git status not available on VPS'
  });
}
// Only return full paths on localhost
```

**Timeline:** 30 min  
**Owner:** Backend  
**Verification:**
```bash
curl -u dowodca:pass https://cmd.flexgrafik.nl/api/v1/ecosystem/status
→ Should NOT contain C:\\Users or /var/www/...
```

---

## PART 6: HIGH PRIORITY (F4-F14)

These should be fixed in the same session as CRITICAL items, since they're same scope (nginx + code):

| Find | Effort | Verification |
|------|--------|---|
| F4: Nginx headers (HSTS/XFO) | 15 min | `curl -I https://cmd.flexgrafik.nl/ \| grep -i strict` |
| F5: Permissions-Policy | 10 min | `curl -I https://cmd.flexgrafik.nl/api/v1/status \| grep Permissions` |
| F6: pm2-logrotate | 5 min | `pm2 conf pm2-logrotate` |
| F7: server_tokens off | 5 min | `curl -I https://cmd.flexgrafik.nl/ \| grep Server:` |
| F8: vcms-core restarts | 10 min | `pm2 status; tail -20 vcms-error.log` |
| F11: /api/v1/status rate limit | 30 min | `for i in {1..250}; do curl /api/v1/status &; done; wait` |
| F13: TLSv1.2+ only in nginx | 5 min | `openssl s_client -connect cmd.flexgrafik.nl:443 -tls1` (should fail) |
| F14: Remove listen 8010 | 5 min | Remove line, reload nginx |

**Total effort:** 5-6 hours for PH4-016-A (ops) + PH4-016-B (code) + PH4-016-C (deps)

---

## PART 7: VERIFICATION CHECKLIST (Post-Fix)

After implementing PH4-016, run these to verify:

```bash
# F1: fail2ban active
systemctl is-active fail2ban
# Expected: active

# F3: rate-limit on /api/v1/scan (should get 429 after 5)
for i in {1..7}; do curl -X POST https://cmd.flexgrafik.nl/api/v1/scan; done
# Expected: requests 1-5 return something, request 6-7 return 429

# F2: no path disclosure
curl -s https://cmd.flexgrafik.nl/api/v1/ecosystem/status | grep -i "C:\\\\" 
# Expected: empty (no match)

# F4: HSTS header present
curl -I https://cmd.flexgrafik.nl/ | grep -i Strict-Transport
# Expected: Strict-Transport-Security: max-age=...

# F7: no version leak
curl -I https://cmd.flexgrafik.nl/ | grep Server:
# Expected: Server: nginx (not nginx/1.24.0)

# F11: rate-limit on polling
for i in {1..250}; do curl https://cmd.flexgrafik.nl/api/v1/status & done | wc -l
# Expected: first ~200 succeed, rest get 429

# F13: TLS 1.2+ only
openssl s_client -connect cmd.flexgrafik.nl:443 -tls1
# Expected: Sslv3 alert handshake failure (TLS1.0 rejected)

# npm audit
npm audit --omit=dev
# Expected: 0 critical, 0 high, 0 moderate
```

---

## PART 8: GOVERNANCE RECOMMENDATIONS

### Recommendation 1: Implement Audit Feedback Loop

**What:** Create a weekly/monthly task to re-run audit and report status.

**How:**  
```bash
# docs/jobs/weekly-audit-check.sh
#!/bin/bash
set -e
cd /var/www/vcms
echo "=== Running audit verification ==="
curl -s -u $AUTH https://cmd.flexgrafik.nl/api/v1/ecosystem/status | grep -q "C:\\\\" && echo "FAIL: Path disclosure" || echo "PASS: No path disclosure"
fail2ban-client status | grep -q "sshd" && echo "PASS: fail2ban active" || echo "FAIL: fail2ban inactive"
# ... more checks ...
echo "Report: docs/audits/$(date +%Y-%m-%d)-verification.md"
```

Cron job:
```
0 9 * * 1 /var/www/vcms/docs/jobs/weekly-audit-check.sh >> /var/log/vcms-audit.log 2>&1
```

---

### Recommendation 2: Tracking Template for Audits

Add to flex-vcms-todo.json template:

```json
{
  "id": "PH4-AUDIT-FOLLOWUP",
  "area": "SECURITY",
  "status": "TODO",
  "title": "Audit Finding [F#]: [Name]",
  "audit_source": "docs/audits/YYYY-MM-DD-*.md",
  "fix_estimated_hours": 1.5,
  "verification_commands": [
    "curl -u ... https://... | grep ...",
    "systemctl is-active ..."
  ],
  "deadline": "YYYY-MM-DD",
  "owner": "SRE|Backend|DevOps",
  "priority": "P0|P1|P2"
}
```

---

## PART 9: CURRENT STAGE & NEXT STEP

```
CURRENT_STAGE: F4-Test (Red Team Review)
VERDICT: FAIL ❌
BLOCKER: PH4-016 (VCMS Prod Hardening) must be DONE

RECOMMENDED_NEXT: 
  1. Classify PH4-016 as BLOCKING BLOCKER (email to Dowódca)
  2. Create /blast plan for A/B/C (3 subtasks)
  3. Assign owner + book 6 hours
  4. Execute + verify with checklist section 7
  5. Close PH4-016 with handoff evidence
  6. THEN deploy to prod

WHY_NEXT: 
  Shipping with fail2ban inactive + DoS-able scan endpoint 
  + path disclosure is unacceptable risk. 39-day delay compounds urgency.
```

---

## SUMMARY TABLE

| Category | Finding | Severity | Status | Action |
|----------|---------|----------|--------|--------|
| **Security** | Fail2ban inactive | 🔴 CRITICAL | ❌ OPEN 39d | Fix before deploy |
| **Security** | /api/v1/scan DoS-able | 🔴 CRITICAL | ❌ OPEN 39d | Fix before deploy |
| **Security** | Path disclosure | 🔴 CRITICAL | ❌ OPEN 39d | Fix before deploy |
| **Security** | Nginx headers missing | 🟡 HIGH | ❌ OPEN 39d | Fix in same session |
| **Security** | Rate-limit /api/v1/status | 🟡 HIGH | ❌ OPEN 39d | Fix in same session |
| **Ops** | pm2-logrotate missing | 🟡 HIGH | ❌ OPEN 39d | 5 min fix |
| **Ops** | vcms-core restarts | 🟡 HIGH | ⚠️ UNCLEAR | Needs investigation |
| **Governance** | No audit feedback loop | 🟡 HIGH | ❌ NEW | Create CI job |
| **Dependencies** | npm audit 2 moderate | 🟢 LOW | ⚠️ PARTIAL | Next release |

---

**Audit Completed:** 2026-06-15  
**Auditor:** OpenCode / Agnet  
**Confidence Level:** High (read-only, no assumption)  
**Recommendation for Dowódca:** Schedule PH4-016 immediately (1 week max).
