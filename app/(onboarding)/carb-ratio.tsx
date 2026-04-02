import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { Field } from '@/components/ui/Field';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography, borderRadius, colors as tokenColors } from '@/constants/tokens';
import { DISCLAIMERS } from '@/constants/disclaimers';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

const QUICK_VALUES = [
  { label: '5', value: '5' },
  { label: '8', value: '8' },
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '15', value: '15' },
];

export default function CarbRatioScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, carbRatio, carbUnit, setField } = useOnboardingStore();
  const [value, setValue] = useState(String(carbRatio));
  const progress = getOnboardingProgress('carb-ratio', insulinTherapy);

  const isExchanges = carbUnit === 'exchanges';
  const unitLabel = isExchanges ? 'exchanges per 1U' : 'g per 1U';

  function handleChipSelect(chipValue: string) {
    setValue(chipValue);
    setField('carbRatio', Number(chipValue));
  }

  function handleCustomInput(text: string) {
    setValue(text);
    const num = Number(text);
    if (!isNaN(num) && num > 0) {
      setField('carbRatio', num);
    }
  }

  function handleNext() {
    if (!isValidRatio) return;
    // Save carb ratio to session store before moving on
    setField('carbRatio', ratioValue);
    router.push('/(onboarding)/goals');
  }

  const ratioValue = Number(value);
  const isValidRatio = Number.isFinite(ratioValue) && ratioValue > 0 && ratioValue <= 100;
  let validationMessage = '';
  if (value.trim() === '') {
    validationMessage = 'Enter your carb ratio to continue.';
  } else if (!isValidRatio) {
    validationMessage = 'Use a valid ratio between 1 and 100.';
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
      <OnboardingMotionBlock style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </OnboardingMotionBlock>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <OnboardingMotionBlock delay={60}>
          <Text style={[styles.heading, { color: colors.text }]}>
            What is your carb ratio?
          </Text>
        </OnboardingMotionBlock>
        <OnboardingMotionBlock delay={90}>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          {isExchanges
            ? 'Your carb ratio tells us how many exchanges are covered by 1 unit of insulin.'
            : 'Your carb ratio tells us how many grams of carbs are covered by 1 unit of insulin.'}
        </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={130}>
          <DisclaimerBanner variant="warning" text={DISCLAIMERS.carbRatioBanner} />
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={170}>
        <Card>
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              1 unit of insulin covers
            </Text>

            <View style={[styles.valueDisplay, { borderColor: colors.primary }]}>
              <Text style={[styles.valueText, { color: colors.text }]}>
                {value || '--'}
              </Text>
            </View>

            <Chips
              options={QUICK_VALUES}
              selected={value}
              onSelect={handleChipSelect}
            />

            <Field
              placeholder="Custom value"
              value={QUICK_VALUES.some((q) => q.value === value) ? '' : value}
              onChangeText={handleCustomInput}
              unit={unitLabel}
              keyboardType="numeric"
            />
          </View>
        </Card>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={210}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          You can change this anytime in Settings.
        </Text>
        </OnboardingMotionBlock>
        {!!validationMessage && (
          <OnboardingMotionBlock delay={240}>
            <Text style={styles.validationText}>{validationMessage}</Text>
          </OnboardingMotionBlock>
        )}
      </ScrollView>

      <OnboardingMotionBlock delay={270} style={styles.footer}>
        <Button fullWidth disabled={!isValidRatio} onPress={handleNext}>
          Next
        </Button>
      </OnboardingMotionBlock>
      <OnboardingMotionBlock delay={300} style={styles.mascotFloat}>
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
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
  helper: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: 22,
    marginTop: -spacing.sm,
  },
  cardContent: {
    gap: spacing.base,
  },
  cardLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
  },
  valueDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    borderWidth: 2,
    borderRadius: borderRadius.md,
  },
  valueText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.display,
  },
  footerText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
  validationText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    color: tokenColors.glucose.high,
    textAlign: 'center',
    marginTop: -spacing.sm,
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
