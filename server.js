const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { setupGuards, handleJsonErrors } = require('./src/middleware/guards');
const logger = require('./src/middleware/logger');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 8001;

// --- 1. Security & Hardening ---
app.set('trust proxy', 1); // Wymagane dla poprawnych metryk i Rate Limita pod Nginxem
setupGuards(app);
app.use(express.json({ limit: '5mb' }));
app.use(handleJsonErrors);

// --- 2. Logging & Monitoring ---
app.use(logger);

// --- 3. Routes ---
app.use('/chat', (req, res, next) => { req.url = '/chat'; next(); }, apiRoutes); // Alias dla kompatybilności
app.use('/api', apiRoutes);

// Monitoring
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: Date.now() });
});

// Bezpieczeństwo
app.use('/deploy-context', (req, res) => res.status(403).send('Forbidden'));

// --- 4. Static Assets (Dashboard & UI) ---
const ONE_HOUR = 3600;
const ONE_YEAR = 31536000;

app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: ONE_HOUR * 1000,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
})); // Dashboard at /

const distPath = path.join(__dirname, 'docs/.vitepress/dist');
app.use('/docs', express.static(distPath, { 
    extensions: ['html'],
    maxAge: ONE_HOUR * 1000 
})); 

app.use('/assets', express.static(path.join(distPath, 'assets'), {
    maxAge: ONE_YEAR * 1000,
    immutable: true
})); // Assets for docs (long-lived)

// PWA Fallback
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.url.startsWith('/api') || req.url.startsWith('/chat')) return next();
    
    // Check if it's a request for the dashboard
    if (req.url === '/' || req.url === '/index.html') {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }

    // Fallback to docs
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Brak GUI. Należy uruchomić najpierw [npm run docs:build]');
    }
});

// Final Error Handling
app.use((err, req, res, next) => {
    console.error(`[System Breakdown] ${err.message}`);
    res.status(500).json({ error: 'Service Unavailable' });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`[VCMS CORE] Uruchomiono produkcyjnie na porcie ${PORT} [Hardened]`);
});
