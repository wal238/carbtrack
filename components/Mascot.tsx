import { StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path, Line } from 'react-native-svg';
import { useEffect } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { MascotProps } from '@/lib/types';

export function Mascot({
  size = 64,
  expression = 'happy',
  glow = false,
  animate = false,
}: MascotProps) {
  const isWink = expression === 'wink';
  const isNeutral = expression === 'neutral';
  const isLookUp = expression === 'lookUp';
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);
  const tilt = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const bobY = useSharedValue(0);

  // Idle bobbing animation
  useEffect(() => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );
    return () => cancelAnimation(bobY);
  }, [bobY]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobY.value }],
  }));

  useEffect(() => {
    if (!animate) {
      driftX.value = withTiming(0, { duration: 220 });
      driftY.value = withTiming(0, { duration: 220 });
      tilt.value = withTiming(0, { duration: 220 });
      glowScale.value = withTiming(1, { duration: 220 });
      return;
    }

    const glanceRight = isLookUp ? 4 : 3;
    const glanceUp = isLookUp ? -5 : -3;

    driftX.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(glanceRight, { duration: 950, easing: Easing.inOut(Easing.quad) }),
        withTiming(-2, { duration: 850, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    driftY.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(glanceUp, { duration: 950, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 850, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    tilt.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(2, { duration: 950, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 850, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(driftX);
      cancelAnimation(driftY);
      cancelAnimation(tilt);
      cancelAnimation(glowScale);
    };
  }, [animate, glowScale, driftX, driftY, tilt, isLookUp]);

  const mascotMotionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: driftX.value },
      { translateY: driftY.value },
      { rotate: `${tilt.value}deg` },
    ],
  }));

  const glowMotionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, bobStyle]} accessible={false} importantForAccessibility="no-hide-descendants">
      {glow && (
        <Animated.View
          style={[
            styles.glow,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              top: -10,
              left: -10,
            },
            glowMotionStyle,
          ]}
        />
      )}
      <Animated.View style={mascotMotionStyle}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* Body — sensor disc */}
          <Circle cx={50} cy={50} r={46} fill="#FFFFFF" stroke="#D8DCE4" strokeWidth={1.5} />
          <Circle cx={50} cy={50} r={38} fill="none" stroke="#E8EBF0" strokeWidth={1} />

          {/* Sensor nub on top */}
          <Rect x={44} y={6} width={12} height={6} rx={3} fill="#D0D5DE" />

          {/* Eyebrows */}
          {isLookUp ? (
            <>
              <Path d="M33 38Q38 35 43 38" stroke="#C0C6D0" strokeWidth={1.2} strokeLinecap="round" fill="none" />
              <Path d="M57 38Q62 35 67 38" stroke="#C0C6D0" strokeWidth={1.2} strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <Path d="M33 40Q38 37 43 40" stroke="#C0C6D0" strokeWidth={1.2} strokeLinecap="round" fill="none" />
              <Path d="M57 40Q62 37 67 40" stroke="#C0C6D0" strokeWidth={1.2} strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Left eye */}
          {isLookUp ? (
            <>
              <Ellipse cx={38} cy={46} rx={5} ry={6} fill="#0F2027" />
              <Circle cx={41} cy={43} r={1.8} fill="#FFFFFF" />
            </>
          ) : (
            <>
              <Ellipse cx={38} cy={48} rx={5} ry={6} fill="#0F2027" />
              <Circle cx={40} cy={46} r={1.8} fill="#FFFFFF" />
            </>
          )}

          {/* Right eye */}
          {isWink ? (
            <Path d="M57 47Q62 45 67 47" stroke="#0F2027" strokeWidth={1.8} strokeLinecap="round" fill="none" />
          ) : isLookUp ? (
            <>
              <Ellipse cx={62} cy={46} rx={5} ry={6} fill="#0F2027" />
              <Circle cx={65} cy={43} r={1.8} fill="#FFFFFF" />
            </>
          ) : (
            <>
              <Ellipse cx={62} cy={48} rx={5} ry={6} fill="#0F2027" />
              <Circle cx={64} cy={46} r={1.8} fill="#FFFFFF" />
            </>
          )}

          {/* Mouth */}
          {isNeutral ? (
            <Line x1={43} y1={57} x2={57} y2={57} stroke="#0F2027" strokeWidth={2} strokeLinecap="round" />
          ) : (
            <Path d="M43 56Q50 62 57 56" stroke="#0F2027" strokeWidth={2} strokeLinecap="round" fill="none" />
          )}

          {/* Blush cheeks */}
          <Circle cx={32} cy={54} r={4} fill="#FBCCC4" opacity={0.7} />
          <Circle cx={68} cy={54} r={4} fill="#FBCCC4" opacity={0.7} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: '#E8FAF8',
    opacity: 0.7,
  },
});
