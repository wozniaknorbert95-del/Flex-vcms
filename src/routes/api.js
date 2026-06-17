const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');
const { execFile } = require('child_process');
const yaml = require('js-yaml');
const { getContextData } = require('../logic/context');
const { getConflictsSummary } = require('../logic/conflicts');
const { runKodaChat } = require('../logic/koda-chat');
const { readRecentEvents } = require('../../tools/vcms-audit-log');
const { winLogger } = require('../middleware/logger');

// --- Configuration ---
const vcmsBase = process.env.VCMS_DIR || process.cwd();
const githubBase = process.env.AGENT_CONTEXT_PATH || path.resolve(process.cwd(), '..');

// --- Rate Limiting ---
// Tiered limiters (PH4-016 F11 fix): global 200/15m blocked dashboard polling (~180/15m at 5s).

const pollLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { error: 'Limit odświeżania dashboardu — poczekaj minutę lub odśwież stronę.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { error: 'Przekroczono limit odczytu API — spróbuj za chwilę.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Przekroczono globalny limit zapytań API.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Heavy scan endpoint: max 5 per hour to prevent DoS via full ecosystem scan
const scanLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Limit skanowania: max 5 razy na godzinę.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Limit chatu KODA — max 30 wiadomości na 15 minut.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const chatSchema = Joi.object({
    messages: Joi.array().items(
        Joi.object({
            role: Joi.string().valid('user', 'model', 'assistant').required(),
            parts: Joi.array().items(
                Joi.object({ text: Joi.string().max(8000).required() })
            ).optional(),
            content: Joi.string().max(8000).optional(),
            text: Joi.string().max(8000).optional()
        }).or('parts', 'content', 'text')
    ).min(1).max(20).required()
});

// --- In-Memory Metrics Store ---
const metrics = {
    start_time: Date.now()
};

const uncleTips = [
    "Dobra latencja to podstawa. Jeśli skacze powyżej 1500ms, sprawdź obciążenie VPS albo limity OpenRoutera.",
    "Zawsze rób 'node tools/vcms-scan.js' przed dużymi zmianami. SSoT to Twój jedyny kompas.",
    "Błędy 403 na produkcji? Zwykle to wina źle ustawionego 'trust proxy' w Expressie albo Nginxa.",
    "Standard 'Swiss Watch' (V6.5) wymaga, by każdy produkt miał prawidłowy SKU. Sprawdzaj product-master-table.json.",
    "Pamiętaj o 'Zasadzie 11'. Tylko ręczny deploy na produkcję daje Ci 100% pewności."
];

const uncleTipsEn = [
    "Good latency is the baseline. If it spikes above 1500ms, check VPS load or OpenRouter limits.",
    "Always run 'node tools/vcms-scan.js' before major changes. SSoT is your only compass.",
    "403 errors in production? Usually misconfigured Express or Nginx 'trust proxy'.",
    "Swiss Watch standard (V6.5) requires every product to have a valid SKU. Check product-master-table.json.",
    "Remember Rule 11. Manual production deploy only gives you 100% certainty."
];

function pickUncleTip(req) {
    const locale = req.query.locale === 'en' ? 'en' : 'pl';
    const pool = locale === 'en' ? uncleTipsEn : uncleTips;
    return pool[Math.floor(Math.random() * pool.length)];
}

// --- Utilities ---
const getGitStatus = (repoPath) => {
    return new Promise((resolve) => {
        const repoAbs = path.resolve(repoPath);
        // Shell injection protection: use execFile with specific arguments
        execFile('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: repoAbs }, (err, branchOut) => {
            if (err) return resolve({ status: 'error', error: 'Not a git repo' });
            
            const branch = branchOut.trim();
            execFile('git', ['status', '--porcelain'], { cwd: repoAbs }, (sErr, sOut) => {
                const dirty = sOut.trim().length > 0;
                
                execFile('git', ['log', '-1', '--format=%h | %an | %ar | %s'], { cwd: repoAbs }, (lErr, lOut) => {
                    resolve({
                        status: dirty ? 'dirty' : 'clean',
                        branch: branch,
                        last_commit: lOut.trim() || 'No commits'
                    });
                });
            });
        });
    });
};

