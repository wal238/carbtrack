import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/Mascot';

export default function ReportsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
        <Card>
          <View style={styles.illustration}>
            <Mascot size={50} expression="happy" />
            <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
              Generate and share reports with your healthcare provider.
            </Text>
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
  illustration: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  placeholder: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
  },
});
