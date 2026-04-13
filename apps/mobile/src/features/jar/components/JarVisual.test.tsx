/**
 * JarVisual tests — confirm folded-note count and cap behavior.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { JarVisual } from './JarVisual';

// Mock react-native-svg — must match the import style used in JarVisual/FoldedNote
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  function Svg({ children, testID, ...props }: any) {
    return React.createElement(View, { testID }, children);
  }
  function G({ children, testID, ...props }: any) {
    return React.createElement(View, { testID }, children);
  }
  function Path({ testID, ...props }: any) {
    return React.createElement(View, { testID });
  }
  function Rect({ testID, ...props }: any) {
    return React.createElement(View, { testID });
  }
  function Defs({ children }: any) {
    return React.createElement(View, {}, children);
  }
  function LinearGradient({ children }: any) {
    return React.createElement(View, {}, children);
  }
  function Stop() { return null; }
  function ClipPath({ children }: any) {
    return React.createElement(View, {}, children);
  }
  function RadialGradient({ children }: any) {
    return React.createElement(View, {}, children);
  }
  function Ellipse({ testID, ...props }: any) {
    return React.createElement(View, { testID });
  }
  return {
    __esModule: true,
    default: Svg,
    Svg,
    G,
    Path,
    Rect,
    Defs,
    LinearGradient,
    Stop,
    ClipPath,
    RadialGradient,
    Ellipse,
  };
});

const makeNotes = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    jar_id: 1,
    date_key: `2026-01-${String(i + 1).padStart(2, '0')}`,
    text: `Note ${i + 1}`,
    color: 'cream' as const,
    emoji: null,
    tags_json: '[]',
    prompt_id: null,
    image_uri: null,
    audio_uri: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  }));

describe('JarVisual', () => {
  it('renders without crashing with 0 notes', () => {
    const { getByTestId } = render(
      <JarVisual notes={[]} width={300} height={400} testID="jar-visual" />,
    );
    expect(getByTestId('jar-visual')).toBeTruthy();
  });

  it('renders with 10 notes', () => {
    const { getByTestId } = render(
      <JarVisual notes={makeNotes(10)} width={300} height={400} testID="jar-visual" />,
    );
    expect(getByTestId('jar-visual')).toBeTruthy();
  });

  it('caps rendered folded-note nodes at 150 even when given 365 notes', () => {
    const { getAllByTestId } = render(
      <JarVisual notes={makeNotes(365)} width={300} height={400} />,
    );
    const noteNodes = getAllByTestId('folded-note');
    expect(noteNodes.length).toBeLessThanOrEqual(150);
  });

  it('renders exactly N folded-note nodes for N <= 150 notes', () => {
    const n = 50;
    const { getAllByTestId } = render(
      <JarVisual notes={makeNotes(n)} width={300} height={400} />,
    );
    const noteNodes = getAllByTestId('folded-note');
    expect(noteNodes).toHaveLength(n);
  });
});
