import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { OnboardingBackButton, OnboardingMotionBlock } from '@/components/onboarding-motion';

export default function PrivacyScreen() {
  const colors = useThemeColors();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const allAccepted = termsAccepted && privacyAccepted;

  function openTerms() {
    router.push('/(onboarding)/terms');
  }

  function openPrivacyNotice() {
    router.push('/(onboarding)/privacy-notice');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <OnboardingBackButton color={colors.text} onPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <OnboardingMotionBlock style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>Privacy & Legal</Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            Accept all required consents to create your account.
          </Text>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={70}>
        <Card>
          <View style={styles.checkboxList}>
            <Checkbox
              checked={termsAccepted}
              onToggle={() => setTermsAccepted(!termsAccepted)}
              label="I confirm I am 16+ and accept the Terms & Conditions"
            />
            <View style={[styles.divider, { backgroundColor: colors.borderFaint }]} />
            <Checkbox
              checked={privacyAccepted}
              onToggle={() => setPrivacyAccepted(!privacyAccepted)}
              label="I accept the Privacy Notice and consent to data processing"
            />
          </View>
        </Card>
        </OnboardingMotionBlock>

        <OnboardingMotionBlock delay={140} style={styles.linksSection}>
          <Text style={[styles.linksLabel, { color: colors.textSecondary }]}>
            Read documents before accepting
          </Text>
          <Pressable onPress={openTerms} hitSlop={12} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              View Terms & Conditions
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
          <Pressable onPress={openPrivacyNotice} hitSlop={12} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              View Privacy Notice
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        </OnboardingMotionBlock>
      </ScrollView>

      <OnboardingMotionBlock delay={200} style={styles.footer}>
        <Button
          fullWidth
          disabled={!allAccepted}
          onPress={() => router.push('/(onboarding)/tailor')}
        >
          Continue
        </Button>
      </OnboardingMotionBlock>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
  subtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    lineHeight: 22,
  },
  checkboxList: {
    gap: spacing.base,
  },
  divider: {
    height: 1,
  },
  linksSection: {
    gap: spacing.sm,
    marginTop: -spacing.sm,
  },
  linksLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
