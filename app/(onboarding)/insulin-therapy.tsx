import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress, nextAfterInsulin } from '@/lib/onboarding-flow';
import { spacing, typography } from '@/constants/tokens';
import type { InsulinTherapy } from '@/lib/types';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

const OPTIONS: { label: string; value: InsulinTherapy }[] = [
  { label: 'Pen / Syringes', value: 'pen_syringes' },
  { label: 'Pump', value: 'pump' },
  { label: 'No insulin', value: 'no_insulin' },
];

export default function InsulinTherapyScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, setField } = useOnboardingStore();
  const [selected, setSelected] = useState<InsulinTherapy | null>(insulinTherapy);
  const progress = getOnboardingProgress('insulin-therapy', insulinTherapy);

  function handleSelect(value: InsulinTherapy) {
    setSelected(value);
    setField('insulinTherapy', value);
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
            What is your insulin therapy?
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={110}>
          <SectionLabel label="INSULIN THERAPY" />
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={150}>
        <Card>
          <View style={styles.options}>
            {OPTIONS.map((option) => (
              <RadioCard
                key={option.value}
                label={option.label}
                selected={selected === option.value}
                onPress={() => handleSelect(option.value)}
              />
            ))}
          </View>
        </Card>
        </OnboardingMotionBlock>
      </ScrollView>

      <OnboardingMotionBlock delay={210} style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => {
            if (!selected) return;
            if (selected === 'no_insulin') {
              setField('takesPills', false);
              setField('meter', 'none');
            }
            router.push(nextAfterInsulin(selected));
          }}
        >
          Next
        </Button>
      </OnboardingMotionBlock>
      <OnboardingMotionBlock delay={240} style={styles.mascotFloat}>
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
