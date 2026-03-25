import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Mascot } from '@/components/Mascot';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography, colors as tokenColors } from '@/constants/tokens';

export default function TailorScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primaryMuted }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.content}>
        <Mascot size={90} expression="wink" glow />
        <Text style={[styles.heading, { color: colors.text }]}>
          Let's tailor the app to{' '}
          <Text style={{ color: tokenColors.primary }}>your diabetes!</Text>
        </Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          You can always readjust in settings.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/diabetes-type')}>
          Start
        </Button>
      </View>
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
