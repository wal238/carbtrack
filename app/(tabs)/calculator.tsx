import { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { AnimatedTabScreen } from '@/components/AnimatedTabScreen';
import { useThemeColors } from '@/lib/theme';
import { haptic } from '@/lib/haptics';
import { spacing, typography } from '@/constants/tokens';
import { useUserPreferencesStore } from '@/lib/store';
import { useInsulinLogStore } from '@/lib/data-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { RulerPicker } from '@/components/ui/RulerPicker';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { DISCLAIMERS } from '@/constants/disclaimers';

export default function CalculatorScreen() {
  const colors = useThemeColors();

  const carbRatio = useUserPreferencesStore((s) => s.carbRatio);
  const carbUnit = useUserPreferencesStore((s) => s.carbUnit);
  const glucoseUnit = useUserPreferencesStore((s) => s.glucoseUnit);
  const rangeTargetHigh = useUserPreferencesStore((s) => s.rangeTargetHigh);
  const rangeTargetLow = useUserPreferencesStore((s) => s.rangeTargetLow);
  const addInsulinLog = useInsulinLogStore((s) => s.addLog);

  const [carbValue, setCarbValue] = useState(0);
  const [glucoseValue, setGlucoseValue] = useState('');

  const unitLabel = carbUnit === 'grams' ? 'g' : 'exc';
  const glucoseUnitLabel = glucoseUnit === 'mmol' ? 'mmol/L' : 'mg/dL';
  const glucosePlaceholder = glucoseUnit === 'mmol' ? 'e.g. 7.2' : 'e.g. 130';

  const targetMid = (rangeTargetHigh + rangeTargetLow) / 2;
  const correctionFactor = 50 / carbRatio;

  const foodDose = useMemo(() => {
    if (carbValue <= 0 || carbRatio <= 0) return 0;
    return carbValue / carbRatio;
  }, [carbValue, carbRatio]);

  const currentGlucose = glucoseValue ? parseFloat(glucoseValue) : 0;
  const needsCorrection = currentGlucose > rangeTargetHigh;

  const correctionDose = useMemo(() => {
    if (!needsCorrection || currentGlucose <= 0) return 0;
    return Math.max(0, (currentGlucose - targetMid) / correctionFactor);
  }, [currentGlucose, needsCorrection, targetMid, correctionFactor]);

  const totalDose = Math.max(0, Math.round((foodDose + correctionDose) * 10) / 10);
  const glucoseStatus = !glucoseValue || Number.isNaN(currentGlucose)
    ? 'idle'
    : currentGlucose > rangeTargetHigh
      ? 'high'
      : currentGlucose < rangeTargetLow
        ? 'low'
        : 'normal';

  function getCorrectionText(): string | null {
    if (!glucoseValue) return null;
    const parsed = parseFloat(glucoseValue);
    if (isNaN(parsed)) return null;
    if (parsed > rangeTargetHigh) {
      return `Above target range — correction dose added.`;
    }
    if (parsed < rangeTargetLow) {
      return `Below target range — consider consuming carbs.`;
    }
    return `Within target range — no correction needed.`;
  }

  function handleLogDose() {
    if (totalDose <= 0) {
      haptic.error();
      Alert.alert('No dose to log', 'Enter carbs or glucose to calculate a dose.');
      return;
    }
    addInsulinLog({
      user_id: 'local',
      dose: Math.round(totalDose * 10) / 10,
      dose_type: correctionDose > 0 ? 'correction' : 'food',
      calculated_from_carbs: carbValue,
      calculated_from_ratio: carbRatio,
      logged_at: new Date().toISOString(),
    });
    haptic.success();
    Alert.alert('Logged!', `${totalDose.toFixed(1)}U insulin dose logged.`);
    setCarbValue(0);
    setGlucoseValue('');
  }

  function handleClear() {
    haptic.light();
    setCarbValue(0);
    setGlucoseValue('');
  }

  const correctionText = getCorrectionText();

  const resultScale = useSharedValue(1);
  const prevDoseRef = useRef(totalDose);
  const prevGlucoseStatusRef = useRef(glucoseStatus);

  useEffect(() => {
    if (totalDose !== prevDoseRef.current) {
      prevDoseRef.current = totalDose;
      if (totalDose > 0) {
        resultScale.value = withSequence(
          withSpring(1.05, { damping: 15, stiffness: 300 }),
          withSpring(1, { damping: 15, stiffness: 300 }),
        );
      }
    }
  }, [totalDose, resultScale]);

  useEffect(() => {
    if (glucoseStatus !== prevGlucoseStatusRef.current) {
      prevGlucoseStatusRef.current = glucoseStatus;
      if (glucoseStatus === 'high' || glucoseStatus === 'low') {
        haptic.warning();
      }
    }
  }, [glucoseStatus]);

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
  }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <AnimatedTabScreen tabIndex={2}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>
          Insulin Calculator
        </Text>

        {/* Disclaimer Banner */}
        <DisclaimerBanner variant="warning" text={DISCLAIMERS.calculatorBanner} />

        {/* Carb Input Section */}
        <Card>
          <SectionLabel label="CARBS" />
          <View style={styles.rulerContainer}>
            <RulerPicker
              min={0}
              max={300}
              step={1}
              value={carbValue}
              onValueChange={setCarbValue}
              unit={unitLabel}
            />
          </View>
        </Card>

        {/* Current Glucose Section */}
        <Card>
          <SectionLabel label="CURRENT GLUCOSE (OPTIONAL)" />
          <View style={styles.glucoseFieldContainer}>
            <Field
              value={glucoseValue}
              onChangeText={setGlucoseValue}
              placeholder={glucosePlaceholder}
              unit={glucoseUnitLabel}
              keyboardType="decimal-pad"
            />
          </View>
          {correctionText && (
            <Animated.View entering={FadeInDown.duration(200)}>
              <Text style={[styles.correctionText, { color: colors.textSecondary }]}>
                {correctionText}
              </Text>
            </Animated.View>
          )}
        </Card>

        {/* Result Section */}
        <Animated.View style={resultAnimatedStyle}>
        <Card style={{ backgroundColor: colors.primaryMuted }}>
          <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
            Recommended Dose
          </Text>
          <Text style={[styles.resultValue, { color: colors.primary }]}>
            {totalDose.toFixed(1)}U
          </Text>

          {/* Breakdown */}
          <View style={styles.breakdownContainer}>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                Food dose
              </Text>
              <Text style={[styles.breakdownValue, { color: colors.text }]}>
                {foodDose.toFixed(1)}U
              </Text>
            </View>
            {correctionDose > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                  Correction dose
                </Text>
                <Text style={[styles.breakdownValue, { color: colors.text }]}>
                  {correctionDose.toFixed(1)}U
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Settings Info */}
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Carb ratio
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              1U : {carbRatio}{unitLabel}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
              Target
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>
              {rangeTargetLow} – {rangeTargetHigh} {glucoseUnitLabel}
            </Text>
          </View>
        </Card>
        </Animated.View>

        {/* Disclaimer Footer */}
        <Text style={[styles.disclaimerFooter, { color: colors.textMuted }]}>
          {DISCLAIMERS.calculatorFooter}
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button variant="primary" fullWidth onPress={handleLogDose}>
            Log Dose
          </Button>
          <Button variant="ghost" fullWidth onPress={handleClear}>
            Clear
          </Button>
        </View>
      </ScrollView>
      </AnimatedTabScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  title: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
  rulerContainer: {
    marginTop: spacing.md,
  },
  glucoseFieldContainer: {
    marginTop: spacing.md,
  },
  correctionText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginTop: spacing.sm,
  },
  resultLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
    textAlign: 'center',
  },
  resultValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: 48,
    fontWeight: typography.fontWeight.display,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.base,
  },
  breakdownContainer: {
    gap: spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  breakdownLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  breakdownValue: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  disclaimerFooter: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
});
