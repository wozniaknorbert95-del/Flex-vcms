const fs = require('fs').promises;
const path = require('path');

const safeExists = async (p) => {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
};

/**
 * Selective context loading to avoid hitting 
 * token limits and causing timeouts.
 * Fully Asynchronous to prevent event loop blocking.
 */
const getEssentialKnowledge = async (vcmsBase) => {
    const docsDir = path.join(vcmsBase, 'docs');
    const essential = {};

    const getFile = async (relPath) => {
        const fullPath = path.join(docsDir, relPath);
        if (await safeExists(fullPath)) {
            const st = await fs.stat(fullPath);
            if (st.isFile()) {
                return await fs.readFile(fullPath, 'utf8');
            }
        }
        return null;
    };

    // 1. Root Core Docs
    const rootFiles = ['index.md', 'brain.md', 'PORADNIK_UZYTKOWNIKA.md', 'system-evolution.md'];
    for (const f of rootFiles) {
        const content = await getFile(f);
        if (content) essential[f] = content;
    }

    // 2. Core Specifications
    const coreDir = path.join(docsDir, 'core');
    if (await safeExists(coreDir)) {
        const files = await fs.readdir(coreDir);
        for (const f of files) {
            if (f.endsWith('.md')) {
                const content = await getFile(path.join('core', f));
                if (content) essential[`core/${f}`] = content;
            }
        }
    }

    // 3. Recent Handoffs (Last 3)
    const handoffsDir = path.join(docsDir, 'handoffs');
    if (await safeExists(handoffsDir)) {
        const files = await fs.readdir(handoffsDir);
        const handoffs = files
            .filter(f => f.endsWith('.md'))
            .sort()
            .reverse()
            .slice(0, 3);
        
        for (const f of handoffs) {
            const content = await getFile(path.join('handoffs', f));
            if (content) essential[`handoffs/${f}`] = content;
        }
    }

    return essential;
};

const getContextData = async (vcmsBase, githubBase) => {
    const getFile = async (p) => {
        try { 
            if (await safeExists(p)) return await fs.readFile(p, 'utf8');
            return '[BRAK PLIKU LUB PUSTY]';
        }
        catch(e) { return '[BŁĄD ODCZYTU: Zablokowano]'; }
    };
    
    // Check if we are running in "Consolidated Mode" (VPS or local with deploy-context)
    const contextDir = path.join(vcmsBase, 'deploy-context');
    const manifestPath = path.join(contextDir, 'manifest.json');
    
    const internalKnowledge = await getEssentialKnowledge(vcmsBase);

    if (await safeExists(manifestPath)) {
        try {
            const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
            const consolidated = {
                "VCMS_INTERNAL_KNOWLEDGE": internalKnowledge,
                "GENERATED_AT": manifest.generated_at,
                "ORIGIN": manifest.origin
            };

            for (const mod of manifest.modules) {
                const modKey = `PROJECT_CONTEXT_${mod.name.replace(/[\.\-]/g, '_')}`;
                consolidated[modKey] = {

                    [mod.brain]: await getFile(path.join(contextDir, mod.name, mod.brain)),
                    [mod.todo]: await getFile(path.join(contextDir, mod.name, mod.todo))
                };
            }
            return consolidated;
        } catch (e) {
            console.error(`[Context Error] Failed to parse manifest: ${e.message}`);
        }
    }

    // Fallback: Legacy / Developer Mode (relative paths)
    return {
        "VCMS_INTERNAL_KNOWLEDGE": internalKnowledge,
        "PROJECT_CONTEXT_flexgrafik_nl": {
            "brain.md": await getFile(path.join(githubBase, 'flexgrafik-nl', 'brain.md')),
            "todo.json": await getFile(path.join(githubBase, 'flexgrafik-nl', 'todo.json'))
        },
        "PROJECT_CONTEXT_app_flexgrafik_nl": {
            "brain.md": await getFile(path.join(githubBase, 'app.flexgrafik.nl', 'brain.md')),
            "todo.json": await getFile(path.join(githubBase, 'app.flexgrafik.nl', 'todo.json'))
        },
        "PROJECT_CONTEXT_zzpackage": {
            "MASTER-BRAIN.md": await getFile(path.join(githubBase, 'zzpackage.flexgrafik.nl', 'MASTER-BRAIN.md')),
            "docs/audit-todo.json": await getFile(path.join(githubBase, 'zzpackage.flexgrafik.nl', 'docs', 'audit-todo.json'))
        },
        "PROJECT_CONTEXT_jadzia_core": {
            "brain.md": await getFile(path.join(githubBase, 'jadzia-core', 'brain.md')),
            "todo.json": await getFile(path.join(githubBase, 'jadzia-core', 'todo.json'))
        },
        "PROJECT_CONTEXT_flexgrafik_meta": {
            "docs/core/master-plan.md": await getFile(path.join(githubBase, 'flexgrafik-meta', 'docs', 'core', 'master-plan.md')),
            "todo.json": await getFile(path.join(githubBase, 'flexgrafik-meta', 'todo.json'))
        }
    };
};

module.exports = { getContextData };
