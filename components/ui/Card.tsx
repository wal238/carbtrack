import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { borderRadius, shadows, spacing } from '@/constants/tokens';
import { useThemeColors, useTheme } from '@/lib/theme';
import type { CardProps } from '@/lib/types';

export function Card({ children, padding, style }: CardProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          ...(isDark
            ? { borderWidth: 1, borderColor: colors.border }
            : shadows.card),
        },
        padding !== undefined && { padding },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
  },
});
