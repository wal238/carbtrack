import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography, borderRadius, shadows } from '@/constants/tokens';

interface SpeechBubbleProps {
  text: string;
  style?: StyleProp<ViewStyle>;
}

export function SpeechBubble({ text, style }: SpeechBubbleProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.bubble, { backgroundColor: colors.surface }, shadows.card]}>
        <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
      </View>
      <View style={styles.tailWrapper}>
        <View
          style={[
            styles.tail,
            {
              borderTopColor: colors.surface,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  text: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
    textAlign: 'center',
  },
  tailWrapper: {
    alignItems: 'center',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
