import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, spacing, typography, colors } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import type { DisclaimerBannerProps } from '@/lib/types';

export function DisclaimerBanner({ variant, text }: DisclaimerBannerProps) {
  const themeColors = useThemeColors();

  const isWarning = variant === 'warning';
  const bgColor = isWarning ? colors.glucose.warningMuted : colors.glucose.highMuted;
  const borderColor = isWarning ? colors.glucose.warning : colors.glucose.high;
  const iconName = isWarning ? 'warning-outline' : 'shield-outline';
  const iconColor = isWarning ? colors.glucose.warning : colors.glucose.high;

  return (
    <View style={[styles.banner, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
      <Ionicons name={iconName as any} size={18} color={iconColor} style={styles.icon} />
      <Text style={[styles.text, { color: themeColors.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    padding: spacing.md,
    gap: spacing.sm,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    lineHeight: 18,
  },
});
