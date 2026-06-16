#!/usr/bin/env node
/**
 * VCMS Demo Video Pipeline — Enterprise Grade
 * Normalizes to 1080p, burns ASS subtitles, mixes ambient audio.
 *
 * Usage: npm run build:demo [-- --config docs/demo/demo-config.json]
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_CONFIG = path.join(ROOT, 'docs', 'demo', 'demo-config.json');

function parseArgs(argv) {
    const args = { config: DEFAULT_CONFIG };
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--config' && argv[i + 1]) {
            args.config = path.resolve(ROOT, argv[++i]);
        }
    }
    return args;
}

function resolveFromRoot(p) {
    return path.isAbsolute(p) ? p : path.join(ROOT, p);
}

function loadConfig(configPath) {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    if (!config.videoInput || !config.output) {
        throw new Error('demo-config.json must define videoInput and output.');
    }
    if (!Array.isArray(config.subtitles) || config.subtitles.length === 0) {
        throw new Error('demo-config.json must define at least one subtitle entry.');
    }
    return config;
}

/** ASS timestamp: H:MM:SS.cc */
function formatAssTime(seconds) {
    const totalCs = Math.max(0, Math.round(Number(seconds) * 100));
    const cs = totalCs % 100;
    const totalSec = Math.floor(totalCs / 100);
    const s = totalSec % 60;
    const m = Math.floor(totalSec / 60) % 60;
    const h = Math.floor(totalSec / 3600);
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function escapeAssDialogue(text) {
    return String(text)
        .replace(/\\/g, '\\\\')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\n/g, '\\N');
}

function generateAss(config) {
    const w = config.targetWidth || 1920;
    const h = config.targetHeight || 1080;
    const st = config.style || {};
    const fontName = st.fontName || 'Inter';
    const fontSize = st.fontSize || 24;
    const primaryColour = st.primaryColour || '&H00FFFFFF';
    const outlineColour = st.outlineColour || '&H00050608';
    const backColour = st.backColour || '&H80050608';
    const bold = st.bold ?? 0;
    const italic = st.italic ?? 0;
    const borderStyle = st.borderStyle ?? 3;
    const outline = st.outline ?? 1;
    const shadow = st.shadow ?? 0;
    const alignment = st.alignment ?? 2;
    const marginL = st.marginL ?? 40;
    const marginR = st.marginR ?? 40;
    const marginV = st.marginV ?? 40;

    const header = `[Script Info]
Title: VCMS Portfolio Demo
ScriptType: v4.00+
PlayResX: ${w}
PlayResY: ${h}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontName},${fontSize},${primaryColour},&H000000FF,${outlineColour},${backColour},${bold},${italic},0,0,100,100,0,0,${borderStyle},${outline},${shadow},${alignment},${marginL},${marginR},${marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    const dialogues = config.subtitles.map((sub) => {
        const [start, end] = sub.time;
        if (!Array.isArray(sub.time) || sub.time.length !== 2) {
            throw new Error(`Invalid subtitle time for: ${sub.text}`);
        }
        const startT = formatAssTime(start);
        const endT = formatAssTime(end);
        const text = escapeAssDialogue(sub.text);
        return `Dialogue: 0,${startT},${endT},Default,,0,0,0,,${text}`;
    });

    return header + dialogues.join('\n') + '\n';
}

/** FFmpeg subtitles/ass filter path (Windows-safe). */
function ffmpegFilterPath(filePath) {
    return filePath
        .replace(/\\/g, '/')
        .replace(/:/g, '\\:')
        .replace(/'/g, "'\\''");
}

function probeDuration(videoPath) {
    return new Promise((resolve, reject) => {
        const ffprobe = ffprobeInstaller.path;
        const proc = spawn(ffprobe, [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            videoPath
        ], { stdio: ['ignore', 'pipe', 'pipe'] });

        let out = '';
        proc.stdout.on('data', (d) => { out += d; });
        proc.on('close', (code) => {
            if (code !== 0) return reject(new Error('ffprobe failed to read video duration.'));
            const dur = parseFloat(out.trim());
            if (!Number.isFinite(dur) || dur <= 0) {
                return reject(new Error('Invalid video duration from ffprobe.'));
            }
            resolve(dur);
        });
    });
}

function runFfmpeg(args) {
    return new Promise((resolve, reject) => {
        const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
        proc.on('error', reject);
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg exited with code ${code}`));
        });
    });
}

