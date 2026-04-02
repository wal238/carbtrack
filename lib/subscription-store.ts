import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import Purchases, { type CustomerInfo } from 'react-native-purchases';
import { REVENUECAT_API_KEYS, ENTITLEMENTS } from '@/constants/revenuecat';
import type { SubscriptionStatus } from '@/lib/types';

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

interface SubscriptionStore {
  // Persisted state
  isProActive: boolean;
  status: SubscriptionStatus;
  expirationDate: string | null;
  productId: string | null;
  willRenew: boolean;

  // Transient state
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  reset: () => void;
}

function updateFromCustomerInfo(
  customerInfo: CustomerInfo,
  set: (partial: Partial<SubscriptionStore>) => void,
) {
  const entitlement = customerInfo.entitlements.active[ENTITLEMENTS.pro];

  if (entitlement) {
    set({
      isProActive: true,
      status: 'active',
      expirationDate: entitlement.expirationDate ?? null,
      productId: entitlement.productIdentifier ?? null,
      willRenew: entitlement.willRenew ?? false,
      error: null,
    });
  } else {
    const hadEntitlement = customerInfo.entitlements.all[ENTITLEMENTS.pro];
    set({
      isProActive: false,
      status: hadEntitlement ? 'expired' : 'none',
      expirationDate: null,
      productId: null,
      willRenew: false,
    });
  }
}

const defaults = {
  isProActive: false,
  status: 'none' as SubscriptionStatus,
  expirationDate: null as string | null,
  productId: null as string | null,
  willRenew: false,
  isInitialized: false,
  isLoading: false,
  error: null as string | null,
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      ...defaults,

      initialize: async () => {
        if (get().isInitialized) return;

        try {
          const apiKey =
            Platform.OS === 'ios'
              ? REVENUECAT_API_KEYS.ios
              : REVENUECAT_API_KEYS.android;

          if (!apiKey) {
            if (__DEV__) console.warn('[RevenueCat] No API key for', Platform.OS);
            set({ isInitialized: true });
            return;
          }

          Purchases.configure({ apiKey });

          Purchases.addCustomerInfoUpdateListener((info) => {
            updateFromCustomerInfo(info, set);
          });

          const customerInfo = await Purchases.getCustomerInfo();
          updateFromCustomerInfo(customerInfo, set);
          set({ isInitialized: true });
        } catch (err) {
          if (__DEV__) console.error('[RevenueCat] Init failed:', err);
          set({
            isInitialized: true,
            error: 'Failed to initialize subscriptions',
          });
        }
      },

      refreshCustomerInfo: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
          const customerInfo = await Purchases.getCustomerInfo();
          updateFromCustomerInfo(customerInfo, set);
        } catch (err) {
          if (__DEV__) console.error('[RevenueCat] Refresh failed:', err);
          set({ error: 'Failed to refresh subscription status' });
        } finally {
          set({ isLoading: false });
        }
      },

      restorePurchases: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
          const customerInfo = await Purchases.restorePurchases();
          updateFromCustomerInfo(customerInfo, set);
        } catch (err) {
          if (__DEV__) console.error('[RevenueCat] Restore failed:', err);
          set({ error: 'Failed to restore purchases' });
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => set(defaults),
    }),
    {
      name: 'carbtrack-subscription',
      storage: secureStorage,
      partialize: (state) => ({
        isProActive: state.isProActive,
        status: state.status,
        expirationDate: state.expirationDate,
        productId: state.productId,
        willRenew: state.willRenew,
      }),
    },
  ),
);

export function useProAccess(): boolean {
  return useSubscriptionStore((s) => s.isProActive);
}
