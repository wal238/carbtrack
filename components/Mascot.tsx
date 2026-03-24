import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path, Line } from 'react-native-svg';
import type { MascotProps } from '@/lib/types';

export function Mascot({ size = 64, expression = 'happy', glow = false }: MascotProps) {
  const isWink = expression === 'wink';
  const isNeutral = expression === 'neutral';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {glow && (
        <View
          style={[
            styles.glow,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              top: -10,
              left: -10,
            },
          ]}
        />
      )}
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Body — sensor disc */}
        <Circle cx={50} cy={50} r={46} fill="#FFFFFF" stroke="#D8DCE4" strokeWidth={1.5} />
        <Circle cx={50} cy={50} r={38} fill="none" stroke="#E8EBF0" strokeWidth={1} />

        {/* Sensor nub on top */}
        <Rect x={44} y={6} width={12} height={6} rx={3} fill="#D0D5DE" />

        {/* Eyebrows */}
        <Path d="M33 40Q38 37 43 40" stroke="#C0C6D0" strokeWidth={1.2} strokeLinecap="round" fill="none" />
        <Path d="M57 40Q62 37 67 40" stroke="#C0C6D0" strokeWidth={1.2} strokeLinecap="round" fill="none" />

        {/* Left eye (always open) */}
        <Ellipse cx={38} cy={48} rx={5} ry={6} fill="#0F2027" />
        <Circle cx={40} cy={46} r={1.8} fill="#FFFFFF" />

        {/* Right eye */}
        {isWink ? (
          <Path d="M57 47Q62 45 67 47" stroke="#0F2027" strokeWidth={1.8} strokeLinecap="round" fill="none" />
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
    </View>
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
