import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { PRIVACY_NOTICE } from '@/constants/legal';

export default function PrivacyNoticeScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderFaint }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {PRIVACY_NOTICE.title}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
          Last updated: {PRIVACY_NOTICE.lastUpdated}
        </Text>

        {PRIVACY_NOTICE.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {section.heading}
            </Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {section.body}
            </Text>
          </View>
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
    alignItems: 'flex-start',
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
