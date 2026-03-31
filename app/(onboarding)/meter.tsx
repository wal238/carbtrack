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
import { spacing, typography } from '@/constants/tokens';

const METER_OPTIONS = [
  { label: 'Accu-Chek Aviva Connect', value: 'accu-chek-aviva' },
  { label: 'Accu-Chek Guide', value: 'accu-chek-guide' },
  { label: 'FreeStyle Libre', value: 'freestyle-libre' },
  { label: 'Other device', value: 'other' },
];

export default function MeterScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, meter, setField } = useOnboardingStore();
  const [selected, setSelected] = useState<string | null>(meter);
  const progress = getOnboardingProgress('meter', insulinTherapy);

  function handleSelect(value: string) {
    setSelected(value);
    setField('meter', value);
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
          Which meter do you use?
        </Text>

        <View style={styles.options}>
          {METER_OPTIONS.map((option) => (
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
          onPress={() => router.push('/(onboarding)/units')}
        >
          Confirm
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
