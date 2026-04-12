import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@myhappyjar/ui';
import {
  House,
  Flame,
  HeartStraight,
  Archive,
  Gear,
} from 'phosphor-react-native';

/**
 * Tab bar layout — 5 screens per PRD Information Architecture.
 * Phosphor Light weight icons, 24px. Active state uses Regular weight.
 * Warm divider above tab bar. Chrome recedes — jar is the dominant surface.
 */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accentWarm,
        tabBarInactiveTintColor: theme.colors.inkMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.bg,
          borderTopWidth: 1,
          borderTopColor: theme.colors.paperAlt,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fontFamilies.sans,
          fontSize: 11,
          fontWeight: '400',
        },
      }}
    >
      <Tabs.Screen
        name="jar"
        options={{
          title: 'Jar',
          tabBarIcon: ({ color, focused }) => (
            <House
              size={24}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: 'Streaks',
          tabBarIcon: ({ color, focused }) => (
            <Flame
              size={24}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, focused }) => (
            <HeartStraight
              size={24}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shelf"
        options={{
          title: 'Shelf',
          tabBarIcon: ({ color, focused }) => (
            <Archive
              size={24}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Gear
              size={24}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
