import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/lib/theme';
import { spacing, typography } from '@/constants/tokens';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/Mascot';
import { GlucoseChart } from '@/components/charts/GlucoseChart';

export default function TrendScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Trend</Text>
          <View style={styles.headerActions}>
            <Pressable style={[styles.headerBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={22} color="#0F2027" />
            </Pressable>
            <Pressable style={[styles.headerBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Glucose Chart */}
        <Card>
          <GlucoseChart compact />
        </Card>

        {/* Carbs Summary */}
        <Card>
          <View style={styles.carbRow}>
            <Ionicons name="flame" size={20} color={colors.warning} />
            <Text style={[styles.carbLabel, { color: colors.textSecondary }]}>Carbs today</Text>
          </View>
          <View style={[styles.progressBg, { backgroundColor: colors.bg }]}>
            <View style={[styles.progressFill, { width: '65%', backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.carbValue, { color: colors.text }]}>
            195 / 200g
          </Text>
        </Card>

        {/* Estimated A1c */}
        <Card>
          <View style={styles.a1cRow}>
            <View>
              <Text style={[styles.a1cLabel, { color: colors.textSecondary }]}>Estimated A1c</Text>
              <Text style={[styles.a1cValue, { color: colors.normal }]}>6.8%</Text>
            </View>
            <Mascot size={38} expression="happy" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.title,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  carbLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  carbValue: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: '600',
  },
  a1cRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  a1cLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    marginBottom: spacing.xs,
  },
  a1cValue: {
    fontFamily: typography.fontFamily.display,
    fontSize: 32,
    fontWeight: '800',
  },
});
