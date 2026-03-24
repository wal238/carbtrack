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
import { spacing, typography } from '@/constants/tokens';

export default function PillsScreen() {
  const colors = useThemeColors();
  const setField = useOnboardingStore((s) => s.setField);
  const [selected, setSelected] = useState<boolean | null>(null);

  function handleSelect(value: boolean) {
    setSelected(value);
    setField('takesPills', value);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={9} current={2} />
      </View>

      <View style={styles.content}>
        <View style={styles.mascotWrapper}>
          <Mascot size={60} expression="neutral" />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          Do you take pills?
        </Text>

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

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={selected === null}
          onPress={() => router.push('/(onboarding)/meter')}
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
  options: {
    gap: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
