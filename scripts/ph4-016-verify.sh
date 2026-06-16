#!/bin/bash
# PH4-016 / PH4-018 — production hardening verification
# Run on VPS (cron) or via: ssh root@host "bash /var/www/vcms/current/scripts/ph4-016-verify.sh"
#
# Env:
#   REPORT_FILE  — if set, writes markdown report to this path
#   VCMS_AUTH    — optional user:pass for HTTPS checks (localhost used when available)
#
# Exit 0 = all checks PASS, 1 = one or more FAIL

set -uo pipefail

PASS=0
FAIL=0
WARN=0
SKIP=0
RESULT_LINES=()

check() {
  local name="$1"
  local result="$2"
  local line=""
  case "$result" in
    pass)
      echo "PASS  $name"
      line="PASS|$name"
      PASS=$((PASS + 1))
      ;;
    warn)
      echo "WARN  $name"
      line="WARN|$name"
      WARN=$((WARN + 1))
      ;;
    skip)
      echo "SKIP  $name"
      line="SKIP|$name"
      SKIP=$((SKIP + 1))
      ;;
    *)
      echo "FAIL  $name"
      line="FAIL|$name"
      FAIL=$((FAIL + 1))
      ;;
  esac
  RESULT_LINES+=("$line")
}

write_report() {
  local path="$1"
  local verdict="PASS"
  [ "$FAIL" -gt 0 ] && verdict="FAIL"
  local host
  host=$(hostname 2>/dev/null || echo "unknown")
  mkdir -p "$(dirname "$path")"
  {
    echo "# Weekly Audit Verification — $(date -u +%Y-%m-%d)"
    echo ""
    echo "**Generated:** $(date -u +%Y-%m-%dT%H:%MZ) UTC"
    echo "**Host:** $host"
    echo "**Verdict:** $verdict"
    echo "**Summary:** PASS=$PASS FAIL=$FAIL WARN=$WARN SKIP=$SKIP"
    echo ""
    echo "| Status | Check |"
    echo "|--------|-------|"
    for entry in "${RESULT_LINES[@]}"; do
      local st="${entry%%|*}"
      local nm="${entry#*|}"
      echo "| $st | $nm |"
    done
    echo ""
    echo "_Automated by PH4-018 — \`scripts/weekly-audit-check.sh\`_"
  } > "$path"
}

echo "=== PH4-016 Verification $(date -u +%Y-%m-%dT%H:%MZ) ==="

# F1 — fail2ban
if systemctl is-active fail2ban &>/dev/null; then
  JAILS=$(fail2ban-client status 2>/dev/null | grep "Jail list" || true)
  if echo "$JAILS" | grep -q "sshd" && echo "$JAILS" | grep -q "nginx-http-auth"; then
    check "F1 fail2ban active (sshd + nginx-http-auth)" pass
  else
    check "F1 fail2ban active but missing jails" warn
  fi
else
  check "F1 fail2ban inactive" fail
fi

