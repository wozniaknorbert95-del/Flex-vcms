#!/bin/bash
# One-time VPS setup for PH4-018 weekly audit cron (manual SSH — Zasada 11)
set -euo pipefail

VCMS_ROOT="${VCMS_ROOT:-/var/www/vcms/current}"
CRON_LINE="0 9 * * 1 ${VCMS_ROOT}/scripts/weekly-audit-check.sh >> /var/log/vcms-audit.log 2>&1"

mkdir -p /var/log/vcms-audit/reports
touch /var/log/vcms-audit.log
chmod +x "${VCMS_ROOT}/scripts/ph4-016-verify.sh" 2>/dev/null || true
chmod +x "${VCMS_ROOT}/scripts/weekly-audit-check.sh" 2>/dev/null || true

if crontab -l 2>/dev/null | grep -q "weekly-audit-check.sh"; then
  echo "Cron entry already exists:"
  crontab -l | grep weekly-audit-check
else
  (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
  echo "Installed cron:"
  echo "  $CRON_LINE"
fi

echo ""
echo "Test run:"
REPORT_DIR=/var/log/vcms-audit/reports bash "${VCMS_ROOT}/scripts/weekly-audit-check.sh"
echo ""
echo "Done. Reports: /var/log/vcms-audit/reports/"
