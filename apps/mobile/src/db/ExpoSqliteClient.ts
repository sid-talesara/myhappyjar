import type { DatabaseClient } from '@myhappyjar/core';
import type { SQLiteDatabase } from 'expo-sqlite';

export function createExpoSqliteClient(db: SQLiteDatabase): DatabaseClient {
  return {
    execute<T = unknown>(sql: string, args: unknown[] = []): { rows: T[] } {
      const rows = db.getAllSync<T>(sql, args as never[]);
      return { rows };
    },
    run(sql: string, args: unknown[] = []) {
      const res = db.runSync(sql, args as never[]);
      return { changes: res.changes, lastInsertRowid: res.lastInsertRowId };
    },
  };
}
