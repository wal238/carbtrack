import { View, type ViewProps } from 'react-native';
import { useThemeColors } from '@/lib/theme';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();

  return <View style={[{ backgroundColor: colors.bg }, style]} {...otherProps} />;
}
