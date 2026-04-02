import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { getOnboardingProgress } from '@/lib/onboarding-flow';
import { spacing, typography, colors as tokenColors, borderRadius } from '@/constants/tokens';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

export default function RangesScreen() {
  const colors = useThemeColors();
  const { insulinTherapy, rangeTargetHigh, rangeTargetLow, glucoseUnit, setField } = useOnboardingStore();
  const unitLabel = glucoseUnit === 'mmol' ? 'mmol/L' : 'mg/dL';
  const progress = getOnboardingProgress('ranges', insulinTherapy);

  const [highAbove, setHighAbove] = useState(String(rangeTargetHigh));
  const [goodLow, setGoodLow] = useState(String(rangeTargetLow));
  const [goodHigh, setGoodHigh] = useState(String(rangeTargetHigh));
  const [lowBelow, setLowBelow] = useState(String(rangeTargetLow));

  function handleHighAbove(text: string) {
    setHighAbove(text);
    setGoodHigh(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetHigh', num);
      setField('rangeVeryHigh', num);
    }
  }

  function handleGoodLow(text: string) {
    setGoodLow(text);
    setLowBelow(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetLow', num);
    }
  }

  function handleGoodHigh(text: string) {
    setGoodHigh(text);
    setHighAbove(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetHigh', num);
      setField('rangeVeryHigh', num);
    }
  }

  function handleLowBelow(text: string) {
    setLowBelow(text);
    setGoodLow(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetLow', num);
    }
  }

  const highValue = Number(highAbove);
  const lowValue = Number(goodLow);
  const hasValidNumbers = Number.isFinite(highValue) && Number.isFinite(lowValue) && highValue > 0 && lowValue > 0;
  const hasValidOrder = hasValidNumbers && lowValue < highValue;
  const isRangeValid = hasValidNumbers && hasValidOrder;

  let validationMessage = '';
  if (highAbove.trim() === '' || goodLow.trim() === '') {
    validationMessage = 'Enter both low and high target values.';
  } else if (!hasValidNumbers) {
    validationMessage = 'Use valid positive numbers for your ranges.';
  } else if (!hasValidOrder) {
    validationMessage = 'Low range must be lower than high range.';
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
            What are your target ranges?
          </Text>
        </OnboardingMotionBlock>
        <OnboardingMotionBlock delay={90}>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            These define how your readings are classified on graphs and reports.
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={150}>
        <Card>
          <View style={styles.rangeRows}>
            {/* High */}
            <View style={styles.rangeSection}>
              <View style={styles.rangeLabelRow}>
                <View style={[styles.dot, { backgroundColor: tokenColors.glucose.high }]} />
                <Text style={[styles.rangeLabel, { color: colors.text }]}>High</Text>
              </View>
              <View style={styles.rangeDescription}>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  Above
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={highAbove}
                    onChangeText={handleHighAbove}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                  <Text style={[styles.unitText, { color: colors.textMuted }]}>{unitLabel}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            {/* Good (target range) */}
            <View style={styles.rangeSection}>
              <View style={styles.rangeLabelRow}>
                <View style={[styles.dot, { backgroundColor: tokenColors.glucose.normal }]} />
                <Text style={[styles.rangeLabel, { color: colors.text }]}>Good</Text>
              </View>
              <View style={styles.rangeDescription}>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  Between
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={goodLow}
                    onChangeText={handleGoodLow}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                </View>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  and
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={goodHigh}
                    onChangeText={handleGoodHigh}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                </View>
                <Text style={[styles.unitText, { color: colors.textMuted }]}>{unitLabel}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            {/* Low */}
            <View style={styles.rangeSection}>
              <View style={styles.rangeLabelRow}>
                <View style={[styles.dot, { backgroundColor: tokenColors.glucose.low }]} />
                <Text style={[styles.rangeLabel, { color: colors.text }]}>Low</Text>
              </View>
              <View style={styles.rangeDescription}>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  Below
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={lowBelow}
                    onChangeText={handleLowBelow}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                  <Text style={[styles.unitText, { color: colors.textMuted }]}>{unitLabel}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={200}>
        <Text style={[styles.footnote, { color: colors.textMuted }]}>
          {glucoseUnit === 'mmol'
            ? 'Defaults: Good range is 3.9 – 10.0 mmol/L.'
            : 'Defaults: Good range is 70 – 180 mg/dL.'}{' '}
          You can adjust these to match your care team guidance.
        </Text>
        </OnboardingMotionBlock>

        {!!validationMessage && (
          <OnboardingMotionBlock delay={230}>
          <Text style={[styles.validationText, { color: tokenColors.glucose.high }]}>
            {validationMessage}
          </Text>
          </OnboardingMotionBlock>
        )}
      </ScrollView>

      <OnboardingMotionBlock delay={260} style={styles.footer}>
        <Button
          fullWidth
          disabled={!isRangeValid}
          onPress={() => router.push('/(onboarding)/disclaimer')}
        >
          Next
        </Button>
      </OnboardingMotionBlock>
      <OnboardingMotionBlock delay={290} style={styles.mascotFloat}>
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
  subtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    marginTop: -spacing.sm,
  },
  rangeRows: {
    gap: spacing.base,
  },
  rangeSection: {
    gap: spacing.sm,
  },
  rangeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rangeLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  rangeDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: 18,
  },
  rangeDescText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.caption,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rangeInput: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    borderWidth: 1.5,
    borderRadius: borderRadius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 60,
    textAlign: 'center',
  },
  unitText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  divider: {
    height: 1,
  },
  footnote: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontStyle: 'italic',
  },
  validationText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
    marginTop: -spacing.sm,
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
