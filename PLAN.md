# CarbTrack Phase 1: Foundation Implementation Plan

## Context
CarbTrack is a diabetes carb calculator app. The project is a fresh Expo SDK 54 template with no app-specific code. This plan implements the complete foundation layer: design tokens, theme system, all reusable UI components, mascot/app icon SVGs, stores, and navigation restructuring — everything needed before building screens in Phase 2.

---

## Step 1: Install Required Packages

```bash
npx expo install react-native-svg @expo-google-fonts/nunito @expo-google-fonts/outfit expo-secure-store zustand @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage
```

Packages needed: `react-native-svg` (mascot/charts), `@expo-google-fonts/nunito` + `@expo-google-fonts/outfit` (typography), `zustand` (state), `expo-secure-store` (persistence), `@supabase/supabase-js` (Supabase client for auth + DB), `react-native-url-polyfill` (required by Supabase on RN), `@react-native-async-storage/async-storage` (Supabase auth session persistence).

---

## Step 2: Design Tokens — `constants/tokens.ts` (new)

Export all design tokens from PRD Section 3:

- **Brand colors**: primary (#2EC4B6), primaryDark (#22A89C), primaryMuted (#E8FAF8), primarySoft (#D0F4F0), secondary (#4C7DFF), secondaryMuted (#EEF2FF)
- **Glucose colors**: normal (#22C55E), warning (#FACC15), high (#EF4444), low (#3B82F6) + muted variants
- **Light surfaces**: bg (#F5F7FA), surface (#FFFFFF), border (#E2E6ED), borderFaint (#EEF1F5)
- **Dark surfaces**: dk (#0F2027), dkCard (#1A2F38), dkBorder (#2A4550), dkText (#94B3C0), dkMute (#5A7A88)
- **Text colors**: primary (#0F2027/#FFFFFF), secondary (#5A6B78/#94B3C0), muted (#94A3B0/#5A7A88)
- **Typography**: fontFamily (Nunito_800ExtraBold, Nunito_700Bold, Outfit_600SemiBold, Outfit_400Regular, Outfit_500Medium), fontSize presets (display 36, heading 24, title 20, bodySemiBold 17, body 15, caption 13, tiny 11, micro 10)
- **Spacing**: xs(4), sm(8), md(12), base(16), lg(20), xl(24), 2xl(32), 3xl(40), 4xl(48)
- **Border radius**: xs(6), sm(10), md(14), lg(18), xl(22), full(999)
- **Shadows**: card, lg (light mode only)
- **Glucose thresholds**: mmol ranges for color mapping

---

## Step 3: TypeScript Interfaces — `lib/types.ts` (new)

All data model interfaces from PRD Section 8:
- `User`, `GlucoseLog`, `MealLog`, `MealItem`, `InsulinLog`
- Unit types: `GlucoseUnit`, `CarbUnit`, `ThemeMode`
- Enums as maps: `DiabetesType`, `InsulinTherapy`, `MealType`, `DoseType`
- `OnboardingState` interface
- Component prop interfaces: `ButtonProps`, `CardProps`, `FieldProps`, `RadioCardProps`, `ChipOption`, `TogglePillProps`, `ProgressDotsProps`, `CheckboxProps`, `MascotProps`, `AppIconProps`

---

## Step 4: Disclaimer Constants — `constants/disclaimers.ts` (new)

All exact disclaimer strings from PRD Section 11:
- `ONBOARDING_HEADING`, `ONBOARDING_BODY`, `ONBOARDING_BULLETS` (array of 5)
- `ONBOARDING_CHECKBOX`
- `CALCULATOR_BANNER`, `CALCULATOR_FOOTER`
- `SCAN_DISCLAIMER`
- `CARB_RATIO_BANNER`

---

## Step 5: Color Helpers — `lib/colors.ts` (new)

- `getGlucoseRangeLabel(value, unit)` -> `'low' | 'normal' | 'warning' | 'high'`
- `getGlucoseColor(value, unit)` -> hex color string
- `getGlucoseBackgroundColor(value, unit)` -> muted hex color string
- Uses thresholds from tokens: low <= 3.9, normal 3.9-10.0, warning 10.0-13.9, high >= 13.9 (mmol/L)

---

## Step 6: Theme System — `lib/theme.ts` (new)

- `ThemeContext` with `isDark`, `mode`, `setMode`, `colors`
- `ThemeProvider` component: detects system color scheme, resolves user override from store, provides full color palette
- `useTheme()` hook -> `{ isDark, mode, setMode }`
- `useThemeColors()` hook -> returns semantic color palette object for current mode (background, surface, text, textSecondary, textMuted, border, primary, etc.)
- Derives `@react-navigation/native` theme from our tokens and wraps children in their ThemeProvider for native integration

---

## Step 7: Zustand Stores — `lib/store.ts` (new)

**Custom storage adapter** using `expo-secure-store` for zustand persist.

**useOnboardingStore:**
- State: currentStep, diabetesType, insulinTherapy, takesPills, meter, glucoseUnit, carbUnit, carbRatio, rangeVeryHigh, rangeTargetHigh, rangeTargetLow, disclaimerAccepted, completed
- Actions: setField, nextStep, prevStep, completeOnboarding, reset

**useUserPreferencesStore** (persisted):
- State: themeMode, glucoseUnit, carbUnit, carbRatio, rangeVeryHigh, rangeTargetHigh, rangeTargetLow, disclaimerAccepted, disclaimerAcceptedAt, onboardingCompleted
- Actions: setThemeMode, setGlucoseUnit, setCarbUnit, setCarbRatio, setRanges, acceptDisclaimer, completeOnboarding

---

## Step 7b: Supabase Client — `lib/supabase.ts` (new)

Initialize the Supabase client for auth and database access.

- Import `react-native-url-polyfill/auto` (must be first import)
- Create Supabase client with `createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })`
- Environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY` loaded from `expo-constants` (set in `app.json` extra field or `.env`)
- Export the `supabase` client instance

---

## Step 7c: Supabase Auth — `lib/auth.ts` (new)

Authentication helpers wrapping Supabase Auth:

- `signUp(email, password)` — creates account via `supabase.auth.signUp()`
- `signIn(email, password)` — email/password login via `supabase.auth.signInWithPassword()`
- `signOut()` — via `supabase.auth.signOut()`
- `getSession()` — returns current session
- `onAuthStateChange(callback)` — subscribes to auth state changes

---

## Step 7d: Auth Context — `lib/auth-context.tsx` (new)

React context provider for auth state throughout the app:

- `AuthProvider` component: wraps app, listens to `onAuthStateChange`, provides `{ session, user, isLoading, isAuthenticated }`
- `useAuth()` hook -> `{ session, user, isLoading, isAuthenticated, signIn, signUp, signOut }`
- Root layout wraps app in `AuthProvider`
- Conditional routing: unauthenticated -> auth screens, authenticated + !onboarded -> onboarding, authenticated + onboarded -> tabs

---

## Step 7e: Auth Screens — `app/(auth)/` (new)

Simple auth screen stubs:

- `app/(auth)/_layout.tsx` — Stack navigator, headerShown: false
- `app/(auth)/sign-in.tsx` — Email + password Fields, "Sign In" Button, link to sign-up
- `app/(auth)/sign-up.tsx` — Email + password + confirm password Fields, "Create Account" Button, link to sign-in

Both screens use the themed UI components (Field, Button, Card) and the Mascot.

---

## Step 7f: Supabase PostgreSQL Schema — `supabase/migrations/` (new)

SQL migration file defining all tables from PRD Section 8:

### `supabase/migrations/001_initial_schema.sql`

```sql
-- Users profile (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  diabetes_type TEXT CHECK (diabetes_type IN ('type1','type2','lada','mody','gestational','other')),
  insulin_therapy TEXT CHECK (insulin_therapy IN ('pen_syringes','pump','no_insulin')),
  takes_pills BOOLEAN DEFAULT false,
  meter TEXT,
  glucose_unit TEXT CHECK (glucose_unit IN ('mgdl','mmol')) DEFAULT 'mmol',
  carb_unit TEXT CHECK (carb_unit IN ('grams','exchanges')) DEFAULT 'grams',
  carb_ratio DECIMAL DEFAULT 10,
  range_very_high DECIMAL DEFAULT 13.9,
  range_target_high DECIMAL DEFAULT 10.0,
  range_target_low DECIMAL DEFAULT 3.9,
  range_very_low DECIMAL DEFAULT 3.0,
  disclaimer_accepted BOOLEAN DEFAULT false,
  disclaimer_accepted_at TIMESTAMPTZ,
  theme TEXT CHECK (theme IN ('light','dark','system')) DEFAULT 'system',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Glucose logs
CREATE TABLE public.glucose_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  value DECIMAL NOT NULL,
  unit TEXT CHECK (unit IN ('mgdl','mmol')) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meal logs
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast','lunch','dinner','snack')) NOT NULL,
  total_carbs DECIMAL NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meal items
CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_log_id UUID REFERENCES public.meal_logs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  carbs DECIMAL NOT NULL,
  calories INTEGER,
  confidence DECIMAL,
  source TEXT CHECK (source IN ('manual','camera_scan')) DEFAULT 'manual'
);

-- Insulin logs
CREATE TABLE public.insulin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dose DECIMAL NOT NULL,
  dose_type TEXT CHECK (dose_type IN ('food','correction','long_acting')) NOT NULL,
  calculated_from_carbs DECIMAL,
  calculated_from_ratio DECIMAL,
  logged_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insulin_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can CRUD own glucose logs" ON public.glucose_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own meal logs" ON public.meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own meal items" ON public.meal_items FOR ALL USING (
  auth.uid() = (SELECT user_id FROM public.meal_logs WHERE id = meal_log_id)
);
CREATE POLICY "Users can CRUD own insulin logs" ON public.insulin_logs FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_glucose_logs_user_logged ON public.glucose_logs(user_id, logged_at DESC);
CREATE INDEX idx_meal_logs_user_logged ON public.meal_logs(user_id, logged_at DESC);
CREATE INDEX idx_insulin_logs_user_logged ON public.insulin_logs(user_id, logged_at DESC);
CREATE INDEX idx_meal_items_meal_log ON public.meal_items(meal_log_id);
```

---

## Step 8: UI Components — `components/ui/` (new files)

All components use `StyleSheet.create` with tokens + `useThemeColors()` for dark/light.

### 8a. `SectionLabel.tsx`
- Props: `label: string`, `style?`
- Uppercase, 11px Outfit bold, primary color, 0.08em letter-spacing

### 8b. `ProgressDots.tsx`
- Props: `total: number`, `current: number`
- Active dot: 20w x 8h, primary color, borderRadius full
- Inactive: 8x8 circle, border color
- Animated scale on active dot via reanimated

### 8c. `Checkbox.tsx`
- Props: `checked: boolean`, `onToggle: () => void`, `label: string | ReactNode`
- 22x22 box, checked = primary bg + white SVG checkmark, unchecked = border only
- Pressable wrapper

### 8d. `Card.tsx`
- Props: `children`, `padding?`, `style?`
- surface bg, borderRadius lg(18), card shadow (light) or 1px dkBorder (dark)

### 8e. `Chips.tsx`
- Props: `options: ChipOption[]`, `selected: string`, `onSelect: (value) => void`
- Horizontal ScrollView of pills, borderRadius full
- Selected: primary bg + dark text; unselected: surface bg + border + regular text

### 8f. `TogglePill.tsx`
- Props: `options: string[]`, `selected: number`, `onSelect: (index) => void`
- Container with bg tint, selected segment = animated primary pill
- Animated sliding indicator via reanimated `withTiming` for translateX

### 8g. `RadioCard.tsx`
- Props: `label`, `sublabel?`, `selected`, `onPress`
- 22px radio circle: unselected = border ring, selected = primary fill + 11px inner dot
- Selected card: 2px primary border + primaryMuted bg; unselected: 1.5px border

### 8h. `Field.tsx`
- Props: `label?`, `value`, `onChangeText`, `placeholder?`, `unit?`, `icon?`, `keyboardType?`
- Height 50, border 1.5px, borderRadius md(14)
- Icon left slot, unit label right-aligned muted
- Focus state: border -> primary color

### 8i. `Button.tsx`
- Props: `children`, `variant`, `size`, `fullWidth?`, `disabled?`, `icon?`, `iconRight?`, `onPress`
- 7 variants: primary, secondary, surface, outline, ghost, accent, dkSurface
- 4 sizes: sm(36h), md(44h), lg(52h), xl(56h)
- Press animation: scale(0.97) via reanimated useSharedValue + withTiming
- Disabled: opacity 0.45, bg = border color
- Outfit 700 bold font

---

## Step 9: Mascot Component — `components/Mascot.tsx` (new)

- Props: `size` (default 64), `expression` ('happy' | 'wink' | 'neutral'), `glow` (boolean)
- Built with `react-native-svg`: `Svg`, `Circle`, `Ellipse`, `Rect`, `Path`, `Line`
- SVG viewbox 0 0 100 100, scales via size prop
- Body: outer circle cx=50 cy=50 r=46 white, stroke #D8DCE4; inner ring r=38; sensor nub rect
- Face: eyes (ellipses + shine circles), eyebrows (paths), mouth (happy=smile path, neutral=line), blush cheeks
- Wink: right eye replaced with curved path
- Glow: View wrapper with primaryMuted bg, blur effect, positioned behind SVG

---

## Step 10: AppIcon Component — `components/AppIcon.tsx` (new)

- Props: `size` (default 34)
- Outer rounded square (borderRadius: size*0.22), primary bg, shadow
- Inner SVG (60% size): simplified mascot face (body circle, inner ring, sensor nub, eyes, shine, smile)
- Always happy expression

---

## Step 11: DisclaimerBanner — `components/DisclaimerBanner.tsx` (new)

- Props: `variant` ('warning' | 'danger'), `text: string`, `icon?`
- Warning: warningMuted bg + warning left border
- Danger: highMuted bg + high left border
- Uses Ionicons warning/shield icon from @expo/vector-icons

---

## Step 11b: Chart Stub Components — `components/charts/` (new)

### `components/charts/GlucoseChart.tsx`
- Props: `data: GlucoseDataPoint[]`, `height?: number` (default 155), `compact?: boolean`
- Stub structure: SVG container with target range band (green rect 3.9-10.0), dashed threshold lines, Y-axis labels (0, 3.9, 10, 16), X-axis time labels
- Placeholder bezier curve with sample data points
- Header area: current glucose value (large, colored) + Time-in-Range donut placeholder
- Legend: Low (blue), Normal (green), Warning (yellow), High (red)
- No real data integration yet — uses hardcoded sample data to demonstrate the visual

### `components/charts/CarbTracker.tsx`
- Props: `days: CarbDay[]`, `target: number`, `compact?: boolean`
- Stub structure: 7-day stacked bar chart (Mon-Sun)
- Meal colors: Breakfast (primary), Lunch (secondary), Dinner (warning), Snack (#A78BFA purple)
- Dashed target line, progress bar header showing today's carbs vs target
- Selected day highlight with meal breakdown
- Uses hardcoded sample data

---

## Step 11c: Onboarding Screen Stubs — `app/(onboarding)/` (new)

Create the onboarding route group with all 11 screen files:

### `app/(onboarding)/_layout.tsx`
- Stack navigator with headerShown: false
- Shared onboarding wrapper with StatusBar config

### Screen files (each with basic layout structure ready for Phase 2 content):
- `app/(onboarding)/welcome.tsx` — primaryMuted bg, Mascot, heading, subtext, Continue button
- `app/(onboarding)/privacy.tsx` — heading, Card with checkbox stubs, Continue button
- `app/(onboarding)/tailor.tsx` — primaryMuted bg, Mascot (wink), heading, Start button
- `app/(onboarding)/diabetes-type.tsx` — ProgressDots (1/9), heading, RadioCard options, Next button
- `app/(onboarding)/insulin-therapy.tsx` — ProgressDots (2/9), heading, RadioCard options, Next button
- `app/(onboarding)/pills.tsx` — ProgressDots (3/9), Mascot (neutral), heading, RadioCard, Next button
- `app/(onboarding)/meter.tsx` — ProgressDots (4/9), heading, RadioCard options, Confirm button
- `app/(onboarding)/units.tsx` — ProgressDots (5/9), heading, TogglePill rows, Next button
- `app/(onboarding)/ranges.tsx` — ProgressDots (6/9), heading, range display Card, Next button
- `app/(onboarding)/disclaimer.tsx` — ProgressDots (7/9), alert icon, heading, disclaimer Card, Checkbox, I Understand button
- `app/(onboarding)/carb-ratio.tsx` — ProgressDots (8/9), heading, disclaimer banner, Chips + Field, Next button

Each screen uses the shared UI components (Button, Card, RadioCard, ProgressDots, Checkbox, Chips, Field, Mascot, DisclaimerBanner) making them functional stubs that demonstrate the component library.

---

## Step 12: Update Root Layout — `app/_layout.tsx` (modify)

1. Import and load fonts: `Nunito_700Bold`, `Nunito_800ExtraBold` from @expo-google-fonts/nunito; `Outfit_400Regular`, `Outfit_500Medium`, `Outfit_600SemiBold` from @expo-google-fonts/outfit
2. Hold splash screen via `SplashScreen.preventAutoHideAsync()` until fonts loaded
3. Wrap in `AuthProvider` -> `ThemeProvider`
4. Stack with (auth), (onboarding), and (tabs) groups
5. Conditional routing: not authenticated -> (auth), authenticated + !onboarded -> (onboarding), authenticated + onboarded -> (tabs)
6. StatusBar style auto

---

## Step 13: Update Tab Layout — `app/(tabs)/_layout.tsx` (modify)

Replace 2 tabs with 4 tabs per PRD:
- `index` -> "My Trend" (Ionicons `trending-up`)
- `reports` -> "Reports" (Ionicons `document-text-outline`)
- `connections` -> "Connect" (Ionicons `people-outline`)
- `more` -> "More" (Ionicons `ellipsis-horizontal-circle-outline`)

Use `useThemeColors()` for tabBarActiveTintColor (primary), tabBarStyle colors.

---

## Step 14: Create Tab Placeholder Screens (new files)

- `app/(tabs)/reports.tsx` — minimal "Reports" placeholder
- `app/(tabs)/connections.tsx` — minimal "Connect" placeholder
- `app/(tabs)/more.tsx` — minimal "More" placeholder

---

## Step 15: Update Home Screen — `app/(tabs)/index.tsx` (modify)

Replace template content with minimal "My Trend" dashboard placeholder using themed components.

---

## Step 16: Clean Up Template Code

- Delete `app/(tabs)/explore.tsx`
- Delete unused components: `hello-wave.tsx`, `parallax-scroll-view.tsx`, `external-link.tsx`, `components/ui/collapsible.tsx`
- Update `themed-text.tsx` to use Nunito/Outfit fonts from tokens
- Update `themed-view.tsx` to use `useThemeColors()`
- Keep: `haptic-tab.tsx`, `icon-symbol.tsx`, `icon-symbol.ios.tsx`
- Replace `constants/theme.ts` with updated version exporting `Colors` derived from tokens (backward compat for any remaining references)

---

## Step 17: Save Memory

Write key architectural decisions and file paths to auto memory for future sessions.

---

## Files Summary

### New files (39):
- `constants/tokens.ts`
- `constants/disclaimers.ts`
- `lib/types.ts`
- `lib/colors.ts`
- `lib/theme.ts`
- `lib/store.ts`
- `lib/supabase.ts`
- `lib/auth.ts`
- `lib/auth-context.tsx`
- `supabase/migrations/001_initial_schema.sql`
- `app/(auth)/_layout.tsx`
- `app/(auth)/sign-in.tsx`
- `app/(auth)/sign-up.tsx`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Field.tsx`
- `components/ui/RadioCard.tsx`
- `components/ui/Chips.tsx`
- `components/ui/TogglePill.tsx`
- `components/ui/ProgressDots.tsx`
- `components/ui/SectionLabel.tsx`
- `components/ui/Checkbox.tsx`
- `components/Mascot.tsx`
- `components/AppIcon.tsx`
- `components/DisclaimerBanner.tsx`
- `components/charts/GlucoseChart.tsx`
- `components/charts/CarbTracker.tsx`
- `app/(tabs)/reports.tsx`
- `app/(tabs)/connections.tsx`
- `app/(tabs)/more.tsx`
- `app/(onboarding)/_layout.tsx`
- `app/(onboarding)/welcome.tsx`
- `app/(onboarding)/privacy.tsx`
- `app/(onboarding)/tailor.tsx`
- `app/(onboarding)/diabetes-type.tsx`
- `app/(onboarding)/insulin-therapy.tsx`
- `app/(onboarding)/pills.tsx`
- `app/(onboarding)/meter.tsx`
- `app/(onboarding)/units.tsx`
- `app/(onboarding)/ranges.tsx`
- `app/(onboarding)/disclaimer.tsx`
- `app/(onboarding)/carb-ratio.tsx`

### Modified files (5):
- `app/_layout.tsx` (font loading, ThemeProvider)
- `app/(tabs)/_layout.tsx` (4 tabs)
- `app/(tabs)/index.tsx` (placeholder content)
- `components/themed-text.tsx` (use new fonts)
- `constants/theme.ts` (derive from tokens)

### Deleted files (5):
- `app/(tabs)/explore.tsx`
- `components/hello-wave.tsx`
- `components/parallax-scroll-view.tsx`
- `components/external-link.tsx`
- `components/ui/collapsible.tsx`

---

## Verification

1. Run `npx expo start --ios` and confirm the app loads without errors
2. Verify all 4 tabs render with correct icons and labels
3. Verify light/dark mode toggle works (via system settings)
4. Verify Nunito + Outfit fonts render correctly in themed text
5. Spot-check individual components by temporarily rendering them on the home screen

---

## Future Phases (not in this implementation)

### Phase 2: Onboarding Logic
- Wire up onboarding screens with real navigation flow + zustand store persistence
- Save user profile to Supabase on completion

### Phase 3: Core Features
- Dashboard with real data from local stores
- New Entry form with local persistence + Supabase sync
- Glucose Chart + Carb Tracker with real data

### Phase 4: AI Camera — Passio.ai SDK
- Integrate **Passio Nutrition-AI SDK** (`@passiolife/nutritionai-react-native-sdk-v3`) for camera-based food recognition
- Camera scan screen (`app/scan.tsx`) using Passio's `PassioSDK.startFoodDetection()` for real-time food identification
- Map Passio food results to our `MealItem` interface (name, carbs, calories, confidence)
- Display detected foods with carb estimates, allow user to edit/remove before logging
- Auto-calculate total carbs from scan results
- "Log Meal" creates meal_log + meal_items with source=camera_scan
- Requires Passio API key (configured via environment variable)
- Note: Passio SDK requires a dev kit subscription from passio.ai

### Phase 5: Insulin Calculator
- Formula: carbs / ratio = dose
- Log dose functionality with Supabase sync

### Phase 6: Polish & Monetization
- RevenueCat (`react-native-purchases`) for PRO subscriptions
- PDF report generation
- Connections screen (Apple Health, devices)
- Push notifications via expo-notifications
- Supabase cloud sync as optional feature for signed-in users
