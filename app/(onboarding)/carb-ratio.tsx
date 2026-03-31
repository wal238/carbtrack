import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>
          What is your carb ratio?
        </Text>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          {isExchanges
            ? 'Your carb ratio tells us how many exchanges are covered by 1 unit of insulin.'
            : 'Your carb ratio tells us how many grams of carbs are covered by 1 unit of insulin.'}
        </Text>

        <DisclaimerBanner variant="warning" text={DISCLAIMERS.carbRatioBanner} />

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

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          You can change this anytime in Settings.
        </Text>
        {!!validationMessage && (
          <Text style={styles.validationText}>{validationMessage}</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth disabled={!isValidRatio} onPress={handleNext}>
          Next
        </Button>
      </View>
      <View style={styles.mascotFloat}>
        <Mascot animate size={60} expression="lookUp" />
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
