import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { borderRadius } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import type { ProgressDotsProps } from '@/lib/types';

export function ProgressDots({ total, current }: ProgressDotsProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <Dot key={i} active={i === current} colors={colors} />
      ))}
    </View>
  );
}

function Dot({ active, colors }: { active: boolean; colors: ReturnType<typeof useThemeColors> }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(active ? 20 : 8, { duration: 200 }),
    backgroundColor: withTiming(active ? colors.primary : colors.border, { duration: 200 }),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: borderRadius.full,
  },
});
