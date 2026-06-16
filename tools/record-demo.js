#!/usr/bin/env node
/**
 * Automated VCMS demo screen capture (Playwright) + optional build pipeline.
 * Usage: npm run record:demo [-- --skip-build]
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, spawnSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const { buildDemo } = require('./build-demo');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.VCMS_DEMO_URL || 'http://127.0.0.1:8001';
const DEMO_LOCALE = process.env.VCMS_DEMO_LOCALE || 'en';
const DEMO_URL = `${BASE_URL}/?locale=${DEMO_LOCALE}`;
const PORT = Number(new URL(BASE_URL).port) || 8001;
const RAW_WEBM = path.join(ROOT, 'docs', 'demo', '.record-raw.webm');
const INPUT_MP4 = path.join(ROOT, 'docs', 'demo', 'input.mp4');
const TERMINAL_HTML = path.join(__dirname, 'demo-terminal.html');

function parseArgs(argv) {
    const opts = { skipBuild: false };
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--skip-build') opts.skipBuild = true;
    }
    return opts;
}

function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function httpGet(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            res.resume();
            resolve(res.statusCode);
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy(new Error('timeout')));
    });
}

async function waitForServer(maxMs = 45000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
        try {
            const code = await httpGet(`${BASE_URL}/health`);
            if (code === 200) return;
        } catch {}
        await wait(500);
    }
    throw new Error(`VCMS not reachable at ${BASE_URL}. Start server or set VCMS_DEMO_URL.`);
}

function startServerIfNeeded() {
    return httpGet(`${BASE_URL}/health`)
        .then(() => null)
        .catch(() => new Promise((resolve, reject) => {
            console.log('[record-demo] Starting VCMS server...');
            const child = spawn('node', ['server.js'], {
                cwd: ROOT,
                stdio: 'ignore',
                detached: true,
                env: { ...process.env, PORT: String(PORT) }
            });
            child.unref();
            waitForServer()
                .then(() => resolve(child))
                .catch(reject);
        }));
}

function runScan() {
    console.log('[record-demo] Running ecosystem scan...');
    const r = spawnSync('node', [path.join(ROOT, 'tools', 'vcms-scan.js')], {
        cwd: ROOT,
        encoding: 'utf8',
        timeout: 120000
    });
    const out = (r.stdout || '') + (r.stderr || '');
    const conflictLine = out.split('\n').find((l) => /Conflicts:\s*\d+/i.test(l)) || 'Conflicts: 0';
    if (r.status !== 0) {
        console.warn('[record-demo] Scan exit code:', r.status);
    }
    console.log('[record-demo]', conflictLine.trim());
    return conflictLine.trim();
}

function ensureDocsBuilt() {
    const distIndex = path.join(ROOT, 'docs', '.vitepress', 'dist', 'index.html');
    if (fs.existsSync(distIndex)) return;
    console.log('[record-demo] Building VitePress docs...');
    const r = spawnSync('npm', ['run', 'docs:build'], { cwd: ROOT, stdio: 'inherit', shell: true });
    if (r.status !== 0) throw new Error('docs:build failed');
}

function convertWebmToMp4(webmPath, mp4Path) {
    return new Promise((resolve, reject) => {
        const args = [
            '-y', '-i', webmPath,
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
            '-pix_fmt', 'yuv420p', '-an',
            '-movflags', '+faststart',
            mp4Path
        ];
        const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
        proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg convert exit ${code}`))));
    });
}

async function recordBrowser(conflictLine) {
    let playwright;
    try {
        playwright = require('playwright');
    } catch {
        throw new Error('Playwright not installed. Run: npm install && npx playwright install chromium');
    }

    fs.mkdirSync(path.dirname(RAW_WEBM), { recursive: true });
    if (fs.existsSync(RAW_WEBM)) fs.unlinkSync(RAW_WEBM);

    const browser = await playwright.chromium.launch({
        headless: true,
        args: ['--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: path.dirname(RAW_WEBM),
            size: { width: 1920, height: 1080 }
        },
        colorScheme: 'dark'
    });

    const page = await context.newPage();
    const terminalUrl = `file:///${TERMINAL_HTML.replace(/\\/g, '/')}`;

    console.log('[record-demo] Recording choreography (~75s)...');

    // 0–14s: Dashboard
    await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await wait(5000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(4000);

    // 14–22s: Ecosystem
    await page.locator('[data-tab="ecosystem"]').first().click();
    await wait(8000);

    // 22–34s: Terminal scan (simulated)
    await context.addInitScript((line) => {
        window.SCAN_LINES = [
            '> node tools/vcms-scan.js',
            'Scanning 8 repositories...',
            line,
            'Written docs/ecosystem/conflicts.md'
        ];
    }, conflictLine);
    await page.goto(terminalUrl, { waitUntil: 'load' });
    await wait(12000);

    // 34–46s: Dashboard Action Log
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    await wait(3000);
    await page.evaluate(() => {
        const log = document.getElementById('log-container');
        if (log) log.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await wait(9000);

    // 46–60s: KODA
    await page.locator('[data-tab="lab"]').first().click();
    await wait(1500);
    await page.locator('#koda-input').fill('How many repos in the ecosystem?');
    await page.locator('#koda-send').click();
    await wait(15000);

    // 60–72s: Agent Boundaries doc
    await page.evaluate(() => window.loadDoc('agents/agent-boundaries'));
    await wait(10000);

    const video = page.video();
    await context.close();
    await browser.close();

    const webmPath = await video.path();
    fs.copyFileSync(webmPath, RAW_WEBM);
    try { fs.unlinkSync(webmPath); } catch {}

    console.log('[record-demo] Converting WebM → MP4...');
    await convertWebmToMp4(RAW_WEBM, INPUT_MP4);
    console.log('[record-demo] Raw capture:', INPUT_MP4);
    return INPUT_MP4;
}

async function main() {
    const opts = parseArgs(process.argv);
    if (!ffmpegPath) throw new Error('ffmpeg-static missing');

    ensureDocsBuilt();
    const serverChild = await startServerIfNeeded();
    const conflictLine = runScan();
    await recordBrowser(conflictLine);

    if (!opts.skipBuild) {
        console.log('[record-demo] Building final video with ASS subtitles...');
        await buildDemo(path.join(ROOT, 'docs', 'demo', 'demo-config.json'));
    }

    if (serverChild) {
        try { process.kill(-serverChild.pid); } catch { try { serverChild.kill(); } catch {} }
    }

    console.log('[record-demo] Complete.');
}

if (require.main === module) {
    main().catch((err) => {
        console.error('[record-demo] ERROR:', err.message);
        process.exit(1);
    });
}

module.exports = { recordBrowser, main };
