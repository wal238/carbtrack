import { colors, glucoseThresholds } from '@/constants/tokens';
import type { GlucoseRangeLabel, GlucoseUnit } from '@/lib/types';

function getThresholds(unit: GlucoseUnit) {
  return unit === 'mmol' ? glucoseThresholds.mmol : glucoseThresholds.mgdl;
}

export function getGlucoseRangeLabel(value: number, unit: GlucoseUnit): GlucoseRangeLabel {
  const t = getThresholds(unit);
  if (value <= t.low) return 'low';
  if (value <= t.targetHigh) return 'normal';
  if (value <= t.veryHigh) return 'warning';
  return 'high';
}

export function getGlucoseColor(value: number, unit: GlucoseUnit): string {
  const label = getGlucoseRangeLabel(value, unit);
  const map: Record<GlucoseRangeLabel, string> = {
    low: colors.glucose.low,
    normal: colors.glucose.normal,
    warning: colors.glucose.warning,
    high: colors.glucose.high,
  };
  return map[label];
}

export function getGlucoseBackgroundColor(value: number, unit: GlucoseUnit): string {
  const label = getGlucoseRangeLabel(value, unit);
  const map: Record<GlucoseRangeLabel, string> = {
    low: colors.glucose.lowMuted,
    normal: colors.glucose.normalMuted,
    warning: colors.glucose.warningMuted,
    high: colors.glucose.highMuted,
  };
  return map[label];
}
