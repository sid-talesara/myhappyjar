/**
 * /add-note — presented as a transparentModal via expo-router.
 *
 * The underlying jar screen remains visible through the transparent backdrop.
 * A 30%-opacity ink scrim sits above the route background but below the sheet.
 *
 * One-note-per-day: the AddNoteModal itself handles mode detection
 * (create / edit / read-only sealed). jarId defaults to 1 (current year's jar).
 *
 * Usage:
 *   router.push('/add-note');
 *   router.push({ pathname: '/add-note', params: { jarId: '2' } });
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AddNoteModal } from '../src/features/add-note';

export default function AddNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ jarId?: string }>();
  const jarId = parseInt(params.jarId ?? '1', 10);

  const handleDismiss = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Semi-transparent ink scrim — dims the jar behind the sheet */}
      <View style={styles.scrim} pointerEvents="none" />
      <AddNoteModal
        jarId={jarId}
        onDismiss={handleDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 35, 26, 0.28)',
  },
});
