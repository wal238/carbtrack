import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  type WithTimingConfig,
  type WithSpringConfig,
} from 'react-native-reanimated';
import { useEffect } from 'react';

// ── Timing presets ──────────────────────────────────────────────────────────

export const TIMING = {
  fast: { duration: 150 } as WithTimingConfig,
  normal: { duration: 250 } as WithTimingConfig,
  slow: { duration: 400 } as WithTimingConfig,
  easeOut: { duration: 250, easing: Easing.out(Easing.cubic) } as WithTimingConfig,
};

// ── Spring presets ──────────────────────────────────────────────────────────

export const SPRING = {
  gentle: { damping: 15, stiffness: 150 } as WithSpringConfig,
  bouncy: { damping: 10, stiffness: 200 } as WithSpringConfig,
  snappy: { damping: 20, stiffness: 300 } as WithSpringConfig,
};

// ── Pre-wrapped animated components ─────────────────────────────────────────

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Hooks ───────────────────────────────────────────────────────────────────

/** Fade in on mount with optional delay */
export function useFadeIn(delay = 0) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, TIMING.normal));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { opacity, animatedStyle };
}

/** Scale press animation (0.97x). Returns pressable handlers and animated style. */
export function useScalePress(scale = 0.97) {
  const scaleValue = useSharedValue(1);

  const onPressIn = () => {
    scaleValue.value = withTiming(scale, TIMING.fast);
  };

  const onPressOut = () => {
    scaleValue.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return { onPressIn, onPressOut, animatedStyle };
}

/** Staggered fade-in for list items */
export function useStaggeredFadeIn(index: number, baseDelay = 60) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    const delay = index * baseDelay;
    opacity.value = withDelay(delay, withTiming(1, TIMING.normal));
    translateY.value = withDelay(delay, withSpring(0, SPRING.gentle));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}
