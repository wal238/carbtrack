import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';

interface SectionLabelProps {
  label: string;
  style?: StyleProp<TextStyle>;
}

export function SectionLabel({ label, style }: SectionLabelProps) {
  const colors = useThemeColors();

  return (
    <Text style={[styles.label, { color: colors.primary }, style]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.fontFamily.tiny,
    fontSize: typography.fontSize.tiny,
    fontWeight: typography.fontWeight.tiny,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
  },
});
