// CarbTrack Design Tokens — PRD Section 3

// Brand Colors
export const colors = {
  primary: '#2EC4B6',
  primaryDark: '#22A89C',
  primaryMuted: '#E8FAF8',
  primarySoft: '#D0F4F0',
  secondary: '#4C7DFF',
  secondaryMuted: '#EEF2FF',

  // Glucose Range Colors
  glucose: {
    normal: '#22C55E',
    normalMuted: '#ECFDF5',
    warning: '#FACC15',
    warningMuted: '#FEFCE8',
    high: '#EF4444',
    highMuted: '#FEF2F2',
    low: '#3B82F6',
    lowMuted: '#EFF6FF',
  },

  // Semantic "on" text colors for colored backgrounds
  onPrimary: '#0F2027',
  onSecondary: '#FFFFFF',
  onWarning: '#5C4813',
  onHigh: '#FFFFFF',
  onNormal: '#FFFFFF',
  onLow: '#FFFFFF',

  // Light Mode Surfaces
  light: {
    bg: '#F5F7FA',
    surface: '#FFFFFF',
    border: '#E2E6ED',
    borderFaint: '#EEF1F5',
    text: '#0F2027',
    textSecondary: '#5A6B78',
    textMuted: '#6B7C89',
  },

  // Dark Mode Surfaces
  dark: {
    bg: '#0F2027',
    surface: '#1A2F38',
    border: '#2A4550',
    borderFaint: '#1A2F38',
    text: '#FFFFFF',
    textSecondary: '#94B3C0',
    textMuted: '#5A7A88',
  },

  // Meal Colors (for charts)
  meals: {
    breakfast: '#2EC4B6',
    lunch: '#4C7DFF',
    dinner: '#F59E0B',
    snack: '#A78BFA',
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    display: 'Nunito_800ExtraBold',
    heading: 'Nunito_700Bold',
    title: 'Nunito_800ExtraBold',
    bodySemiBold: 'Outfit_600SemiBold',
    body: 'Outfit_400Regular',
    caption: 'Outfit_500Medium',
    tiny: 'Outfit_700Bold',
    micro: 'Outfit_500Medium',
  },
  fontSize: {
    display: 36,
    heading: 24,
    title: 20,
    bodySemiBold: 17,
    body: 15,
    caption: 13,
    tiny: 11,
    micro: 10,
  },
  fontWeight: {
    display: '800' as const,
    heading: '700' as const,
    title: '800' as const,
    bodySemiBold: '600' as const,
    body: '400' as const,
    caption: '500' as const,
    tiny: '700' as const,
    micro: '500' as const,
  },
} as const;

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

// Border Radius
export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 999,
} as const;

// Shadows (light mode only — dark mode uses borders)
export const shadows = {
  card: {
    shadowColor: '#0F2027',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F2027',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
} as const;

// Glucose Thresholds (mmol/L)
export const glucoseThresholds = {
  mmol: {
    veryLow: 3.0,
    low: 3.9,
    targetHigh: 10.0,
    veryHigh: 13.9,
  },
  mgdl: {
    veryLow: 54,
    low: 70,
    targetHigh: 180,
    veryHigh: 250,
  },
} as const;
