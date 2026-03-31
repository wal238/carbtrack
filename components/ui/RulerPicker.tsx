import { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import { haptic } from '@/lib/haptics';

const TICK_WIDTH = 10;

interface RulerPickerProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  unit?: string;
  height?: number;
}

export function RulerPicker({
  min = 0,
  max = 300,
  step = 1,
  value,
  onValueChange,
  unit,
  height = 120,
}: RulerPickerProps) {
  const colors = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const halfWidth = Math.floor(containerWidth / 2);
  const tickCount = Math.floor((max - min) / step);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const valueToOffset = useCallback(
    (val: number) => ((val - min) / step) * TICK_WIDTH,
    [min, step],
  );

  const offsetToValue = useCallback(
    (offsetX: number) => {
      const raw = Math.round(offsetX / TICK_WIDTH) * step + min;
      return Math.max(min, Math.min(max, raw));
    },
    [min, max, step],
  );

  const snapToTick = useCallback(
    (offsetX: number) => {
      const snappedOffset = Math.round(offsetX / TICK_WIDTH) * TICK_WIDTH;
      scrollRef.current?.scrollTo({ x: snappedOffset, animated: true });
    },
    [],
  );

  // Scroll to initial value once layout is known
  useEffect(() => {
    if (containerWidth === 0) return;
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: valueToOffset(value), animated: false });
    }, 50);
    return () => clearTimeout(timeout);
    // Only run when containerWidth first becomes available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  // Scroll to value when it changes externally
  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollRef.current?.scrollTo({ x: valueToOffset(value), animated: true });
    }
  }, [value, valueToOffset]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const newValue = offsetToValue(offsetX);
      if (newValue !== value) {
        haptic.selection();
        onValueChange(newValue);
      }
    },
    [offsetToValue, value, onValueChange],
  );

  const momentumStarted = useRef(false);

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
    momentumStarted.current = false;
  }, []);

  const handleMomentumBegin = useCallback(() => {
    momentumStarted.current = true;
  }, []);

  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      // If momentum will follow, let onMomentumScrollEnd handle it
      const offset = e.nativeEvent.contentOffset.x;
      setTimeout(() => {
        if (!momentumStarted.current) {
          isUserScrolling.current = false;
          haptic.light();
          snapToTick(offset);
        }
      }, 50);
    },
    [snapToTick],
  );

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      isUserScrolling.current = false;
      haptic.light();
      snapToTick(e.nativeEvent.contentOffset.x);
    },
    [snapToTick],
  );

  // Build tick marks
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= tickCount; i++) {
    const tickValue = min + i * step;
    const isMajor = tickValue % 5 === 0;

    ticks.push(
      <View key={i} style={styles.tickContainer}>
        <View
          style={[
            styles.tick,
            isMajor
              ? { height: 24, width: 2, backgroundColor: colors.textMuted }
              : { height: 12, width: 1, backgroundColor: colors.border },
          ]}
        />
        {isMajor && (
          <Text
            style={[
              styles.tickLabel,
              { color: colors.textMuted },
            ]}
          >
            {tickValue}
          </Text>
        )}
      </View>,
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {/* Selected value display */}
      <View style={styles.valueContainer}>
        <Text style={[styles.valueText, { color: colors.text }]}>
          {value}
        </Text>
        {unit ? (
          <Text style={[styles.unitText, { color: colors.textSecondary }]}>
            {unit}
          </Text>
        ) : null}
      </View>

      {/* Ruler area */}
      <View style={styles.rulerWrapper} onLayout={handleLayout}>
        {/* Center indicator */}
        <View style={[styles.indicatorContainer, { left: halfWidth }]} pointerEvents="none">
          {/* Triangle arrow at top */}
          <View
            style={[
              styles.indicatorTriangle,
              {
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: colors.primary,
              },
            ]}
          />
          {/* Vertical line */}
          <View
            style={[
              styles.indicatorLine,
              { backgroundColor: colors.primary },
            ]}
          />
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollBegin={handleMomentumBegin}
          onMomentumScrollEnd={handleMomentumEnd}
          contentContainerStyle={[
            styles.rulerContent,
            { paddingHorizontal: halfWidth },
          ]}
          bounces={false}
        >
          {ticks}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  valueText: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.display,
  },
  unitText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
    marginLeft: spacing.xs,
  },
  rulerWrapper: {
    flex: 1,
    position: 'relative',
  },
  rulerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tickContainer: {
    width: TICK_WIDTH,
    alignItems: 'center',
  },
  tick: {
    borderRadius: 1,
  },
  tickLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.micro,
    fontWeight: typography.fontWeight.micro,
    marginTop: spacing.xs,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    width: 0,
  },
  indicatorTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
  },
  indicatorLine: {
    width: 2,
    flex: 1,
  },
});
