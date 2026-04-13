import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartStraight } from 'phosphor-react-native';
import { Text, useTheme } from '@myhappyjar/ui';

/**
 * Memories screen stub.
 * Memories feature squad implements resurfaced memory feed and archive view.
 */
export default function MemoriesScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.center}>
        <View style={[styles.icon, styles.iconOpacity]}>
          <HeartStraight
            size={48}
            color={colors.inkMuted}
            weight="light"
          />
        </View>
        <Text
          variant="display"
          style={[styles.title, { color: colors.ink }]}
        >
          Your resurfaced moments
        </Text>
        <Text
          variant="body"
          style={[styles.body, { color: colors.inkMuted }]}
        >
          Once you've saved a few notes, moments from before will find their way here.
        </Text>
        <Text
          variant="handwritten"
          style={[styles.caveat, { color: colors.inkMuted }]}
        >
          Come back soon.
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
