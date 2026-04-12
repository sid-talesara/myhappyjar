import { DatabaseClient } from '../types/DatabaseClient';
import { Jar, CreateJarInput } from '../types/Jar';

export class JarRepository {
  constructor(private readonly db: DatabaseClient) {}

  create(input: CreateJarInput): Jar {
    const now = new Date().toISOString();
    const result = this.db.run(
      `INSERT INTO jars (year, name, created_at, is_completed, note_count, restricted_reveals_json)
       VALUES (?, ?, ?, 0, 0, '[]')`,
      [input.year, input.name ?? null, now],
    );
    return this.getById(result.lastInsertRowid as number)!;
  }

  getById(id: number): Jar | null {
    const rows = this.db.execute<Jar>('SELECT * FROM jars WHERE id = ?', [id]).rows;
    return rows[0] ?? null;
  }

  getCurrentYear(year: number): Jar | null {
    const rows = this.db.execute<Jar>('SELECT * FROM jars WHERE year = ?', [year]).rows;
    return rows[0] ?? null;
  }

  markCompleted(id: number): Jar {
    const now = new Date().toISOString();
    this.db.run('UPDATE jars SET is_completed = 1, completed_at = ? WHERE id = ?', [now, id]);
    return this.getById(id)!;
  }

  incrementNoteCount(id: number): Jar {
    this.db.run('UPDATE jars SET note_count = note_count + 1 WHERE id = ?', [id]);
    return this.getById(id)!;
  }

  /**
   * Appends a note_id to the restricted_reveals_json array for this jar.
   */
  trackReveal(jarId: number, noteId: number): Jar {
    const jar = this.getById(jarId);
    if (!jar) throw new Error(`Jar ${jarId} not found`);

    const existing: number[] = JSON.parse(jar.restricted_reveals_json);
    if (!existing.includes(noteId)) {
      existing.push(noteId);
    }
    this.db.run('UPDATE jars SET restricted_reveals_json = ? WHERE id = ?', [
      JSON.stringify(existing),
      jarId,
    ]);
    return this.getById(jarId)!;
  }

  list(): Jar[] {
    return this.db.execute<Jar>('SELECT * FROM jars ORDER BY year DESC').rows;
  }
}
