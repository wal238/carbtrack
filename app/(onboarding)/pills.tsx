import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Mascot } from '@/components/Mascot';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography } from '@/constants/tokens';

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
      <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={progress.total} current={progress.current} />
      </View>

      <View style={styles.content}>
        <View style={styles.mascotWrapper}>
          <Mascot animate size={60} expression="neutral" />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          Do you take pills?
        </Text>

        <View style={styles.cardWrapper}>
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
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/meter')}
        >
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
