const fs = require('fs').promises;
const path = require('path');
const db = require('../database/instance');

const safeExists = async (p) => {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
};

/**
 * Selective context loading using SQLite index to avoid event loop blocking
 * and excessive disk crawling.
 */
const getEssentialKnowledge = async (vcmsBase) => {
    const essential = {};
    
    try {
        // Query critical files from the index
        const criticalFiles = db.prepare(`
            SELECT file_path, repo_id 
            FROM knowledge_index 
            WHERE repo_id = 'flex-vcms' AND (
                file_name IN ('index.md', 'brain.md', 'PORADNIK_UZYTKOWNIKA.md', 'system-evolution.md', 'global-rules.md')
                OR file_path LIKE 'core/%.md'
            )
            OR (category = 'HANDOFF' AND repo_id = 'flex-vcms')
            ORDER BY last_updated DESC
        `).all();

        const handoffs = criticalFiles.filter(f => f.file_path.includes('handoffs')).slice(0, 3);
        const docs = criticalFiles.filter(f => !f.file_path.includes('handoffs'));
        
        const toLoad = [...docs, ...handoffs];

        if (toLoad.length > 0) {
            for (const file of toLoad) {
                const fullPath = path.join(vcmsBase, file.file_path);
                try {
                    const content = await fs.readFile(fullPath, 'utf8');
                    essential[file.file_path] = content;
                } catch (e) {}
            }
            return essential;
        }
    } catch (err) {
        console.error('[Context DB Error]', err);
    }

    // --- Fallback: Manual Disk Scan (e.g. on VPS without indexed DB) ---
    const docsDir = path.join(vcmsBase, 'docs');
    const getFile = async (relPath) => {
        const fullPath = path.join(docsDir, relPath);
        if (await safeExists(fullPath)) {
            const st = await fs.stat(fullPath);
            if (st.isFile()) return await fs.readFile(fullPath, 'utf8');
        }
        return null;
    };

    const rootFiles = ['index.md', 'brain.md', 'PORADNIK_UZYTKOWNIKA.md', 'system-evolution.md', 'core/global-rules.md'];
    for (const f of rootFiles) {
        const content = await getFile(f);
        if (content) essential[f] = content;
    }

    const handoffsDir = path.join(docsDir, 'handoffs');
    if (await safeExists(handoffsDir)) {
        const files = await fs.readdir(handoffsDir);
        const handoffs = files.filter(f => f.endsWith('.md')).sort().reverse().slice(0, 3);
        for (const f of handoffs) {
            const content = await getFile(path.join('handoffs', f));
            if (content) essential[`handoffs/${f}`] = content;
        }
    }

    return essential;
};

const getContextData = async (vcmsBase, githubBase) => {
    const internalKnowledge = await getEssentialKnowledge(vcmsBase);
    
    // Check for "Consolidated Mode" (VPS/Atomic Deploy)
    const contextDir = path.join(vcmsBase, 'deploy-context');
    const manifestPath = path.join(contextDir, 'manifest.json');

    if (await safeExists(manifestPath)) {
        try {
            const raw = await fs.readFile(manifestPath, 'utf8');
            const manifest = JSON.parse(raw);
            const consolidated = {
                "VCMS_INTERNAL_KNOWLEDGE": internalKnowledge,
                "GENERATED_AT": manifest.generated_at,
                "ORIGIN": manifest.origin
            };

            for (const mod of manifest.modules) {
                const modKey = `PROJECT_CONTEXT_${mod.name.replace(/[\.\-]/g, '_')}`;
                const brainPath = path.join(contextDir, mod.name, mod.brain);
                const todoPath = path.join(contextDir, mod.name, mod.todo);
                
                consolidated[modKey] = {
                    [mod.brain]: await safeExists(brainPath) ? await fs.readFile(brainPath, 'utf8') : '[BRAK BRAIN]',
                    [mod.todo]: await safeExists(todoPath) ? await fs.readFile(todoPath, 'utf8') : '[BRAK TODO]'
                };
            }
            return consolidated;
        } catch (e) {
            console.error(`[Context Error] Manifest parse failed: ${e.message}`);
        }
    }

    // --- Dynamic Resolution via SQLite (Audit 3.0) ---
    const consolidated = {
        "VCMS_INTERNAL_KNOWLEDGE": internalKnowledge
    };

    try {
        // Get all critical project files (BRAIN/TODO) from all registered repos
        const files = db.prepare(`
            SELECT k.repo_id, k.file_path, k.file_name, k.category, r.path as repo_root
            FROM knowledge_index k
            JOIN repos r ON k.repo_id = r.id
            WHERE k.category IN ('BRAIN', 'TODO')
        `).all();

        for (const f of files) {
            const modKey = `PROJECT_CONTEXT_${f.repo_id.replace(/[\.\-]/g, '_')}`;
            if (!consolidated[modKey]) consolidated[modKey] = {};
            
            const fullPath = path.join(f.repo_root, f.file_path);
            try {
                consolidated[modKey][f.file_path] = await fs.readFile(fullPath, 'utf8');
            } catch (e) {
                consolidated[modKey][f.file_path] = `[ERROR_READING: ${f.file_path}]`;
            }
        }
        return consolidated;
    } catch (e) {
        console.error('[Context SQLite Fallback Error]', e);
        // If DB fails, return partial context
        return consolidated;
    }
};

module.exports = { getContextData };
