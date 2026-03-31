import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Mascot } from '@/components/Mascot';
import { SpeechBubble } from '@/components/SpeechBubble';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';

export default function WelcomeScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryMuted }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(220)}>
          <SpeechBubble text="I'm Patchy! I'm here to help you with your diabetes goals." />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(80).duration(260)}>
          <Mascot animate size={120} expression="happy" glow />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(140).duration(260)} style={styles.textBlock}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Welcome to CarbTrack
          </Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            Your personal carb counting companion. Track meals, calculate insulin doses, and manage your diabetes with confidence.
          </Text>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(220).duration(260)} style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/privacy')}>
          Continue
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.display,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
