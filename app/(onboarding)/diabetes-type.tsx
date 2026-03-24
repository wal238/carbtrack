import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { spacing, typography } from '@/constants/tokens';
import type { DiabetesType } from '@/lib/types';

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
  const setField = useOnboardingStore((s) => s.setField);
  const [selected, setSelected] = useState<DiabetesType | null>(null);

  function handleSelect(value: DiabetesType) {
    setSelected(value);
    setField('diabetesType', value);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={9} current={0} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>
          What is your diabetes type?
        </Text>

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
      </ScrollView>

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/insulin-therapy')}
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
});
