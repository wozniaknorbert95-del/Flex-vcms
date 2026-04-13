const fs = require('fs');
const path = require('path');

// Configuration
const REPOS_YAML_PATH = path.join(__dirname, '..', 'repos.yaml');
const TODO_JSON_PATH = path.join(__dirname, '..', 'flex-vcms-todo.json');
const CONTEXT_DIR = path.join(__dirname, '..', 'deploy-context');

function sync() {
    console.log('[VCMS Sync] Starting Senior Context Sync...');

    // 1. Create/Clear deploy-context
    if (fs.existsSync(CONTEXT_DIR)) {
        fs.rmSync(CONTEXT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(CONTEXT_DIR, { recursive: true });

    // 2. Update flex-vcms-todo.json (Admin move)
    if (fs.existsSync(TODO_JSON_PATH)) {
        try {
            const todo = JSON.parse(fs.readFileSync(TODO_JSON_PATH, 'utf8'));
            todo.meta.updated = new Date().toISOString();
            todo.meta.last_deploy_origin = require('os').hostname();
            fs.writeFileSync(TODO_JSON_PATH, JSON.stringify(todo, null, 2));
            console.log(`[VCMS Sync] Updated flex-vcms-todo.json metadata (${todo.meta.updated})`);
        } catch (e) {
            console.warn(`[VCMS Sync] Warning: Could not update todo.json: ${e.message}`);
        }
    }

    // 3. Load Repos (Senior Robust Parsing)
    const reposRaw = fs.readFileSync(REPOS_YAML_PATH, 'utf8');
    const manifest = {
        generated_at: Date.now(),
        origin: require('os').hostname(),
        modules: []
    };

    // Standard patterns for brain/todo
    const moduleFiles = [
        { type: 'brain', names: ['MASTER-BRAIN.md', 'brain.md', 'docs/core/master-plan.md', 'docs/brain.md'] },
        { type: 'todo', names: ['docs/audit-todo.json', 'todo.json', 'flex-vcms-todo.json'] }
    ];

    const repoBlocks = reposRaw.split('- name:').slice(1);
    
    repoBlocks.forEach(block => {
        const nameMatch = block.match(/"([^"]+)"/);
        const pathMatch = block.match(/path:\s*"([^"]+)"/);
        
        if (nameMatch && pathMatch) {
            const name = nameMatch[1];
            // Normalize path for current OS
            let repoPath = path.normalize(pathMatch[1]);
            
            // If path is not absolute, resolve from current directory (common for flex-vcms itself)
            if (!path.isAbsolute(repoPath)) {
                repoPath = path.resolve(__dirname, '..', repoPath);
            }
            
            if (!fs.existsSync(repoPath)) {
                console.warn(`[VCMS Sync] Target path missing for ${name}: ${repoPath}`);
                return;
            }

            const moduleEntry = { name, brain: null, todo: null };
            const moduleSubDir = path.join(CONTEXT_DIR, name);
            if (!fs.existsSync(moduleSubDir)) fs.mkdirSync(moduleSubDir, { recursive: true });

            moduleFiles.forEach(fType => {
                const found = fType.names.find(n => fs.existsSync(path.join(repoPath, n)));
                if (found) {
                    const src = path.join(repoPath, found);
                    const destName = path.basename(found);
                    
                    try {
                        fs.copyFileSync(src, path.join(moduleSubDir, destName));
                        moduleEntry[fType.type] = destName;
                    } catch (err) {
                        console.error(`[VCMS Sync] Error copying ${src}: ${err.message}`);
                    }
                }
            });

            if (moduleEntry.brain || moduleEntry.todo) {
                manifest.modules.push(moduleEntry);
                console.log(`[VCMS Sync] Bundled context for: ${name}`);
            }
        }
    });

    // 4. Save manifest
    fs.writeFileSync(path.join(CONTEXT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('[VCMS Sync] Context manifest generated successfully.');
}

try {
    sync();
} catch (err) {
    console.error(`[VCMS Sync] Fatal error: ${err.message}`);
    process.exit(1);
}
