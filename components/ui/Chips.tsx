import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import { haptic } from '@/lib/haptics';
import { AnimatedPressable, useScalePress } from '@/lib/animations';
import type { ChipsProps } from '@/lib/types';

function ChipItem({
  option,
  isSelected,
  colors,
  onSelect,
}: {
  option: { value: string; label: string; icon?: React.ReactNode };
  isSelected: boolean;
  colors: ReturnType<typeof useThemeColors>;
  onSelect: (value: string) => void;
}) {
  const { onPressIn, onPressOut, animatedStyle } = useScalePress(0.95);

  return (
    <AnimatedPressable
      onPress={() => {
        haptic.medium();
        onSelect(option.value);
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
        animatedStyle,
      ]}
    >
      {option.icon && <View style={styles.icon}>{option.icon}</View>}
      <Text
        style={[
          styles.label,
          { color: isSelected ? colors.onPrimary : colors.text },
        ]}
      >
        {option.label}
      </Text>
    </AnimatedPressable>
  );
}

export function Chips({ options, selected, onSelect }: ChipsProps) {
  const colors = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <ChipItem
            key={option.value}
            option={option}
            isSelected={isSelected}
            colors={colors}
            onSelect={onSelect}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
  },
});
