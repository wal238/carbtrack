import { StyleSheet, View } from 'react-native';
import Svg, { Line, Rect, Path } from 'react-native-svg';
import { Mascot } from '@/components/Mascot';
import { colors } from '@/constants/tokens';

interface EmptyChartProps {
  size?: number;
}

export function EmptyChart({ size = 120 }: EmptyChartProps) {
  const gridSize = size * 0.85;
  const gridOffset = (size - gridSize) / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background chart grid/line decoration */}
      <View style={styles.svgLayer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Grid lines */}
          {[0.3, 0.5, 0.7].map((ratio) => (
            <Line
              key={ratio}
              x1={gridOffset}
              y1={size * ratio}
              x2={gridOffset + gridSize}
              y2={size * ratio}
              stroke={colors.primary}
              strokeWidth={0.8}
              opacity={0.15}
            />
          ))}

          {/* Vertical grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <Line
              key={`v-${ratio}`}
              x1={gridOffset + gridSize * ratio}
              y1={size * 0.25}
              x2={gridOffset + gridSize * ratio}
              y2={size * 0.75}
              stroke={colors.primary}
              strokeWidth={0.8}
              opacity={0.1}
            />
          ))}

          {/* Flat line chart path */}
          <Path
            d={`M ${gridOffset + 5} ${size * 0.55} Q ${size * 0.35} ${size * 0.4} ${size * 0.5} ${size * 0.45} T ${gridOffset + gridSize - 5} ${size * 0.5}`}
            fill="none"
            stroke={colors.primary}
            strokeWidth={1.5}
            opacity={0.2}
            strokeDasharray="4 3"
          />

          {/* Small axis rect */}
          <Rect
            x={gridOffset}
            y={size * 0.35}
            width={gridSize}
            height={size * 0.35}
            rx={4}
            fill={colors.primary}
            opacity={0.04}
          />
        </Svg>
      </View>

      {/* Mascot overlay */}
      <View style={styles.mascotLayer}>
        <Mascot size={size * 0.55} expression="neutral" />
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
