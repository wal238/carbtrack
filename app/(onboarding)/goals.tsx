import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
        <View style={styles.mascotSection}>
          <Mascot animate size={100} expression="wink" glow />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          What is your goal?
        </Text>

        <View style={styles.options}>
          {GOAL_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              label={option.label}
              sublabel={option.sublabel}
              selected={selected === option.value}
              onPress={() => handleSelect(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/carb-target')}
        >
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
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignSelf: 'flex-start' as const,
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
