const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { winLogger } = require('../middleware/logger');

const DB_PATH = path.join(__dirname, '../../data/vcms.db');
const DATA_DIR = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db;

try {
    db = new Database(DB_PATH, { verbose: (msg) => winLogger.debug(msg) });
    db.pragma('journal_mode = WAL'); // High performance mode
    
    // Initialize Schema
    db.exec(`
        CREATE TABLE IF NOT EXISTS knowledge_index (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            repo_id TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_name TEXT NOT NULL,
            content_hash TEXT,
            summary TEXT,
            category TEXT,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(repo_id, file_path)
        );

        CREATE TABLE IF NOT EXISTS repos (
            id TEXT PRIMARY KEY,
            path TEXT NOT NULL,
            type TEXT,
            last_scan DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS rate_limits (
            ip TEXT PRIMARY KEY,
            hits INTEGER DEFAULT 1,
            reset_time INTEGER NOT NULL
        );
    `);

    winLogger.info(`SQLite Database initialized at ${DB_PATH}`);
} catch (err) {
    winLogger.error('Failed to initialize SQLite database:', err);
    throw err;
}

module.exports = db;
