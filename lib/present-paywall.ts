import { Alert } from 'react-native';
import Constants from 'expo-constants';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useSubscriptionStore } from '@/lib/subscription-store';

const isExpoGo = Constants.appOwnership === 'expo';

export async function presentPaywall(): Promise<boolean> {
  if (isExpoGo) {
    Alert.alert(
      'Dev Build Required',
      'RevenueCat paywall requires a development build. Run: npx expo run:ios',
    );
    return false;
  }

  try {
    const result = await RevenueCatUI.presentPaywall();

    if (__DEV__) console.log('[Paywall] Result:', result);

    if (
      result === PAYWALL_RESULT.PURCHASED ||
      result === PAYWALL_RESULT.RESTORED
    ) {
      await useSubscriptionStore.getState().refreshCustomerInfo();
      return true;
    }

    return false;
  } catch (err) {
    if (__DEV__) console.error('[Paywall] Error:', err);
    Alert.alert(
      'Something went wrong',
      'Unable to load subscriptions. Please try again later.',
    );
    return false;
  }
}
