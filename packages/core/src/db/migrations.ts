import { DatabaseClient } from '../types/DatabaseClient';
import {
  CREATE_JARS_TABLE,
  CREATE_NOTES_TABLE,
  CREATE_PREFERENCES_TABLE,
  CREATE_PROMPTS_TABLE,
  CREATE_RESTRICTED_REVEALS_TABLE,
  CREATE_STREAK_SUMMARY_TABLE,
} from './schema';

export interface Migration {
  version: number;
  description: string;
  up: (db: DatabaseClient) => void;
}

export const migrations: Migration[] = [
  {
    version: 1,
    description: 'Create initial schema: jars, notes, restricted_reveals, streak_summary, prompts, preferences',
    up(db) {
      db.run(CREATE_JARS_TABLE);
      db.run(CREATE_NOTES_TABLE);
      db.run(CREATE_RESTRICTED_REVEALS_TABLE);
      db.run(CREATE_STREAK_SUMMARY_TABLE);
      db.run(CREATE_PROMPTS_TABLE);
      db.run(CREATE_PREFERENCES_TABLE);
      // Seed singleton streak_summary row
      db.run(`INSERT OR IGNORE INTO streak_summary (id, current_streak, longest_streak, last_completed_date_key) VALUES (1, 0, 0, NULL)`);
      // Seed singleton preferences row
      db.run(`INSERT OR IGNORE INTO preferences (id) VALUES (1)`);
    },
  },
];

/**
 * Run all pending migrations against the given DatabaseClient.
 * Uses a simple `user_version` PRAGMA to track applied version.
 */
export function runMigrations(db: DatabaseClient): void {
  const result = db.execute<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result.rows[0]?.user_version ?? 0;

  const pending = migrations.filter((m) => m.version > currentVersion);
  for (const migration of pending) {
    migration.up(db);
    db.run(`PRAGMA user_version = ${migration.version}`);
  }
}
