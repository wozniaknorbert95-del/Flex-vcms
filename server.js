const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// --- 1. HTTP Hardening (Helmet, CORS) ---
app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: false // Wymagane wyłączenie pod SSG PWA, ew. można to dokładnie przestroić
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://vcms.flexgrafik.nl'];
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error('CORS policy violation'), false);
    }
}));

app.use(express.json({ limit: '5mb' }));

// --- 2. Minimalne Logowanie Techniczne ---
const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        if(req.path.startsWith('/api') || res.statusCode >= 400) {
           console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Status: ${res.statusCode} | Time: ${ms}ms`);
        }
    });
    next();
};
app.use(logger);

// --- 3. Rate Limiting ---
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

const vcmsBase = process.env.VCMS_DIR || path.resolve(__dirname);
const githubBase = process.env.GITHUB_DIR || path.resolve(__dirname, '..');

const getContextData = () => {
    const getFile = (p) => {
        try { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '[BRAK PLIKU LUB PUSTY]'; }
        catch(e) { return '[BŁĄD ODCZYTU: Zablokowano]'; }
    };
    
    return {
        "KNOWLEDGE_STUDY": {
            "study-index.md": getFile(path.join(vcmsBase, 'docs/study/study-index.md')),
            "skill-gap-matrix.md": getFile(path.join(vcmsBase, 'docs/study/skill-gap-matrix.md'))
        },
        "KNOWLEDGE_WORKFLOW": {
            "global-rules.md": getFile(path.join(vcmsBase, 'docs/core/global-rules.md')),
            "sprint-plan.md": getFile(path.join(vcmsBase, '.agent/workflows/sprint-plan.md')),
            "blokady": getFile(path.join(vcmsBase, 'docs/study/blocker-decision-tree.md'))
        },
        "KNOWLEDGE_PROJECT_ZZP": {
            "brain-zzp.md": getFile(path.join(githubBase, 'flexgrafik-nl/brain-zzp.md')),
            "todo.json": getFile(path.join(githubBase, 'flexgrafik-nl/todo.json'))
        },
        "KNOWLEDGE_PROJECT_APP": {
            "brain-app.md": getFile(path.join(githubBase, 'app.flexgrafik.nl/brain-app.md')),
            "todo.json": getFile(path.join(githubBase, 'app.flexgrafik.nl/todo.json'))
        },
        "KNOWLEDGE_PROJECT_ZZPACKAGE": {
            "brain-zzpackage.md": getFile(path.join(githubBase, 'zzpackage.flexgrafik.nl/brain-zzpackage.md')),
            "todo.json": getFile(path.join(githubBase, 'zzpackage.flexgrafik.nl/todo.json'))
        }
    };
};

// --- Monitoring ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: Date.now() });
});

app.get('/api/knowledge', apiLimiter, (req, res) => {
    try {
        const data = getContextData();
        res.json(data);
    } catch(err) {
        console.error(`[API Error] /api/knowledge - ${err.message}`);
        res.status(500).json({ error: 'Nie udało się poprawnie złożyć SSOT' });
    }
});

app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        const payload = req.body;
        
        // --- Walidacja Żądania (Request Validation) ---
        if (!payload || !payload.messages || !Array.isArray(payload.messages)) {
            console.warn('[Validation Failed] Odczytano błędny payload (brak tablicy messages).');
            return res.status(400).json({ error: 'Nieprawidłowy payload. Oczekiwano tablicy "messages".' });
        }
        if (payload.messages.length === 0) {
             return res.status(400).json({ error: 'Puste żądanie.' });
        }
        if (payload.messages.length > 50) {
            console.warn(`[Validation Failed] Max rozmowy przekroczone: ${payload.messages.length}`);
            return res.status(400).json({ error: 'Przekroczono dozwoloną długość kontekstu dla agenta (max 50).' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[Config Error] Brak klucza API Gemini w .env');
            return res.status(500).json({ error: 'Błąd konfiguracji usługi LLM.' });
        }

        const systemPrompt = `🎯 ROLA\nJesteś moim osobistym mentorem, trenerem i „aniołem stróżem” w vibe-codingu.\n\nTwoje zadanie:\n- prowadzić mnie krok po kroku\n- motywować mnie\n- pilnować mojej konsekwencji\n- sprawdzać wykonanie zadań\n- NIE pozwalać mi się wycofać ani rozproszyć\n\nJesteś:\n- spokojny, konkretny, męski w komunikacji\n- wspierający, ale wymagający\n- skupiony na działaniu, nie teorii\n\n🧬 DOPASOWANIE DO MNIE (KLUCZOWE)\nDziałam jak Generator (Human Design):\n- najlepiej działam, gdy reaguję, nie gdy jestem zmuszany\n- mam dużo energii, ale tylko do rzeczy, które mnie angażują\n- blokuję się przy presji i nadmiarze\n\nTwoje zasady pracy ze mną:\n- dawaj mi małe, konkretne kroki\n- zadawaj pytania zamiast narzucać\n- pomagaj mi poczuć „czy to mnie kręci”\n- jeśli tracę energię → pomóż mi zmienić podejście, nie zmuszaj\n\n🧭 CEL GŁÓWNY\nPomóż mi:\n- nauczyć się vibe-codingu w praktyce\n- budować realne projekty\n- wejść w stan flow i regularnej pracy\n- stać się samodzielnym twórcą / programistą\n\n🔥 MOTYWACJA I TRYB STRAŻNIKA\n- Jeśli unikam działania, zatrzymaj mnie: "Unikasz. Wracamy do zadania."\n- Zawsze dawaj najmniejszy krok.\n- Nie dawaj długich wykładów, najwyżej 3 mocne zdania.`;

        const enrichedSystemPrompt = systemPrompt + "\n\n===== KONTEKST =====\n" + JSON.stringify(getContextData(), null, 2);

        const geminiPayload = {
            system_instruction: { parts: [{ text: enrichedSystemPrompt }] },
            contents: payload.messages
        };

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        
        // --- 4. Timeouty i Kontrolowana Obsługa Upstreamu ---
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s twardy limit blokady LLM

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.text();
            console.error(`[Upstream Error API] kod: ${response.status} msg: ${errData}`);
            // Nie rzucamy tracebackiem we front
            return res.status(response.status).json({ error: 'LLM odrzucił wejście (Upstream zablokowany).' });
        }

        const data = await response.text();
        res.status(response.status).send(data);
    } catch (e) {
        if (e.name === 'AbortError') {
             console.error('[Upstream Error] Gemini API Timeout over 20s.');
             return res.status(504).json({ error: 'Gemini nie zdążył odpowiedzieć (Timeout).' });
        }
        console.error(`[Chat Fatal Error] ${e.message}`);
        res.status(500).json({ error: 'Wystąpił wewnętrzny błąd podczas procesu analizy Czat.' });
    }
});

// Serwuj produkt finalny PWA (Fallback mode)
const distPath = path.join(__dirname, 'docs/.vitepress/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Brak GUI. Należy uruchomić najpierw [npm run docs:build]');
    }
});

// Hard Error Handling (dla złapania resztek poza blokami ryzyk)
app.use((err, req, res, next) => {
    console.error(`[System Breakdown] ${err.message}`);
    res.status(500).json({ error: 'Service Unavailable' });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`[VCMS CORE] Uruchomiono produkcyjnie na porcie ${PORT} [Hardened]`);
});
