const db = require('../src/database/instance');
const fs = require('fs');
const path = require('path');

async function sync() {
    try {
        const manifestPath = './deploy-context/manifest.json';
        if (!fs.existsSync(manifestPath)) {
            console.error('Manifest not found at', manifestPath);
            process.exit(1);
        }

        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const stmt = db.prepare('INSERT OR REPLACE INTO knowledge_index (repo_id, file_path, file_name, category) VALUES (?, ?, ?, ?)');

        manifest.modules.forEach(mod => {
            const brainPath = path.join('deploy-context', mod.name, mod.brain);
            const brainRel = brainPath.replace(/\\/g, '/');
            if (fs.existsSync(brainPath)) {
                stmt.run(mod.name, brainRel, mod.brain, 'BRAIN');
                console.log(`Indexed BRAIN for ${mod.name}: ${brainRel}`);
            }

            const todoPath = path.join('deploy-context', mod.name, mod.todo);
            const todoRel = todoPath.replace(/\\/g, '/');
            if (fs.existsSync(todoPath)) {
                stmt.run(mod.name, todoRel, mod.todo, 'TODO');
                console.log(`Indexed TODO for ${mod.name}: ${todoRel}`);
            }
        });

        const count = db.prepare('SELECT count(*) as count FROM knowledge_index').get().count;
        console.log(`Sync complete. Total records: ${count}`);
    } catch (err) {
        console.error('Sync failed:', err);
    } finally {
        db.close();
    }
}

sync();
