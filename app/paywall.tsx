import { useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, AppState } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useSubscriptionStore } from '@/lib/subscription-store';
import { useThemeColors } from '@/lib/theme';

const isExpoGo = Constants.appOwnership === 'expo';

export default function PaywallScreen() {
  const colors = useThemeColors();
  const hasPresented = useRef(false);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  useEffect(() => {
    if (hasPresented.current) return;
    hasPresented.current = true;

    if (isExpoGo) {
      Alert.alert(
        'Dev Build Required',
        'RevenueCat paywall requires a development build. Run: npx expo run:ios',
        [{ text: 'OK', onPress: goBack }],
      );
      return;
    }

    (async () => {
      try {
        const result = await RevenueCatUI.presentPaywall();

        if (__DEV__) console.log('[Paywall] Result:', result);

        if (
          result === PAYWALL_RESULT.PURCHASED ||
          result === PAYWALL_RESULT.RESTORED
        ) {
          await useSubscriptionStore.getState().refreshCustomerInfo();
        }
      } catch (err) {
        if (__DEV__) console.error('[Paywall] Error:', err);
        Alert.alert(
          'Something went wrong',
          'Unable to load subscriptions. Please try again later.',
          [{ text: 'OK' }],
        );
      }

      // Navigate back after the native paywall is fully dismissed
      goBack();
    })();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
