import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { TERMS_AND_CONDITIONS } from '@/constants/legal';
import { OnboardingBackButton } from '@/components/onboarding-motion';

export default function TermsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderFaint }]}>
        <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {TERMS_AND_CONDITIONS.title}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(220)}>
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
            Last updated: {TERMS_AND_CONDITIONS.lastUpdated}
          </Text>
        </Animated.View>

        {TERMS_AND_CONDITIONS.sections.map((section, index) => (
          <Animated.View key={index} entering={FadeInDown.delay(40 * (index + 1)).duration(220)} style={styles.section}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {section.heading}
            </Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {section.body}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.heading,
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  lastUpdated: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeading: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.bodySemiBold,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  sectionBody: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: 22,
  },
});
