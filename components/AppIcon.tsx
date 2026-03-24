import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path } from 'react-native-svg';
import { shadows } from '@/constants/tokens';
import type { AppIconProps } from '@/lib/types';

export function AppIcon({ size = 34 }: AppIconProps) {
  const innerSize = size * 0.6;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
        },
        shadows.card,
      ]}
    >
      <Svg width={innerSize} height={innerSize} viewBox="0 0 100 100">
        {/* Body circle */}
        <Circle cx={50} cy={50} r={42} fill="#FFFFFF" />
        <Circle cx={50} cy={50} r={35} fill="none" stroke="#E8EBF0" strokeWidth={1.5} />

        {/* Sensor nub */}
        <Rect x={44} y={10} width={12} height={5} rx={2.5} fill="#D0D5DE" />

        {/* Eyes */}
        <Ellipse cx={39} cy={48} rx={4.5} ry={5.5} fill="#0F2027" />
        <Ellipse cx={61} cy={48} rx={4.5} ry={5.5} fill="#0F2027" />

        {/* Eye shine */}
        <Circle cx={41} cy={46} r={1.5} fill="#FFFFFF" />
        <Circle cx={63} cy={46} r={1.5} fill="#FFFFFF" />

        {/* Smile */}
        <Path
          d="M43 58Q50 64 57 58"
          stroke="#0F2027"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2EC4B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
