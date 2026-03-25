import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeColors } from '@/lib/theme';
import { useUserPreferencesStore, useOnboardingStore } from '@/lib/store';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppIcon } from '@/components/AppIcon';

export default function MoreScreen() {
  const colors = useThemeColors();

  function handleResetOnboarding() {
    useUserPreferencesStore.setState({ onboardingCompleted: false });
    useOnboardingStore.getState().reset();
    router.replace('/(onboarding)/welcome');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>More</Text>
        <Card>
          <View style={styles.appInfo}>
            <AppIcon size={48} />
            <View>
              <Text style={[styles.appName, { color: colors.text }]}>CarbTrack</Text>
              <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0</Text>
            </View>
          </View>
        </Card>

        {__DEV__ && (
          <Card>
            <View style={styles.devSection}>
              <Text style={[styles.devLabel, { color: colors.textMuted }]}>DEV TOOLS</Text>
              <Button variant="outline" size="sm" onPress={handleResetOnboarding}>
                Reset Onboarding
              </Button>
            </View>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, gap: spacing.base },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: '800',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  appName: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.bodySemiBold,
    fontWeight: '600',
  },
  version: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  devSection: {
    gap: spacing.md,
  },
  devLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.micro,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
