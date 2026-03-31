import { StyleSheet, Pressable, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import { haptic } from '@/lib/haptics';
import type { CheckboxProps } from '@/lib/types';
import type { ReactNode } from 'react';

export function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        haptic.medium();
        onToggle();
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={typeof label === 'string' ? label : undefined}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? colors.primary : 'transparent',
            borderColor: checked ? colors.primary : colors.border,
          },
        ]}
      >
        {checked && (
          <Animated.View entering={ZoomIn.duration(200)} exiting={ZoomOut.duration(200)}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12l5 5L20 7"
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        )}
      </View>
      {typeof label === 'string' ? (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      ) : (
        <View style={styles.labelContainer}>{label as ReactNode}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  labelContainer: {
    flex: 1,
  },
});
