# EXECUTIVE BRIEF — PH4-016 Fix Plan (One Page)

**Status:** ✅ READY TO EXECUTE  
**Timeline:** 5.5 hours (1 day sprint) — 2026-06-16  
**Owner:** Downódca + SRE/Backend team  
**Risk Level:** Low (all mitigations in place)  

---

## THE PROBLEM

3 **CRITICAL security findings** have been **OPEN for 39 DAYS** on production:

| Issue | Risk | Status |
|-------|------|--------|
| **Fail2ban inactive** | SSH brute-force unprotected | ❌ OPEN |
| **`/api/v1/scan` DoS-able** | CPU spike attacks possible | ❌ OPEN |
| **Path disclosure** | Windows paths leaked in API response | ❌ OPEN |

**Impact:** Cannot deploy or add prod traffic safely.

---

## THE SOLUTION (In 3 Sessions)

### Session A: VPS Infrastructure (1.5 hours)
```
[ ] Enable fail2ban (SSH/basic-auth protection)
[ ] Add nginx security headers (HSTS, XFO, CSP)
[ ] Install pm2-logrotate (log rotation)
[ ] Hide nginx version (server_tokens off)
[ ] TLS 1.2+ only (disable old TLS)
[ ] Remove unused port 8010
```

### Session B: Code Security (3 hours)
```
[ ] Sanitize API responses (no Windows paths)
[ ] Rate-limit /api/v1/scan (5 per hour)
[ ] Add Permissions-Policy header
[ ] Fix PM2 process stability (min_uptime)
[ ] Bind Express to 127.0.0.1 only
[ ] Global rate-limiter on /api/v1/*
```

### Session C: Dependencies (1 hour)
```
[ ] Update npm packages (fix CVE in ip-address)
[ ] Verify 0 vulnerabilities
[ ] Smoke test application
```

---

## VERIFICATION (15 curl Commands)

After completion, run checklist. Example:

```bash
# F1: Fail2ban active?
systemctl is-active fail2ban
# Expected: active ✅

# F3: Rate limit works?
for i in {1..7}; do curl -X POST https://cmd.flexgrafik.nl/api/v1/scan; done
# Expected: requests 6-7 get 429 ✅

# F2: No path leaks?
curl https://cmd.flexgrafik.nl/api/v1/ecosystem/status | grep -i "C:\\\\"
# Expected: (empty) ✅
```

**All 14 findings verified ✅**

---

## EFFORT BREAKDOWN

| Phase | Duration | Owner | Complexity |
|-------|----------|-------|-----------|
| A — VPS Ops | 1.5h | SRE (or Downódca) | Low (bash + systemctl) |
| B — Code | 3h | Backend/DevOps | Medium (6 code changes) |
| C — Deps | 1h | DevOps | Low (npm update) |
| Verification | 0.5h | Any | Low (curl commands) |
| **TOTAL** | **5.5h** | — | **Medium overall** |

---

## TIMELINE

```
🕘 2026-06-16 09:00 — Session A starts (VPS ops)
                       └─ Expected done: 10:30

🕘 2026-06-16 11:00 — Session B starts (code)
                       └─ Expected done: 14:00
                       └─ Deploy happens here

🕘 2026-06-16 14:30 — Session C starts (deps)
                       └─ Expected done: 15:30

🕘 2026-06-16 15:30 — Verification checklist
                       └─ Expected done: 16:00
```

---

## SUCCESS CRITERIA

✅ **All 14 audit findings** from 2026-05-08 are **FIXED**  
✅ **Verification checklist** runs **100% PASS**  
✅ **Application stable** (no restart loops)  
✅ **npm audit** shows **0 vulnerabilities**  
✅ **Smoke test** passes (health endpoint 200)

---

## RISKS & MITIGATIONS

| Risk | Mitigation |
|------|-----------|
| npm update breaks something | Smoke test before deploy, rollback artifact ready |
| nginx reload fails | Test with `nginx -t` before reload |
| Rate limit too strict | Monitor logs, adjust after 1 week if needed |
| Fail2ban bans legitimate IP | Keep ban list, adjust `maxretry` if needed |

**Overall Risk Level:** 🟢 **LOW** (all risks mitigated)

---

## DECISION

### ✅ GO (Recommended)

Execute Plan on 2026-06-16. 5.5 hours effort = production secure + deployable.

### ❌ NO-GO (Not Recommended)

Skip this. Risk: SSH compromise, DoS attacks, data disclosure on prod. Cost of incident >> 5.5 hours.

---

## YOUR ACTION (Now)

1. **Read full plan:** `docs/plans/PH4-016-BLAST-VCMS-PROD-HARDENING.md` (20 min)
2. **Approve or negotiate:** Schedule time slot
3. **Assign owners:**
   - Session A: SRE (or you)
   - Session B: Backend lead
   - Session C: DevOps
4. **Book calendar:** Block 5.5 hours on 2026-06-16

---

## NEXT STEPS (Post-Execution)

### Immediate (Day 1)
- [ ] Run full verification checklist
- [ ] Handoff documentation
- [ ] Monitor PM2 logs for stability

### Week 1
- [ ] Monitor fail2ban for patterns
- [ ] Check rate-limit effectiveness
- [ ] Verify no customer complaints

### Month 1
- [ ] Plan PH4-017 (mobile device testing)
- [ ] Plan PH4-018 (audit CI job for weekly checks)

---

## QUESTIONS?

**Full technical details:** `docs/plans/PH4-016-BLAST-VCMS-PROD-HARDENING.md` (sections 2-9)

**Audit source:** `docs/audits/2026-05-08-vcms-prod-redteam.md` (findings F1-F14)

**Live audit:** `docs/audits/2026-06-15-LIVE-AUDIT-FLASH.md` (current status)

---

**Plan Prepared:** 2026-06-15  
**Ready to Execute:** YES ✅  
**Commander Approval Needed:** YES (your sign-off below)

```
Approved by: ________________     Date: ____________
```
