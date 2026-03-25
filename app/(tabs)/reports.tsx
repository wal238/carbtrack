import { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography, borderRadius, colors, glucoseThresholds } from '@/constants/tokens';
import { useUserPreferencesStore } from '@/lib/store';
import { useGlucoseLogStore, useMealLogStore, useInsulinLogStore } from '@/lib/data-store';
import { getGlucoseColor } from '@/lib/colors';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TogglePill } from '@/components/ui/TogglePill';
import { CarbTracker } from '@/components/charts/CarbTracker';
import type { GlucoseLog, GlucoseUnit, CarbDay, DoseType } from '@/lib/types';
import { DOSE_TYPES } from '@/lib/types';

// --- Helpers ---

function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayAbbr(date: Date): string {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
}

interface RangeBreakdown {
  low: number;
  normal: number;
  warning: number;
  high: number;
  total: number;
}

function classifyGlucoseLogs(logs: GlucoseLog[], unit: GlucoseUnit): RangeBreakdown {
  const t = unit === 'mmol' ? glucoseThresholds.mmol : glucoseThresholds.mgdl;
  const result: RangeBreakdown = { low: 0, normal: 0, warning: 0, high: 0, total: logs.length };

  for (const log of logs) {
    if (log.value <= t.low) {
      result.low++;
    } else if (log.value <= t.targetHigh) {
      result.normal++;
    } else if (log.value <= t.veryHigh) {
      result.warning++;
    } else {
      result.high++;
    }
  }

  return result;
}

function formatGlucoseValue(value: number, unit: GlucoseUnit): string {
  if (unit === 'mmol') return value.toFixed(1);
  return Math.round(value).toString();
}

// --- Donut Ring Chart ---

interface DonutSegment {
  percentage: number;
  color: string;
  label: string;
}

