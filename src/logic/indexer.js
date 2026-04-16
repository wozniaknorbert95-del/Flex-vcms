const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../database/instance');
const { winLogger } = require('../middleware/logger');

class KnowledgeIndexer {
    constructor() {
        this.db = db;
    }

    /**
     * Calculate SHA-256 hash of a file
     */
    getFileHash(filePath) {
        try {
            if (!fs.existsSync(filePath)) return null;
            const content = fs.readFileSync(filePath);
            return crypto.createHash('sha256').update(content).digest('hex');
        } catch (err) {
            winLogger.error(`Hash calculation failed for ${filePath}:`, err);
            return null;
        }
    }

    /**
     * Index a single file
     */
    indexFile(repoId, relativePath, absolutePath, category = 'doc') {
        const h = this.getFileHash(absolutePath);
        if (!h) return;

        const fileName = path.basename(relativePath);
        
        const upsert = this.db.prepare(`
            INSERT INTO knowledge_index (repo_id, file_path, file_name, content_hash, category)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(repo_id, file_path) DO UPDATE SET
                content_hash = excluded.content_hash,
                last_updated = CURRENT_TIMESTAMP
        `);

        try {
            upsert.run(repoId, relativePath, fileName, h, category);
            winLogger.debug(`Indexed: [${repoId}] ${relativePath}`);
        } catch (err) {
            winLogger.error(`Indexing failed for ${relativePath}:`, err);
        }
    }

    /**
     * Get all indexed files for a repo
     */
    getRepoIndex(repoId) {
        return this.db.prepare('SELECT * FROM knowledge_index WHERE repo_id = ?').all(repoId);
    }

    /**
     * Search knowledge by query (simple LIKE for now, can be improved to FTS5 later)
     */
    search(query) {
        return this.db.prepare(`
            SELECT * FROM knowledge_index 
            WHERE file_name LIKE ? OR summary LIKE ? OR category LIKE ?
        `).all(`%${query}%`, `%${query}%`, `%${query}%`);
    }

    /**
     * Clean up missing files from index
     */
    purgeMissing(repoId, existingPaths) {
        if (!existingPaths || existingPaths.length === 0) return;
        
        const placeholders = existingPaths.map(() => '?').join(',');
        const stmt = this.db.prepare(`
            DELETE FROM knowledge_index 
            WHERE repo_id = ? AND file_path NOT IN (${placeholders})
        `);
        
        stmt.run(repoId, ...existingPaths);
    }
}

module.exports = new KnowledgeIndexer();
