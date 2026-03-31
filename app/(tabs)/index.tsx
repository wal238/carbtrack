import { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInLeft, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { AnimatedTabScreen } from '@/components/AnimatedTabScreen';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/Mascot';
import { GlucoseChart } from '@/components/charts/GlucoseChart';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useGlucoseLogStore, useMealLogStore, useInsulinLogStore } from '@/lib/data-store';
import { useUserPreferencesStore } from '@/lib/store';
import { haptic } from '@/lib/haptics';
import { AnimatedPressable, useScalePress } from '@/lib/animations';
import { MEAL_TYPES, DOSE_TYPES } from '@/lib/types';
import type { GlucoseDataPoint, InsulinDoseMarker, MealType, DoseType } from '@/lib/types';

function formatTimeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatHour(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}${ampm}`;
}

const DEFAULT_CARB_TARGET = 200;

export default function TrendScreen() {
  const themeColors = useThemeColors();
  const router = useRouter();
  const addButtonPress = useScalePress();
  const searchButtonPress = useScalePress();

  const glucoseUnit = useUserPreferencesStore((s) => s.glucoseUnit);

  const glucoseLogs = useGlucoseLogStore((s) => s.logs);
  const mealLogs = useMealLogStore((s) => s.logs);
  const insulinLogs = useInsulinLogStore((s) => s.logs);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Today's glucose data
  const todayGlucoseLogs = useMemo(
    () => glucoseLogs.filter((l) => l.logged_at.startsWith(today)),
    [glucoseLogs, today],
  );

  const glucoseChartData = useMemo<GlucoseDataPoint[]>(
    () =>
      todayGlucoseLogs
        .sort((a, b) => a.logged_at.localeCompare(b.logged_at))
        .map((l) => ({
          time: formatHour(l.logged_at),
          value: l.value,
          unit: l.unit,
        })),
    [todayGlucoseLogs],
  );

  const insulinMarkers = useMemo<InsulinDoseMarker[]>(
    () =>
      insulinLogs
        .filter((l) => l.logged_at.startsWith(today))
        .sort((a, b) => a.logged_at.localeCompare(b.logged_at))
        .map((l) => ({ time: formatHour(l.logged_at), dose: l.dose })),
    [insulinLogs, today],
  );

  // Today's meals
  const todayMeals = useMemo(
    () => mealLogs.filter((l) => l.logged_at.startsWith(today)),
    [mealLogs, today],
  );

  const totalCarbs = useMemo(
    () => todayMeals.reduce((sum, m) => sum + m.total_carbs, 0),
    [todayMeals],
  );

  const mealBreakdown = useMemo(() => {
    const breakdown: Record<MealType, number> = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };
    for (const meal of todayMeals) {
      breakdown[meal.meal_type] += meal.total_carbs;
    }
    return breakdown;
  }, [todayMeals]);

  // Today's insulin
  const todayInsulin = useMemo(
    () => insulinLogs.filter((l) => l.logged_at.startsWith(today)),
    [insulinLogs, today],
  );

  const totalInsulin = useMemo(
    () => todayInsulin.reduce((sum, l) => sum + l.dose, 0),
    [todayInsulin],
  );

  const insulinBreakdown = useMemo(() => {
    const breakdown: Record<DoseType, number> = {
      food: 0,
      correction: 0,
      long_acting: 0,
    };
    for (const log of todayInsulin) {
      breakdown[log.dose_type] += log.dose;
    }
    return breakdown;
  }, [todayInsulin]);

  // Estimated A1c (last 30 days)
  const estimatedA1c = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const rangeLogs = glucoseLogs.filter((l) => {
      const logDate = l.logged_at.slice(0, 10);
      return logDate >= startDate && logDate <= today;
    });

    if (rangeLogs.length === 0) return null;

    const avg = rangeLogs.reduce((sum, l) => sum + l.value, 0) / rangeLogs.length;

    if (glucoseUnit === 'mmol') {
      return ((avg + 2.59) / 1.59).toFixed(1);
    }
    return ((avg + 46.7) / 28.7).toFixed(1);
  }, [glucoseLogs, today, glucoseUnit]);

  // Recent activity (last 5 entries across all types)
  const recentActivity = useMemo(() => {
    interface ActivityEntry {
      type: 'glucose' | 'meal' | 'insulin';
      label: string;
      value: string;
      loggedAt: string;
      icon: 'analytics-outline' | 'restaurant-outline' | 'medkit-outline';
    }

    const entries: ActivityEntry[] = [];

    for (const g of glucoseLogs) {
      const unitLabel = g.unit === 'mmol' ? 'mmol/L' : 'mg/dL';
      entries.push({
        type: 'glucose',
        label: 'Glucose',
        value: `${g.value} ${unitLabel}`,
        loggedAt: g.logged_at,
        icon: 'analytics-outline',
      });
    }

    for (const m of mealLogs) {
      entries.push({
        type: 'meal',
        label: MEAL_TYPES[m.meal_type],
        value: `${m.total_carbs}g`,
        loggedAt: m.logged_at,
        icon: 'restaurant-outline',
      });
    }

    for (const i of insulinLogs) {
      entries.push({
        type: 'insulin',
        label: `${DOSE_TYPES[i.dose_type]}`,
        value: `${i.dose}U`,
        loggedAt: i.logged_at,
        icon: 'medkit-outline',
      });
    }

    return entries
      .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
      .slice(0, 5);
  }, [glucoseLogs, mealLogs, insulinLogs]);

  const carbProgress = Math.min(totalCarbs / DEFAULT_CARB_TARGET, 1);

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(carbProgress * 100, { duration: 600 });
  }, [carbProgress, progressWidth]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bg }]}>
      <AnimatedTabScreen tabIndex={0}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>My Trend</Text>
          <View style={styles.headerActions}>
            <AnimatedPressable
              style={[
                styles.headerBtn,
                { backgroundColor: themeColors.primary },
                addButtonPress.animatedStyle,
              ]}
              onPress={() => {
                haptic.medium();
                router.push('/new-entry');
              }}
              onPressIn={addButtonPress.onPressIn}
              onPressOut={addButtonPress.onPressOut}
              accessibilityRole="button"
              accessibilityLabel="Add new entry"
              hitSlop={8}
            >
              <Ionicons name="add" size={22} color={themeColors.onPrimary} />
            </AnimatedPressable>
            <AnimatedPressable
              style={[
                styles.headerBtn,
                { backgroundColor: themeColors.surface, borderWidth: 1, borderColor: themeColors.border },
                searchButtonPress.animatedStyle,
              ]}
              onPress={() => {
                haptic.light();
              }}
              onPressIn={searchButtonPress.onPressIn}
              onPressOut={searchButtonPress.onPressOut}
              accessibilityRole="button"
              accessibilityLabel="Search entries"
              hitSlop={8}
            >
              <Ionicons name="search" size={20} color={themeColors.textSecondary} />
            </AnimatedPressable>
          </View>
        </View>

        {/* Glucose Chart */}
        <Animated.View entering={FadeInDown.delay(0).duration(300).springify()}>
        <Card>
          {glucoseChartData.length > 0 ? (
            <GlucoseChart data={glucoseChartData} insulinDoses={insulinMarkers} compact />
          ) : (
            <View style={styles.emptyState}>
              <Mascot size={48} expression="neutral" />
              <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                No glucose readings today
              </Text>
            </View>
          )}
        </Card>
        </Animated.View>

        {/* Carbs Today */}
        <Animated.View entering={FadeInDown.delay(80).duration(300).springify()}>
        <Card>
          <View style={styles.carbRow}>
            <Ionicons name="flame" size={20} color={themeColors.dinner} />
            <Text style={[styles.carbLabel, { color: themeColors.textSecondary }]}>Carbs today</Text>
          </View>
          <View style={[styles.progressBg, { backgroundColor: themeColors.bg }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: themeColors.primary,
                },
                progressAnimatedStyle,
              ]}
            />
          </View>
          <Text style={[styles.carbValue, { color: themeColors.text }]}>
            {totalCarbs} / {DEFAULT_CARB_TARGET}g
          </Text>
          {todayMeals.length > 0 && (
            <View style={styles.mealBreakdown}>
              {(Object.keys(MEAL_TYPES) as MealType[]).map((type) =>
                mealBreakdown[type] > 0 ? (
                  <View key={type} style={styles.mealBreakdownRow}>
                    <Text style={[styles.mealTypeLabel, { color: themeColors.textSecondary }]}>
                      {MEAL_TYPES[type]}
                    </Text>
                    <Text style={[styles.mealTypeValue, { color: themeColors.text }]}>
                      {mealBreakdown[type]}g
                    </Text>
                  </View>
                ) : null,
              )}
            </View>
          )}
        </Card>
        </Animated.View>

        {/* Insulin Today */}
        <Animated.View entering={FadeInDown.delay(160).duration(300).springify()}>
        <Card>
          <View style={styles.carbRow}>
            <Ionicons name="medkit-outline" size={20} color={themeColors.secondary} />
            <Text style={[styles.carbLabel, { color: themeColors.textSecondary }]}>Insulin today</Text>
          </View>
          {todayInsulin.length > 0 ? (
            <>
              <Text style={[styles.insulinTotal, { color: themeColors.text }]}>
                {totalInsulin}U total
              </Text>
              <View style={styles.insulinBreakdown}>
                {(Object.keys(DOSE_TYPES) as DoseType[]).map((type) =>
                  insulinBreakdown[type] > 0 ? (
                    <View key={type} style={styles.mealBreakdownRow}>
                      <Text style={[styles.mealTypeLabel, { color: themeColors.textSecondary }]}>
                        {DOSE_TYPES[type]}
                      </Text>
                      <Text style={[styles.mealTypeValue, { color: themeColors.text }]}>
                        {insulinBreakdown[type]}U
                      </Text>
                    </View>
                  ) : null,
                )}
              </View>
            </>
          ) : (
            <Text style={[styles.emptyInline, { color: themeColors.textMuted }]}>
              No insulin logged
            </Text>
          )}
        </Card>
        </Animated.View>

        {/* Estimated A1c */}
        <Animated.View entering={FadeInDown.delay(240).duration(300).springify()}>
        <Card>
          <View style={styles.a1cRow}>
            <View>
              <Text style={[styles.a1cLabel, { color: themeColors.textSecondary }]}>Estimated A1c</Text>
              <Text style={[styles.a1cValue, { color: themeColors.primaryDark }]}>
                {estimatedA1c != null ? `${estimatedA1c}%` : '\u2014'}
              </Text>
            </View>
            <Mascot size={38} expression="happy" />
          </View>
        </Card>
        </Animated.View>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <>
            <SectionLabel label="Recent Activity" />
            <Card>
              {recentActivity.map((entry, index) => (
                <Animated.View
                  key={`${entry.type}-${entry.loggedAt}-${index}`}
                  entering={FadeInLeft.delay(index * 60).duration(250)}
                  style={[
                    styles.activityRow,
                    index < recentActivity.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: themeColors.borderFaint,
                    },
                  ]}
                >
                  <Ionicons
                    name={entry.icon}
                    size={18}
                    color={
                      entry.type === 'glucose'
                        ? themeColors.primaryDark
                        : entry.type === 'meal'
                          ? themeColors.dinner
                          : themeColors.secondary
                    }
                  />
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityLabel, { color: themeColors.text }]}>
                      {entry.label}
                    </Text>
                    <Text style={[styles.activityValue, { color: themeColors.textSecondary }]}>
                      {entry.value}
                    </Text>
                  </View>
                  <Text style={[styles.activityTime, { color: themeColors.textMuted }]}>
                    {formatTimeAgo(entry.loggedAt)}
                  </Text>
                </Animated.View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
      </AnimatedTabScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  carbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  carbLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  carbValue: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: '600',
  },
  mealBreakdown: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  mealBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTypeLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  mealTypeValue: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.caption,
    fontWeight: '600',
  },
  insulinTotal: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.bodySemiBold,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  insulinBreakdown: {
    gap: spacing.xs,
  },
  emptyInline: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  a1cRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  a1cLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginBottom: spacing.xs,
  },
  a1cValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: 32,
    fontWeight: '800',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: '600',
  },
  activityValue: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginTop: 2,
  },
  activityTime: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
});
