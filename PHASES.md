# CarbTrack Development Phases

## Phase 1: Foundation (COMPLETE)

Design system, component library, and app scaffolding.

- Design tokens (`constants/tokens.ts`): colors, typography, spacing, border radius, shadows, glucose thresholds
- TypeScript interfaces and data models (`lib/types.ts`)
- Disclaimer constants (`constants/disclaimers.ts`)
- Color helpers for glucose range mapping (`lib/colors.ts`)
- Theme system with light/dark mode (`lib/theme.ts`): ThemeContext, useTheme(), useThemeColors()
- Zustand stores (`lib/store.ts`): useOnboardingStore, useUserPreferencesStore (persisted via expo-secure-store)
- 9 reusable UI components (`components/ui/`): Button, Card, Field, RadioCard, Chips, TogglePill, ProgressDots, SectionLabel, Checkbox
- Mascot SVG component with 3 expressions: happy, wink, neutral (`components/Mascot.tsx`)
- AppIcon component (`components/AppIcon.tsx`)
- DisclaimerBanner component (`components/DisclaimerBanner.tsx`)
- Chart stubs with sample data (`components/charts/`): GlucoseChart, CarbTracker
- 11 onboarding screen stubs + layout (`app/(onboarding)/`)
- 4-tab navigation: My Trend, Reports, Connect, More (`app/(tabs)/`)
- Font loading: Nunito (headings) + Outfit (body)
- Template cleanup: removed unused Expo boilerplate

---

## Phase 2: Onboarding Logic

Wire up the onboarding screens into a functional, connected flow.

- Connect all 11 onboarding screens with sequential navigation (next/back)
- Persist user selections to `useOnboardingStore` during the flow
- On completion, commit choices to `useUserPreferencesStore` (persisted to secure storage)
- Conditional routing in root layout: skip onboarding if `onboardingCompleted === true`
- Input validation on each step (disable Next until required fields are filled)
- Back button handling and progress tracking via ProgressDots
- Animate transitions between screens

---

## Phase 3: Core Features

Build the main app screens with local data persistence.

- **Dashboard** (`app/(tabs)/index.tsx`): real glucose chart and carb tracker using data from local stores
- **New Entry form**: screen for manually logging glucose readings, meals, and insulin doses
- **Meal logging**: add meal items with name, carbs, calories; calculate totals
- **Glucose logging**: log readings with timestamp, unit, and optional tags
- **Local data stores**: Zustand stores for glucose_logs, meal_logs, insulin_logs with persistence
- **Glucose Chart** with real data: bezier curve, color-coded points, target range band
- **Carb Tracker** with real data: weekly stacked bar chart, meal breakdown, progress vs target
- **Reports tab**: weekly/monthly summaries, averages, time-in-range stats

---

## Phase 4: AI Camera — Passio.ai SDK

Camera-based food recognition for quick carb logging.

- Install and configure `@passiolife/nutritionai-react-native-sdk-v3`
- Camera scan screen (`app/scan.tsx`) using `PassioSDK.startFoodDetection()` for real-time food identification
- Map Passio food results to our `MealItem` interface (name, carbs, calories, confidence)
- Display detected foods with carb estimates, allow user to edit/remove before logging
- Auto-calculate total carbs from scan results
- "Log Meal" creates meal_log + meal_items with `source: 'camera_scan'`
- Scan disclaimer banner per PRD requirements
- Requires Passio API key (configured via environment variable)
- Note: Passio SDK requires a dev kit subscription from passio.ai

---

## Phase 5: Insulin Calculator (COMPLETE)

Insulin dose calculation with ruler-style carb input.

- New "Calculator" tab added to bottom navigation (between Reports and Connect)
- RulerPicker component (`components/ui/RulerPicker.tsx`): horizontal scroll ruler for carb input (0–300g)
- Calculator screen (`app/(tabs)/calculator.tsx`):
  - Ruler-style carb input with snap-to-tick scrolling
  - Optional current glucose input for correction doses
  - Real-time dose calculation: `dose = carbs / carbRatio`
  - Correction dose support: based on current glucose vs target range
  - Result card with dose breakdown (food dose + correction dose)
  - "Log Dose" button saves to insulin log store
  - Disclaimer banner and footer per PRD requirements
- Recent calculations shown on calculator screen from insulin log history

---

## Phase 6: RevenueCat Subscriptions

Integrate RevenueCat SDK for in-app subscriptions and entitlement gating.

- Install `react-native-purchases` and `react-native-purchases-ui`
- RevenueCat constants (`constants/revenuecat.ts`): API keys, entitlement ID
- Subscription Zustand store (`lib/subscription-store.ts`): SDK init, entitlement checking, restore purchases, customer info listener
- `useProAccess` hook (`lib/hooks/useProAccess.ts`) for entitlement gating
- Paywall modal screen (`app/paywall.tsx`) using `RevenueCatUI.presentPaywallIfNeeded()`
- Customer Center modal screen (`app/customer-center.tsx`) using `RevenueCatUI.presentCustomerCenter()`
- Subscription management UI in More tab: status, upgrade, manage, restore
- `ProGate` component (`components/ProGate.tsx`) for feature gating
- Products: Monthly, Yearly, Lifetime
- Entitlement: `Preflightai .io Pro`

---

## Phase 7: Polish & Finalization

Final polish, cloud sync, and remaining features.

- **Supabase integration**: auth (sign-in/sign-up), PostgreSQL database, cloud sync
  - User profiles synced to Supabase on signup
  - Optional cloud sync for glucose/meal/insulin logs
  - Auth screens (`app/(auth)/`): sign-in, sign-up
  - AuthProvider context with conditional routing
  - RLS policies for data security
- **PDF report generation**: exportable glucose/carb reports
- **Connections screen**: Apple Health integration, device connections
- **Push notifications** via `expo-notifications`: medication reminders, logging reminders
- **Settings screen**: theme toggle, unit preferences, account management, data export
- **App Store preparation**: icons, screenshots, metadata
