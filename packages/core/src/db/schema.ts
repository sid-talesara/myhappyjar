export const CREATE_JARS_TABLE = `
  CREATE TABLE IF NOT EXISTS jars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL UNIQUE,
    name TEXT,
    created_at TEXT NOT NULL,
    completed_at TEXT,
    is_completed INTEGER NOT NULL DEFAULT 0,
    note_count INTEGER NOT NULL DEFAULT 0,
    restricted_reveals_json TEXT NOT NULL DEFAULT '[]'
  )
`;

export const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jar_id INTEGER NOT NULL REFERENCES jars(id),
    date_key TEXT NOT NULL UNIQUE,
    text TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'cream',
    emoji TEXT,
    tags_json TEXT NOT NULL DEFAULT '[]',
    prompt_id INTEGER,
    image_uri TEXT,
    audio_uri TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const CREATE_RESTRICTED_REVEALS_TABLE = `
  CREATE TABLE IF NOT EXISTS restricted_reveals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jar_id INTEGER NOT NULL REFERENCES jars(id),
    note_id INTEGER NOT NULL REFERENCES notes(id),
    revealed_at TEXT NOT NULL,
    reason_key TEXT NOT NULL,
    reason_note TEXT
  )
`;

export const CREATE_STREAK_SUMMARY_TABLE = `
  CREATE TABLE IF NOT EXISTS streak_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_completed_date_key TEXT
  )
`;

export const CREATE_PROMPTS_TABLE = `
  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_key TEXT,
    prompt_text TEXT NOT NULL,
    is_global INTEGER NOT NULL DEFAULT 1
  )
`;

export const CREATE_PREFERENCES_TABLE = `
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    haptics_enabled INTEGER NOT NULL DEFAULT 1,
    sound_enabled INTEGER NOT NULL DEFAULT 1,
    prompt_enabled INTEGER NOT NULL DEFAULT 1,
    sync_enabled INTEGER NOT NULL DEFAULT 0,
    onboarding_completed INTEGER NOT NULL DEFAULT 0
  )
`;