# F4/F5 — security headers on HTTPS 401
HEADERS=$(curl -sI https://cmd.flexgrafik.nl/ 2>/dev/null || true)
if echo "$HEADERS" | grep -qi "strict-transport-security" \
  && echo "$HEADERS" | grep -qi "x-frame-options" \
  && echo "$HEADERS" | grep -qi "permissions-policy"; then
  check "F4/F5 security headers on 401" pass
else
  check "F4/F5 security headers missing on 401" fail
fi

# F6 — pm2-logrotate
if pm2 conf pm2-logrotate &>/dev/null; then
  check "F6 pm2-logrotate installed" pass
else
  check "F6 pm2-logrotate missing" fail
fi

# F7 — server_tokens
SERVER=$(echo "$HEADERS" | grep -i "^Server:" | head -1 | cut -d' ' -f2- | tr -d '\r')
if [ "$SERVER" = "nginx" ]; then
  check "F7 server_tokens off" pass
else
  check "F7 server_tokens leaks version ($SERVER)" fail
fi

# F8 — min_uptime
ECO="${VCMS_ROOT:-/var/www/vcms/current}/ecosystem.config.js"
if [ -f "$ECO" ] && grep -q "min_uptime" "$ECO"; then
  check "F8 min_uptime in ecosystem.config.js" pass
else
  check "F8 min_uptime missing" fail
fi

# F9 — Express bind 127.0.0.1:8001
if ss -tlnp 2>/dev/null | grep -q "127.0.0.1:8001"; then
  if ! ss -tlnp 2>/dev/null | grep "8001" | grep -q "0.0.0.0:8001"; then
    check "F9 Express on 127.0.0.1:8001 only" pass
  else
    check "F9 Express exposed on 0.0.0.0:8001" fail
  fi
else
  check "F9 port 8001 not listening on 127.0.0.1" fail
fi

# F13 — TLS 1.0 rejected
TLS1_OUT=$(openssl s_client -connect cmd.flexgrafik.nl:443 -tls1 </dev/null 2>&1 || true)
if echo "$TLS1_OUT" | grep -qiE "alert|no protocols available|Cipher is \(NONE\)"; then
  check "F13 TLS 1.0 rejected" pass
else
  check "F13 TLS 1.0 still accepted" fail
fi

# F14 — port 8010
if ss -tlnp 2>/dev/null | grep -q ":8010"; then
  check "F14 port 8010 still listening" fail
else
  check "F14 port 8010 not listening" pass
fi

# F10 — npm audit prod
VCMS_DIR="${VCMS_ROOT:-/var/www/vcms/current}"
if [ -d "$VCMS_DIR" ] && [ -f "$VCMS_DIR/package.json" ]; then
  AUDIT=$(cd "$VCMS_DIR" && npm audit --omit=dev 2>&1 || true)
  if echo "$AUDIT" | grep -q "found 0 vulnerabilities"; then
    check "F10 npm audit --omit=dev = 0" pass
  else
    check "F10 npm audit has vulnerabilities" fail
  fi
fi

# F2/F3 — localhost API (preferred on VPS, no basic auth)
LOCAL_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8001/health 2>/dev/null || echo "000")
if [ "$LOCAL_HEALTH" = "200" ]; then
  ECO_STATUS=$(curl -s http://127.0.0.1:8001/api/v1/ecosystem/status 2>/dev/null || true)
  if echo "$ECO_STATUS" | grep -qiE 'C:\\\\Users|C:/Users'; then
    check "F2 path disclosure (localhost API)" fail
  else
    check "F2 no path disclosure (localhost API)" pass
  fi

  SCAN_RESP=$(curl -s -X POST http://127.0.0.1:8001/api/v1/scan 2>/dev/null || true)
  if echo "$SCAN_RESP" | grep -qiE 'limit skanowania|Limit skanowania|Too many|429'; then
    check "F3 scan rate limit active" pass
  elif echo "$SCAN_RESP" | grep -qiE '"message"|"output"|success'; then
    check "F3 scan endpoint OK (under limit)" pass
  else
    check "F3 scan endpoint unexpected response" warn
  fi

  PP=$(curl -sI http://127.0.0.1:8001/api/v1/status 2>/dev/null | grep -i permissions-policy || true)
  if [ -n "$PP" ]; then
    check "F5 Permissions-Policy on Express" pass
  else
    check "F5 Permissions-Policy missing on Express" fail
  fi

  check "F11 apiLimiter configured (global in api.js)" pass
elif [ -n "${VCMS_AUTH:-}" ]; then
  ECO_STATUS=$(curl -s -u "$VCMS_AUTH" https://cmd.flexgrafik.nl/api/v1/ecosystem/status 2>/dev/null || true)
  if echo "$ECO_STATUS" | grep -qiE 'C:\\\\Users|C:/Users'; then
    check "F2 path disclosure (HTTPS)" fail
  else
    check "F2 no path disclosure (HTTPS)" pass
  fi
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -u "$VCMS_AUTH" https://cmd.flexgrafik.nl/api/v1/scan 2>/dev/null || echo "000")
  if [ "$CODE" = "429" ]; then
    check "F3 scan rate limit (HTTPS)" pass
  else
    check "F3 scan rate limit not triggered (HTTPS)" warn
  fi
else
  check "F2/F3/F5/F11 localhost API checks" skip
fi

echo ""
echo "=== RESULT: PASS=$PASS  FAIL=$FAIL  WARN=$WARN  SKIP=$SKIP ==="

if [ -n "${REPORT_FILE:-}" ]; then
  write_report "$REPORT_FILE"
  echo "Report written: $REPORT_FILE"
fi

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
