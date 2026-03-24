import { StyleSheet, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import type { TogglePillProps } from '@/lib/types';
import { useState, useCallback } from 'react';

export function TogglePill({ options, selected, onSelect }: TogglePillProps) {
  const colors = useThemeColors();
  const [segmentWidth, setSegmentWidth] = useState(0);

  const onLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number } } }) => {
      setSegmentWidth(e.nativeEvent.layout.width / options.length);
    },
    [options.length]
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(selected * segmentWidth, { duration: 200 }) }],
    width: segmentWidth,
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg }]}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: colors.primary },
          indicatorStyle,
        ]}
      />
      {options.map((option, index) => (
        <Pressable
          key={option}
          style={styles.segment}
          onPress={() => onSelect(index)}
        >
          <Text
            style={[
              styles.label,
              {
                color: index === selected ? '#0F2027' : colors.textSecondary,
                fontWeight: index === selected ? '700' : '500',
              },
            ]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.full,
    padding: 3,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    borderRadius: borderRadius.full,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    zIndex: 1,
  },
  label: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
});