async function buildDemo(configPath) {
    if (!ffmpegPath) {
        throw new Error('ffmpeg-static binary not found. Run npm install.');
    }

    const config = loadConfig(configPath);
    const videoInput = resolveFromRoot(config.videoInput);
    const audioInput = config.audioInput ? resolveFromRoot(config.audioInput) : null;
    const output = resolveFromRoot(config.output);
    const ambientVolume = config.ambientVolume ?? 0.1;
    const tw = config.targetWidth || 1920;
    const th = config.targetHeight || 1080;

    if (!fs.existsSync(videoInput)) {
        throw new Error(
            `Video not found: ${videoInput}\n` +
            'Record screen capture to docs/demo/input.mp4 (see docs/VCMS_DEMO_SCRIPT.md).'
        );
    }

    const assContent = generateAss(config);
    const assPath = path.join(path.dirname(output), '.generated-subtitles.ass');
    fs.mkdirSync(path.dirname(assPath), { recursive: true });
    fs.writeFileSync(assPath, assContent, 'utf8');

    const assFilter = ffmpegFilterPath(assPath);
    const duration = await probeDuration(videoInput);
    const hasAmbient = audioInput && fs.existsSync(audioInput);

    const videoFilter =
        `[0:v]scale=${tw}:${th}:force_original_aspect_ratio=decrease,` +
        `pad=${tw}:${th}:(ow-iw)/2:(oh-ih)/2,ass='${assFilter}'[vout]`;

    const ffmpegArgs = ['-y', '-i', videoInput];

    const fadeOutStart = Math.max(0, duration - 3);

    if (hasAmbient) {
        ffmpegArgs.push('-stream_loop', '-1', '-i', audioInput);
        const audioFilter =
            `[1:a]volume=${ambientVolume},atrim=0:${duration},asetpts=PTS-STARTPTS,` +
            `afade=t=in:st=0:d=2,afade=t=out:st=${fadeOutStart}:d=3[aout]`;
        ffmpegArgs.push(
            '-filter_complex', `${videoFilter};${audioFilter}`,
            '-map', '[vout]',
            '-map', '[aout]'
        );
    } else {
        console.warn('[build-demo] ambient.mp3 not found — generating subtle pink noise bed.');
        ffmpegArgs.push(
            '-f', 'lavfi', '-i', `anoisesrc=color=pink:amplitude=0.02:duration=${duration}`,
            '-filter_complex',
            `${videoFilter};[1:a]volume=${ambientVolume},atrim=0:${duration},asetpts=PTS-STARTPTS,` +
            `afade=t=in:st=0:d=2,afade=t=out:st=${fadeOutStart}:d=3[aout]`,
            '-map', '[vout]',
            '-map', '[aout]'
        );
    }

    ffmpegArgs.push(
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-shortest',
        output
    );

    console.log('[build-demo] Input:', videoInput);
    console.log('[build-demo] ASS:', assPath);
    console.log('[build-demo] Output:', output);
    console.log('[build-demo] Duration:', duration.toFixed(2), 's');
    console.log('[build-demo] Ambient:', hasAmbient ? audioInput : 'synthetic (lavfi)');

    await runFfmpeg(ffmpegArgs);

    console.log('[build-demo] Done:', output);
    return output;
}

if (require.main === module) {
    const cli = parseArgs(process.argv);
    buildDemo(cli.config).catch((err) => {
        console.error('[build-demo] ERROR:', err.message);
        process.exit(1);
    });
}

module.exports = { loadConfig, generateAss, formatAssTime, buildDemo };
