export type RevealReasonKey =
  | 'need_comfort'
  | 'life_feels_heavy'
  | 'celebrate_progress'
  | 'want_perspective';

export interface RestrictedReveal {
  id: number;
  jar_id: number;
  note_id: number;
  revealed_at: string; // ISO timestamp
  reason_key: RevealReasonKey;
  reason_note: string | null; // optional free-text from user
}

export interface CreateRestrictedRevealInput {
  jar_id: number;
  note_id: number;
  reason_key: RevealReasonKey;
  reason_note?: string | null;
}
