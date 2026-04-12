import { createTestDb } from '../repositories/testDb';
import { runMigrations } from './migrations';

describe('migrations', () => {
  it('creates all 6 tables', () => {
    const db = createTestDb();
    runMigrations(db);

    const tables = db.execute<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
    ).rows.map((r) => r.name);

    expect(tables).toContain('jars');
    expect(tables).toContain('notes');
    expect(tables).toContain('restricted_reveals');
    expect(tables).toContain('streak_summary');
    expect(tables).toContain('prompts');
    expect(tables).toContain('preferences');
  });

  it('seeds singleton streak_summary row', () => {
    const db = createTestDb();
    runMigrations(db);

    const rows = db.execute<{ id: number; current_streak: number }>('SELECT * FROM streak_summary').rows;
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(1);
    expect(rows[0].current_streak).toBe(0);
  });

  it('seeds singleton preferences row', () => {
    const db = createTestDb();
    runMigrations(db);

    const rows = db.execute<{ id: number; haptics_enabled: number }>('SELECT * FROM preferences').rows;
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(1);
    expect(rows[0].haptics_enabled).toBe(1);
  });

  it('tracks user_version after migration', () => {
    const db = createTestDb();
    runMigrations(db);

    const result = db.execute<{ user_version: number }>('PRAGMA user_version').rows;
    expect(result[0].user_version).toBe(1);
  });

  it('is idempotent — running twice does not error', () => {
    const db = createTestDb();
    expect(() => {
      runMigrations(db);
      runMigrations(db);
    }).not.toThrow();
  });
});
