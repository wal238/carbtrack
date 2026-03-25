import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type {
  GlucoseLog,
  GlucoseUnit,
  MealLog,
  MealItem,
  MealType,
  InsulinLog,
  DoseType,
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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Glucose Log Store
interface GlucoseLogStore {
  logs: GlucoseLog[];
  addLog: (log: Omit<GlucoseLog, 'id' | 'created_at'>) => void;
  deleteLog: (id: string) => void;
  getLogsForDate: (date: string) => GlucoseLog[];
  getLogsForRange: (startDate: string, endDate: string) => GlucoseLog[];
  clearAll: () => void;
}

export const useGlucoseLogStore = create<GlucoseLogStore>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (log) =>
        set((s) => ({
          logs: [
            ...s.logs,
            { ...log, id: generateId(), created_at: new Date().toISOString() },
          ],
        })),

      deleteLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      getLogsForDate: (date) =>
        get().logs.filter((l) => l.logged_at.startsWith(date)),

      getLogsForRange: (startDate, endDate) =>
        get().logs.filter((l) => {
          const logDate = l.logged_at.slice(0, 10);
          return logDate >= startDate && logDate <= endDate;
        }),

      clearAll: () => set({ logs: [] }),
    }),
    {
      name: 'carbtrack-glucose-logs',
      storage: secureStorage,
    }
  )
);

// Meal Log Store
interface MealLogStore {
  logs: MealLog[];
  items: MealItem[];
  addMeal: (
    log: Omit<MealLog, 'id' | 'created_at'>,
    items: Omit<MealItem, 'id' | 'meal_log_id'>[]
  ) => void;
  deleteMeal: (id: string) => void;
  getItemsForMeal: (mealLogId: string) => MealItem[];
  getMealsForDate: (date: string) => MealLog[];
  getTotalCarbsForDate: (date: string) => number;
  clearAll: () => void;
}

export const useMealLogStore = create<MealLogStore>()(
  persist(
    (set, get) => ({
      logs: [],
      items: [],

      addMeal: (log, mealItems) => {
        const mealId = generateId();
        const linkedItems = mealItems.map((item) => ({
          ...item,
          id: generateId(),
          meal_log_id: mealId,
        }));
        set((s) => ({
          logs: [
            ...s.logs,
            { ...log, id: mealId, created_at: new Date().toISOString() },
          ],
          items: [...s.items, ...linkedItems],
        }));
      },

      deleteMeal: (id) =>
        set((s) => ({
          logs: s.logs.filter((l) => l.id !== id),
          items: s.items.filter((i) => i.meal_log_id !== id),
        })),

      getItemsForMeal: (mealLogId) =>
        get().items.filter((i) => i.meal_log_id === mealLogId),

      getMealsForDate: (date) =>
        get().logs.filter((l) => l.logged_at.startsWith(date)),

      getTotalCarbsForDate: (date) =>
        get()
          .logs.filter((l) => l.logged_at.startsWith(date))
          .reduce((sum, l) => sum + l.total_carbs, 0),

      clearAll: () => set({ logs: [], items: [] }),
    }),
    {
      name: 'carbtrack-meal-logs',
      storage: secureStorage,
    }
  )
);

// Insulin Log Store
interface InsulinLogStore {
  logs: InsulinLog[];
  addLog: (log: Omit<InsulinLog, 'id' | 'created_at'>) => void;
  deleteLog: (id: string) => void;
  getLogsForDate: (date: string) => InsulinLog[];
  clearAll: () => void;
}

export const useInsulinLogStore = create<InsulinLogStore>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (log) =>
        set((s) => ({
          logs: [
            ...s.logs,
            { ...log, id: generateId(), created_at: new Date().toISOString() },
          ],
        })),

      deleteLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      getLogsForDate: (date) =>
        get().logs.filter((l) => l.logged_at.startsWith(date)),

      clearAll: () => set({ logs: [] }),
    }),
    {
      name: 'carbtrack-insulin-logs',
      storage: secureStorage,
    }
  )
);
