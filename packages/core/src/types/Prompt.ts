export interface Prompt {
  id: number;
  date_key: string | null; // null = global/any-day prompt
  prompt_text: string;
  is_global: number; // 0 or 1
}
