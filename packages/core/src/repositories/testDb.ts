import Database from 'better-sqlite3';
import { DatabaseClient } from '../types/DatabaseClient';

/**
 * Creates an in-memory better-sqlite3 database wrapped in DatabaseClient.
 * Used only in tests — never imported by the mobile app.
 */
export function createTestDb(): DatabaseClient {
  const sqlite = new Database(':memory:');

  return {
    execute<T = unknown>(sql: string, args: unknown[] = []): { rows: T[] } {
      const stmt = sqlite.prepare(sql);
      // PRAGMA statements return a single row via .get(); SELECT returns array via .all()
      const isPragma = sql.trim().toUpperCase().startsWith('PRAGMA');
      if (isPragma) {
        const row = stmt.get(...args) as T | undefined;
        return { rows: row !== undefined ? [row] : [] };
      }
      const rows = stmt.all(...args) as T[];
      return { rows };
    },
    run(sql: string, args: unknown[] = []): { changes: number; lastInsertRowid: number | bigint } {
      const stmt = sqlite.prepare(sql);
      const info = stmt.run(...args);
      return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    },
  };
}
