import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gear } from 'phosphor-react-native';
import { Text, useTheme } from '@myhappyjar/ui';

/**
 * Profile/Settings screen stub.
 * Profile squad implements app lock, export/delete, sync preferences.
 */
export default function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.center}>
        <View style={[styles.icon, styles.iconOpacity]}>
          <Gear
            size={48}
            color={colors.inkMuted}
            weight="light"
          />
        </View>
        <Text
          variant="display"
          style={[styles.title, { color: colors.ink }]}
        >
          Your jar settings
        </Text>
        <Text
          variant="body"
          style={[styles.body, { color: colors.inkMuted }]}
        >
          App lock, export, sound, and haptics. All the ways to make this jar feel like yours.
        </Text>
        <Text
          variant="handwritten"
          style={[styles.caveat, { color: colors.inkMuted }]}
        >
          Settling in soon.
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
