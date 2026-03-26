import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Rect, Line, Circle, Path, Text as SvgText } from 'react-native-svg';
import { spacing, typography, colors } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import { getGlucoseColor } from '@/lib/colors';
import type { GlucoseDataPoint, InsulinDoseMarker } from '@/lib/types';

interface GlucoseChartProps {
  data?: GlucoseDataPoint[];
  insulinDoses?: InsulinDoseMarker[];
  height?: number;
  compact?: boolean;
}

// Sample data for stub rendering
const SAMPLE_DATA: GlucoseDataPoint[] = [
  { time: '12AM', value: 5.2, unit: 'mmol' },
  { time: '3AM', value: 4.8, unit: 'mmol' },
  { time: '6AM', value: 6.1, unit: 'mmol' },
  { time: '9AM', value: 8.4, unit: 'mmol' },
  { time: '12PM', value: 11.2, unit: 'mmol' },
  { time: '3PM', value: 7.6, unit: 'mmol' },
  { time: '6PM', value: 9.8, unit: 'mmol' },
  { time: '9PM', value: 6.5, unit: 'mmol' },
];

const Y_LABELS = [0, 3.9, 10, 16];

export function GlucoseChart({ data = SAMPLE_DATA, insulinDoses = [], height = 155, compact = false }: GlucoseChartProps) {
  const themeColors = useThemeColors();
  const chartWidth = 300;
  const chartHeight = height - 30;
  const paddingLeft = 30;
  const paddingBottom = 20;

  // Guard against empty data
  if (data.length === 0) return null;

  const latestReading = data[data.length - 1];
  const latestColor = getGlucoseColor(latestReading.value, latestReading.unit);
  const unitLabel = latestReading.unit === 'mmol' ? 'mmol/L' : 'mg/dL';

  function yScale(value: number) {
    return chartHeight - (value / 16) * (chartHeight - paddingBottom);
  }

  function xScale(index: number) {
    const divisor = data.length > 1 ? data.length - 1 : 1;
    return paddingLeft + (index / divisor) * (chartWidth - paddingLeft - 10);
  }

  // Build bezier path (only if 2+ points)
  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value) }));
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
    const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
    pathD += ` C ${cp1x} ${points[i - 1].y} ${cp2x} ${points[i].y} ${points[i].x} ${points[i].y}`;
  }

  // Build x-axis labels from actual data times
  const xLabels = data.length <= 6
    ? data.map((d) => d.time)
    : data.filter((_, i) => {
        const step = Math.max(1, Math.floor(data.length / 5));
        return i % step === 0 || i === data.length - 1;
      }).map((d) => d.time);

  return (
    <View style={styles.container}>
      {!compact && (
        <View style={styles.header}>
          <View>
            <Text style={[styles.currentValue, { color: latestColor }]}>
              {latestReading.unit === 'mmol'
                ? latestReading.value.toFixed(1)
                : Math.round(latestReading.value).toString()}
            </Text>
            <Text style={[styles.currentUnit, { color: themeColors.textSecondary }]}>{unitLabel}</Text>
          </View>
          <View style={styles.legend}>
            <LegendItem color={colors.glucose.low} label="Low" textColor={themeColors.textSecondary} />
            <LegendItem color={colors.glucose.normal} label="Normal" textColor={themeColors.textSecondary} />
            <LegendItem color={colors.glucose.warning} label="Warning" textColor={themeColors.textSecondary} />
            <LegendItem color={colors.glucose.high} label="High" textColor={themeColors.textSecondary} />
            {insulinDoses.length > 0 && (
              <LegendItem color={colors.secondary} label="Insulin" textColor={themeColors.textSecondary} />
            )}
          </View>
        </View>
      )}

      <Svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {/* Target range band */}
        <Rect
          x={paddingLeft}
          y={yScale(10)}
          width={chartWidth - paddingLeft - 10}
          height={yScale(3.9) - yScale(10)}
          fill={colors.glucose.normalMuted}
          opacity={0.5}
        />

        {/* Dashed threshold lines */}
        <Line
          x1={paddingLeft} y1={yScale(10)} x2={chartWidth - 10} y2={yScale(10)}
          stroke={colors.glucose.warning} strokeWidth={1} strokeDasharray="4 4" opacity={0.6}
        />
        <Line
          x1={paddingLeft} y1={yScale(3.9)} x2={chartWidth - 10} y2={yScale(3.9)}
          stroke={colors.glucose.low} strokeWidth={1} strokeDasharray="4 4" opacity={0.6}
        />

        {/* Y-axis labels */}
        {Y_LABELS.map((v) => (
          <SvgText
            key={v}
            x={paddingLeft - 5}
            y={yScale(v) + 4}
            fontSize={9}
            fill={themeColors.textMuted}
            textAnchor="end"
          >
            {v}
          </SvgText>
        ))}

        {/* Bezier curve (only render if 2+ points) */}
        {data.length > 1 && (
          <>
            <Path d={pathD} fill="none" stroke={themeColors.primary} strokeWidth={2} />
            <Path
              d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`}
              fill={themeColors.primary}
              opacity={0.07}
            />
          </>
        )}

        {/* Insulin dose markers */}
        {insulinDoses.map((dose, i) => {
          // Find matching glucose data point by time, or distribute evenly
          const matchIndex = data.findIndex((d) => d.time === dose.time);
          let x: number;
          if (matchIndex >= 0) {
            x = xScale(matchIndex);
          } else {
            // Place proportionally across chart
            const divisor = Math.max(insulinDoses.length - 1, 1);
            x = paddingLeft + (i / divisor) * (chartWidth - paddingLeft - 10);
          }
          const markerY = 8;
          const lineBottom = chartHeight - paddingBottom;

          return (
            <React.Fragment key={`insulin-${i}`}>
              {/* Dashed drop line */}
              <Line
                x1={x} y1={markerY + 8}
                x2={x} y2={lineBottom}
                stroke={colors.secondary}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.4}
              />
              {/* Triangle marker */}
              <Path
                d={`M ${x - 5} ${markerY} L ${x + 5} ${markerY} L ${x} ${markerY + 8} Z`}
                fill={colors.secondary}
              />
              {/* Dose label */}
              <SvgText
                x={x}
                y={markerY - 2}
                fontSize={8}
                fill={colors.secondary}
                textAnchor="middle"
                fontWeight="700"
              >
                {dose.dose}U
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Data points */}
        {data.map((d, i) => (
          <Circle
            key={i}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r={4}
            fill={getGlucoseColor(d.value, d.unit)}
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        ))}

        {/* X-axis labels from actual data */}
        {xLabels.map((label, i) => (
          <SvgText
            key={label + i}
            x={paddingLeft + (i / Math.max(xLabels.length - 1, 1)) * (chartWidth - paddingLeft - 10)}
            y={height - 2}
            fontSize={9}
            fill={themeColors.textMuted}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

function LegendItem({ color, label, textColor }: { color: string; label: string; textColor: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  currentValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: 28,
    fontWeight: '800',
  },
  currentUnit: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.micro,
  },
});
