import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { spacing, typography, colors as tokenColors } from '@/constants/tokens';

export default function RangesScreen() {
  const colors = useThemeColors();
  const { rangeVeryHigh, rangeTargetHigh, rangeTargetLow } = useOnboardingStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={9} current={5} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>
          What are your ranges?
        </Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          These define how graphs classify your values.
        </Text>

        <Card>
          <View style={styles.rangeRows}>
            <View style={styles.rangeRow}>
              <View style={[styles.dot, { backgroundColor: tokenColors.glucose.warning }]} />
              <Text style={[styles.rangeLabel, { color: colors.text }]}>Very high</Text>
              <Text style={[styles.rangeValue, { color: colors.textSecondary }]}>
                {rangeVeryHigh} mmol/L
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            <View style={styles.rangeRow}>
              <View style={[styles.dot, { backgroundColor: tokenColors.glucose.normal }]} />
              <Text style={[styles.rangeLabel, { color: colors.text }]}>Target range</Text>
              <Text style={[styles.rangeValue, { color: colors.textSecondary }]}>
                {rangeTargetLow} – {rangeTargetHigh} mmol/L
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            <View style={styles.rangeRow}>
              <View style={[styles.dot, { backgroundColor: tokenColors.glucose.high }]} />
              <Text style={[styles.rangeLabel, { color: colors.text }]}>Very low</Text>
              <Text style={[styles.rangeValue, { color: colors.textSecondary }]}>
                3.0 mmol/L
              </Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.footnote, { color: colors.textMuted }]}>
          Very low cannot be changed for medical reasons.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/disclaimer')}>
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotsWrapper: {
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
  subtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    marginTop: -spacing.sm,
  },
  rangeRows: {
    gap: spacing.base,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rangeLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  rangeValue: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  divider: {
    height: 1,
  },
  footnote: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
