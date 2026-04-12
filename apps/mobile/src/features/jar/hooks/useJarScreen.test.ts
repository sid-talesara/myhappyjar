/**
 * useJarScreen hook tests.
 * Uses a mock DatabaseClient to avoid real SQLite in tests.
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useJarScreen } from './useJarScreen';

// Mock the DbProvider
jest.mock('../../../providers/DbProvider', () => ({
  useDb: jest.fn(),
}));

import { useDb } from '../../../providers/DbProvider';

const mockDb = {
  execute: jest.fn(),
  run: jest.fn(),
};

const mockJar = {
  id: 1,
  year: 2026,
  name: 'My Jar',
  created_at: '2026-01-01T00:00:00.000Z',
  completed_at: null,
  is_completed: 0,
  note_count: 3,
  restricted_reveals_json: '[]',
};

const mockNotes = [
  { id: 1, jar_id: 1, date_key: '2026-01-01', text: 'Hello', color: 'cream', emoji: null, tags_json: '[]', prompt_id: null, image_uri: null, audio_uri: null, created_at: '2026-01-01T10:00:00.000Z', updated_at: '2026-01-01T10:00:00.000Z' },
  { id: 2, jar_id: 1, date_key: '2026-01-02', text: 'World', color: 'honey', emoji: null, tags_json: '[]', prompt_id: null, image_uri: null, audio_uri: null, created_at: '2026-01-02T10:00:00.000Z', updated_at: '2026-01-02T10:00:00.000Z' },
];

beforeEach(() => {
  jest.clearAllMocks();
  (useDb as jest.Mock).mockReturnValue(mockDb);

  // getCurrentYear
  mockDb.execute.mockImplementation((sql: string, params: unknown[]) => {
    if (sql.includes('FROM jars WHERE year')) {
      return { rows: [mockJar] };
    }
    if (sql.includes('FROM notes WHERE jar_id') && sql.includes('ORDER BY date_key')) {
      return { rows: mockNotes };
    }
    if (sql.includes('FROM notes WHERE date_key')) {
      return { rows: [] };
    }
    return { rows: [] };
  });
});

describe('useJarScreen', () => {
  it('loads jar and notes', async () => {
    const { result } = renderHook(() => useJarScreen());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jar).toBeDefined();
    expect(result.current.jar?.year).toBe(2026);
    expect(result.current.notes).toHaveLength(2);
  });

  it('todayNote is null when no note exists for today', async () => {
    const { result } = renderHook(() => useJarScreen());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Today is 2026-04-12, no note in mockNotes for that date
    expect(result.current.todayNote).toBeNull();
  });

  it('todayNote is set when a note exists for today', async () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayNote = { id: 99, jar_id: 1, date_key: todayKey, text: 'Today!', color: 'rose', emoji: null, tags_json: '[]', prompt_id: null, image_uri: null, audio_uri: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

    mockDb.execute.mockImplementation((sql: string) => {
      if (sql.includes('FROM jars WHERE year')) return { rows: [mockJar] };
      if (sql.includes('FROM notes WHERE jar_id') && sql.includes('ORDER BY date_key')) return { rows: mockNotes };
      if (sql.includes('FROM notes WHERE date_key')) return { rows: [todayNote] };
      return { rows: [] };
    });

    const { result } = renderHook(() => useJarScreen());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.todayNote).not.toBeNull();
    expect(result.current.todayNote?.id).toBe(99);
  });

  it('creates jar if none exists for current year', async () => {
    mockDb.execute.mockImplementation((sql: string) => {
      if (sql.includes('FROM jars WHERE year')) return { rows: [] };
      if (sql.includes('FROM notes WHERE jar_id')) return { rows: [] };
      if (sql.includes('FROM notes WHERE date_key')) return { rows: [] };
      if (sql.includes('FROM jars WHERE id')) return { rows: [mockJar] };
      return { rows: [] };
    });
    mockDb.run.mockReturnValue({ lastInsertRowid: 1 });

    const { result } = renderHook(() => useJarScreen());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO jars'),
      expect.any(Array),
    );
  });
});
