import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useUserPreferencesStore, useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography, borderRadius, colors as tokenColors } from '@/constants/tokens';

const FREE_FEATURES = [
  'Manual carb entry',
  'Glucose logging',
  'Insulin dose calculator',
  'Basic reports',
];

const PRO_FEATURES = [
  'Everything in Free, plus…',
  'Unlimited food photo scans',
  'AI-powered carb estimation',
  'Advanced reports & trends',
];

// Structured for easy RevenueCat integration later
const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: null,
    features: FREE_FEATURES,
  },
  pro: {
    id: 'pro_monthly', // Will match RevenueCat offering ID
    name: 'CarbTrack Pro',
    price: '$4.99/mo', // Placeholder — will come from RevenueCat
    features: PRO_FEATURES,
  },
} as const;

export default function PricingScreen() {
  const colors = useThemeColors();
  const completeOnboarding = useUserPreferencesStore((s) => s.completeOnboarding);
  const onboardingStore = useOnboardingStore();
  const progress = getOnboardingProgress('pricing', onboardingStore.insulinTherapy);

  function handleContinue() {
    // Commit onboarding selections to persisted preferences
    const prefs = useUserPreferencesStore.getState();
    prefs.setGlucoseUnit(onboardingStore.glucoseUnit);
    prefs.setCarbUnit(onboardingStore.carbUnit);
    prefs.setCarbRatio(onboardingStore.carbRatio);
    prefs.setRanges({
      rangeVeryHigh: onboardingStore.rangeVeryHigh,
      rangeTargetHigh: onboardingStore.rangeTargetHigh,
      rangeTargetLow: onboardingStore.rangeTargetLow,
    });
    if (onboardingStore.disclaimerAccepted) {
      prefs.acceptDisclaimer();
    }
    completeOnboarding();

    // Mark session store as completed
    onboardingStore.completeOnboarding();

    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, { color: colors.text }]}>
          Choose your plan
        </Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          Start free, upgrade anytime
        </Text>

        {/* Free Plan */}
        <Card>
          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: colors.text }]}>
              {PLANS.free.name}
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.bg }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                Current
              </Text>
            </View>
          </View>
          <View style={styles.featureList}>
            {PLANS.free.features.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Pro Plan */}
        <View
          style={[
            styles.proCardWrapper,
            {
              borderColor: colors.primary,
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <View style={styles.proCardInner}>
            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planName, { color: colors.text }]}>
                  {PLANS.pro.name}
                </Text>
                <Text style={[styles.priceText, { color: colors.textSecondary }]}>
                  {PLANS.pro.price}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.badgeText, { color: colors.onPrimary }]}>
                  BEST VALUE
                </Text>
              </View>
            </View>
            <View style={styles.featureList}>
              {PLANS.pro.features.map((feature, index) => {
                const isHighlight = feature === 'Unlimited food photo scans';
                return (
                  <View key={feature} style={styles.featureRow}>
                    <Ionicons
                      name={isHighlight ? 'camera' : 'checkmark-circle'}
                      size={20}
                      color={isHighlight ? tokenColors.secondary : colors.primary}
                    />
                    <Text
                      style={[
                        styles.featureText,
                        { color: colors.text },
                        isHighlight && styles.featureHighlight,
                      ]}
                    >
                      {feature}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {/* TODO: Wire up RevenueCat purchase flow */}
        <Button fullWidth disabled>
          Try Pro Free (Coming Soon)
        </Button>
        <Button fullWidth variant="ghost" onPress={handleContinue}>
          Continue with Free
        </Button>
        <Text style={[styles.footerNote, { color: colors.textMuted }]}>
          Subscriptions are not available yet. You can continue with Free now and upgrade later.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignSelf: 'flex-start' as const,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  dotsWrapper: {
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
    marginTop: spacing.base,
  },
  subtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    marginTop: -spacing.sm,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  planName: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.title,
  },
  priceText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontFamily: typography.fontFamily.tiny,
    fontSize: typography.fontSize.tiny,
    fontWeight: typography.fontWeight.tiny,
  },
  featureList: {
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    flex: 1,
  },
  featureHighlight: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  proCardWrapper: {
    borderWidth: 2,
  },
  proCardInner: {
    padding: spacing.base,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  footerNote: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
});
