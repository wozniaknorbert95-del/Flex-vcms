#!/bin/bash
# PH4-018 — Weekly audit verification (VPS cron entrypoint)
# Install: scripts/install-weekly-audit-cron.sh (manual, Zasada 11)
#
# Cron (Monday 09:00 UTC):
#   0 9 * * 1 /var/www/vcms/current/scripts/weekly-audit-check.sh >> /var/log/vcms-audit.log 2>&1

set -uo pipefail

VCMS_ROOT="${VCMS_ROOT:-/var/www/vcms/current}"
REPORT_DIR="${REPORT_DIR:-/var/log/vcms-audit/reports}"
VERIFY_SCRIPT="${VCMS_ROOT}/scripts/ph4-016-verify.sh"
DATE=$(date -u +%Y-%m-%d)
REPORT_FILE="${REPORT_DIR}/${DATE}-verification.md"
LATEST_LINK="${REPORT_DIR}/latest-verification.md"

mkdir -p "$REPORT_DIR"

if [ ! -f "$VERIFY_SCRIPT" ]; then
  echo "ERROR: Missing $VERIFY_SCRIPT — run Deploy-VPS.ps1 first"
  exit 2
fi

export REPORT_FILE
export VCMS_ROOT

echo "=== PH4-018 Weekly Audit Check $(date -u +%Y-%m-%dT%H:%MZ) ==="

set +e
bash "$VERIFY_SCRIPT"
EXIT_CODE=$?
set -e

if [ -f "$REPORT_FILE" ]; then
  cp -f "$REPORT_FILE" "$LATEST_LINK"
  echo "Latest report: $LATEST_LINK"
fi

if [ "$EXIT_CODE" -ne 0 ]; then
  echo "ALERT: Audit verification FAILED (exit $EXIT_CODE) — review $REPORT_FILE"
fi

exit "$EXIT_CODE"
