const path = require('path');
const { loadConfig, generateAss, formatAssTime } = require('../tools/build-demo');

describe('build-demo ASS generator', () => {
    const configPath = path.join(__dirname, '..', 'docs', 'demo', 'demo-config.json');

    test('loadConfig reads demo-config.json', () => {
        const config = loadConfig(configPath);
        expect(config.videoInput).toContain('input.mp4');
        expect(config.subtitles.length).toBeGreaterThanOrEqual(8);
    });

    test('formatAssTime produces ASS timestamps', () => {
        expect(formatAssTime(0.5)).toBe('0:00:00.50');
        expect(formatAssTime(65.25)).toBe('0:01:05.25');
    });

    test('generateAss includes Script Info and Dialogue lines', () => {
        const config = loadConfig(configPath);
        const ass = generateAss(config);
        expect(ass).toContain('[Script Info]');
        expect(ass).toContain('PlayResX: 1920');
        expect(ass).toContain('Style: Default,Arial');
        expect(ass).toContain('Dialogue:');
        expect(ass).toContain('governance layer');
        expect(ass).toContain('human approves');
    });
});
