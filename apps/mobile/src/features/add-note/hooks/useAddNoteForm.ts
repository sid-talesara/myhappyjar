/**
 * useAddNoteForm — react-hook-form + zod resolver wired to core noteSchema.
 * Manages all form state for the Add Note composer.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, NOTE_COLORS, type NoteSchemaInput, type NoteColorEnum } from '@myhappyjar/core';

export type AddNoteFormValues = NoteSchemaInput;

export interface UseAddNoteFormOptions {
  defaultText?: string;
  defaultColor?: NoteColorEnum;
  defaultEmoji?: string | null;
  defaultTags?: string[];
  defaultPromptId?: number | null;
}

export function useAddNoteForm(options: UseAddNoteFormOptions = {}) {
  const form = useForm<AddNoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      text: options.defaultText ?? '',
      color: options.defaultColor ?? NOTE_COLORS[0], // 'cream'
      emoji: options.defaultEmoji ?? null,
      tags: options.defaultTags ?? [],
      prompt_id: options.defaultPromptId ?? null,
      image_uri: null,
      audio_uri: null,
    },
    mode: 'onChange',
  });

  const text = form.watch('text');
  const charCount = text?.length ?? 0;
  const CHAR_LIMIT = 150;

  /**
   * Counter color:
   * - muted   (0–129):   inkMuted (#7A6E64)
   * - warning (130–149): honey (#D4965A)
   * - at-cap  (150):     terracotta/accentWarm (#C4673A)
   */
  const counterColor =
    charCount >= CHAR_LIMIT
      ? '#C4673A'
      : charCount >= 130
        ? '#D4965A'
        : '#7A6E64';

  return {
    ...form,
    charCount,
    counterColor,
    CHAR_LIMIT,
  };
}