// --- Helpers ---
const isWindowsPath = (p) => typeof p === 'string' && (/^[A-Za-z]:[/\\]/.test(p) || p.includes('\\'));

// --- Routes ---

router.get('/v1/status', pollLimiter, async (req, res) => {
    try {
        const randomTip = pickUncleTip(req);
        const contextData = await getContextData(vcmsBase, githubBase);
        const knowledgeCount = Object.keys(contextData.VCMS_INTERNAL_KNOWLEDGE).length;
        const conflicts = getConflictsSummary(vcmsBase);

        res.json({
            status: 'OK',
            uptime: Math.floor((Date.now() - metrics.start_time) / 1000),
            knowledge: {
                file_count: knowledgeCount
            },
            conflicts,
            uncle_tip: randomTip,
            version: '3.0.0-hardened'
        });
    } catch (err) {
        res.status(500).json({ error: 'Błąd podczas pobierania statusu systemu.' });
    }
});

router.post('/v1/scan', scanLimiter, async (req, res) => {
    try {
        const reposPath = path.join(vcmsBase, 'repos.yaml');
        const yamlText = await fs.readFile(reposPath, 'utf8');
        const data = yaml.load(yamlText);
        const repos = data.repos || [];
        const hasWindowsPaths = repos.some(r => isWindowsPath(r.path));
        if (hasWindowsPaths) {
            return res.status(400).json({
                error: 'Scan aborted: repos.yaml contains local Windows paths not portable to this environment. Run scan from your laptop.',
                hint: 'Update repos.yaml with VPS-relative paths or run vcms-scan.js locally.'
            });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Failed to read repos.yaml before scan.' });
    }

    winLogger.info('[VCMS] Triggering Ecosystem Scan...');
    execFile('node', [path.join(vcmsBase, 'tools', 'vcms-scan.js')], (error, stdout) => {
        if (error) {
            winLogger.error(`[Scan Error] ${error.message}`);
            return res.status(500).json({ error: 'Skanowanie nie powiodło się.' });
        }
        winLogger.info('[VCMS] Scan completed successfully');
        res.json({ message: 'Skanowanie zakończone.', output: stdout });
    });
});

router.get('/knowledge', apiLimiter, async (req, res) => {
    try {
        const data = await getContextData(vcmsBase, githubBase);
        res.json(data);
    } catch(err) {
        winLogger.error(`[API Error] /knowledge - ${err.message}`);
        res.status(500).json({ error: 'Nie udało się poprawnie złożyć SSOT' });
    }
});
 
router.get('/v1/context/health', readLimiter, async (req, res) => {
    try {
        const fsSync = require('fs');
        const manifestPath = path.join(vcmsBase, 'deploy-context', 'manifest.json');
        const staleMs = 24 * 60 * 60 * 1000;

        if (!fsSync.existsSync(manifestPath)) {
            return res.json({
                modules: [
                    { name: 'deploy-context', status: 'missing' }
                ],
                note: 'Brak paczki SSoT na serwerze — uruchom Deploy-VPS.ps1 po vcms-sync-context.js'
            });
        }

        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        const bundleAge = Date.now() - (manifest.generated_at || 0);
        const bundleStale = bundleAge > staleMs;

        const modules = (manifest.modules || []).flatMap((mod) => {
            const ctxDir = path.join(vcmsBase, 'deploy-context', mod.name);
            const rows = [];
            if (mod.brain) {
                const brainPath = path.join(ctxDir, mod.brain);
                rows.push({
                    name: `${mod.name} · brain`,
                    path: `deploy-context/${mod.name}/${mod.brain}`,
                    status: !fsSync.existsSync(brainPath) ? 'missing' : bundleStale ? 'stale' : 'healthy'
                });
            }
            if (mod.todo) {
                const todoPath = path.join(ctxDir, mod.todo);
                rows.push({
                    name: `${mod.name} · todo`,
                    path: `deploy-context/${mod.name}/${mod.todo}`,
                    status: !fsSync.existsSync(todoPath) ? 'missing' : bundleStale ? 'stale' : 'healthy'
                });
            }
            return rows;
        });

        res.json({ modules, bundle_updated: manifest.generated_at || null });
    } catch (err) {
        res.status(500).json({ error: 'Błąd weryfikacji zdrowia kontekstu.' });
    }
});



let backlogCache = { data: null, expire: 0 };

router.get('/v1/backlog', readLimiter, async (req, res) => {
    try {
        if (backlogCache.data && Date.now() < backlogCache.expire) {
            return res.json(backlogCache.data);
        }

        const todoPath = path.join(vcmsBase, 'flex-vcms-todo.json');
        const raw = await fs.readFile(todoPath, 'utf8');
        const todo = JSON.parse(raw);
        const stats = await fs.stat(todoPath);

        const response = {
            status: 'ok',
            next_task: todo.meta?.next || null,
            updated: todo.meta?.updated || 'unknown',
            last_sync_ms: stats.mtimeMs,
            source: 'flex-vcms-todo.json'
        };

        backlogCache = { data: response, expire: Date.now() + 10000 };
        res.json(response);
    } catch (err) {
        res.status(404).json({ status: 'error', error: 'Backlog niedostępny.' });
    }
});

router.get('/v1/audit-log', readLimiter, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100);
        const entries = readRecentEvents(limit);
        res.json({
            status: 'ok',
            source: 'data/governance-audit.jsonl',
            count: entries.length,
            entries
        });
    } catch (err) {
        res.status(500).json({ error: 'Nie udało się odczytać audit log.' });
    }
});

