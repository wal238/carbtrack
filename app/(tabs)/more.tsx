import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { AppIcon } from '@/components/AppIcon';

export default function MoreScreen() {
  const colors = useThemeColors();

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
});
