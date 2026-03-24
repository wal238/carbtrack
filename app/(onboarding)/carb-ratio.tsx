import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { Field } from '@/components/ui/Field';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { spacing, typography, borderRadius } from '@/constants/tokens';
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
  const { carbRatio, setField, completeOnboarding } = useOnboardingStore();
  const [value, setValue] = useState(String(carbRatio));

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
    completeOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={9} current={7} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>
          What's your carb ratio?
        </Text>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Your carb ratio tells us how many grams of carbs are covered by 1 unit of insulin.
        </Text>

        <DisclaimerBanner variant="warning" text={DISCLAIMERS.carbRatioBanner} />

        <Card>
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
              1 unit of insulin covers
            </Text>

            <View style={[styles.valueDisplay, { borderColor: colors.primary }]}>
              <Text style={[styles.valueText, { color: colors.text }]}>
                {value}
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
              unit="g per 1U"
              keyboardType="numeric"
            />
          </View>
        </Card>

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          You can change this anytime in Settings.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth onPress={handleNext}>
          Next
        </Button>
      </View>
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
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