router.get('/v1/ecosystem/status', readLimiter, async (req, res) => {
    try {
        const reposPath = path.join(vcmsBase, 'repos.yaml');
        const yamlText = await fs.readFile(reposPath, 'utf8');
        const data = yaml.load(yamlText);
        const repos = data.repos || [];

        // When repos.yaml contains Windows-origin paths (laptop config deployed to VPS),
        // return a safe remote stub instead of leaking host filesystem layout.
        const hasWindowsPaths = repos.some(r => isWindowsPath(r.path));
        if (hasWindowsPaths) {
            return res.json({
                status: 'remote',
                note: 'Git status unavailable on remote server — repos.yaml contains laptop-local paths. Run ecosystem scan from your development machine.',
                generated_at: new Date().toISOString(),
                repos: repos.map(r => ({
                    name: r.name,
                    type: r.type,
                    risk_level: r.risk_level || 'UNKNOWN'
                }))
            });
        }

        const statusPromises = repos.map(async (repo) => {
            const gitStatus = await getGitStatus(repo.path);
            return { name: repo.name, type: repo.type, git: gitStatus };
        });

        const ecosystemStatus = await Promise.all(statusPromises);
        res.json({
            status: 'ok',
            generated_at: new Date().toISOString(),
            repos: ecosystemStatus
        });
    } catch (err) {
        winLogger.error(`[Ecosystem API Error] ${err.message}`);
        res.status(500).json({ status: 'error', error: 'Błąd skanowania ekosystemu.' });
    }
});

router.post('/chat', chatLimiter, apiLimiter, async (req, res) => {
    const { error, value } = chatSchema.validate(req.body || {});
    if (error || !value?.messages?.length) {
        return res.status(400).json({
            error: error?.details?.[0]?.message || 'Pole "messages" jest wymagane.'
        });
    }

    try {
        const contextData = await getContextData(vcmsBase, githubBase);
        const result = await runKodaChat(value.messages, contextData);

        if (!result.ok) {
            return res.status(result.status || 502).json({ error: result.error });
        }

        res.json({
            message: result.message,
            provider: result.provider,
            model: result.model
        });
    } catch (err) {
        winLogger.error(`[KODA Error] ${err.message}`);
        res.status(500).json({ error: 'Błąd przetwarzania chatu KODA.' });
    }
});

module.exports = router;
