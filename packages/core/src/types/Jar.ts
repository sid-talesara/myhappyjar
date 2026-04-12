export interface Jar {
  id: number;
  year: number;
  name: string | null;
  created_at: string;
  completed_at: string | null;
  is_completed: number; // 0 or 1 (SQLite boolean)
  note_count: number;
  restricted_reveals_json: string; // JSON array of revealed note ids
}

export interface CreateJarInput {
  year: number;
  name?: string | null;
}
