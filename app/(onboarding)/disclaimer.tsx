import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress, nextAfterDisclaimer } from '@/lib/onboarding-flow';
import { spacing, typography, colors as tokenColors } from '@/constants/tokens';
import { DISCLAIMERS } from '@/constants/disclaimers';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

export default function DisclaimerScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, disclaimerAccepted, setField } = useOnboardingStore();
  const [accepted, setAccepted] = useState(disclaimerAccepted);
  const progress = getOnboardingProgress('disclaimer', insulinTherapy);

  function handleToggle() {
    const next = !accepted;
    setAccepted(next);
    setField('disclaimerAccepted', next);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
      <OnboardingMotionBlock style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </OnboardingMotionBlock>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <OnboardingMotionBlock delay={60} style={styles.iconWrapper}>
          <Ionicons name="alert-circle" size={56} color={tokenColors.glucose.high} />
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={90}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Important Disclaimer
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={140}>
        <Card>
          <View style={styles.cardContent}>
            <DisclaimerBanner variant="danger" text={DISCLAIMERS.onboarding.body} />

            <View style={styles.bullets}>
              {DISCLAIMERS.onboarding.bullets.map((bullet, index) => (
                <View key={index} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: colors.textSecondary }]}>{'\u2022'}</Text>
                  <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={190}>
        <Checkbox
          checked={accepted}
          onToggle={handleToggle}
          label={DISCLAIMERS.onboarding.checkbox}
        />
        </OnboardingMotionBlock>
      </ScrollView>

      <OnboardingMotionBlock delay={240} style={styles.footer}>
        <Button
          fullWidth
          disabled={!accepted}
          onPress={() => router.push(nextAfterDisclaimer(insulinTherapy))}
        >
          I Understand
        </Button>
      </OnboardingMotionBlock>
      <OnboardingMotionBlock delay={270} style={styles.mascotFloat}>
        <Mascot animate size={60} expression="lookUp" />
      </OnboardingMotionBlock>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotsWrapper: {
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
    textAlign: 'center',
  },
  cardContent: {
    gap: spacing.base,
  },
  bullets: {
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bulletDot: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  mascotFloat: {
    position: 'absolute',
    bottom: 90,
    left: 20,
  },
});
