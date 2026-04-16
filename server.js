const express = require('express');
const path = require('path');
const fs = require('fs');
const { port, githubBase, allowedOrigins } = require('./src/config/env');
const { setupGuards, handleJsonErrors } = require('./src/middleware/guards');
const { logger, winLogger } = require('./src/middleware/logger');
const apiRoutes = require('./src/routes/api');

const app = express();

// --- 1. Security & Hardening ---
app.set('trust proxy', 1); 
setupGuards(app);
app.use(express.json({ limit: '5mb' }));
app.use(handleJsonErrors);

// --- 2. Logging & Monitoring ---
app.use(logger);

// --- 3. Routes ---
app.use('/chat', (req, res, next) => { req.url = '/chat'; next(); }, apiRoutes); 
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: Date.now() });
});

// Protect deploy context
app.use('/deploy-context', (req, res) => res.status(403).send('Forbidden'));

// --- 4. Static Assets (Dashboard & UI) ---
const ONE_HOUR = 3600;
const ONE_YEAR = 31536000;

app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: ONE_HOUR * 1000,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (filePath.match(/\.(js|css|webp|png|jpg|woff2?)$/)) {
            res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
        }
    }
}));

const distPath = path.join(__dirname, 'docs/.vitepress/dist');
app.use('/docs', express.static(distPath, { 
    extensions: ['html'],
    maxAge: ONE_HOUR * 1000,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
    }
})); 

app.use('/assets', express.static(path.join(distPath, 'assets'), {
    maxAge: ONE_YEAR * 1000,
    immutable: true
}));

// SPA Fallback
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.url.startsWith('/api') || req.url.startsWith('/chat')) return next();
    
    if (req.url === '/' || req.url === '/index.html') {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }

    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Brak GUI. Należy uruchomić najpierw [npm run docs:build]');
    }
});

// Final Error Handling
app.use((err, req, res, next) => {
    winLogger.error(`[Fatal-Middleware] ${err.message}`);
    res.status(500).json({ error: 'Service Unavailable' });
});

const server = app.listen(port, '0.0.0.0', () => {
    winLogger.info(`--- VCMS CORE Hardened v3.0 ---`);
    winLogger.info(`Port: ${port}`);
    winLogger.info(`Base Context Path: ${githubBase}`);
    winLogger.info(`Allowed Origins: ${allowedOrigins.join(', ')}`);
});

// --- 5. Graceful Shutdown (Audit 2.0 INF-013) ---
const shutdown = () => {
    winLogger.info('SIGTERM/SIGINT received. Closing HTTP server...');
    server.close(() => {
        winLogger.info('HTTP server closed. Exiting process.');
        process.exit(0);
    });
    
    // Force shutdown after 10s if connections persist
    setTimeout(() => {
        winLogger.warn('Shutdown forced after timeout.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
