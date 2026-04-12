# @myhappyjar/ui

Shared React Native design system — tokens and primitive components for My Happy Jar.

Warm/paper/scrapbook aesthetic. Pure presentational, no business logic.

## Quick Usage

```tsx
import {
  ThemeProvider,
  useTheme,
  Text,
  Button,
  Card,
  Input,
  Tag,
  IconButton,
  Stack,
  Divider,
  tokens,
} from '@myhappyjar/ui';
import { Plus } from '@myhappyjar/ui'; // curated Phosphor icons

// Wrap your app
export function App() {
  return (
    <ThemeProvider>
      <MyScreen />
    </ThemeProvider>
  );
}

// Use primitives
function MyScreen() {
  const { colors, spacing } = useTheme();

  return (
    <Stack gap="lg" style={{ padding: spacing.xl, backgroundColor: colors.bg }}>
      <Text variant="display">Your jar is filling.</Text>
      <Text variant="body" color={colors.inkMuted}>47 memories kept.</Text>

      <Card elevated>
        <Stack gap="md" style={{ padding: 16 }}>
          <Text variant="title">What made you smile today?</Text>
          <Input variant="underline" placeholder="Write a memory..." counter="0/280" />
        </Stack>
      </Card>

      <Stack direction="horizontal" gap="sm">
        <Tag label="gratitude" />
        <Tag label="family" />
      </Stack>

      <Divider />

      <Stack direction="horizontal" gap="md">
        <Button variant="primary" size="md" label="Drop into jar" onPress={() => {}} />
        <Button variant="secondary" size="md" label="Save draft" onPress={() => {}} />
        <IconButton icon={Plus} onPress={() => {}} />
      </Stack>
    </Stack>
  );
}
```

## Token Reference

| Token group | Key values |
|---|---|
| `colors.bg` | `#F5F0E8` Linen |
| `colors.paper` | `#EDE6D6` Cream |
| `colors.ink` | `#2C231A` Sepia Dark |
| `colors.inkMuted` | `#7A6E64` Warm Gray |
| `colors.accentWarm` | `#C4673A` Terracotta (primary CTA only) |
| `colors.accentCool` | `#5A7A8C` Dusk Blue |
| `spacing` | xs=4, sm=8, md=12, lg=16, xl=24, 2xl=32, 3xl=48 |
| `radii` | none=0, sm=4, md=8, lg=12 |
| `motionDurations` | sheetOpen=280ms, fold=400ms, drop=500ms |

## Design Rules (Non-Negotiables)

- No gradients anywhere
- No drop shadow > 8px blur
- No border-radius > 12px (components), > 10px (buttons)
- No emoji in UI chrome
- No pure white (`#FFFFFF`) or pure black (`#000000`)
- Phosphor Light weight only (24px default)
- `accentWarm` is the only CTA color — never two accent CTAs on one screen
- Caveat (handwritten) max once per screen, never in interactive elements
