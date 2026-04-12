import { createTestDb } from './testDb';
import { runMigrations } from '../db/migrations';
import { JarRepository } from './JarRepository';

function setup() {
  const db = createTestDb();
  runMigrations(db);
  return new JarRepository(db);
}

describe('JarRepository', () => {
  it('creates a jar and returns it', () => {
    const repo = setup();
    const jar = repo.create({ year: 2024 });
    expect(jar.id).toBeGreaterThan(0);
    expect(jar.year).toBe(2024);
    expect(jar.is_completed).toBe(0);
    expect(jar.note_count).toBe(0);
    expect(jar.restricted_reveals_json).toBe('[]');
  });

  it('gets current year jar', () => {
    const repo = setup();
    repo.create({ year: 2024 });
    const jar = repo.getCurrentYear(2024);
    expect(jar).not.toBeNull();
    expect(jar!.year).toBe(2024);
  });

  it('returns null when no jar for year', () => {
    const repo = setup();
    expect(repo.getCurrentYear(2024)).toBeNull();
  });

  it('marks jar as completed', () => {
    const repo = setup();
    const jar = repo.create({ year: 2024 });
    const completed = repo.markCompleted(jar.id);
    expect(completed.is_completed).toBe(1);
    expect(completed.completed_at).not.toBeNull();
  });

  it('increments note count', () => {
    const repo = setup();
    const jar = repo.create({ year: 2024 });
    expect(jar.note_count).toBe(0);
    const updated = repo.incrementNoteCount(jar.id);
    expect(updated.note_count).toBe(1);
    const again = repo.incrementNoteCount(jar.id);
    expect(again.note_count).toBe(2);
  });

  it('tracks a reveal by appending note_id to restricted_reveals_json', () => {
    const repo = setup();
    const jar = repo.create({ year: 2024 });
    const after1 = repo.trackReveal(jar.id, 42);
    expect(JSON.parse(after1.restricted_reveals_json)).toContain(42);

    const after2 = repo.trackReveal(jar.id, 99);
    const ids = JSON.parse(after2.restricted_reveals_json);
    expect(ids).toContain(42);
    expect(ids).toContain(99);
  });

  it('creates jar with optional name', () => {
    const repo = setup();
    const jar = repo.create({ year: 2024, name: 'My Best Year' });
    expect(jar.name).toBe('My Best Year');
  });

  it('enforces unique year constraint', () => {
    const repo = setup();
    repo.create({ year: 2024 });
    expect(() => repo.create({ year: 2024 })).toThrow();
  });
});
