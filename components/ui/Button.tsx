import { StyleSheet, Pressable, Text, View, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { borderRadius, spacing, typography } from '@/constants/tokens';
import { useThemeColors, useTheme } from '@/lib/theme';
import type { ButtonProps } from '@/lib/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SIZE_MAP = {
  sm: { height: 36, fontSize: typography.fontSize.caption, px: spacing.md },
  md: { height: 44, fontSize: typography.fontSize.body, px: spacing.base },
  lg: { height: 52, fontSize: typography.fontSize.bodySemiBold, px: spacing.lg },
  xl: { height: 56, fontSize: typography.fontSize.title, px: spacing.xl },
} as const;

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  disabled = false,
  icon,
  iconRight,
  onPress,
}: ButtonProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withTiming(0.97, { duration: 100 });
  }

  function handlePressOut() {
    scale.value = withTiming(1, { duration: 150 });
  }

  const variantStyles = getVariantStyles(variant, colors, isDark);
  const sizeConfig = SIZE_MAP[size];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.px,
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.borderColor,
          borderWidth: variantStyles.borderWidth,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
      ]}
    >
      {icon && <View style={styles.iconLeft}>{icon}</View>}
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.label,
            { color: variantStyles.text, fontSize: sizeConfig.fontSize },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
    </AnimatedPressable>
  );
}

function getVariantStyles(
  variant: NonNullable<ButtonProps['variant']>,
  colors: ReturnType<typeof useThemeColors>,
  isDark: boolean
) {
  const base = { borderWidth: 0, borderColor: 'transparent' };

  switch (variant) {
    case 'primary':
      return { ...base, bg: colors.primary, text: colors.onPrimary };
    case 'secondary':
      return { ...base, bg: colors.secondaryMuted, text: colors.secondary };
    case 'surface':
      return { ...base, bg: colors.surface, text: colors.text, borderWidth: 1, borderColor: colors.border };
    case 'outline':
      return { ...base, bg: 'transparent', text: colors.primary, borderWidth: 1.5, borderColor: colors.primary };
    case 'ghost':
      return { ...base, bg: 'transparent', text: colors.primary };
    case 'accent':
      return { ...base, bg: colors.warning, text: colors.onWarning };
    case 'dkSurface':
      return { ...base, bg: isDark ? colors.surface : colors.bg, text: colors.text };
    default:
      return { ...base, bg: colors.primary, text: colors.onPrimary };
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontWeight: '700',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
});
