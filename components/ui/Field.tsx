import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import type { FieldProps } from '@/lib/types';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  unit,
  icon,
  keyboardType = 'default',
}: FieldProps) {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputRow,
          {
            borderColor: isFocused ? colors.primary : colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: colors.text, fontFamily: typography.fontFamily.body },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {unit && (
          <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.body,
    height: '100%',
  },
  unit: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginLeft: spacing.sm,
  },
});
