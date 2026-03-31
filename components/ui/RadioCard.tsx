import { StyleSheet, Pressable, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import { haptic } from '@/lib/haptics';
import { SPRING } from '@/lib/animations';
import type { RadioCardProps } from '@/lib/types';

export function RadioCard({ label, sublabel, selected, onPress }: RadioCardProps) {
  const colors = useThemeColors();

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selected ? 1 : 0, SPRING.bouncy) }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(selected ? colors.primary : colors.border, { duration: 200 }),
    borderWidth: withTiming(selected ? 2 : 1.5, { duration: 200 }),
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: selected ? colors.primaryMuted : colors.surface,
        },
        borderStyle,
      ]}
    >
      <Pressable
        onPress={() => {
          haptic.medium();
          onPress();
        }}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={sublabel ? `${label}, ${sublabel}` : label}
        style={styles.pressable}
      >
        <View
          style={[
            styles.radio,
            {
              borderColor: selected ? colors.primary : colors.border,
            },
          ]}
        >
          <Animated.View style={[styles.radioInner, { backgroundColor: colors.primary }, dotStyle]} />
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: spacing.base,
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
