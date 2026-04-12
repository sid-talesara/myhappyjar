import { z } from 'zod';

export const NOTE_COLORS = ['cream', 'ecru', 'terracotta', 'honey', 'dusk', 'rose'] as const;
export type NoteColorEnum = (typeof NOTE_COLORS)[number];

export const noteSchema = z.object({
  text: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length >= 1, { message: 'Note must contain at least 1 non-whitespace character' })
    .refine((s) => s.length <= 150, { message: 'Note text must not exceed 150 characters' }),
  color: z.enum(NOTE_COLORS),
  emoji: z.string().nullable().optional().default(null),
  tags: z.array(z.string()).optional().default([]),
  prompt_id: z.number().int().positive().nullable().optional().default(null),
  image_uri: z.string().nullable().optional().default(null),
  audio_uri: z.string().nullable().optional().default(null),
});

export type NoteSchemaInput = z.input<typeof noteSchema>;
export type NoteSchemaOutput = z.output<typeof noteSchema>;
