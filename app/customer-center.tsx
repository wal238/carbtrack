import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';
import { useThemeColors } from '@/lib/theme';

export default function CustomerCenterScreen() {
  const colors = useThemeColors();
  const [presented, setPresented] = useState(false);

  useEffect(() => {
    if (presented) return;
    setPresented(true);

    presentCustomerCenter();
  }, [presented]);

  async function presentCustomerCenter() {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (err) {
      if (__DEV__) console.error('[CustomerCenter] Error:', err);
      Alert.alert(
        'Something went wrong',
        'Unable to load subscription management. Please try again later.',
        [{ text: 'OK' }],
      );
    } finally {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }
  }

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
