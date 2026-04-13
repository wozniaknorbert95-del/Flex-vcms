const fs = require('fs');
const path = require('path');

const scanDocsRecursively = (dir, baseDir = '') => {
    let results = {};
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.join(baseDir, file).replace(/\\/g, '/');
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            if (file !== '.vitepress' && file !== 'node_modules') {
                Object.assign(results, scanDocsRecursively(filePath, relativePath));
            }
        } else if (file.endsWith('.md')) {
            try {
                results[relativePath] = fs.readFileSync(filePath, 'utf8');
            } catch (e) {
                results[relativePath] = '[BŁĄD ODCZYTU]';
            }
        }
    });
    return results;
};

const getContextData = (vcmsBase, githubBase) => {
    const getFile = (p) => {
        try { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '[BRAK PLIKU LUB PUSTY]'; }
        catch(e) { return '[BŁĄD ODCZYTU: Zablokowano]'; }
    };
    
    const vcmsDocs = scanDocsRecursively(path.join(vcmsBase, 'docs'));

    return {
        "VCMS_INTERNAL_KNOWLEDGE": vcmsDocs,
        "PROJECT_CONTEXT_flexgrafik_nl": {
            "brain.md": getFile(path.join(githubBase, 'flexgrafik-nl', 'brain.md')),
            "todo.json": getFile(path.join(githubBase, 'flexgrafik-nl', 'todo.json'))
        },
        "PROJECT_CONTEXT_app_flexgrafik_nl": {
            "brain.md": getFile(path.join(githubBase, 'app.flexgrafik.nl', 'brain.md')),
            "todo.json": getFile(path.join(githubBase, 'app.flexgrafik.nl', 'todo.json'))
        },
        "PROJECT_CONTEXT_zzpackage": {
            "MASTER-BRAIN.md": getFile(path.join(githubBase, 'zzpackage.flexgrafik.nl', 'MASTER-BRAIN.md')),
            "docs/audit-todo.json": getFile(path.join(githubBase, 'zzpackage.flexgrafik.nl', 'docs', 'audit-todo.json'))
        },
        "PROJECT_CONTEXT_jadzia_core": {
            "brain.md": getFile(path.join(githubBase, 'jadzia-core', 'brain.md')),
            "todo.json": getFile(path.join(githubBase, 'jadzia-core', 'todo.json'))
        },
        "PROJECT_CONTEXT_flexgrafik_meta": {
            "docs/core/master-plan.md": getFile(path.join(githubBase, 'flexgrafik-meta', 'docs', 'core', 'master-plan.md')),
            "todo.json": getFile(path.join(githubBase, 'flexgrafik-meta', 'todo.json'))
        }
    };
};

module.exports = { getContextData };
