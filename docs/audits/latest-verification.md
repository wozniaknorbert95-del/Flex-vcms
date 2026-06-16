# Weekly Audit Verification — 2026-06-16

**Generated:** 2026-06-16T07:00Z UTC
**Host:** vps41619215
**Verdict:** PASS
**Summary:** PASS=12 FAIL=0 WARN=1 SKIP=0

| Status | Check |
|--------|-------|
| PASS | F1 fail2ban active (sshd + nginx-http-auth) |
| PASS | F4/F5 security headers on 401 |
| PASS | F6 pm2-logrotate installed |
| PASS | F7 server_tokens off |
| PASS | F8 min_uptime in ecosystem.config.js |
| PASS | F9 Express on 127.0.0.1:8001 only |
| PASS | F13 TLS 1.0 rejected |
| PASS | F14 port 8010 not listening |
| PASS | F10 npm audit --omit=dev = 0 |
| PASS | F2 no path disclosure (localhost API) |
| WARN | F3 scan endpoint unexpected response |
| PASS | F5 Permissions-Policy on Express |
| PASS | F11 apiLimiter configured (global in api.js) |

_Automated by PH4-018 — `scripts/weekly-audit-check.sh`_
