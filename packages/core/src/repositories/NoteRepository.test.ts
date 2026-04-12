import { createTestDb } from './testDb';
import { runMigrations } from '../db/migrations';
import { NoteRepository } from './NoteRepository';
import { JarRepository } from './JarRepository';

function setup() {
  const db = createTestDb();
  runMigrations(db);
  const jarRepo = new JarRepository(db);
  const noteRepo = new NoteRepository(db);
  return { db, jarRepo, noteRepo };
}

describe('NoteRepository', () => {
  it('creates a note and retrieves it by date_key', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });

    const note = noteRepo.create({
      jar_id: jar.id,
      date_key: '2024-06-15',
      text: 'A sunny afternoon',
      color: 'honey',
    });

    expect(note.id).toBeGreaterThan(0);
    expect(note.date_key).toBe('2024-06-15');
    expect(note.text).toBe('A sunny afternoon');
    expect(note.color).toBe('honey');
    expect(note.tags_json).toBe('[]');
    expect(note.emoji).toBeNull();
  });

  it('retrieves a note by date_key', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });
    noteRepo.create({ jar_id: jar.id, date_key: '2024-06-15', text: 'Hello', color: 'cream' });

    const found = noteRepo.getByDateKey('2024-06-15');
    expect(found).not.toBeNull();
    expect(found!.text).toBe('Hello');
  });

  it('returns null for missing date_key', () => {
    const { noteRepo } = setup();
    expect(noteRepo.getByDateKey('2099-01-01')).toBeNull();
  });

  it('lists notes by jar', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });
    noteRepo.create({ jar_id: jar.id, date_key: '2024-01-01', text: 'Day 1', color: 'cream' });
    noteRepo.create({ jar_id: jar.id, date_key: '2024-01-02', text: 'Day 2', color: 'ecru' });

    const notes = noteRepo.listByJar(jar.id);
    expect(notes.length).toBe(2);
  });

  it('updates a note', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });
    const note = noteRepo.create({ jar_id: jar.id, date_key: '2024-06-15', text: 'Original', color: 'cream' });

    const updated = noteRepo.update(note.id, { text: 'Updated', color: 'rose', tags: ['joy'] });
    expect(updated.text).toBe('Updated');
    expect(updated.color).toBe('rose');
    expect(updated.tags_json).toBe('["joy"]');
  });

  it('counts notes by jar', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });
    noteRepo.create({ jar_id: jar.id, date_key: '2024-01-01', text: 'A', color: 'cream' });
    noteRepo.create({ jar_id: jar.id, date_key: '2024-01-02', text: 'B', color: 'cream' });

    expect(noteRepo.count(jar.id)).toBe(2);
  });

  it('enforces UNIQUE date_key constraint', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });
    noteRepo.create({ jar_id: jar.id, date_key: '2024-06-15', text: 'First', color: 'cream' });

    expect(() =>
      noteRepo.create({ jar_id: jar.id, date_key: '2024-06-15', text: 'Duplicate', color: 'cream' })
    ).toThrow();
  });

  it('stores and retrieves emoji and tags', () => {
    const { jarRepo, noteRepo } = setup();
    const jar = jarRepo.create({ year: 2024 });
    const note = noteRepo.create({
      jar_id: jar.id,
      date_key: '2024-06-15',
      text: 'Emoji test',
      color: 'cream',
      emoji: '🌟',
      tags: ['gratitude', 'morning'],
    });

    expect(note.emoji).toBe('🌟');
    expect(note.tags_json).toBe('["gratitude","morning"]');
  });
});
