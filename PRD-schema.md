# PRD-schema.md — VCMS Database Schema (Audit 3.0)

## System: Flex-VCMS Knowledge & Persistent Store
**Engine**: SQLite (`data/vcms.db`)
**Driver**: `better-sqlite3`

---

## 1. Table: `knowledge_index`
Stores metadata and location of knowledge files across the ecosystem.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| `repo_id` | TEXT | NOT NULL | Module identifier (e.g., 'zzpackage') |
| `file_path` | TEXT | NOT NULL | Relative path to the file |
| `file_name` | TEXT | NOT NULL | Basename of the file |
| `content_hash` | TEXT | | SHA-256 hash to detect changes |
| `summary` | TEXT | | AI-generated summary of the content (cache) |
| `category` | TEXT | | e.g., 'doc', 'core', 'rule' |
| `last_updated` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last sync time |

**Constraints**:
- `UNIQUE(repo_id, file_path)`: Prevents duplicate entries for the same file in a specific module.

---

## 2. Table: `repos`
Canonical metadata for all scanned repositories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique module name (e.g., 'zzpackage') |
| `path` | TEXT | NOT NULL | Absolute local path to the repo |
| `type` | TEXT | | e.g., 'front', 'core', 'meta' |
| `last_scan` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last time this repo was indexed |

---

## 3. Table: `rate_limits` (Future-proofing for SEC-024)
Persistent store for API rate limiting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `ip` | TEXT | PRIMARY KEY | User IP address |
| `hits` | INTEGER | DEFAULT 1 | Count of requests |
| `reset_time` | INTEGER | NOT NULL | Timestamp when the window resets |

---

## 3. Implementation Notes
- The database file will reside in `data/vcms.db`.
- Initialize using a singleton `src/database/instance.js`.
- Index sync logic will be triggered in `tools/vcms-scan.js`.
