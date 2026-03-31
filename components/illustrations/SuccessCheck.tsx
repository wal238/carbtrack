import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { colors } from '@/constants/tokens';

interface SuccessCheckProps {
  size?: number;
}

export function SuccessCheck({ size = 80 }: SuccessCheckProps) {
  const center = size / 2;
  const radius = size * 0.42;
  // Checkmark proportions relative to center
  const cx = center;
  const cy = center;
  const armLen = size * 0.12;
  const legLen = size * 0.22;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Circle scales in */}
      <Animated.View entering={ZoomIn.duration(350)} style={styles.absolute}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={center} cy={center} r={radius} fill={colors.primary} />
          <Circle cx={center} cy={center} r={radius * 0.88} fill={colors.primary} opacity={0.85} />
        </Svg>
      </Animated.View>

      {/* Checkmark fades in after circle */}
      <Animated.View entering={FadeIn.delay(300).duration(300)} style={styles.absolute}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Path
            d={`M ${cx - armLen * 1.1} ${cy} l ${armLen} ${armLen} l ${legLen} ${-legLen}`}
            stroke="#FFFFFF"
            strokeWidth={size * 0.06}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
  },
});
