import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { colors } from '@/constants/tokens';
import type { ThemeMode } from '@/lib/types';

// Semantic color palette for each mode
function buildLightColors() {
  return {
    bg: colors.light.bg,
    surface: colors.light.surface,
    border: colors.light.border,
    borderFaint: colors.light.borderFaint,
    text: colors.light.text,
    textSecondary: colors.light.textSecondary,
    textMuted: colors.light.textMuted,
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryMuted: colors.primaryMuted,
    primarySoft: colors.primarySoft,
    secondary: colors.secondary,
    secondaryMuted: colors.secondaryMuted,
    // Glucose colors are the same in both modes
    ...colors.glucose,
    // Meal colors
    ...colors.meals,
  };
}

function buildDarkColors() {
  return {
    bg: colors.dark.bg,
    surface: colors.dark.surface,
    border: colors.dark.border,
    borderFaint: colors.dark.borderFaint,
    text: colors.dark.text,
    textSecondary: colors.dark.textSecondary,
    textMuted: colors.dark.textMuted,
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryMuted: '#2EC4B620', // 20% opacity primary for dark mode
    primarySoft: '#2EC4B610',
    secondary: colors.secondary,
    secondaryMuted: '#4C7DFF20',
    ...colors.glucose,
    ...colors.meals,
  };
}

export type ThemeColors = ReturnType<typeof buildLightColors>;

const lightColors = buildLightColors();
const darkColors = buildDarkColors();

// Theme Context
interface ThemeContextValue {
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  mode: 'system',
  setMode: () => {},
  colors: lightColors,
});

// Navigation theme derived from our tokens
function buildNavigationTheme(isDark: boolean) {
  const base = isDark ? DarkTheme : DefaultTheme;
  const c = isDark ? darkColors : lightColors;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.bg,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.primary,
    },
  };
}

export { ThemeContext, lightColors, darkColors, buildNavigationTheme };

// Hooks
export function useTheme() {
  const ctx = useContext(ThemeContext);
  return {
    isDark: ctx.isDark,
    mode: ctx.mode,
    setMode: ctx.setMode,
  };
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}

// Provider helper — used in _layout.tsx
export function useThemeProvider(persistedMode?: ThemeMode) {
  const systemScheme = useSystemColorScheme();
  const [mode, setMode] = useState<ThemeMode>(persistedMode ?? 'system');

  const isDark = useMemo(() => {
    if (mode === 'system') return systemScheme === 'dark';
    return mode === 'dark';
  }, [mode, systemScheme]);

  const themeColors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);
  const navigationTheme = useMemo(() => buildNavigationTheme(isDark), [isDark]);

  const value: ThemeContextValue = useMemo(
    () => ({ isDark, mode, setMode, colors: themeColors }),
    [isDark, mode, themeColors]
  );

  return { value, navigationTheme, ThemeContext };
}
