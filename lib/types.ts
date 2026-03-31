import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// Unit Types
export type GlucoseUnit = 'mgdl' | 'mmol';
export type CarbUnit = 'grams' | 'exchanges';
export type ThemeMode = 'light' | 'dark' | 'system';
export type GlucoseRangeLabel = 'low' | 'normal' | 'warning' | 'high';

// Enum-like Maps
export const DIABETES_TYPES = {
  type1: 'Type 1',
  type2: 'Type 2',
  lada: 'LADA',
  mody: 'MODY',
  gestational: 'Gestational diabetes',
  other: 'Other',
} as const;

export const INSULIN_THERAPIES = {
  pen_syringes: 'Pen / Syringes',
  pump: 'Pump',
  no_insulin: 'No insulin',
} as const;

export const MEAL_TYPES = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
} as const;

export const DOSE_TYPES = {
  food: 'Food',
  correction: 'Correction',
  long_acting: 'Long acting',
} as const;

export const USER_GOALS = {
  better_management: 'Better diabetes management',
  better_carb_counting: 'Better carb counting',
  lose_weight: 'Lose weight',
  learn_nutrition: 'Learn about nutrition',
} as const;

export type DiabetesType = keyof typeof DIABETES_TYPES;
export type InsulinTherapy = keyof typeof INSULIN_THERAPIES;
export type MealType = keyof typeof MEAL_TYPES;
export type DoseType = keyof typeof DOSE_TYPES;
export type UserGoal = keyof typeof USER_GOALS;

// Data Models (PRD Section 8)
export interface User {
  id: string;
  email: string;
  created_at: string;
  diabetes_type: DiabetesType;
  insulin_therapy: InsulinTherapy;
  takes_pills: boolean;
  meter: string;
  glucose_unit: GlucoseUnit;
  carb_unit: CarbUnit;
  carb_ratio: number;
  daily_carb_target: number | null;
  range_very_high: number;
  range_target_high: number;
  range_target_low: number;
  range_very_low: number;
  disclaimer_accepted: boolean;
  disclaimer_accepted_at: string | null;
  theme: ThemeMode;
  onboarding_completed: boolean;
}

export interface GlucoseLog {
  id: string;
  user_id: string;
  value: number;
  unit: GlucoseUnit;
  logged_at: string;
  tag: string | null;
  created_at: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  meal_type: MealType;
  total_carbs: number;
  logged_at: string;
  created_at: string;
}

export interface MealItem {
  id: string;
  meal_log_id: string;
  name: string;
  carbs: number;
  calories: number | null;
  confidence: number | null;
  source: 'manual' | 'camera_scan';
}

export interface InsulinLog {
  id: string;
  user_id: string;
  dose: number;
  dose_type: DoseType;
  calculated_from_carbs: number | null;
  calculated_from_ratio: number | null;
  logged_at: string;
  created_at: string;
}

// Onboarding State
export interface OnboardingState {
  currentStep: number;
  diabetesType: DiabetesType | null;
  insulinTherapy: InsulinTherapy | null;
  takesPills: boolean | null;
  meter: string | null;
  glucoseUnit: GlucoseUnit;
  carbUnit: CarbUnit;
  carbRatio: number;
  dailyCarbTarget: number | null;
  rangeVeryHigh: number;
  rangeTargetHigh: number;
  rangeTargetLow: number;
  disclaimerAccepted: boolean;
  completed: boolean;
}

// Component Prop Interfaces

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'surface' | 'outline' | 'ghost' | 'accent' | 'dkSurface';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  onPress: () => void;
  hapticType?: 'heavy' | 'medium' | 'light' | 'none';
}

export interface CardProps {
  children: ReactNode;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

export interface FieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  unit?: string;
  icon?: ReactNode;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}

export interface RadioCardProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
}

export interface ChipOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ChipsProps {
  options: ChipOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export interface TogglePillProps {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
}

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string | ReactNode;
}

export interface MascotProps {
  size?: number;
  expression?: 'happy' | 'wink' | 'neutral' | 'lookUp';
  glow?: boolean;
  animate?: boolean;
}

export interface AppIconProps {
  size?: number;
}

export interface DisclaimerBannerProps {
  variant: 'warning' | 'danger';
  text: string;
}

// Chart Data Types
export interface GlucoseDataPoint {
  time: string;
  value: number;
  unit: GlucoseUnit;
}

export interface InsulinDoseMarker {
  time: string;
  dose: number;
}

export interface CarbDay {
  day: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
}
