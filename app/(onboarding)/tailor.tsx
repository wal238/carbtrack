import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography, colors as tokenColors } from '@/constants/tokens';
import { haptic } from '@/lib/haptics';
import { AnimatedPressable, useScalePress } from '@/lib/animations';

export default function TailorScreen() {
  const colors = useThemeColors();
  const backButtonPress = useScalePress();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryMuted }]}>
      <AnimatedPressable
        onPress={() => {
          haptic.light();
          router.back();
        }}
        onPressIn={backButtonPress.onPressIn}
        onPressOut={backButtonPress.onPressOut}
        style={[styles.backButton, backButtonPress.animatedStyle]}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </AnimatedPressable>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(220)}>
          <Mascot animate size={90} expression="wink" glow />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(90).duration(260)} style={styles.textBlock}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Let us tailor the app to{' '}
            <Text style={{ color: tokenColors.primary }}>your diabetes!</Text>
          </Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            You can always readjust in settings.
          </Text>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(180).duration(260)} style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/diabetes-type')}>
          Start
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignSelf: 'flex-start' as const,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  textBlock: {
    alignItems: 'center',
    gap: spacing.base,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
