import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { spacing, typography } from '@/constants/tokens';
import type { InsulinTherapy } from '@/lib/types';

const OPTIONS: { label: string; value: InsulinTherapy }[] = [
  { label: 'Pen / Syringes', value: 'pen_syringes' },
  { label: 'Pump', value: 'pump' },
  { label: 'No insulin', value: 'no_insulin' },
];

export default function InsulinTherapyScreen() {
  const colors = useThemeColors();
  const setField = useOnboardingStore((s) => s.setField);
  const [selected, setSelected] = useState<InsulinTherapy | null>(null);

  function handleSelect(value: InsulinTherapy) {
    setSelected(value);
    setField('insulinTherapy', value);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={9} current={1} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>
          What is your insulin therapy?
        </Text>

        <SectionLabel label="INSULIN THERAPY" />

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
      </ScrollView>

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/pills')}
        >
          Next
        </Button>
      </View>
      <View style={styles.mascotFloat}>
        <Mascot size={44} expression="happy" />
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
