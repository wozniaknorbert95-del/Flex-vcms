const fs = require('fs').promises;
const path = require('path');
const { getContextData } = require('../src/logic/context');

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
