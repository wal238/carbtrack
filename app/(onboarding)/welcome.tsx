import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';

export default function WelcomeScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryMuted }]}>
      <View style={styles.content}>
        <Mascot size={110} expression="happy" glow />
        <Text style={[styles.heading, { color: colors.text }]}>
          Welcome to CarbTrack
        </Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          Your personal carb counting companion. Track meals, calculate insulin doses, and manage your diabetes with confidence.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/privacy')}>
          Continue
        </Button>
      </View>
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
