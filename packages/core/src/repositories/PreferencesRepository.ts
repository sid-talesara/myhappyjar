import { DatabaseClient } from '../types/DatabaseClient';
import { Preferences, UpdatePreferencesInput } from '../types/Preferences';

const SINGLETON_ID = 1;

export class PreferencesRepository {
  constructor(private readonly db: DatabaseClient) {}

  get(): Preferences | null {
    const rows = this.db.execute<Preferences>(
      'SELECT * FROM preferences WHERE id = ?',
      [SINGLETON_ID],
    ).rows;
    return rows[0] ?? null;
  }

  update(input: UpdatePreferencesInput): Preferences {
    const existing = this.get();
    if (!existing) throw new Error('Preferences row not found — run migrations first');

    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.haptics_enabled !== undefined) {
      fields.push('haptics_enabled = ?');
      values.push(input.haptics_enabled);
    }
    if (input.sound_enabled !== undefined) {
      fields.push('sound_enabled = ?');
      values.push(input.sound_enabled);
    }
    if (input.prompt_enabled !== undefined) {
      fields.push('prompt_enabled = ?');
      values.push(input.prompt_enabled);
    }
    if (input.sync_enabled !== undefined) {
      fields.push('sync_enabled = ?');
      values.push(input.sync_enabled);
    }
    if (input.onboarding_completed !== undefined) {
      fields.push('onboarding_completed = ?');
      values.push(input.onboarding_completed);
    }

    if (fields.length > 0) {
      values.push(SINGLETON_ID);
      this.db.run(`UPDATE preferences SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return this.get()!;
  }
}
