// Legacy Colors export — derived from design tokens for backward compatibility
import { colors } from '@/constants/tokens';

export const Colors = {
  light: {
    text: colors.light.text,
    background: colors.light.bg,
    tint: colors.primary,
    icon: colors.light.textSecondary,
    tabIconDefault: colors.light.textSecondary,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.dark.text,
    background: colors.dark.bg,
    tint: colors.primary,
    icon: colors.dark.textSecondary,
    tabIconDefault: colors.dark.textSecondary,
    tabIconSelected: colors.primary,
  },
} as const;
