/**
 * Tests for useSaveRitual.
 * Validates: commit-before-animation, DB error rollback, reduced-motion, haptics gating.
 */
import { renderHook, act } from '@testing-library/react-native';
import { useSaveRitual, type UseSaveRitualOptions } from './useSaveRitual';
import type { NoteSchemaInput } from '@myhappyjar/core';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('../services/haptics', () => ({
  hapticsImpact: jest.fn().mockResolvedValue(undefined),
  hapticsNotification: jest.fn().mockResolvedValue(undefined),
  ExpoHaptics: {
    ImpactFeedbackStyle: { Medium: 'Medium', Light: 'Light' },
    NotificationFeedbackType: { Success: 'Success' },
  },
}));

jest.mock('../services/sound', () => ({
  playPaperFoldSound: jest.fn().mockResolvedValue(undefined),
  playGlassContactSound: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../services/reducedMotion', () => ({
  isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
}));

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return {
    ...actual,
    withTiming: (_toValue: number, _config: unknown, callback?: (finished: boolean) => void) => {
      // Immediately invoke callback synchronously in tests
      if (callback) callback(true);
      return _toValue;
    },
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    Easing: {
      bezier: () => (t: number) => t,
      out: () => (t: number) => t,
      cubic: (t: number) => t,
    },
  };
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const makeMockRepo = (overrides?: Partial<{ create: jest.Mock; update: jest.Mock }>) => ({
  create: jest.fn().mockReturnValue({ id: 42 }),
  update: jest.fn().mockReturnValue({ id: 42 }),
  getById: jest.fn().mockReturnValue(null),
  getByDateKey: jest.fn().mockReturnValue(null),
  listByJar: jest.fn().mockReturnValue([]),
  count: jest.fn().mockReturnValue(0),
  ...overrides,
});

const validFormValues: NoteSchemaInput = {
  text: 'Today was a good day.',
  color: 'cream',
  emoji: null,
  tags: [],
  prompt_id: null,
  image_uri: null,
  audio_uri: null,
};

function buildOptions(
  repo: ReturnType<typeof makeMockRepo>,
  overrides: Partial<UseSaveRitualOptions> = {},
): UseSaveRitualOptions {
  return {
    repository: repo as unknown as import('@myhappyjar/core').NoteRepository,
    jarId: 1,
    hapticsEnabled: true,
    soundEnabled: false,
    onSuccess: jest.fn(),
    onValidationError: jest.fn(),
    onCommitError: jest.fn(),
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useSaveRitual', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('commits to DB before any animation fires', async () => {
    const { hapticsImpact } = require('../services/haptics');
    const repo = makeMockRepo();
    const opts = buildOptions(repo);
    const { result } = renderHook(() => useSaveRitual(opts));

    const createOrder: string[] = [];
    repo.create.mockImplementation(() => {
      createOrder.push('db');
      return { id: 99 };
    });
    hapticsImpact.mockImplementation(() => {
      createOrder.push('haptic');
      return Promise.resolve();
    });

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    // DB write must precede any haptic call
    const dbIdx = createOrder.indexOf('db');
    const hapticIdx = createOrder.indexOf('haptic');
    expect(dbIdx).toBeGreaterThanOrEqual(0);
    expect(hapticIdx).toBeGreaterThanOrEqual(0);
    expect(dbIdx).toBeLessThan(hapticIdx);
  });

  it('calls onSuccess after full sequence', async () => {
    const repo = makeMockRepo();
    const onSuccess = jest.fn();
    const opts = buildOptions(repo, { onSuccess });
    const { result } = renderHook(() => useSaveRitual(opts));

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    expect(onSuccess).toHaveBeenCalledWith(42);
    expect(result.current.stage).toBe('done');
  });

  it('rolls back to error stage and calls onCommitError when DB fails', async () => {
    const repo = makeMockRepo({ create: jest.fn().mockImplementation(() => { throw new Error('disk full'); }) });
    const onCommitError = jest.fn();
    const onSuccess = jest.fn();
    const opts = buildOptions(repo, { onCommitError, onSuccess });
    const { result } = renderHook(() => useSaveRitual(opts));

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    expect(onCommitError).toHaveBeenCalledWith('disk full');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.stage).toBe('error');
  });

  it('calls onValidationError for invalid input and never touches DB', async () => {
    const repo = makeMockRepo();
    const onValidationError = jest.fn();
    const opts = buildOptions(repo, { onValidationError });
    const { result } = renderHook(() => useSaveRitual(opts));

    const invalidValues: NoteSchemaInput = { ...validFormValues, text: '' };

    await act(async () => {
      await result.current.triggerRitual(invalidValues);
    });

    expect(onValidationError).toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
    expect(result.current.stage).toBe('error');
  });

  it('skips haptics when hapticsEnabled=false', async () => {
    const { hapticsImpact, hapticsNotification } = require('../services/haptics');
    const repo = makeMockRepo();
    const opts = buildOptions(repo, { hapticsEnabled: false });
    const { result } = renderHook(() => useSaveRitual(opts));

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    // hapticsImpact and hapticsNotification receive enabled=false — they won't fire native API
    // We verify they are called with false
    const allImpactCalls: boolean[] = hapticsImpact.mock.calls.map((c: unknown[]) => c[1]);
    const allNotifCalls: boolean[] = hapticsNotification.mock.calls.map((c: unknown[]) => c[1]);
    expect(allImpactCalls.every((e) => e === false)).toBe(true);
    expect(allNotifCalls.every((e) => e === false)).toBe(true);
  });

  it('calls haptics when hapticsEnabled=true', async () => {
    const { hapticsImpact, hapticsNotification } = require('../services/haptics');
    const repo = makeMockRepo();
    const opts = buildOptions(repo, { hapticsEnabled: true });
    const { result } = renderHook(() => useSaveRitual(opts));

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    expect(hapticsImpact).toHaveBeenCalled();
    expect(hapticsNotification).toHaveBeenCalled();
  });

  it('respects reduced-motion: completes in short path', async () => {
    const { isReduceMotionEnabled } = require('../services/reducedMotion');
    isReduceMotionEnabled.mockResolvedValue(true);

    const repo = makeMockRepo();
    const onSuccess = jest.fn();
    const opts = buildOptions(repo, { onSuccess });
    const { result } = renderHook(() => useSaveRitual(opts));

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    expect(onSuccess).toHaveBeenCalledWith(42);
    expect(result.current.stage).toBe('done');
  });

  it('uses update instead of create when existingNoteId provided', async () => {
    const repo = makeMockRepo();
    const opts = buildOptions(repo, { existingNoteId: 7 });
    const { result } = renderHook(() => useSaveRitual(opts));

    await act(async () => {
      await result.current.triggerRitual(validFormValues);
    });

    expect(repo.update).toHaveBeenCalledWith(7, expect.objectContaining({ text: 'Today was a good day.' }));
    expect(repo.create).not.toHaveBeenCalled();
  });
});
