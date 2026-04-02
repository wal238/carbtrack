import { useState } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography } from '@/constants/tokens';
import type { DiabetesType } from '@/lib/types';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

const OPTIONS: { label: string; value: DiabetesType }[] = [
  { label: 'Type 1', value: 'type1' },
  { label: 'Type 2', value: 'type2' },
  { label: 'LADA', value: 'lada' },
  { label: 'MODY', value: 'mody' },
  { label: 'Gestational diabetes', value: 'gestational' },
  { label: 'Other', value: 'other' },
];

export default function DiabetesTypeScreen() {
  const colors = useThemeColors();
  const { setField, insulinTherapy, diabetesType } = useOnboardingStore();
  const [selected, setSelected] = useState<DiabetesType | null>(diabetesType);
  const progress = getOnboardingProgress('diabetes-type', insulinTherapy);

  function handleSelect(value: DiabetesType) {
    setSelected(value);
    setField('diabetesType', value);
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
            What is your diabetes type?
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={120} style={styles.options}>
          {OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              label={option.label}
              selected={selected === option.value}
              onPress={() => handleSelect(option.value)}
            />
          ))}
        </OnboardingMotionBlock>
      </ScrollView>

      <OnboardingMotionBlock delay={180} style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/insulin-therapy')}
        >
          Next
        </Button>
      </OnboardingMotionBlock>
      <OnboardingMotionBlock delay={220} style={styles.mascotFloat}>
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
  options: {
    gap: spacing.md,
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