function DonutChart({
  segments,
  centerText,
  centerLabel,
  size = 180,
  strokeWidth = 16,
  textColor,
  secondaryColor,
}: {
  segments: DonutSegment[];
  centerText: string;
  centerLabel: string;
  size?: number;
  strokeWidth?: number;
  textColor: string;
  secondaryColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const arcs = segments
    .filter((s) => s.percentage > 0)
    .map((segment) => {
      const startAngle = cumulativePercent * 360 - 90;
      const sweepAngle = segment.percentage * 360;
      cumulativePercent += segment.percentage;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = ((startAngle + sweepAngle) * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArcFlag = sweepAngle > 180 ? 1 : 0;

      const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

      return { d, color: segment.color, key: segment.label };
    });

  return (
    <View style={donutStyles.container}>
      <Svg width={size} height={size}>
        {/* Background ring */}
        <SvgCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Segments */}
        {arcs.map((arc) => (
          <Path
            key={arc.key}
            d={arc.d}
            stroke={arc.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </Svg>
      <View style={donutStyles.center}>
        <Text style={[donutStyles.centerText, { color: textColor }]}>{centerText}</Text>
        <Text style={[donutStyles.centerLabel, { color: secondaryColor }]}>{centerLabel}</Text>
      </View>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerText: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
  centerLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
});

// --- Legend Item ---

function LegendItem({
  color,
  label,
  percentage,
  textColor,
  secondaryColor,
}: {
  color: string;
  label: string;
  percentage: number;
  textColor: string;
  secondaryColor: string;
}) {
  return (
    <View style={legendStyles.row}>
      <View style={[legendStyles.dot, { backgroundColor: color }]} />
      <Text style={[legendStyles.label, { color: textColor }]}>{label}</Text>
      <Text style={[legendStyles.value, { color: secondaryColor }]}>
        {Math.round(percentage * 100)}%
      </Text>
    </View>
  );
}

const legendStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  value: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
});

// --- Stat Row ---

function StatRow({
  label,
  value,
  valueColor,
  textColor,
  secondaryColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
  textColor: string;
  secondaryColor: string;
}) {
  return (
    <View style={statStyles.row}>
      <Text style={[statStyles.label, { color: secondaryColor }]}>{label}</Text>
      <Text style={[statStyles.value, { color: valueColor ?? textColor }]}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  value: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
});

// --- Main Screen ---

export default function ReportsScreen() {
  const themeColors = useThemeColors();
  const glucoseUnit = useUserPreferencesStore((s) => s.glucoseUnit);

  const glucoseLogs = useGlucoseLogStore((s) => s.logs);
  const mealLogs = useMealLogStore((s) => s.logs);
  const insulinLogs = useInsulinLogStore((s) => s.logs);

  const [periodIndex, setPeriodIndex] = useState(0);
  const periodDays = periodIndex === 0 ? 7 : 30;

  const unitLabel = glucoseUnit === 'mmol' ? 'mmol/L' : 'mg/dL';

  // Compute date range
  const { startDateStr, todayStr } = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - periodDays);
    return {
      startDateStr: formatDateStr(startDate),
      todayStr: formatDateStr(today),
    };
  }, [periodDays]);

  // Filter logs for the period
  const periodGlucoseLogs = useMemo(
    () =>
      glucoseLogs.filter((l) => {
        const d = l.logged_at.slice(0, 10);
        return d >= startDateStr && d <= todayStr;
      }),
    [glucoseLogs, startDateStr, todayStr]
  );

  const periodMealLogs = useMemo(
    () =>
      mealLogs.filter((l) => {
        const d = l.logged_at.slice(0, 10);
        return d >= startDateStr && d <= todayStr;
      }),
    [mealLogs, startDateStr, todayStr]
  );

  const periodInsulinLogs = useMemo(
    () =>
      insulinLogs.filter((l) => {
        const d = l.logged_at.slice(0, 10);
        return d >= startDateStr && d <= todayStr;
      }),
    [insulinLogs, startDateStr, todayStr]
  );

  // Time in Range
  const rangeBreakdown = useMemo(
    () => classifyGlucoseLogs(periodGlucoseLogs, glucoseUnit),
    [periodGlucoseLogs, glucoseUnit]
  );

  const rangeSegments: DonutSegment[] = useMemo(() => {
    const total = rangeBreakdown.total;
    if (total === 0) return [];
    return [
      { percentage: rangeBreakdown.normal / total, color: colors.glucose.normal, label: 'Normal' },
      { percentage: rangeBreakdown.warning / total, color: colors.glucose.warning, label: 'Warning' },
      { percentage: rangeBreakdown.high / total, color: colors.glucose.high, label: 'High' },
      { percentage: rangeBreakdown.low / total, color: colors.glucose.low, label: 'Low' },
    ];
  }, [rangeBreakdown]);

  const inRangePercent = useMemo(() => {
    if (rangeBreakdown.total === 0) return 0;
    return rangeBreakdown.normal / rangeBreakdown.total;
  }, [rangeBreakdown]);

  // Glucose Stats
  const glucoseStats = useMemo(() => {
    if (periodGlucoseLogs.length === 0) return null;
    const values = periodGlucoseLogs.map((l) => l.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    return { avg, highest, lowest, count: values.length };
  }, [periodGlucoseLogs]);

  // Daily Carbs — build CarbDay[] for last 7 days (always 7 for the chart)
  const carbDays: CarbDay[] = useMemo(() => {
    const days: CarbDay[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDateStr(date);
      const dayMeals = mealLogs.filter((l) => l.logged_at.startsWith(dateStr));

      const carbDay: CarbDay = {
        day: getDayAbbr(date),
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0,
      };

      for (const meal of dayMeals) {
        carbDay[meal.meal_type] += meal.total_carbs;
      }

      days.push(carbDay);
    }
    return days;
  }, [mealLogs]);

  const avgDailyCarbs = useMemo(() => {
    if (periodMealLogs.length === 0) return 0;
    const totalCarbs = periodMealLogs.reduce((sum, l) => sum + l.total_carbs, 0);
    return Math.round(totalCarbs / periodDays);
  }, [periodMealLogs, periodDays]);

  // Insulin Summary
  const insulinSummary = useMemo(() => {
    if (periodInsulinLogs.length === 0) return null;
    const totalUnits = periodInsulinLogs.reduce((sum, l) => sum + l.dose, 0);
    const avgDaily = totalUnits / periodDays;

    const byType: Record<DoseType, number> = {
      food: 0,
      correction: 0,
      long_acting: 0,
    };
    for (const log of periodInsulinLogs) {
      byType[log.dose_type] += log.dose;
    }

    return { totalUnits, avgDaily, byType };
  }, [periodInsulinLogs, periodDays]);

  // Logging Streak
  const loggingStreak = useMemo(() => {
    const daysWithLogs = new Set<string>();

    for (const log of periodGlucoseLogs) {
      daysWithLogs.add(log.logged_at.slice(0, 10));
    }
    for (const log of periodMealLogs) {
      daysWithLogs.add(log.logged_at.slice(0, 10));
    }
    for (const log of periodInsulinLogs) {
      daysWithLogs.add(log.logged_at.slice(0, 10));
    }

    return { logged: daysWithLogs.size, total: periodDays };
  }, [periodGlucoseLogs, periodMealLogs, periodInsulinLogs, periodDays]);

  const streakPercent = loggingStreak.total > 0 ? loggingStreak.logged / loggingStreak.total : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.title, { color: themeColors.text }]}>Reports</Text>

        {/* Period Toggle */}
        <TogglePill
          options={['7 Days', '30 Days']}
          selected={periodIndex}
          onSelect={setPeriodIndex}
        />

        {/* Time in Range */}
        <Card>
          <SectionLabel label="TIME IN RANGE" />
          {rangeBreakdown.total > 0 ? (
            <View style={styles.rangeContent}>
              <DonutChart
                segments={rangeSegments}
                centerText={`${Math.round(inRangePercent * 100)}%`}
                centerLabel="In Range"
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
              <View style={styles.legendContainer}>
                <LegendItem
                  color={colors.glucose.normal}
                  label={glucoseUnit === 'mmol' ? 'Normal (3.9–10.0)' : 'Normal (70–180)'}
                  percentage={rangeBreakdown.total > 0 ? rangeBreakdown.normal / rangeBreakdown.total : 0}
                  textColor={themeColors.text}
                  secondaryColor={themeColors.textSecondary}
                />
                <LegendItem
                  color={colors.glucose.warning}
                  label={glucoseUnit === 'mmol' ? 'Warning (10.0–13.9)' : 'Warning (180–250)'}
                  percentage={rangeBreakdown.total > 0 ? rangeBreakdown.warning / rangeBreakdown.total : 0}
                  textColor={themeColors.text}
                  secondaryColor={themeColors.textSecondary}
                />
                <LegendItem
                  color={colors.glucose.high}
                  label={glucoseUnit === 'mmol' ? 'High (>13.9)' : 'High (>250)'}
                  percentage={rangeBreakdown.total > 0 ? rangeBreakdown.high / rangeBreakdown.total : 0}
                  textColor={themeColors.text}
                  secondaryColor={themeColors.textSecondary}
                />
                <LegendItem
                  color={colors.glucose.low}
                  label={glucoseUnit === 'mmol' ? 'Low (<3.9)' : 'Low (<70)'}
                  percentage={rangeBreakdown.total > 0 ? rangeBreakdown.low / rangeBreakdown.total : 0}
                  textColor={themeColors.text}
                  secondaryColor={themeColors.textSecondary}
                />
              </View>
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              No glucose data for this period
            </Text>
          )}
        </Card>

        {/* Glucose Stats */}
        <Card>
          <SectionLabel label="GLUCOSE STATS" />
          {glucoseStats ? (
            <View style={styles.statsContent}>
              <StatRow
                label="Average"
                value={`${formatGlucoseValue(glucoseStats.avg, glucoseUnit)} ${unitLabel}`}
                valueColor={getGlucoseColor(glucoseStats.avg, glucoseUnit)}
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
              <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
              <StatRow
                label="Highest"
                value={`${formatGlucoseValue(glucoseStats.highest, glucoseUnit)} ${unitLabel}`}
                valueColor={getGlucoseColor(glucoseStats.highest, glucoseUnit)}
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
              <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
              <StatRow
                label="Lowest"
                value={`${formatGlucoseValue(glucoseStats.lowest, glucoseUnit)} ${unitLabel}`}
                valueColor={getGlucoseColor(glucoseStats.lowest, glucoseUnit)}
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
              <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
              <StatRow
                label="Readings"
                value={glucoseStats.count.toString()}
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              No glucose data for this period
            </Text>
          )}
        </Card>

        {/* Daily Carbs */}
        <Card>
          <SectionLabel label="DAILY CARBS" />
          <View style={styles.carbsContent}>
            <CarbTracker days={carbDays} compact />
            <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
            <StatRow
              label="Avg daily carbs"
              value={`${avgDailyCarbs}g`}
              textColor={themeColors.text}
              secondaryColor={themeColors.textSecondary}
            />
          </View>
        </Card>

        {/* Insulin Summary */}
        <Card>
          <SectionLabel label="INSULIN SUMMARY" />
          {insulinSummary ? (
            <View style={styles.statsContent}>
              <StatRow
                label="Total units"
                value={`${insulinSummary.totalUnits.toFixed(1)}u`}
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
              <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
              <StatRow
                label="Avg daily"
                value={`${insulinSummary.avgDaily.toFixed(1)}u`}
                textColor={themeColors.text}
                secondaryColor={themeColors.textSecondary}
              />
              <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
              {(Object.keys(DOSE_TYPES) as DoseType[]).map((doseType) => (
                <View key={doseType}>
                  <StatRow
                    label={DOSE_TYPES[doseType]}
                    value={`${insulinSummary.byType[doseType].toFixed(1)}u`}
                    textColor={themeColors.text}
                    secondaryColor={themeColors.textSecondary}
                  />
                  <View style={[styles.divider, { backgroundColor: themeColors.borderFaint }]} />
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              No insulin data for this period
            </Text>
          )}
        </Card>

        {/* Logging Streak */}
        <Card>
          <SectionLabel label="LOGGING STREAK" />
          <View style={styles.streakContent}>
            <Text style={[styles.streakValue, { color: themeColors.text }]}>
              {loggingStreak.logged} of {loggingStreak.total} days
            </Text>
            <View style={[styles.progressBg, { backgroundColor: themeColors.bg }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round(streakPercent * 100)}%`,
                    backgroundColor: themeColors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.streakCaption, { color: themeColors.textMuted }]}>
              {Math.round(streakPercent * 100)}% of days logged
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.title,
  },
  rangeContent: {
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.base,
  },
  legendContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  statsContent: {
    marginTop: spacing.md,
  },
  carbsContent: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  streakContent: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  streakValue: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.bodySemiBold,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  streakCaption: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  progressBg: {
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  divider: {
    height: 1,
  },
  emptyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
