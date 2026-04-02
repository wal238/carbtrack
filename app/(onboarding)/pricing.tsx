import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Purchases from 'react-native-purchases';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useUserPreferencesStore, useOnboardingStore } from '@/lib/store';
import { useSubscriptionStore } from '@/lib/subscription-store';
import { presentPaywall } from '@/lib/present-paywall';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography, borderRadius, colors as tokenColors } from '@/constants/tokens';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

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

const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: null,
    features: FREE_FEATURES,
  },
  pro: {
    id: 'pro_monthly',
    name: 'CarbTrack Pro',
    priceFallback: '$4.99/mo',
    features: PRO_FEATURES,
  },
} as const;

export default function PricingScreen() {
  const colors = useThemeColors();
  const completeOnboarding = useUserPreferencesStore((s) => s.completeOnboarding);
  const onboardingStore = useOnboardingStore();
  const isInitialized = useSubscriptionStore((s) => s.isInitialized);
  const progress = getOnboardingProgress('pricing', onboardingStore.insulinTherapy);
  const [proPrice, setProPrice] = useState<string>(PLANS.pro.priceFallback);

  useEffect(() => {
    if (!isInitialized) return;

    Purchases.getOfferings()
      .then((offerings) => {
        const monthly = offerings.current?.monthly;
        if (monthly) {
          setProPrice(`${monthly.product.priceString}/mo`);
        }
      })
      .catch((err) => {
        if (__DEV__) console.warn('[Pricing] Failed to load offerings:', err);
      });
  }, [isInitialized]);

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
      <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
      <OnboardingMotionBlock style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </OnboardingMotionBlock>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingMotionBlock delay={60}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Choose your plan
          </Text>
        </OnboardingMotionBlock>
        <OnboardingMotionBlock delay={90}>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            Start free, upgrade anytime
          </Text>
        </OnboardingMotionBlock>

        {/* Free Plan */}
        <OnboardingMotionBlock delay={140}>
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
        </OnboardingMotionBlock>

        {/* Pro Plan */}
        <OnboardingMotionBlock delay={190}>
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
                  {proPrice}
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
        </OnboardingMotionBlock>
      </ScrollView>

      <OnboardingMotionBlock delay={240} style={styles.footer}>
        <Button fullWidth onPress={() => presentPaywall()}>
          Try Pro Free
        </Button>
        <Button fullWidth variant="ghost" onPress={handleContinue}>
          Continue with Free
        </Button>
        <Text style={[styles.footerNote, { color: colors.textMuted }]}>
          You can change your plan anytime in Settings.
        </Text>
      </OnboardingMotionBlock>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
