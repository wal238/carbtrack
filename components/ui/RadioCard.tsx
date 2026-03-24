import { StyleSheet, Pressable, View, Text } from 'react-native';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import type { RadioCardProps } from '@/lib/types';

export function RadioCard({ label, sublabel, selected, onPress }: RadioCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? colors.primaryMuted : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1.5,
        },
      ]}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? colors.primary : colors.border,
          },
        ]}
      >
        {selected && (
          <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
            {sublabel}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  sublabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginTop: 2,
  },
});
