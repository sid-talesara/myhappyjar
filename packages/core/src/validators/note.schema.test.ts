import { noteSchema, NOTE_COLORS } from './note.schema';

describe('noteSchema', () => {
  const validBase = {
    text: 'Something made me smile today',
    color: 'cream' as const,
  };

  it('parses valid minimal note', () => {
    const result = noteSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('parses full valid note', () => {
    const result = noteSchema.safeParse({
      ...validBase,
      emoji: '😊',
      tags: ['gratitude', 'morning'],
      prompt_id: 3,
      image_uri: '/path/to/img.jpg',
      audio_uri: null,
    });
    expect(result.success).toBe(true);
  });

  it('fails when text is empty', () => {
    const result = noteSchema.safeParse({ ...validBase, text: '' });
    expect(result.success).toBe(false);
  });

  it('fails when text is only whitespace', () => {
    const result = noteSchema.safeParse({ ...validBase, text: '   ' });
    expect(result.success).toBe(false);
  });

  it('fails when text exceeds 150 chars', () => {
    const result = noteSchema.safeParse({ ...validBase, text: 'a'.repeat(151) });
    expect(result.success).toBe(false);
  });

  it('accepts text of exactly 150 chars', () => {
    const result = noteSchema.safeParse({ ...validBase, text: 'a'.repeat(150) });
    expect(result.success).toBe(true);
  });

  it('trims text before validating length', () => {
    // 150 chars of 'a' plus surrounding spaces — trimmed still 150 chars
    const result = noteSchema.safeParse({ ...validBase, text: '  ' + 'a'.repeat(150) + '  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe('a'.repeat(150));
    }
  });

  it('fails when text trims to empty', () => {
    const result = noteSchema.safeParse({ ...validBase, text: '   ' });
    expect(result.success).toBe(false);
  });

  it('fails when trimmed text exceeds 150 chars', () => {
    const result = noteSchema.safeParse({ ...validBase, text: '  ' + 'a'.repeat(151) + '  ' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid color', () => {
    const result = noteSchema.safeParse({ ...validBase, color: 'blue' });
    expect(result.success).toBe(false);
  });

  it('accepts all 6 valid colors', () => {
    for (const color of NOTE_COLORS) {
      const result = noteSchema.safeParse({ ...validBase, color });
      expect(result.success).toBe(true);
    }
  });

  it('emoji is optional and defaults to null', () => {
    const result = noteSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.emoji).toBeNull();
    }
  });

  it('tags defaults to empty array', () => {
    const result = noteSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it('fails when tags is not an array', () => {
    const result = noteSchema.safeParse({ ...validBase, tags: 'not-array' });
    expect(result.success).toBe(false);
  });
});
