/**
 * tools/vcms-sync-db.js
 * Synchronizes the filesystem state with the SQLite Knowledge Index.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const indexer = require('../src/logic/indexer');
const db = require('../src/database/instance');
const { winLogger } = require('../src/middleware/logger');

const VCMS_ROOT = path.resolve(__dirname, '..');
const REPOS_YAML = path.join(VCMS_ROOT, 'repos.yaml');

async function syncAll() {
    winLogger.info('Starting Knowledge Index Sync (SQLite)...');
    
    try {
        const yamlText = fs.readFileSync(REPOS_YAML, 'utf8');
        const config = yaml.load(yamlText);
        const repos = config.repos || [];

        for (const repo of repos) {
            const repoPath = path.resolve(repo.path);
            if (!fs.existsSync(repoPath)) {
                winLogger.warn(`Repo path not found: ${repoPath}`);
                continue;
            }

            winLogger.info(`Indexing Repo: ${repo.name}`);
            
            // Sync Repo metadata
            const upsertRepo = db.prepare(`
                INSERT INTO repos (id, path, type) VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET path = excluded.path, type = excluded.type, last_scan = CURRENT_TIMESTAMP
            `);
            upsertRepo.run(repo.name, repoPath, repo.type || null);

            const indexedPaths = [];

            // 1. Index Brain and Todo (Canonical)
            if (repo.canonical_brain) {
                const brainPath = path.join(repoPath, repo.canonical_brain.path);
                if (fs.existsSync(brainPath)) {
                    indexer.indexFile(repo.name, repo.canonical_brain.path, brainPath, 'BRAIN');
                    indexedPaths.push(repo.canonical_brain.path);
                }
            }

            if (repo.canonical_todo) {
                const todoPath = path.join(repoPath, repo.canonical_todo.path);
                if (fs.existsSync(todoPath)) {
                    indexer.indexFile(repo.name, repo.canonical_todo.path, todoPath, 'TODO');
                    indexedPaths.push(repo.canonical_todo.path);
                }
            }

            // 2. Index documentation (docs folder)
            const docsDir = path.join(repoPath, 'docs');
            if (fs.existsSync(docsDir)) {
                indexRecursive(repo.name, docsDir, repoPath, indexedPaths);
            }

            // 3. Purge missing files from DB for this repo
            indexer.purgeMissing(repo.name, indexedPaths);
        }

        winLogger.info('Knowledge Index Sync Complete.');
    } catch (err) {
        winLogger.error('Sync failed:', err);
        process.exit(1);
    } finally {
        try {
            db.close();
            winLogger.debug('SQLite connection closed.');
        } catch (e) {}
    }
}

/**
 * Helper to index files recursively with depth limit
 */
function indexRecursive(repoId, currentDir, rootDir, indexedPaths, depth = 0) {
    if (depth > 3) return; // Limit depth

    const files = fs.readdirSync(currentDir);
    for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const relPath = path.relative(rootDir, fullPath);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Ignore common junk
            if (['node_modules', '.git', 'archive'].includes(file)) continue;
            indexRecursive(repoId, fullPath, rootDir, indexedPaths, depth + 1);
        } else if (file.endsWith('.md') || file.endsWith('.json')) {
            let category = 'DOC';
            if (relPath.includes('handoffs')) category = 'HANDOFF';
            
            indexer.indexFile(repoId, relPath, fullPath, category);
            indexedPaths.push(relPath);
        }
    }
}

syncAll();
