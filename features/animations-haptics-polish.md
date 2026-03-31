# Animations, Haptics & UI Polish Plan

## Context
CarbTrack has a solid foundation with react-native-reanimated (4.1.1), expo-haptics (15.0.8), and react-native-gesture-handler (2.28.0) already installed. Current animations are minimal — Button scale press, TogglePill slide, ProgressDots width/color. Haptics are limited to a single Light impact on tab press (iOS only). This plan adds comprehensive animations, varied haptic feedback, icon improvements, and custom illustrations across the entire app.

---

## Step 1: Foundation — Haptic Utility & Animation Presets

### 1a. Create `lib/haptics.ts`
Semantic haptic feedback system with Platform.OS check and try/catch:
- `haptic.heavy()` → ImpactFeedbackStyle.Heavy — primary action buttons (Log Dose, Save Entry)
- `haptic.medium()` → ImpactFeedbackStyle.Medium — tab switches, toggle changes, chip/radio selection
- `haptic.light()` → ImpactFeedbackStyle.Light — minor interactions, header buttons, close
- `haptic.selection()` → selectionAsync — RulerPicker tick snaps during scroll
- `haptic.success()` → NotificationFeedbackType.Success — successful log entries
- `haptic.warning()` → NotificationFeedbackType.Warning — correction dose warnings
- `haptic.error()` → NotificationFeedbackType.Error — validation failures

### 1b. Create `lib/animations.ts`
Shared animation presets and reusable hooks:
- **Timing presets:** `TIMING.fast` (150ms), `TIMING.normal` (250ms), `TIMING.slow` (400ms), `TIMING.easeOut`
- **Spring presets:** `SPRING.gentle` (damping 15), `SPRING.bouncy` (damping 10), `SPRING.snappy` (damping 20)
- **Hooks:** `useFadeIn(delay?)`, `useScalePress()`, `useStaggeredFadeIn(index, baseDelay?)`
- Export `AnimatedPressable = Animated.createAnimatedComponent(Pressable)`

---

## Step 2: Component-Level Animations & Haptics

| File | Changes |
|------|---------|
| `components/ui/Button.tsx` | Add haptics: `heavy` for primary variant, `light` for ghost/outline, `medium` for others. Add optional `hapticType` prop override |
| `components/ui/TogglePill.tsx` | Add `haptic.medium()` on segment press |
| `components/ui/Chips.tsx` | Scale bounce on selection (`withSpring` 0.95→1.0), `haptic.medium()` on press |
| `components/ui/Checkbox.tsx` | Animated checkmark: `ZoomIn.duration(200)` on check, scale shrink on uncheck, `haptic.medium()` |
| `components/ui/RadioCard.tsx` | Animate inner dot scale 0→1 with `withSpring(SPRING.bouncy)`, border color transition, `haptic.medium()` |
| `components/ui/Field.tsx` | Animated `borderColor` transition on focus using `useAnimatedStyle` + `withTiming` (200ms) |
| `components/ui/RulerPicker.tsx` | `haptic.selection()` on every tick change during scroll, `haptic.light()` on final snap |
| `components/ui/Card.tsx` | `entering={FadeIn.duration(300)}` on mount. Optional `onPress` prop with scale press + `haptic.light()` |
| `components/Mascot.tsx` | Gentle idle bobbing: looping vertical translate ~3px over 1.5s using `withRepeat` + `withSequence` |

---

## Step 3: Tab Bar — Icon Upgrades & Haptics

### File: `app/(tabs)/_layout.tsx`
Use filled/outline icon pairs based on `focused` prop:
- My Trend: `trending-up` / `trending-up-outline`
- Reports: `document-text` / `document-text-outline`
- Calculator: `calculator` / `calculator-outline`
- Connect: `people` / `people-outline`
- More: `ellipsis-horizontal-circle` / `ellipsis-horizontal-circle-outline`

### File: `components/haptic-tab.tsx`
Replace direct `Haptics.impactAsync(Light)` with `haptic.medium()` from the new utility (removes manual platform check).

---

## Step 4: Screen Transitions

### File: `app/_layout.tsx` (root layout)
- `new-entry` modal: add `animation: 'slide_from_bottom'` for Android parity
- `(tabs)` group: add `animation: 'fade'`

