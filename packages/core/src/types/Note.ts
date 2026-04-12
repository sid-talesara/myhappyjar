export type NoteColor = 'cream' | 'ecru' | 'terracotta' | 'honey' | 'dusk' | 'rose';

export interface Note {
  id: number;
  jar_id: number;
  date_key: string; // "YYYY-MM-DD"
  text: string;
  color: NoteColor;
  emoji: string | null;
  tags_json: string; // JSON array of strings
  prompt_id: number | null;
  image_uri: string | null;
  audio_uri: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface CreateNoteInput {
  jar_id: number;
  date_key: string;
  text: string;
  color: NoteColor;
  emoji?: string | null;
  tags?: string[];
  prompt_id?: number | null;
  image_uri?: string | null;
  audio_uri?: string | null;
}

export interface UpdateNoteInput {
  text?: string;
  color?: NoteColor;
  emoji?: string | null;
  tags?: string[];
  prompt_id?: number | null;
  image_uri?: string | null;
  audio_uri?: string | null;
}
