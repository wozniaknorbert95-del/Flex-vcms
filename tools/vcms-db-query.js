const db = require('../src/database/instance');

const query = process.argv[2] || 'SELECT repo_id, COUNT(*) as count FROM knowledge_index GROUP BY repo_id';

try {
    const rows = db.prepare(query).all();
    console.table(rows);
} catch (err) {
    console.error('Query failed:', err.message);
} finally {
    db.close();
}