### Tab Content Fade — Each tab screen file
Wrap root content in `<Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>` in:
- `app/(tabs)/index.tsx`
- `app/(tabs)/reports.tsx`
- `app/(tabs)/calculator.tsx`
- `app/(tabs)/connections.tsx`
- `app/(tabs)/more.tsx`

---

## Step 5: Dashboard Animations — `app/(tabs)/index.tsx`

- **Staggered card entry:** Each Card wrapped in `Animated.View` with `entering={FadeInDown.delay(i * 80).duration(300).springify()}`
- **Activity list:** Each row gets `entering={FadeInLeft.delay(i * 60).duration(250)}`
- **Animated progress bar:** Replace static carbs progress bar width with animated width using `useAnimatedStyle` + `withTiming` (animate from 0 to target on mount)

---

## Step 6: New Entry & Calculator Animations

### File: `app/new-entry.tsx`
- Tab content sections: `entering={FadeIn.duration(200)}`, `exiting={FadeOut.duration(100)}`
- Success state: `entering={ZoomIn.duration(300)}` + Mascot with `expression="wink"` + `haptic.success()`

### File: `app/(tabs)/calculator.tsx`
- Result card total dose: brief scale pulse (1.0→1.05→1.0) with `withSpring` when value changes
- Correction text appearance: `entering={FadeInDown.duration(200)}`

---

## Step 7: Chart Animations

### File: `components/charts/GlucoseChart.tsx`
- Wrap SVG container in `Animated.View` with `entering={FadeIn.duration(500)}`

### File: `components/charts/CarbTracker.tsx`
- Wrap SVG container in `Animated.View` with `entering={FadeIn.duration(400)}`
- Progress bar widths: animated from 0 to final value on mount
- Add `haptic.light()` on day bar press

---

## Step 8: Custom Illustrations & Empty States

Create `components/illustrations/` directory with SVG illustrations:
- `EmptyChart.tsx` — for dashboard when no glucose data (Mascot holding a chart)
- `EmptyActivity.tsx` — for empty Recent Activity section
- `SuccessCheck.tsx` — animated checkmark SVG for log success state

Use existing Mascot component as base, compose with additional SVG elements. Match the teal (#2EC4B6) primary color and Nunito/Outfit typography.

---

## Implementation Order

1. `lib/haptics.ts` (new) — foundation, no dependencies
2. `lib/animations.ts` (new) — foundation, no dependencies
3. `components/haptic-tab.tsx` — quick win
4. `components/ui/Button.tsx` — most-used component
5. `components/ui/TogglePill.tsx` — add haptics
6. `components/ui/Chips.tsx` — bounce + haptics
7. `components/ui/RulerPicker.tsx` — selection haptics
8. `components/ui/Checkbox.tsx` — animated checkmark
9. `components/ui/RadioCard.tsx` — ring animation
10. `components/ui/Field.tsx` — animated border
11. `components/ui/Card.tsx` — fade-in
12. `components/Mascot.tsx` — idle bobbing
13. `app/(tabs)/_layout.tsx` — icon upgrades
14. `app/_layout.tsx` — screen transitions
15. Tab screen wrappers (5 files) — fade-in content
16. `app/(tabs)/index.tsx` — staggered cards, progress bar
17. `app/new-entry.tsx` — tab transitions, success
18. `app/(tabs)/calculator.tsx` — result emphasis
19. `components/charts/GlucoseChart.tsx` — chart fade-in
20. `components/charts/CarbTracker.tsx` — bar fade-in
21. `components/illustrations/` — empty states (3 files)

---

## Verification

1. Run `npx expo start` and test on iOS simulator
2. Tab switching: verify fade transition on each tab, filled icons when active
3. Haptics: test on physical iOS device — verify heavy on primary buttons, medium on toggles, selection on ruler scroll
4. Dashboard: verify staggered card entry animation, progress bar animates on mount
5. Calculator: verify ruler haptic ticks, dose result pulse on value change
6. New Entry: verify tab content fade transitions, success zoom + haptic
7. Mascot: verify gentle bobbing animation, no jank
8. Charts: verify fade-in on mount
9. Performance: no dropped frames during animations (use React DevTools profiler)
