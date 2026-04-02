import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { haptic } from '@/lib/haptics';
import { AnimatedPressable, useScalePress } from '@/lib/animations';

export function OnboardingMotionBlock({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(240)} style={style}>
      {children}
    </Animated.View>
  );
}

export function OnboardingBackButton({
  color,
  onPress,
}: {
  color: string;
  onPress: () => void;
}) {
  const { onPressIn, onPressOut, animatedStyle } = useScalePress();

  return (
    <AnimatedPressable
      onPress={() => {
        haptic.light();
        onPress();
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.backButton, animatedStyle]}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={24} color={color} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignSelf: 'flex-start',
  },
});
