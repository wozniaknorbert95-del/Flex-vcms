const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getContextData } = require('../logic/context');
const { callGemini } = require('../providers/gemini');

// --- Rate Limiting ---
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, 
    message: { error: 'Przekroczono globalny limit zapytań API (Try again later).' },
    standardHeaders: true,
    legacyHeaders: false,
});

const chatLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 30, 
    message: { error: 'Osiągnięto limit wymiany z LLM. Poczekaj 5 minut.' }
});

// --- Metrics Store ---
const metrics = {
    total_requests: 0,
    last_latency: 0,
    last_status: 'unknown',
    start_time: Date.now(),
    history: [] // [{time, status, latency}]
};

// --- Uncle's Senior Tips (Educational Layer) ---
const uncleTips = [
    "Dobra latencja to podstawa. Jeśli skacze powyżej 1500ms, sprawdź obciążenie VPS albo limity OpenRoutera.",
    "Zawsze rób 'node tools/vcms-scan.js' przed dużymi zmianami. SSoT to Twój jedyny kompas.",
    "Błędy 403 na produkcji? Zwykle to wina źle ustawionego 'trust proxy' w Expressie albo Nginxa.",
    "Vibecoding to nie tylko pisanie kodu, to reżyserowanie AI. Bądź precyzyjny w promptach jak w specyfikacji.",
    "Standard 'Swiss Watch' (V6.5) wymaga, by każdy produkt miał prawidłowy SKU. Sprawdzaj product-master-table.json.",
    "Pamiętaj o 'Zasadzie 11'. Tylko ręczny deploy na produkcję daje Ci 100% pewności, co tam faktycznie siedzi.",
    "Jeśli logi PM2 puchną, sprawdź czy nie zostawiłeś 'debug: true' w jakiejś usłudze na proda."
];

const vcmsBase = process.env.VCMS_DIR || process.cwd();
const githubBase = process.env.AGENT_CONTEXT_PATH || require('path').resolve(process.cwd(), '..');

router.get('/v1/status', (req, res) => {
    const randomTip = uncleTips[Math.floor(Math.random() * uncleTips.length)];
    res.json({
        status: 'OK',
        uptime: Math.floor((Date.now() - metrics.start_time) / 1000),
        llm: {
            last_status: metrics.last_status,
            last_latency_ms: metrics.last_latency,
            total_requests: metrics.total_requests,
            history: metrics.history.slice(-10).reverse() // Last 10
        },
        uncle_tip: randomTip,
        version: '1.0.0-gateway'
    });
});

// Secure trigger for ecosystem scan
router.post('/v1/scan', async (req, res) => {
    const { exec } = require('child_process');
    console.log('[VCMS] Triggering Ecosystem Scan from Dashboard...');
    
    exec('node tools/vcms-scan.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`[Scan Error] ${error.message}`);
            return res.status(500).json({ error: 'Skanowanie nie powiodło się.' });
        }
        res.json({ message: 'Skanowanie zakończone sukcesem.', output: stdout });
    });
});

router.get('/knowledge', apiLimiter, (req, res) => {
    try {
        metrics.total_requests++;
        const data = getContextData(vcmsBase, githubBase);
        res.json(data);
    } catch(err) {
        console.error(`[API Error] /api/knowledge - ${err.message}`);
        res.status(500).json({ error: 'Nie udało się poprawnie złożyć SSOT' });
    }
});

