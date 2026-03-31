import React, { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DISTANCE = SCREEN_WIDTH * 0.15;
const DURATION = 250;
const EASING = Easing.out(Easing.cubic);

// Global previous tab index shared across all tab screens
let globalPrevTabIndex = -1;

interface AnimatedTabScreenProps {
  tabIndex: number;
  children: React.ReactNode;
}

export function AnimatedTabScreen({ tabIndex, children }: AnimatedTabScreenProps) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(isFocused ? 1 : 0);
  const translateX = useSharedValue(0);
  const hasAnimatedOnce = useRef(false);

  useEffect(() => {
    if (!isFocused) return;

    const prevIndex = globalPrevTabIndex;
    globalPrevTabIndex = tabIndex;

    if (!hasAnimatedOnce.current) {
      hasAnimatedOnce.current = true;
      if (prevIndex === -1) {
        // Very first tab load — just fade in, no slide
        opacity.value = withTiming(1, { duration: DURATION, easing: EASING });
        return;
      }
    }

    // Slide direction based on global previous tab
    const direction = tabIndex > prevIndex ? 1 : tabIndex < prevIndex ? -1 : 0;

    if (direction !== 0) {
      translateX.value = direction * SLIDE_DISTANCE;
      opacity.value = 0;
      translateX.value = withTiming(0, { duration: DURATION, easing: EASING });
      opacity.value = withTiming(1, { duration: DURATION, easing: EASING });
    } else {
      opacity.value = withTiming(1, { duration: DURATION, easing: EASING });
    }
  }, [isFocused, tabIndex, opacity, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
