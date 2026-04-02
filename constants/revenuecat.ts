export const REVENUECAT_API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? '',
};

export const ENTITLEMENTS = {
  pro: 'Preflightai .io Pro',
} as const;

export const PRODUCT_IDS = {
  monthly: 'carbtrack_pro_monthly',
  yearly: 'carbtrack_pro_yearly',
  lifetime: 'carbtrack_pro_lifetime',
} as const;
