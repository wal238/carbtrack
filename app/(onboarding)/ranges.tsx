import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/Mascot';
import { Card } from '@/components/ui/Card';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useThemeColors } from '@/lib/theme';
import { useOnboardingStore } from '@/lib/store';
import { spacing, typography, colors as tokenColors, borderRadius } from '@/constants/tokens';

export default function RangesScreen() {
  const colors = useThemeColors();
  const { rangeTargetHigh, rangeTargetLow, setField } = useOnboardingStore();

  const [highAbove, setHighAbove] = useState(String(rangeTargetHigh));
  const [goodLow, setGoodLow] = useState(String(rangeTargetLow));
  const [goodHigh, setGoodHigh] = useState(String(rangeTargetHigh));
  const [lowBelow, setLowBelow] = useState(String(rangeTargetLow));

  function handleHighAbove(text: string) {
    setHighAbove(text);
    setGoodHigh(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetHigh', num);
      setField('rangeVeryHigh', num);
    }
  }

  function handleGoodLow(text: string) {
    setGoodLow(text);
    setLowBelow(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetLow', num);
    }
  }

  function handleGoodHigh(text: string) {
    setGoodHigh(text);
    setHighAbove(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetHigh', num);
      setField('rangeVeryHigh', num);
    }
  }

  function handleLowBelow(text: string) {
    setLowBelow(text);
    setGoodLow(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num > 0) {
      setField('rangeTargetLow', num);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.dotsWrapper}>
        <ProgressDots total={9} current={5} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>
          What are your target ranges?
        </Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          These define how your readings are classified on graphs and reports.
        </Text>

        <Card>
          <View style={styles.rangeRows}>
            {/* High */}
            <View style={styles.rangeSection}>
              <View style={styles.rangeLabelRow}>
                <View style={[styles.dot, { backgroundColor: tokenColors.glucose.high }]} />
                <Text style={[styles.rangeLabel, { color: colors.text }]}>High</Text>
              </View>
              <View style={styles.rangeDescription}>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  Above
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={highAbove}
                    onChangeText={handleHighAbove}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                  <Text style={[styles.unitText, { color: colors.textMuted }]}>mmol/L</Text>
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            {/* Good (target range) */}
            <View style={styles.rangeSection}>
              <View style={styles.rangeLabelRow}>
                <View style={[styles.dot, { backgroundColor: tokenColors.glucose.normal }]} />
                <Text style={[styles.rangeLabel, { color: colors.text }]}>Good</Text>
              </View>
              <View style={styles.rangeDescription}>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  Between
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={goodLow}
                    onChangeText={handleGoodLow}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                </View>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  and
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={goodHigh}
                    onChangeText={handleGoodHigh}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                </View>
                <Text style={[styles.unitText, { color: colors.textMuted }]}>mmol/L</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />

            {/* Low */}
            <View style={styles.rangeSection}>
              <View style={styles.rangeLabelRow}>
                <View style={[styles.dot, { backgroundColor: tokenColors.glucose.low }]} />
                <Text style={[styles.rangeLabel, { color: colors.text }]}>Low</Text>
              </View>
              <View style={styles.rangeDescription}>
                <Text style={[styles.rangeDescText, { color: colors.textSecondary }]}>
                  Below
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.rangeInput, { color: colors.text, borderColor: colors.border }]}
                    value={lowBelow}
                    onChangeText={handleLowBelow}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                  <Text style={[styles.unitText, { color: colors.textMuted }]}>mmol/L</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <Text style={[styles.footnote, { color: colors.textMuted }]}>
          Defaults: Good range is 3.9 – 10.0 mmol/L. You can adjust these to match your doctor's advice.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth onPress={() => router.push('/(onboarding)/disclaimer')}>
          Next
        </Button>
      </View>
      <View style={styles.mascotFloat}>
        <Mascot size={44} expression="neutral" />
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
  rangeSection: {
    gap: spacing.sm,
  },
  rangeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rangeLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  rangeDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: 18,
  },
  rangeDescText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.caption,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rangeInput: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    borderWidth: 1.5,
    borderRadius: borderRadius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 60,
    textAlign: 'center',
  },
  unitText: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
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
  mascotFloat: {
    position: 'absolute',
    bottom: 90,
    left: 20,
  },
});
