import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedTabScreen } from '@/components/AnimatedTabScreen';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/lib/theme';
import { useUserPreferencesStore, useOnboardingStore } from '@/lib/store';
import { useSubscriptionStore } from '@/lib/subscription-store';
import { presentPaywall } from '@/lib/present-paywall';
import { spacing, typography, borderRadius } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppIcon } from '@/components/AppIcon';

export default function MoreScreen() {
  const colors = useThemeColors();
  const isProActive = useSubscriptionStore((s) => s.isProActive);
  const expirationDate = useSubscriptionStore((s) => s.expirationDate);
  const isLoading = useSubscriptionStore((s) => s.isLoading);
  const error = useSubscriptionStore((s) => s.error);
  const restorePurchases = useSubscriptionStore((s) => s.restorePurchases);

  function handleResetOnboarding() {
    useUserPreferencesStore.setState({ onboardingCompleted: false });
    useOnboardingStore.getState().reset();
    router.replace('/(onboarding)/welcome');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <AnimatedTabScreen tabIndex={4}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(220)}>
          <Text style={[styles.title, { color: colors.text }]}>More</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(70).duration(260)}>
          <Card>
            <View style={styles.appInfo}>
              <AppIcon size={48} />
              <View>
                <Text style={[styles.appName, { color: colors.text }]}>CarbTrack</Text>
                <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Subscription Section */}
        <Animated.View entering={FadeInDown.delay(140).duration(260)}>
          <Card>
            <View style={styles.devSection}>
              <Text style={[styles.devLabel, { color: colors.textMuted }]}>SUBSCRIPTION</Text>
              <View style={styles.subscriptionHeader}>
                <View style={styles.subscriptionInfo}>
                  <Ionicons
                    name={isProActive ? 'shield-checkmark' : 'shield-outline'}
                    size={24}
                    color={isProActive ? colors.primary : colors.textMuted}
                  />
                  <View>
                    <Text style={[styles.appName, { color: colors.text }]}>
                      {isProActive ? 'CarbTrack Pro' : 'Free Plan'}
                    </Text>
                    {isProActive && expirationDate && (
                      <Text style={[styles.version, { color: colors.textMuted }]}>
                        Renews {new Date(expirationDate).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isProActive ? colors.primarySoft : colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: isProActive ? colors.primary : colors.textMuted },
                    ]}
                  >
                    {isProActive ? 'Active' : 'Free'}
                  </Text>
                </View>
              </View>
              {isProActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onPress={() => router.push('/customer-center')}
                >
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onPress={() => presentPaywall()}
                >
                  Upgrade to Pro
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                disabled={isLoading}
                onPress={restorePurchases}
              >
                {isLoading ? 'Restoring...' : 'Restore Purchases'}
              </Button>
              {error && (
                <Text style={[styles.errorText, { color: colors.high }]}>{error}</Text>
              )}
            </View>
          </Card>
        </Animated.View>

        {__DEV__ && (
          <Animated.View entering={FadeInDown.delay(210).duration(260)}>
            <Card>
              <View style={styles.devSection}>
                <Text style={[styles.devLabel, { color: colors.textMuted }]}>DEV TOOLS</Text>
                <Button variant="outline" size="sm" onPress={handleResetOnboarding}>
                  Reset Onboarding
                </Button>
              </View>
            </Card>
          </Animated.View>
        )}
      </View>
      </AnimatedTabScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, gap: spacing.base },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: '800',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  appName: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.bodySemiBold,
    fontWeight: '600',
  },
  version: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  devSection: {
    gap: spacing.md,
  },
  devLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.micro,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    fontFamily: typography.fontFamily.tiny,
    fontSize: typography.fontSize.tiny,
    fontWeight: '700',
  },
  errorText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
});
