export interface StreakSummary {
  id: number;
  current_streak: number;
  longest_streak: number;
  last_completed_date_key: string | null; // "YYYY-MM-DD"
}
