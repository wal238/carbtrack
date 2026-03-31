import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Line, Path } from 'react-native-svg';
import { Mascot } from '@/components/Mascot';
import { colors } from '@/constants/tokens';

interface EmptyActivityProps {
  size?: number;
}

export function EmptyActivity({ size = 100 }: EmptyActivityProps) {
  const clipSize = size * 0.35;
  const clipX = size * 0.62;
  const clipY = size * 0.08;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background clipboard decoration */}
      <View style={styles.svgLayer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Clipboard body */}
          <Rect
            x={clipX}
            y={clipY + clipSize * 0.12}
            width={clipSize}
            height={clipSize * 1.2}
            rx={3}
            fill={colors.primary}
            opacity={0.1}
          />

          {/* Clipboard clip */}
          <Rect
            x={clipX + clipSize * 0.25}
            y={clipY}
            width={clipSize * 0.5}
            height={clipSize * 0.22}
            rx={2}
            fill={colors.primary}
            opacity={0.18}
          />

          {/* List lines on clipboard */}
          {[0.38, 0.55, 0.72].map((ratio) => (
            <Line
              key={ratio}
              x1={clipX + clipSize * 0.15}
              y1={clipY + clipSize * ratio * 1.2}
              x2={clipX + clipSize * 0.85}
              y2={clipY + clipSize * ratio * 1.2}
              stroke={colors.primary}
              strokeWidth={1.2}
              opacity={0.15}
              strokeLinecap="round"
            />
          ))}

          {/* Small checkmarks next to lines */}
          {[0.38, 0.55].map((ratio) => (
            <Path
              key={`check-${ratio}`}
              d={`M ${clipX + clipSize * 0.08} ${clipY + clipSize * ratio * 1.2} l 2 2 l 4 -4`}
              stroke={colors.primary}
              strokeWidth={1}
              opacity={0.2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>

      {/* Mascot overlay */}
      <View style={styles.mascotLayer}>
        <Mascot size={size * 0.55} expression="happy" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgLayer: {
    position: 'absolute',
  },
  mascotLayer: {
    zIndex: 1,
  },
});
