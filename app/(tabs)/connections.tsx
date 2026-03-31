import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedTabScreen } from '@/components/AnimatedTabScreen';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { EmptyChart } from '@/components/illustrations/EmptyChart';

export default function ConnectionsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <AnimatedTabScreen tabIndex={3}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(220)}>
          <Text style={[styles.title, { color: colors.text }]}>Connections</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(70).duration(260)}>
          <Card>
            <View style={styles.placeholderContent}>
              <EmptyChart size={108} />
              <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
                Connect your glucose meters and health apps.
              </Text>
            </View>
          </Card>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(140).duration(240)}>
          <Text style={[styles.footer, { color: colors.textMuted }]}>
            May vary by country and regulatory approval.
          </Text>
        </Animated.View>
      </View>
      </AnimatedTabScreen>
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
  placeholder: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  placeholderContent: {
    alignItems: 'center',
    gap: spacing.base,
    paddingVertical: spacing.lg,
  },
  footer: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
});