router.post('/chat', chatLimiter, async (req, res) => {
    try {
        const payload = req.body;
        
        if (!payload || !payload.messages || !Array.isArray(payload.messages)) {
            return res.status(400).json({ error: 'Nieprawidłowy payload. Oczekiwano tablicy "messages".' });
        }
        if (payload.messages.length === 0) {
             return res.status(400).json({ error: 'Puste żądanie.' });
        }
        if (payload.messages.length > 50) {
            return res.status(400).json({ error: 'Przekroczono dozwoloną długość kontekstu dla agenta (max 50).' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Błąd konfiguracji usługi LLM.' });
        }

        const context = getContextData(vcmsBase, githubBase);
        const startTime = Date.now();
        const result = await callGemini(payload.messages, context, apiKey);
        
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
            console.error(`[LLM Error] Status: ${result.status} Data: ${result.error}`);
            return res.status(result.status).json({ error: 'LLM odrzucił wejście (Upstream zablokowany).' });
        }

        res.status(result.status).json(result.data);
    } catch (e) {
        if (e.name === 'AbortError') {
             return res.status(504).json({ error: 'Gemini nie zdążył odpowiedzieć (Timeout).' });
        }
        console.error(`[Chat Fatal Error] ${e.message}`);
        res.status(500).json({ error: 'Wystąpił wewnętrzny błąd podczas procesu analizy Czat.' });
    }
});

// --- PH4-014: Control Lab & Backlog API (Audit Optimized) ---

let backlogCache = { data: null, expire: 0 };

router.get('/v1/backlog', (req, res) => {
    try {
        if (backlogCache.data && Date.now() < backlogCache.expire) {
            return res.json(backlogCache.data);
        }

        const todoPath = require('path').join(vcmsBase, 'flex-vcms-todo.json');
        if (!require('fs').existsSync(todoPath)) {
            return res.json({ status: 'missing', error: 'Brak pliku flex-vcms-todo.json' });
        }

        const raw = require('fs').readFileSync(todoPath, 'utf8');
        
        // Robust JSON Parsing
        let todo;
        try {
            todo = JSON.parse(raw);
        } catch (parseErr) {
            console.error(`[SEC-WATCHDOG] Backlog JSON Corrupted: ${parseErr.message}`);
            return res.status(200).json({ 
                status: 'error', 
                error: 'Plik flex-vcms-todo.json jest uszkodzony.',
                recovery: 'Uruchom node tools/vcms-scan.js, aby spróbować naprawić stan.' 
            });
        }

        const stats = require('fs').statSync(todoPath);

        const response = {
            status: 'ok',
            next_task: (todo.meta && todo.meta.next) ? todo.meta.next : null,
            updated: (todo.meta && todo.meta.updated) ? todo.meta.updated : 'unknown',
            last_sync_ms: stats.mtimeMs,
            source: 'flex-vcms-todo.json'
        };

        backlogCache = { data: response, expire: Date.now() + 10000 }; // 10s cache
        res.json(response);
    } catch (err) {
        console.error(`[Backlog General Error] ${err.message}`);
        res.status(200).json({ status: 'error', error: 'Błąd systemu podczas odczytu backlogu.' });
    }
});

router.get('/v1/context/health', (req, res) => {
    try {
        const manifestPath = require('path').join(githubBase, 'manifest.json');
        let manifest = { modules: [], generated_at: 0 };
        
        if (require('fs').existsSync(manifestPath)) {
            const raw = require('fs').readFileSync(manifestPath, 'utf8');
            if (raw.trim()) manifest = JSON.parse(raw);
        }

        const health = (manifest.modules || []).map(mod => {
            const bPath = require('path').join(githubBase, mod.name, mod.brain);
            const tPath = require('path').join(githubBase, mod.name, mod.todo);
            
            let bExists = false;
            let tExists = false;

            try {
                bExists = require('fs').existsSync(bPath) && require('fs').statSync(bPath).size > 0;
                tExists = require('fs').existsSync(tPath) && require('fs').statSync(tPath).size > 0;
            } catch(e) {}
            
            let status = 'healthy';
            if (!bExists || !tExists) status = 'missing';
            else if (Date.now() - (manifest.generated_at || 0) > 24 * 60 * 60 * 1000) status = 'stale';

            return {
                name: mod.name,
                status: status,
                last_sync: manifest.generated_at || 0
            };
        });

        res.json({
            status: 'ok',
            generated_at: manifest.generated_at || 0,
            modules: health
        });
    } catch (err) {
        console.error(`[Health Error] ${err.message}`);
        res.status(500).json({ error: 'Błąd sprawdzania statusu kontekstu.' });
    }
});

module.exports = router;
