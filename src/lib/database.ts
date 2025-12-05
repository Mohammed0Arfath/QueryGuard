// IndexedDB wrapper for storing query logs
// Provides persistent storage in the browser

const DB_NAME = 'MedicalQueryFirewall';
const DB_VERSION = 1;
const STORE_NAME = 'queryLogs';

export interface StoredLogEntry {
  id: string;
  timestamp: string;
  query: string;
  decision: 'allowed' | 'blocked';
  classifier_prob: number;
  rule_matches: string[];
  user_id: string;
  session_id: string;
  llm_response?: string;
  explanation?: string;
}

class LogDatabase {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  // Initialize the database
  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('decision', 'decision', { unique: false });
          console.log('Created object store:', STORE_NAME);
        }
      };
    });

    return this.initPromise;
  }

  // Add a new log entry
  async addLog(log: StoredLogEntry): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(log);

      request.onsuccess = () => {
        console.log('Log added:', log.id);
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to add log:', request.error);
        reject(request.error);
      };
    });
  }

  // Get all logs, sorted by timestamp (newest first)
  async getAllLogs(limit?: number): Promise<StoredLogEntry[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev'); // Descending order

      const logs: StoredLogEntry[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor && (!limit || logs.length < limit)) {
          logs.push(cursor.value);
          cursor.continue();
        } else {
          resolve(logs);
        }
      };

      request.onerror = () => {
        console.error('Failed to fetch logs:', request.error);
        reject(request.error);
      };
    });
  }

  // Get logs by decision type
  async getLogsByDecision(decision: 'allowed' | 'blocked'): Promise<StoredLogEntry[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('decision');
      const request = index.getAll(decision);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to fetch logs by decision:', request.error);
        reject(request.error);
      };
    });
  }

  // Get analytics data
  async getAnalytics(): Promise<{
    total: number;
    allowed: number;
    blocked: number;
    topRules: { rule: string; count: number }[];
  }> {
    const logs = await this.getAllLogs();
    
    const allowed = logs.filter(log => log.decision === 'allowed').length;
    const blocked = logs.filter(log => log.decision === 'blocked').length;
    
    // Count rule occurrences
    const ruleCount = new Map<string, number>();
    logs.forEach(log => {
      log.rule_matches.forEach(rule => {
        ruleCount.set(rule, (ruleCount.get(rule) || 0) + 1);
      });
    });

    // Sort and get top rules
    const topRules = Array.from(ruleCount.entries())
      .map(([rule, count]) => ({ rule, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: logs.length,
      allowed,
      blocked,
      topRules,
    };
  }

  // Clear all logs (for testing/reset)
  async clearAllLogs(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All logs cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to clear logs:', request.error);
        reject(request.error);
      };
    });
  }

  // Delete a specific log
  async deleteLog(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Log deleted:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to delete log:', request.error);
        reject(request.error);
      };
    });
  }

  // Get count of logs
  async getLogCount(): Promise<number> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to get log count:', request.error);
        reject(request.error);
      };
    });
  }
}

// Export singleton instance
export const logDB = new LogDatabase();

// Helper function to generate session ID
let currentSessionId: string | null = null;

export function getSessionId(): string {
  if (!currentSessionId) {
    currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return currentSessionId;
}

// Helper function to generate user ID (stored in localStorage)
export function getUserId(): string {
  let userId = localStorage.getItem('medicalQueryFirewall_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('medicalQueryFirewall_userId', userId);
  }
  return userId;
}
