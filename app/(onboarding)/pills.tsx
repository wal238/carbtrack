import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Mascot } from '@/components/Mascot';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography } from '@/constants/tokens';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

export default function PillsScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, takesPills, setField } = useOnboardingStore();
  const [selected, setSelected] = useState<boolean | null>(takesPills);
  const progress = getOnboardingProgress('pills', insulinTherapy);

  function handleSelect(value: boolean) {
    setSelected(value);
    setField('takesPills', value);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
      <OnboardingMotionBlock style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </OnboardingMotionBlock>

      <View style={styles.content}>
        <OnboardingMotionBlock delay={60} style={styles.mascotWrapper}>
          <Mascot animate size={60} expression="neutral" />
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={100}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Do you take pills?
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={150} style={styles.cardWrapper}>
          <Card>
            <View style={styles.options}>
              <RadioCard
                label="Yes"
                selected={selected === true}
                onPress={() => handleSelect(true)}
              />
              <RadioCard
                label="No"
                selected={selected === false}
                onPress={() => handleSelect(false)}
              />
            </View>
          </Card>
        </OnboardingMotionBlock>
      </View>

      <OnboardingMotionBlock delay={210} style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/meter')}
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    alignItems: 'center',
  },
  mascotWrapper: {
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
    textAlign: 'center',
  },
  cardWrapper: {
    alignSelf: 'stretch',
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
