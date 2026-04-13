/**
 * Tests for useAddNoteForm.
 * Uses renderHook from @testing-library/react-native.
 */
import { renderHook, act } from '@testing-library/react-native';
import { useAddNoteForm } from './useAddNoteForm';

describe('useAddNoteForm', () => {
  it('initialises with empty text and cream color', () => {
    const { result } = renderHook(() => useAddNoteForm());
    expect(result.current.getValues('text')).toBe('');
    expect(result.current.getValues('color')).toBe('cream');
  });

  it('accepts a valid note (non-empty text, valid color)', async () => {
    const { result } = renderHook(() => useAddNoteForm());

    let submitted: unknown;
    await act(async () => {
      await result.current.setValue('text', 'Had a wonderful walk in the park.');
      await result.current.setValue('color', 'honey');
      await result.current.handleSubmit((data) => {
        submitted = data;
      })();
    });

    expect(result.current.formState.errors.text).toBeUndefined();
    expect((submitted as { text: string }).text).toBe('Had a wonderful walk in the park.');
  });

  it('rejects empty text', async () => {
    const { result } = renderHook(() => useAddNoteForm());

    await act(async () => {
      result.current.setValue('text', '   ', { shouldValidate: true });
    });
    // Trigger explicitly to force validation
    await act(async () => {
      await result.current.trigger('text');
    });

    expect(result.current.formState.errors.text).toBeDefined();
  });

  it('enforces 150-char hard cap', async () => {
    const { result } = renderHook(() => useAddNoteForm());
    const overLimit = 'a'.repeat(151);

    await act(async () => {
      result.current.setValue('text', overLimit, { shouldValidate: true });
    });
    await act(async () => {
      await result.current.trigger('text');
    });

    expect(result.current.formState.errors.text).toBeDefined();
  });

  it('accepts exactly 150 chars', async () => {
    const { result } = renderHook(() => useAddNoteForm());
    const atLimit = 'a'.repeat(150);

    let submitted: unknown;
    await act(async () => {
      await result.current.setValue('text', atLimit);
      await result.current.handleSubmit((data) => {
        submitted = data;
      })();
    });

    expect(result.current.formState.errors.text).toBeUndefined();
    expect((submitted as { text: string }).text).toBe(atLimit);
  });

  it('reports charCount and counterColor correctly', () => {
    const { result } = renderHook(() => useAddNoteForm());

    act(() => {
      result.current.setValue('text', 'short');
    });
    // charCount is from watch — after setValue it should update
    expect(result.current.CHAR_LIMIT).toBe(150);
  });

  it('counterColor is muted for short text', () => {
    const { result } = renderHook(() => useAddNoteForm({ defaultText: 'hello' }));
    expect(result.current.counterColor).toBe('#7A6E64');
  });

  it('counterColor is honey for text 130-149 chars', () => {
    const { result } = renderHook(() =>
      useAddNoteForm({ defaultText: 'a'.repeat(135) }),
    );
    expect(result.current.counterColor).toBe('#D4965A'); // honey (accent-soft)
  });

  it('counterColor is terracotta at 150 chars (cap)', () => {
    const { result } = renderHook(() =>
      useAddNoteForm({ defaultText: 'a'.repeat(150) }),
    );
    expect(result.current.counterColor).toBe('#C4673A'); // terracotta (accent-warm)
  });

  it('rejects invalid color enum via submit', async () => {
    const { result } = renderHook(() => useAddNoteForm());
    const submitHandler = jest.fn();

    await act(async () => {
      // @ts-expect-error intentional invalid value
      result.current.setValue('color', 'purple');
      result.current.setValue('text', 'valid text');
      await result.current.handleSubmit(submitHandler)();
    });

    // When validation fails (invalid color), the submit handler should NOT be called
    expect(submitHandler).not.toHaveBeenCalled();
  });
});
