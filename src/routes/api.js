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

const vcmsBase = process.env.VCMS_DIR || process.cwd();
const githubBase = process.env.AGENT_CONTEXT_PATH || require('path').resolve(process.cwd(), '..');

router.get('/v1/status', (req, res) => {
    res.json({
        status: 'OK',
        uptime: Math.floor((Date.now() - metrics.start_time) / 1000),
        llm: {
            last_status: metrics.last_status,
            last_latency_ms: metrics.last_latency,
            total_requests: metrics.total_requests,
            history: metrics.history.slice(-10).reverse() // Last 10
        },
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

module.exports = router;
