import { DatabaseClient } from '../types/DatabaseClient';
import { Note, CreateNoteInput, UpdateNoteInput } from '../types/Note';

export class NoteRepository {
  constructor(private readonly db: DatabaseClient) {}

  create(input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const tagsJson = JSON.stringify(input.tags ?? []);
    const result = this.db.run(
      `INSERT INTO notes (jar_id, date_key, text, color, emoji, tags_json, prompt_id, image_uri, audio_uri, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.jar_id,
        input.date_key,
        input.text,
        input.color,
        input.emoji ?? null,
        tagsJson,
        input.prompt_id ?? null,
        input.image_uri ?? null,
        input.audio_uri ?? null,
        now,
        now,
      ],
    );
    return this.getById(result.lastInsertRowid as number)!;
  }

  getById(id: number): Note | null {
    const rows = this.db.execute<Note>('SELECT * FROM notes WHERE id = ?', [id]).rows;
    return rows[0] ?? null;
  }

  getByDateKey(dateKey: string): Note | null {
    const rows = this.db.execute<Note>('SELECT * FROM notes WHERE date_key = ?', [dateKey]).rows;
    return rows[0] ?? null;
  }

  listByJar(jarId: number): Note[] {
    return this.db.execute<Note>('SELECT * FROM notes WHERE jar_id = ? ORDER BY date_key ASC', [jarId]).rows;
  }

  update(id: number, input: UpdateNoteInput): Note {
    const existing = this.getById(id);
    if (!existing) throw new Error(`Note ${id} not found`);

    const tagsJson = input.tags !== undefined ? JSON.stringify(input.tags) : existing.tags_json;
    const now = new Date().toISOString();

    this.db.run(
      `UPDATE notes SET
        text = ?, color = ?, emoji = ?, tags_json = ?,
        prompt_id = ?, image_uri = ?, audio_uri = ?, updated_at = ?
       WHERE id = ?`,
      [
        input.text ?? existing.text,
        input.color ?? existing.color,
        input.emoji !== undefined ? input.emoji : existing.emoji,
        tagsJson,
        input.prompt_id !== undefined ? input.prompt_id : existing.prompt_id,
        input.image_uri !== undefined ? input.image_uri : existing.image_uri,
        input.audio_uri !== undefined ? input.audio_uri : existing.audio_uri,
        now,
        id,
      ],
    );

    return this.getById(id)!;
  }

  count(jarId: number): number {
    const rows = this.db.execute<{ cnt: number }>('SELECT COUNT(*) as cnt FROM notes WHERE jar_id = ?', [jarId]).rows;
    return rows[0]?.cnt ?? 0;
  }
}
