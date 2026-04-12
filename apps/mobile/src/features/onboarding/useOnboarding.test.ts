import { renderHook, act } from '@testing-library/react-native';
import { useOnboarding } from './useOnboarding';
import { track } from './analytics';
import { TOTAL_STEPS } from './content';

// Mock analytics
jest.mock('./analytics', () => ({
  track: jest.fn(),
}));

const mockTrack = track as jest.MockedFunction<typeof track>;

// Minimal DatabaseClient mock
const mockRun = jest.fn();
const mockExecute = jest.fn().mockReturnValue({ rows: [{ id: 1, onboarding_completed: 0, haptics_enabled: 1, sound_enabled: 1, prompt_enabled: 1, sync_enabled: 0 }] });
const mockDb = {
  run: mockRun,
  execute: mockExecute,
};

describe('useOnboarding', () => {
  let onComplete: jest.Mock;
  let onSkip: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    onComplete = jest.fn();
    onSkip = jest.fn();
  });

  function renderOnboarding() {
    return renderHook(() =>
      useOnboarding({
        db: mockDb as any,
        onComplete,
        onSkip,
      }),
    );
  }

  it('starts at step 0', () => {
    const { result } = renderOnboarding();
    expect(result.current.currentStep).toBe(0);
    expect(result.current.totalSteps).toBe(TOTAL_STEPS);
  });

  it('isLastStep is false at step 0', () => {
    const { result } = renderOnboarding();
    expect(result.current.isLastStep).toBe(false);
  });

  it('advance() increments step and fires onboarding_step_viewed', () => {
    const { result } = renderOnboarding();

    act(() => {
      result.current.advance();
    });

    expect(result.current.currentStep).toBe(1);
    expect(mockTrack).toHaveBeenCalledWith('onboarding_step_viewed', { step: 1 });
  });

  it('advance() does not go past last step', () => {
    const { result } = renderOnboarding();

    // advance to last step
    for (let i = 0; i < TOTAL_STEPS - 1; i++) {
      act(() => {
        result.current.advance();
      });
    }

    expect(result.current.currentStep).toBe(TOTAL_STEPS - 1);
    expect(result.current.isLastStep).toBe(true);

    // try to advance past the end
    act(() => {
      result.current.advance();
    });

    expect(result.current.currentStep).toBe(TOTAL_STEPS - 1);
  });

  it('isLastStep is true at final step', () => {
    const { result } = renderOnboarding();

    for (let i = 0; i < TOTAL_STEPS - 1; i++) {
      act(() => {
        result.current.advance();
      });
    }

    expect(result.current.isLastStep).toBe(true);
  });

  it('skip() fires onboarding_skipped, persists completion, calls onSkip', () => {
    const { result } = renderOnboarding();

    act(() => {
      result.current.advance();
    });

    act(() => {
      result.current.skip();
    });

    expect(mockTrack).toHaveBeenCalledWith('onboarding_skipped', { step: 1 });
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('onboarding_completed'),
      expect.arrayContaining([1]),
    );
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('complete() fires onboarding_completed, persists completion, calls onComplete', () => {
    const { result } = renderOnboarding();

    act(() => {
      result.current.complete();
    });

    expect(mockTrack).toHaveBeenCalledWith('onboarding_completed', { step: 0 });
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('onboarding_completed'),
      expect.arrayContaining([1]),
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onSkip).not.toHaveBeenCalled();
  });

  it('complete() does not call onSkip', () => {
    const { result } = renderOnboarding();

    act(() => {
      result.current.complete();
    });

    expect(onSkip).not.toHaveBeenCalled();
  });

  it('skip() does not call onComplete', () => {
    const { result } = renderOnboarding();

    act(() => {
      result.current.skip();
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('fires onboarding_step_viewed for each advance', () => {
    const { result } = renderOnboarding();

    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });

    const stepViewCalls = mockTrack.mock.calls.filter(
      ([event]) => event === 'onboarding_step_viewed',
    );
    expect(stepViewCalls).toHaveLength(3);
    expect(stepViewCalls[0][1]).toEqual({ step: 1 });
    expect(stepViewCalls[1][1]).toEqual({ step: 2 });
    expect(stepViewCalls[2][1]).toEqual({ step: 3 });
  });
});
