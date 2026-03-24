import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';

export default function PrivacyScreen() {
  const colors = useThemeColors();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const allAccepted = termsAccepted && privacyAccepted;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>Privacy & Legal</Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>
            Accept all required consents to create your account.
          </Text>
        </View>

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
      </ScrollView>

      <View style={styles.footer}>
        <Button
          fullWidth
          disabled={!allAccepted}
          onPress={() => router.push('/(onboarding)/tailor')}
        >
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
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
