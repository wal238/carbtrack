import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type {
  ThemeMode,
  GlucoseUnit,
  CarbUnit,
  DiabetesType,
  InsulinTherapy,
  UserGoal,
} from '@/lib/types';

// Custom storage adapter for expo-secure-store
const secureStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
}));

// Onboarding Store (session-based, not persisted)
interface OnboardingStore {
  currentStep: number;
  diabetesType: DiabetesType | null;
  insulinTherapy: InsulinTherapy | null;
  takesPills: boolean | null;
  meter: string | null;
  goal: UserGoal | null;
  glucoseUnit: GlucoseUnit;
  carbUnit: CarbUnit;
  carbRatio: number;
  dailyCarbTarget: number | null;
  rangeVeryHigh: number;
  rangeTargetHigh: number;
  rangeTargetLow: number;
  disclaimerAccepted: boolean;
  completed: boolean;

  setField: <K extends keyof OnboardingStore>(key: K, value: OnboardingStore[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const onboardingDefaults = {
  currentStep: 0,
  diabetesType: null as DiabetesType | null,
  insulinTherapy: null as InsulinTherapy | null,
  takesPills: null as boolean | null,
  meter: null as string | null,
  goal: null as UserGoal | null,
  glucoseUnit: 'mmol' as GlucoseUnit,
  carbUnit: 'grams' as CarbUnit,
  carbRatio: 10,
  dailyCarbTarget: null as number | null,
  rangeVeryHigh: 13.9,
  rangeTargetHigh: 10.0,
  rangeTargetLow: 3.9,
  disclaimerAccepted: false,
  completed: false,
};

export const useOnboardingStore = create<OnboardingStore>()((set) => ({
  ...onboardingDefaults,

  setField: (key, value) => set({ [key]: value }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  completeOnboarding: () => set({ completed: true }),
  reset: () => set(onboardingDefaults),
}));

// User Preferences Store (persisted with expo-secure-store)
interface UserPreferencesStore {
  themeMode: ThemeMode;
  glucoseUnit: GlucoseUnit;
  carbUnit: CarbUnit;
  carbRatio: number;
  dailyCarbTarget: number | null;
  rangeVeryHigh: number;
  rangeTargetHigh: number;
  rangeTargetLow: number;
  disclaimerAccepted: boolean;
  disclaimerAcceptedAt: string | null;
  onboardingCompleted: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setGlucoseUnit: (unit: GlucoseUnit) => void;
  setCarbUnit: (unit: CarbUnit) => void;
  setCarbRatio: (ratio: number) => void;
  setDailyCarbTarget: (target: number | null) => void;
  setRanges: (ranges: {
    rangeVeryHigh: number;
    rangeTargetHigh: number;
    rangeTargetLow: number;
  }) => void;
  acceptDisclaimer: () => void;
  completeOnboarding: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      themeMode: 'system',
      glucoseUnit: 'mmol',
      carbUnit: 'grams',
      carbRatio: 10,
      dailyCarbTarget: null,
      rangeVeryHigh: 13.9,
      rangeTargetHigh: 10.0,
      rangeTargetLow: 3.9,
      disclaimerAccepted: false,
      disclaimerAcceptedAt: null,
      onboardingCompleted: false,

      setThemeMode: (mode) => set({ themeMode: mode }),
      setGlucoseUnit: (unit) => set({ glucoseUnit: unit }),
      setCarbUnit: (unit) => set({ carbUnit: unit }),
      setCarbRatio: (ratio) => set({ carbRatio: ratio }),
      setDailyCarbTarget: (target) => set({ dailyCarbTarget: target }),
      setRanges: (ranges) => set(ranges),
      acceptDisclaimer: () =>
        set({ disclaimerAccepted: true, disclaimerAcceptedAt: new Date().toISOString() }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
    }),
    {
      name: 'carbtrack-preferences',
      storage: secureStorage,
    }
  )
);
