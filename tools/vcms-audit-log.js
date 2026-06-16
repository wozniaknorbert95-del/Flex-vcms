/**
 * Append governance audit events (JSONL) after ecosystem scan.
 */
const fs = require('fs');
const path = require('path');

const VCMS_ROOT = path.resolve(__dirname, '..');
const DEFAULT_LOG = path.join(VCMS_ROOT, 'data', 'governance-audit.jsonl');

function appendScanEvent(summary = {}) {
    const entry = {
        ts: new Date().toISOString(),
        actor: 'vcms-scan',
        action: 'ECOSYSTEM_SCAN',
        target: `${summary.repos_scanned ?? '?'} repos`,
        reason: 'scheduled or manual scan',
        evidence: 'docs/ecosystem/conflicts.md',
        conflicts: summary.count ?? 0,
        severity: summary.severity || { blocking: 0, warning: 0, info: 0 }
    };

    ensureDir(path.dirname(DEFAULT_LOG));
    fs.appendFileSync(DEFAULT_LOG, JSON.stringify(entry) + '\n', 'utf8');
    return entry;
}

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

/**
 * Read last N JSONL audit events (newest first).
 */
function readRecentEvents(limit = 25) {
    if (!fs.existsSync(DEFAULT_LOG)) {
        return [];
    }
    const raw = fs.readFileSync(DEFAULT_LOG, 'utf8').trim();
    if (!raw) return [];

    const lines = raw.split('\n').filter(Boolean);
    const slice = lines.slice(-Math.min(limit, lines.length));

    return slice
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean)
        .reverse();
}

module.exports = { appendScanEvent, readRecentEvents, DEFAULT_LOG };
