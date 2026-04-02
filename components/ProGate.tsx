import { type ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/lib/theme';
import { useProAccess } from '@/lib/subscription-store';
import { presentPaywall } from '@/lib/present-paywall';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
}

export function ProGate({ children, fallback, feature }: ProGateProps) {
  const isPro = useProAccess();

  if (isPro) return <>{children}</>;
  if (fallback) return <>{fallback}</>;

  return <ProGateFallback feature={feature} />;
}

function ProGateFallback({ feature }: { feature?: string }) {
  const colors = useThemeColors();

  return (
    <Card>
      <View style={styles.container}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="lock-closed" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {feature ? `Unlock ${feature}` : 'Upgrade to Pro'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This feature requires CarbTrack Pro
        </Text>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onPress={() => presentPaywall()}
        >
          Upgrade to Pro
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.title,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
  },
});
