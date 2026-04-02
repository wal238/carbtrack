import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useThemeProvider } from '@/lib/theme';
import { useUserPreferencesStore } from '@/lib/store';
import { useSubscriptionStore } from '@/lib/subscription-store';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const themeMode = useUserPreferencesStore((s) => s.themeMode);
  const onboardingCompleted = useUserPreferencesStore((s) => s.onboardingCompleted);
  const { value, navigationTheme, ThemeContext: Ctx } = useThemeProvider(themeMode);

  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const initSubscription = useSubscriptionStore((s) => s.initialize);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      initSubscription();
    }
  }, [fontsLoaded, initSubscription]);

  const segments = useSegments();

  useEffect(() => {
    if (!fontsLoaded) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!onboardingCompleted && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (onboardingCompleted && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [onboardingCompleted, fontsLoaded, segments]);

  if (!fontsLoaded) return null;

  return (
    <Ctx.Provider value={value}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="new-entry" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="paywall" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="customer-center" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </Ctx.Provider>
  );
}
