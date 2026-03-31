import { useState, useCallback, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { spacing, typography, borderRadius } from '@/constants/tokens';
import { useThemeColors } from '@/lib/theme';
import { haptic } from '@/lib/haptics';
import { useUserPreferencesStore } from '@/lib/store';
import {
  useGlucoseLogStore,
  useMealLogStore,
  useInsulinLogStore,
} from '@/lib/data-store';
import { MEAL_TYPES, DOSE_TYPES } from '@/lib/types';
import type { ChipOption, MealType, DoseType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Chips } from '@/components/ui/Chips';
import { TogglePill } from '@/components/ui/TogglePill';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Mascot } from '@/components/Mascot';
import { SuccessCheck } from '@/components/illustrations/SuccessCheck';
import { AnimatedPressable, useScalePress } from '@/lib/animations';

const TAB_OPTIONS = ['Glucose', 'Meal', 'Insulin'];

const mealTypeOptions: ChipOption[] = Object.entries(MEAL_TYPES).map(
  ([value, label]) => ({ value, label })
);

const doseTypeOptions: ChipOption[] = Object.entries(DOSE_TYPES).map(
  ([value, label]) => ({ value, label })
);

interface PendingMealItem {
  name: string;
  carbs: number;
}

function MotionIconButton({
  accessibilityLabel,
  onPress,
  hitSlop = 8,
  style,
  children,
}: {
  accessibilityLabel: string;
  onPress: () => void;
  hitSlop?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const { onPressIn, onPressOut, animatedStyle } = useScalePress();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function NewEntryScreen() {
  const colors = useThemeColors();
  const glucoseUnit = useUserPreferencesStore((s) => s.glucoseUnit);
  const addGlucoseLog = useGlucoseLogStore((s) => s.addLog);
  const addMeal = useMealLogStore((s) => s.addMeal);
  const addInsulinLog = useInsulinLogStore((s) => s.addLog);

  const [selectedTab, setSelectedTab] = useState(0);
  const [success, setSuccess] = useState(false);

  // Glucose state
  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseTag, setGlucoseTag] = useState('');

  // Meal state
  const [mealType, setMealType] = useState<string>('breakfast');
  const [mealItems, setMealItems] = useState<PendingMealItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemCarbs, setItemCarbs] = useState('');

  // Insulin state
  const [doseType, setDoseType] = useState<string>('food');
  const [insulinDose, setInsulinDose] = useState('');

  const totalCarbs = mealItems.reduce((sum, item) => sum + item.carbs, 0);

  const handleAddItem = useCallback(() => {
    const name = itemName.trim();
    const carbs = parseFloat(itemCarbs);
    if (!name) {
      haptic.error();
      Alert.alert('Missing name', 'Please enter a food item name.');
      return;
    }
    if (isNaN(carbs) || carbs < 0) {
      haptic.error();
      Alert.alert('Invalid carbs', 'Please enter a valid carb amount.');
      return;
    }
    haptic.light();
    setMealItems((prev) => [...prev, { name, carbs }]);
    setItemName('');
    setItemCarbs('');
  }, [itemName, itemCarbs]);

  const handleDeleteItem = useCallback((index: number) => {
    haptic.light();
    setMealItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const showSuccess = useCallback(() => {
    haptic.success();
    setSuccess(true);
    setTimeout(() => {
      router.back();
    }, 800);
  }, []);

  const handleLogGlucose = useCallback(() => {
    const value = parseFloat(glucoseValue);
    if (isNaN(value) || value <= 0) {
      haptic.error();
      Alert.alert('Invalid value', 'Please enter a valid glucose reading.');
      return;
    }
    addGlucoseLog({
      user_id: 'local',
      value,
      unit: glucoseUnit,
      logged_at: new Date().toISOString(),
      tag: glucoseTag.trim() || null,
    });
    showSuccess();
  }, [glucoseValue, glucoseUnit, glucoseTag, addGlucoseLog, showSuccess]);

  const handleLogMeal = useCallback(() => {
    if (mealItems.length === 0) {
      haptic.error();
      Alert.alert('No items', 'Please add at least one food item.');
      return;
    }
    addMeal(
      {
        user_id: 'local',
        meal_type: mealType as MealType,
        total_carbs: totalCarbs,
        logged_at: new Date().toISOString(),
      },
      mealItems.map((item) => ({
        name: item.name,
        carbs: item.carbs,
        calories: null,
        confidence: null,
        source: 'manual' as const,
      }))
    );
    showSuccess();
  }, [mealItems, mealType, totalCarbs, addMeal, showSuccess]);

  const handleLogInsulin = useCallback(() => {
    const dose = parseFloat(insulinDose);
    if (isNaN(dose) || dose <= 0) {
      haptic.error();
      Alert.alert('Invalid dose', 'Please enter a valid insulin dose.');
      return;
    }
    addInsulinLog({
      user_id: 'local',
      dose,
      dose_type: doseType as DoseType,
      calculated_from_carbs: null,
      calculated_from_ratio: null,
      logged_at: new Date().toISOString(),
    });
    showSuccess();
  }, [insulinDose, doseType, addInsulinLog, showSuccess]);

  if (success) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.successContainer}>
          <SuccessCheck size={80} />
          <Mascot size={64} expression="wink" />
          <Text style={[styles.successText, { color: colors.primary }]}>
            Logged successfully!
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const unitLabel = glucoseUnit === 'mmol' ? 'mmol/L' : 'mg/dL';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            New Entry
          </Text>
          <MotionIconButton
            accessibilityLabel="Close new entry"
            onPress={() => {
              haptic.light();
              router.back();
            }}
            hitSlop={12}
          >
            <Text style={[styles.closeButton, { color: colors.textSecondary }]}>
              ✕
            </Text>
          </MotionIconButton>
        </View>

        <View style={styles.pillWrapper}>
          <TogglePill
            options={TAB_OPTIONS}
            selected={selectedTab}
            onSelect={setSelectedTab}
          />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {selectedTab === 0 && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)} style={{ gap: spacing.lg }}>
              <Card>
                <View style={styles.cardContent}>
                  <Field
                    label="Glucose Reading"
                    value={glucoseValue}
                    onChangeText={setGlucoseValue}
                    placeholder="e.g. 7.2"
                    keyboardType="decimal-pad"
                    unit={unitLabel}
                  />
                  <Field
                    label="Tag (optional)"
                    value={glucoseTag}
                    onChangeText={setGlucoseTag}
                    placeholder="e.g. before lunch"
                  />
                </View>
              </Card>
              <Button variant="primary" fullWidth onPress={handleLogGlucose}>
                Log Glucose
              </Button>
            </Animated.View>
          )}

          {selectedTab === 1 && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)} style={{ gap: spacing.lg }}>
              <Card>
                <View style={styles.cardContent}>
                  <Chips
                    options={mealTypeOptions}
                    selected={mealType}
                    onSelect={setMealType}
                  />

                  <SectionLabel label="Food Items" style={styles.sectionLabel} />

                  {mealItems.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.mealItemRow,
                        { borderBottomColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[styles.mealItemName, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.mealItemCarbs,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.carbs}g
                      </Text>
                      <MotionIconButton
                        accessibilityLabel={`Remove ${item.name}`}
                        onPress={() => handleDeleteItem(index)}
                        hitSlop={8}
                      >
                        <Text
                          style={[
                            styles.deleteButton,
                            { color: colors.textMuted },
                          ]}
                        >
                          ✕
                        </Text>
                      </MotionIconButton>
                    </View>
                  ))}

                  <View style={styles.addItemRow}>
                    <View style={styles.addItemName}>
                      <Field
                        value={itemName}
                        onChangeText={setItemName}
                        placeholder="Item name"
                      />
                    </View>
                    <View style={styles.addItemCarbs}>
                      <Field
                        value={itemCarbs}
                        onChangeText={setItemCarbs}
                        placeholder="Carbs"
                        keyboardType="decimal-pad"
                        unit="g"
                      />
                    </View>
                    <MotionIconButton
                      accessibilityLabel="Add meal item"
                      onPress={handleAddItem}
                      style={[
                        styles.addButton,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>+</Text>
                    </MotionIconButton>
                  </View>

                  <View
                    style={[
                      styles.totalRow,
                      { borderTopColor: colors.border },
                    ]}
                  >
                    <Text
                      style={[styles.totalLabel, { color: colors.textSecondary }]}
                    >
                      Total Carbs
                    </Text>
                    <Text style={[styles.totalValue, { color: colors.text }]}>
                      {totalCarbs}g
                    </Text>
                  </View>
                </View>
              </Card>
              <Button variant="primary" fullWidth onPress={handleLogMeal}>
                Log Meal
              </Button>
            </Animated.View>
          )}

          {selectedTab === 2 && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)} style={{ gap: spacing.lg }}>
              <Card>
                <View style={styles.cardContent}>
                  <Chips
                    options={doseTypeOptions}
                    selected={doseType}
                    onSelect={setDoseType}
                  />
                  <Field
                    label="Dose"
                    value={insulinDose}
                    onChangeText={setInsulinDose}
                    placeholder="Units"
                    keyboardType="decimal-pad"
                    unit="U"
                  />
                </View>
              </Card>
              <Button variant="primary" fullWidth onPress={handleLogInsulin}>
                Log Insulin
              </Button>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
  closeButton: {
    fontSize: typography.fontSize.title,
    fontWeight: '600',
  },
  pillWrapper: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  cardContent: {
    gap: spacing.base,
  },
  sectionLabel: {
    marginTop: spacing.sm,
  },
  mealItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  mealItemName: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
  },
  mealItemCarbs: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  deleteButton: {
    fontSize: typography.fontSize.caption,
    fontWeight: '600',
    paddingHorizontal: spacing.xs,
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  addItemName: {
    flex: 2,
  },
  addItemCarbs: {
    flex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: typography.fontSize.heading,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.base,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontFamily: typography.fontFamily.caption,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.caption,
  },
  totalValue: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.bodySemiBold,
    fontWeight: typography.fontWeight.bodySemiBold,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.heading,
  },
});
