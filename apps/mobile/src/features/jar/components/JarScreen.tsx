import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJarScreen } from '../hooks/useJarScreen';
import { JarHeader } from './JarHeader';
import { JarVisual } from './JarVisual';
import { TodayStatusCard } from './TodayStatusCard';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

/**
 * JarScreen — the primary emotional surface of My Happy Jar.
 *
 * Layout:
 *   - SafeAreaView with linen bg
 *   - JarHeader (wordmark + counter) — minimal, recedes
 *   - JarVisual — ~55% vertical height, dominant element
 *   - TodayStatusCard — 3-state CTA beneath the jar
 *
 * Renders immediately from local data. No spinner gate.
 * Tab bar is provided by (tabs)/_layout.tsx — not re-implemented here.
 */
export function JarScreen() {
  const { width, height } = useWindowDimensions();
  const { jar, notes, todayNote, isLoading } = useJarScreen();

  console.log('[JarScreen] render', { notes: notes.length, jar: jar?.id, isLoading });

  // Jar occupies ~55% of screen height, leaving room for header + card + tab bar
  // Tab bar ~49px, card ~90px, header ~60px, paddings ~30px
  const jarHeight = Math.max(height * 0.52, 280);
  const jarWidth = width;

  // Don't gate on isLoading — jar renders with whatever state is available.
  // On first launch the jar is empty; data populates synchronously from SQLite.

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.container}>
        {/* Header: wordmark + counter */}
        <JarHeader
          year={jar?.year ?? new Date().getFullYear()}
          noteCount={jar?.note_count ?? 0}
        />

        {/* Jar visual — the hero */}
        <ErrorBoundary label="JarVisual">
          <View style={[styles.jarContainer, { height: jarHeight }]}>
            <JarVisual
              notes={notes}
              width={jarWidth}
              height={jarHeight}
              testID="jar-visual"
            />
          </View>
        </ErrorBoundary>

        {/* Today status card */}
        <ErrorBoundary label="TodayStatusCard">
          <TodayStatusCard todayNote={todayNote} />
        </ErrorBoundary>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 8,
  },
  jarContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
