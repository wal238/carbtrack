import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { TogglePill } from '@/components/ui/TogglePill';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography } from '@/constants/tokens';

const GLUCOSE_OPTIONS = ['mg/dL', 'mmol/L'];
const CARB_OPTIONS = ['Grams', 'Exchanges'];

export default function UnitsScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, glucoseUnit, carbUnit, setField } = useOnboardingStore();
  const progress = getOnboardingProgress('units', insulinTherapy);

  const glucoseIndex = glucoseUnit === 'mgdl' ? 0 : 1;
  const carbIndex = carbUnit === 'exchanges' ? 1 : 0;

  function handleGlucoseSelect(index: number) {
    setField('glucoseUnit', index === 0 ? 'mgdl' : 'mmol');
  }

  function handleCarbSelect(index: number) {
    setField('carbUnit', index === 0 ? 'grams' : 'exchanges');
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
          What units do you use?
        </Text>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Ask your healthcare professional if unsure.
        </Text>

        <Card>
          <View style={styles.unitRows}>
            <View style={styles.unitRow}>
              <SectionLabel label="GLUCOSE" />
              <TogglePill
                options={GLUCOSE_OPTIONS}
                selected={glucoseIndex}
                onSelect={handleGlucoseSelect}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            <View style={styles.unitRow}>
              <SectionLabel label="CARBS" />
              <TogglePill
                options={CARB_OPTIONS}
                selected={carbIndex}
                onSelect={handleCarbSelect}
              />
            </View>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/ranges')}>
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
  helper: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    marginTop: -spacing.sm,
  },
  unitRows: {
    gap: spacing.base,
  },
  unitRow: {
    gap: spacing.md,
  },
  divider: {
    height: 1,
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
