import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Ionicons } from '@expo/vector-icons';

export default function ConnectionsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Connections</Text>
        <Card>
          <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
            Connect your glucose meters and health apps.
          </Text>
        </Card>
        <Text style={[styles.footer, { color: colors.textMuted }]}>
          May vary by country and regulatory approval.
        </Text>
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
  placeholder: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  footer: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
});
