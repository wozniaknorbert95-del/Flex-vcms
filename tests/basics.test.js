const fs = require('fs').promises;
const path = require('path');
const { getContextData } = require('../src/logic/context');

const { normalizeMessages, buildSystemPrompt } = require('../src/logic/koda-chat');

describe('VCMS Core Logic Verification', () => {
    const vcmsBase = process.cwd();
    const githubBase = path.resolve(vcmsBase, '..');

    test('getContextData should be a function', () => {
        expect(typeof getContextData).toBe('function');
    });

    test('getContextData should return a promise (Async)', () => {
        const result = getContextData(vcmsBase, githubBase);
        expect(result instanceof Promise).toBe(true);
    });

    test('getContextData should contain VCMS_INTERNAL_KNOWLEDGE', async () => {
        const data = await getContextData(vcmsBase, githubBase);
        expect(data).toHaveProperty('VCMS_INTERNAL_KNOWLEDGE');
    });

    test('Check for manifest fallback behavior', async () => {
        const data = await getContextData(vcmsBase, githubBase);
        // Even if manifest is missing, we should have fallback modules
        expect(data).toHaveProperty('PROJECT_CONTEXT_flexgrafik_nl');
    });
});

describe('KODA chat helpers', () => {
    test('normalizeMessages maps Gemini-style parts to OpenAI roles', () => {
        const out = normalizeMessages([
            { role: 'user', parts: [{ text: 'Hello' }] },
            { role: 'model', parts: [{ text: 'Hi' }] }
        ]);
        expect(out).toEqual([
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi' }
        ]);
    });

    test('buildSystemPrompt includes governance boundaries', () => {
        const prompt = buildSystemPrompt({ VCMS_INTERNAL_KNOWLEDGE: { 'brain.md': 'x' } });
        expect(prompt).toContain('READ-ONLY');
        expect(prompt).toContain('Agent OS');
    });
});
