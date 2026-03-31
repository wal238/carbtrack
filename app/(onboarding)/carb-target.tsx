import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { Field } from '@/components/ui/Field';
import { RadioCard } from '@/components/ui/RadioCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography, borderRadius } from '@/constants/tokens';

type TargetMode = 'known' | 'help' | 'skip';

const SUGGESTED_TARGETS = [
  { label: 'Low-carb (50g)', value: '50' },
  { label: 'Moderate (130g)', value: '130' },
  { label: 'Standard (250g)', value: '250' },
];

const QUICK_VALUES = [
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '130', value: '130' },
  { label: '200', value: '200' },
  { label: '250', value: '250' },
];

export default function CarbTargetScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, dailyCarbTarget, carbUnit, setField } = useOnboardingStore();
  const [mode, setMode] = useState<TargetMode | null>(
    dailyCarbTarget ? 'known' : null
  );
  const [value, setValue] = useState(dailyCarbTarget ? String(dailyCarbTarget) : '');
  const progress = getOnboardingProgress('carb-target', insulinTherapy);

  const isExchanges = carbUnit === 'exchanges';
  const unitLabel = isExchanges ? 'exchanges' : 'g';

  function handleModeSelect(selected: TargetMode) {
    setMode(selected);
    if (selected === 'skip') {
      setField('dailyCarbTarget', null);
      setValue('');
    }
  }

  function handleChipSelect(chipValue: string) {
    setValue(chipValue);
    setField('dailyCarbTarget', Number(chipValue));
  }

  function handleSuggestionSelect(suggestionValue: string) {
    setValue(suggestionValue);
    setField('dailyCarbTarget', Number(suggestionValue));
    setMode('known');
  }

  function handleCustomInput(text: string) {
    setValue(text);
    const num = Number(text);
    if (!isNaN(num) && num > 0) {
      setField('dailyCarbTarget', num);
    }
  }

  function handleNext() {
    if (mode === 'skip') {
      setField('dailyCarbTarget', null);
    }
    router.push('/(onboarding)/pricing');
  }

  const numericValue = Number(value);
  const hasValidTarget =
    mode === 'skip' ||
    (Number.isFinite(numericValue) && numericValue > 0 && numericValue <= 1000);
  const canProceed = mode === 'skip' || (mode !== null && hasValidTarget && value !== '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryMuted }]}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
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
          <Mascot animate size={100} expression="happy" glow />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          Daily carb target
        </Text>
        <Text style={[styles.helper, { color: colors.textSecondary }]}>
          Setting a daily carb target helps you track your intake and stay on
          course throughout the day.
        </Text>

        <View style={styles.options}>
          <RadioCard
            label="I know my target"
            sublabel="Enter your daily carb goal"
            selected={mode === 'known'}
            onPress={() => handleModeSelect('known')}
          />
          <RadioCard
            label="Help me pick one"
            sublabel="Choose from common daily targets"
            selected={mode === 'help'}
            onPress={() => handleModeSelect('help')}
          />
          <RadioCard
            label="Skip for now"
            sublabel="You can set this later in Settings"
            selected={mode === 'skip'}
            onPress={() => handleModeSelect('skip')}
          />
        </View>

        {mode === 'known' && (
          <Card>
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Daily target
              </Text>

              <View style={[styles.valueDisplay, { borderColor: colors.primary }]}>
                <Text style={[styles.valueText, { color: colors.text }]}>
                  {value || '--'}
                </Text>
                <Text style={[styles.unitText, { color: colors.textSecondary }]}>
                  {unitLabel}
                </Text>
              </View>

              <Chips
                options={QUICK_VALUES}
                selected={value}
                onSelect={handleChipSelect}
              />

              <Field
                placeholder="Custom value"
                value={QUICK_VALUES.some((q) => q.value === value) ? '' : value}
                onChangeText={handleCustomInput}
                unit={unitLabel}
                keyboardType="numeric"
              />
            </View>
          </Card>
        )}

        {mode === 'help' && (
          <View style={styles.suggestions}>
            {SUGGESTED_TARGETS.map((suggestion) => (
              <RadioCard
                key={suggestion.value}
                label={suggestion.label}
                selected={value === suggestion.value}
                onPress={() => handleSuggestionSelect(suggestion.value)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth disabled={!canProceed} onPress={handleNext}>
          {mode === 'skip' ? 'Skip' : 'Next'}
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
  dotsWrapper: {
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
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
  helper: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: -spacing.sm,
  },
  options: {
    width: '100%',
    gap: spacing.md,
  },
  cardContent: {
    gap: spacing.base,
  },
  cardLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    height: 72,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  valueText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.display,
  },
  unitText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  suggestions: {
    width: '100%',
    gap: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
