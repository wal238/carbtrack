import { StyleSheet, View, Text, Pressable } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { useState } from 'react';
import { spacing, typography, colors, borderRadius } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import type { CarbDay } from '@/lib/types';

interface CarbTrackerProps {
  days?: CarbDay[];
  target?: number;
  compact?: boolean;
}

const SAMPLE_DAYS: CarbDay[] = [
  { day: 'Mon', breakfast: 45, lunch: 60, dinner: 55, snack: 20 },
  { day: 'Tue', breakfast: 50, lunch: 55, dinner: 65, snack: 15 },
  { day: 'Wed', breakfast: 40, lunch: 70, dinner: 50, snack: 25 },
  { day: 'Thu', breakfast: 55, lunch: 45, dinner: 60, snack: 30 },
  { day: 'Fri', breakfast: 60, lunch: 65, dinner: 70, snack: 35 },
  { day: 'Sat', breakfast: 35, lunch: 50, dinner: 45, snack: 15 },
  { day: 'Sun', breakfast: 48, lunch: 62, dinner: 58, snack: 27 },
];

const MEAL_COLORS = {
  breakfast: colors.meals.breakfast,
  lunch: colors.meals.lunch,
  dinner: colors.meals.dinner,
  snack: colors.meals.snack,
};

export function CarbTracker({ days = SAMPLE_DAYS, target = 200, compact = false }: CarbTrackerProps) {
  const themeColors = useThemeColors();
  const [selectedDay, setSelectedDay] = useState(6); // Sunday

  const todayTotal = days[selectedDay]
    ? days[selectedDay].breakfast + days[selectedDay].lunch + days[selectedDay].dinner + days[selectedDay].snack
    : 0;

  const maxTotal = Math.max(...days.map((d) => d.breakfast + d.lunch + d.dinner + d.snack), target);
  const barMaxHeight = 100;
  const barWidth = 28;
  const chartWidth = 300;
  const gap = (chartWidth - days.length * barWidth) / (days.length + 1);

  const progressPercent = Math.min(todayTotal / target, 1);
  const isOverTarget = todayTotal > target;

  return (
    <View style={styles.container}>
      {/* Header */}
      {!compact && (
        <View style={styles.header}>
          <View>
            <Text style={[styles.totalLabel, { color: themeColors.textSecondary }]}>
              Carbs today
            </Text>
            <Text style={[styles.totalValue, { color: themeColors.text }]}>
              {todayTotal}g
              <Text style={[styles.targetText, { color: themeColors.textMuted }]}> / {target}g</Text>
            </Text>
          </View>
        </View>
      )}

      {/* Progress bar */}
      <View style={[styles.progressBg, { backgroundColor: themeColors.bg }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercent * 100}%`,
              backgroundColor: isOverTarget ? colors.glucose.high : themeColors.primary,
            },
          ]}
        />
      </View>

      {/* Bar chart */}
      <Svg width="100%" height={barMaxHeight + 30} viewBox={`0 0 ${chartWidth} ${barMaxHeight + 30}`}>
        {/* Target dashed line */}
        <Line
          x1={0}
          y1={barMaxHeight - (target / maxTotal) * barMaxHeight}
          x2={chartWidth}
          y2={barMaxHeight - (target / maxTotal) * barMaxHeight}
          stroke={themeColors.textMuted}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
        />

        {/* Stacked bars */}
        {days.map((day, i) => {
          const x = gap + i * (barWidth + gap);
          const total = day.breakfast + day.lunch + day.dinner + day.snack;
          const isSelected = i === selectedDay;

          let yOffset = barMaxHeight;
          const segments = [
            { key: 'breakfast', value: day.breakfast, color: MEAL_COLORS.breakfast },
            { key: 'lunch', value: day.lunch, color: MEAL_COLORS.lunch },
            { key: 'dinner', value: day.dinner, color: MEAL_COLORS.dinner },
            { key: 'snack', value: day.snack, color: MEAL_COLORS.snack },
          ];

          return segments.map((seg) => {
            const segHeight = (seg.value / maxTotal) * barMaxHeight;
            yOffset -= segHeight;
            return (
              <Rect
                key={`${i}-${seg.key}`}
                x={x}
                y={yOffset}
                width={barWidth}
                height={segHeight}
                rx={3}
                fill={seg.color}
                opacity={isSelected ? 1 : 0.5}
                onPress={() => setSelectedDay(i)}
              />
            );
          });
        })}

        {/* Day labels */}
        {days.map((day, i) => {
          const x = gap + i * (barWidth + gap) + barWidth / 2;
          return (
            <Svg key={`label-${i}`}>
              <Rect x={0} y={0} width={0} height={0} />
            </Svg>
          );
        })}
      </Svg>

      {/* Day labels below chart */}
      <View style={styles.dayLabels}>
        {days.map((day, i) => (
          <Pressable key={day.day} onPress={() => setSelectedDay(i)} style={styles.dayLabel}>
            <Text
              style={[
                styles.dayText,
                {
                  color: i === selectedDay ? themeColors.primary : themeColors.textMuted,
                  fontWeight: i === selectedDay ? '700' : '400',
                },
              ]}
            >
              {day.day}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Meal breakdown for selected day */}
      {!compact && days[selectedDay] && (
        <View style={styles.breakdown}>
          <MealRow label="Breakfast" value={days[selectedDay].breakfast} color={MEAL_COLORS.breakfast} total={todayTotal} textColor={themeColors.text} mutedColor={themeColors.textSecondary} />
          <MealRow label="Lunch" value={days[selectedDay].lunch} color={MEAL_COLORS.lunch} total={todayTotal} textColor={themeColors.text} mutedColor={themeColors.textSecondary} />
          <MealRow label="Dinner" value={days[selectedDay].dinner} color={MEAL_COLORS.dinner} total={todayTotal} textColor={themeColors.text} mutedColor={themeColors.textSecondary} />
          <MealRow label="Snack" value={days[selectedDay].snack} color={MEAL_COLORS.snack} total={todayTotal} textColor={themeColors.text} mutedColor={themeColors.textSecondary} />
        </View>
      )}
    </View>
  );
}

function MealRow({
  label,
  value,
  color,
  total,
  textColor,
  mutedColor,
}: {
  label: string;
  value: number;
  color: string;
  total: number;
  textColor: string;
  mutedColor: string;
}) {
  const percent = total > 0 ? value / total : 0;

  return (
    <View style={mealStyles.row}>
      <View style={[mealStyles.dot, { backgroundColor: color }]} />
      <Text style={[mealStyles.label, { color: textColor }]}>{label}</Text>
      <View style={mealStyles.barBg}>
        <View style={[mealStyles.barFill, { width: `${percent * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[mealStyles.value, { color: mutedColor }]}>{value}g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  totalValue: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: '700',
  },
  targetText: {
    fontSize: typography.fontSize.body,
    fontWeight: '400',
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayLabel: {
    paddingVertical: spacing.xs,
  },
  dayText: {
    fontFamily: typography.fontFamily.micro,
    fontSize: typography.fontSize.micro,
  },
  breakdown: {
    gap: spacing.sm,
  },
});

const mealStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    width: 70,
  },
  barBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E6ED20',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  value: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    width: 35,
    textAlign: 'right',
  },
});
