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
import { USER_GOALS } from '@/lib/types';
import type { UserGoal } from '@/lib/types';
import { spacing, typography } from '@/constants/tokens';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

const GOAL_OPTIONS: { value: UserGoal; label: string; sublabel: string }[] = [
  {
    value: 'better_management',
    label: USER_GOALS.better_management,
    sublabel: 'Track glucose, insulin & carbs in one place',
  },
  {
    value: 'better_carb_counting',
    label: USER_GOALS.better_carb_counting,
    sublabel: 'Snap a photo, get carb estimates instantly',
  },
  {
    value: 'lose_weight',
    label: USER_GOALS.lose_weight,
    sublabel: 'Understand what you eat and make better choices',
  },
  {
    value: 'learn_nutrition',
    label: USER_GOALS.learn_nutrition,
    sublabel: 'Build healthy habits with food insights',
  },
];

export default function GoalsScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, goal, setField } = useOnboardingStore();
  const [selected, setSelected] = useState<UserGoal | null>(goal);
  const progress = getOnboardingProgress('goals', insulinTherapy);

  function handleSelect(value: UserGoal) {
    setSelected(value);
    setField('goal', value);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryMuted }]}>
      <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
      <OnboardingMotionBlock style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </OnboardingMotionBlock>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingMotionBlock delay={60} style={styles.mascotSection}>
          <Mascot animate size={100} expression="wink" glow />
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={100}>
          <Text style={[styles.heading, { color: colors.text }]}>
            What is your goal?
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={150} style={styles.options}>
          {GOAL_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              label={option.label}
              sublabel={option.sublabel}
              selected={selected === option.value}
              onPress={() => handleSelect(option.value)}
            />
          ))}
        </OnboardingMotionBlock>
      </ScrollView>

      <OnboardingMotionBlock delay={210} style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/carb-target')}
        >
          Next
        </Button>
      </OnboardingMotionBlock>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  dotsWrapper: {
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  mascotSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    gap: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
