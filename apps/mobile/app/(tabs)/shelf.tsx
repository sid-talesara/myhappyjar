import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Archive } from 'phosphor-react-native';
import { Text, useTheme } from '@myhappyjar/ui';

/**
 * Shelf screen stub.
 * Shelf feature squad implements completed yearly jar archive.
 */
export default function ShelfScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.center}>
        <View style={[styles.icon, styles.iconOpacity]}>
          <Archive
            size={48}
            color={colors.inkMuted}
            weight="light"
          />
        </View>
        <Text
          variant="display"
          style={[styles.title, { color: colors.ink }]}
        >
          Your past jars
        </Text>
        <Text
          variant="body"
          style={[styles.body, { color: colors.inkMuted }]}
        >
          At the end of each year, your jar moves here — fully open, fully yours.
        </Text>
        <Text
          variant="handwritten"
          style={[styles.caveat, { color: colors.inkMuted }]}
        >
          Nothing yet. That's okay.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 20,
  },
  iconOpacity: {
    opacity: 0.4,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
  },
  caveat: {
    fontSize: 16,
    textAlign: 'center',
  },
});
