/**
 * Database Operations Module (sql.js version)
 * Pure JavaScript SQLite implementation - no C++ compilation required
 */

import initSqlJs from 'sql.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, 'database.sqlite');

let SQL = null;
let db = null;

/**
 * Initialize database
 */
async function initDb() {
  if (db) return db;

  // Initialize SQL.js
  SQL = await initSqlJs();

  // Load existing database or create new one
  let buffer = null;
  if (fs.existsSync(dbPath)) {
    buffer = fs.readFileSync(dbPath);
  }

  db = new SQL.Database(buffer);

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS query_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      query TEXT NOT NULL,
      decision TEXT NOT NULL CHECK(decision IN ('allowed', 'blocked')),
      classifier_prob REAL NOT NULL,
      rule_matches TEXT NOT NULL,
      user_id TEXT,
      session_id TEXT,
      llm_response TEXT,
      explanation TEXT,
      ip_address TEXT,
      user_agent TEXT
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_timestamp ON query_logs(timestamp DESC);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_decision ON query_logs(decision);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_session ON query_logs(session_id);`);

  console.log(`✅ Database initialized: ${dbPath}`);
  return db;
}

/**
 * Save database to disk
 */
function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, data);
}

/**
 * Database operations
 */
export const dbOps = {
  /**
   * Initialize database (must be called before other operations)
   */
  async init() {
    await initDb();
  },

  /**
   * Add a query log entry
   */
  addLog(log) {
    if (!db) throw new Error('Database not initialized');

    const {
      id,
      timestamp,
      query,
      decision,
      classifier_prob,
      rule_matches,
      user_id = null,
      session_id = null,
      llm_response = null,
      explanation = null,
      ip_address = null,
      user_agent = null,
    } = log;

    db.run(
      `INSERT INTO query_logs (
        id, timestamp, query, decision, classifier_prob, rule_matches,
        user_id, session_id, llm_response, explanation, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        timestamp,
        query,
        decision,
        classifier_prob,
        JSON.stringify(rule_matches),
        user_id,
        session_id,
        llm_response,
        explanation,
        ip_address,
        user_agent,
      ]
    );

    // Save to disk after each insert
    saveDb();

    return { success: true, id };
  },

  /**
   * Get recent logs
   */
  getLogs(limit = 50) {
    if (!db) throw new Error('Database not initialized');

    const stmt = db.prepare(
      `SELECT * FROM query_logs 
       ORDER BY timestamp DESC 
       LIMIT ?`
    );

    stmt.bind([limit]);

    const logs = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      logs.push({
        ...row,
        rule_matches: JSON.parse(row.rule_matches || '[]'),
      });
    }

    stmt.free();
    return logs;
  },

  /**
   * Get logs by session ID
   */
  getLogsBySession(sessionId, limit = 50) {
    if (!db) throw new Error('Database not initialized');

    const stmt = db.prepare(
      `SELECT * FROM query_logs 
       WHERE session_id = ?
       ORDER BY timestamp DESC 
       LIMIT ?`
    );

    stmt.bind([sessionId, limit]);

    const logs = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      logs.push({
        ...row,
        rule_matches: JSON.parse(row.rule_matches || '[]'),
      });
    }

    stmt.free();
    return logs;
  },

  /**
   * Get analytics summary
   */
  getAnalytics() {
    if (!db) throw new Error('Database not initialized');

    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN decision = 'allowed' THEN 1 ELSE 0 END) as allowed,
        SUM(CASE WHEN decision = 'blocked' THEN 1 ELSE 0 END) as blocked,
        AVG(classifier_prob) as avgConfidence
      FROM query_logs
    `);

    stmt.step();
    const result = stmt.getAsObject();
    stmt.free();

    return {
      total: result.total || 0,
      allowed: result.allowed || 0,
      blocked: result.blocked || 0,
      avgConfidence: result.avgConfidence || 0,
    };
  },

  /**
   * Get total log count
   */
  getLogCount() {
    if (!db) throw new Error('Database not initialized');

    const stmt = db.prepare('SELECT COUNT(*) as count FROM query_logs');
    stmt.step();
    const result = stmt.getAsObject();
    stmt.free();

    return result.count || 0;
  },

  /**
   * Clear all logs (development only)
   */
  clearLogs() {
    if (!db) throw new Error('Database not initialized');

    db.run('DELETE FROM query_logs');
    saveDb();

    return { success: true, message: 'All logs cleared' };
  },

  /**
   * Close database connection
   */
  close() {
    if (db) {
      saveDb();
      db.close();
      db = null;
      console.log('✅ Database connection closed');
    }
  },
};

export default dbOps;
