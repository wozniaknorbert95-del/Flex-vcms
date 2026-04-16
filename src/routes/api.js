const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');
const { execFile } = require('child_process');
const yaml = require('js-yaml');
const { getContextData } = require('../logic/context');
const { callGemini } = require('../providers/gemini');

// --- Configuration ---
const vcmsBase = process.env.VCMS_DIR || process.cwd();
const githubBase = process.env.AGENT_CONTEXT_PATH || path.resolve(process.cwd(), '..');

// --- Rate Limiting ---
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, 
    message: { error: 'Przekroczono globalny limit zapytań API.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const chatLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 30, 
    message: { error: 'Osiągnięto limit wymiany z LLM. Poczekaj 5 minut.' }
});

// --- In-Memory Metrics Store ---
const metrics = {
    total_requests: 0,
    last_latency: 0,
    last_status: 'unknown',
    start_time: Date.now(),
    history: [] 
};

const uncleTips = [
    "Dobra latencja to podstawa. Jeśli skacze powyżej 1500ms, sprawdź obciążenie VPS albo limity OpenRoutera.",
    "Zawsze rób 'node tools/vcms-scan.js' przed dużymi zmianami. SSoT to Twój jedyny kompas.",
    "Błędy 403 na produkcji? Zwykle to wina źle ustawionego 'trust proxy' w Expressie albo Nginxa.",
    "Standard 'Swiss Watch' (V6.5) wymaga, by każdy produkt miał prawidłowy SKU. Sprawdzaj product-master-table.json.",
    "Pamiętaj o 'Zasadzie 11'. Tylko ręczny deploy na produkcję daje Ci 100% pewności."
];

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

// --- Routes ---

router.get('/v1/status', async (req, res) => {
    try {
        const randomTip = uncleTips[Math.floor(Math.random() * uncleTips.length)];
        const contextData = await getContextData(vcmsBase, githubBase);
        const knowledgeCount = Object.keys(contextData.VCMS_INTERNAL_KNOWLEDGE).length;

        res.json({
            status: 'OK',
            uptime: Math.floor((Date.now() - metrics.start_time) / 1000),
            llm: {
                last_status: metrics.last_status,
                last_latency_ms: metrics.last_latency,
                total_requests: metrics.total_requests,
                history: metrics.history.slice(-10).reverse()
            },
            knowledge: {
                file_count: knowledgeCount
            },
            uncle_tip: randomTip,
            version: '1.3.0-hardened'
        });
    } catch (err) {
        res.status(500).json({ error: 'Błąd podczas pobierania statusu systemu.' });
    }
});

router.post('/v1/scan', apiLimiter, async (req, res) => {
    console.log('[VCMS] Triggering Ecosystem Scan...');
    execFile('node', [path.join(vcmsBase, 'tools', 'vcms-scan.js')], (error, stdout) => {
        if (error) {
            console.error(`[Scan Error] ${error.message}`);
            return res.status(500).json({ error: 'Skanowanie nie powiodło się.' });
        }
        res.json({ message: 'Skanowanie zakończone.', output: stdout });
    });
});

router.get('/knowledge', apiLimiter, async (req, res) => {
    try {
        const data = await getContextData(vcmsBase, githubBase);
        res.json(data);
    } catch(err) {
        console.error(`[API Error] /knowledge - ${err.message}`);
        res.status(500).json({ error: 'Nie udało się poprawnie złożyć SSOT' });
    }
});
 
router.get('/v1/context/health', async (req, res) => {
    try {
        const db = require('../database/instance');
        const files = db.prepare(`
            SELECT repo_id, file_path, file_name, category FROM knowledge_index
            WHERE repo_id = 'flex-vcms' AND category IN ('BRAIN', 'TODO', 'HANDOFF', 'DOC')
            ORDER BY category ASC
        `).all();

        const health = files.map(f => {
            const fullPath = path.join(vcmsBase, f.file_path);
            const exists = require('fs').existsSync(fullPath);
            return {
                name: f.file_name,
                path: f.file_path,
                status: exists ? 'healthy' : 'missing'
            };
        });

        res.json({ modules: health });
    } catch (err) {
        res.status(500).json({ error: 'Błąd weryfikacji zdrowia kontekstu.' });
    }
});

router.post('/chat', chatLimiter, async (req, res) => {
    try {
        const schema = Joi.object({
            messages: Joi.array().items(
                Joi.object({
                    role: Joi.string().valid('user', 'model', 'assistant').required(),
                    parts: Joi.array().items(
                        Joi.object({
                            text: Joi.string().required()
                        })
                    ).required()
                })
            ).min(1).required()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: `Błędny format wiadomości: ${error.details[0].message}` });
        }

        const { messages } = value;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Brak klucza API LLM.' });

        const context = await getContextData(vcmsBase, githubBase);
        const startTime = Date.now();
        const result = await callGemini(messages, context, apiKey);
        
        metrics.total_requests++;
        metrics.last_latency = Date.now() - startTime;
        metrics.last_status = result.ok ? 'success' : `error_${result.status}`;
        
        metrics.history.push({
            time: new Date().toLocaleTimeString('pl-PL'),
            status: metrics.last_status,
            latency: metrics.last_latency
        });
        if (metrics.history.length > 20) metrics.history.shift();

        if (!result.ok) {
            return res.status(result.status || 502).json({ error: 'Upstream LLM error.' });
        }

        res.status(200).json(result.data);
    } catch (e) {
        console.error(`[Chat Fatal] ${e.message}`);
        const status = e.name === 'AbortError' ? 504 : 500;
        res.status(status).json({ error: 'Wewnętrzny błąd czatu.' });
    }
});

let backlogCache = { data: null, expire: 0 };

router.get('/v1/backlog', async (req, res) => {
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

router.get('/v1/ecosystem/status', async (req, res) => {
    try {
        const reposPath = path.join(vcmsBase, 'repos.yaml');
        const yamlText = await fs.readFile(reposPath, 'utf8');
        const data = yaml.load(yamlText);
        const repos = data.repos || [];

        const statusPromises = repos.map(async (repo) => {
            const gitStatus = await getGitStatus(repo.path);
            return {
                name: repo.name,
                type: repo.type,
                path: repo.path,
                git: gitStatus
            };
        });

        const ecosystemStatus = await Promise.all(statusPromises);
        res.json({
            status: 'ok',
            generated_at: new Date().toISOString(),
            repos: ecosystemStatus
        });
    } catch (err) {
        console.error(`[Ecosystem API Error] ${err.message}`);
        res.status(500).json({ status: 'error', error: 'Błąd skanowania ekosystemu.' });
    }
});

module.exports = router;
