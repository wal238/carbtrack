import type { InsulinTherapy } from '@/lib/types';

export type OnboardingStep =
  | 'diabetes-type'
  | 'insulin-therapy'
  | 'pills'
  | 'meter'
  | 'units'
  | 'ranges'
  | 'disclaimer'
  | 'carb-ratio'
  | 'goals'
  | 'carb-target'
  | 'pricing';

const FULL_FLOW: OnboardingStep[] = [
  'diabetes-type',
  'insulin-therapy',
  'pills',
  'meter',
  'units',
  'ranges',
  'disclaimer',
  'carb-ratio',
  'goals',
  'carb-target',
  'pricing',
];

const NO_INSULIN_FLOW: OnboardingStep[] = [
  'diabetes-type',
  'insulin-therapy',
  'units',
  'ranges',
  'disclaimer',
  'goals',
  'carb-target',
  'pricing',
];

function getFlow(therapy: InsulinTherapy | null): OnboardingStep[] {
  return therapy === 'no_insulin' ? NO_INSULIN_FLOW : FULL_FLOW;
}

export function getOnboardingProgress(
  step: OnboardingStep,
  therapy: InsulinTherapy | null
): { total: number; current: number } {
  const activeFlow = getFlow(therapy);
  const stepIndex = activeFlow.indexOf(step);

  if (stepIndex >= 0) {
    return { total: activeFlow.length, current: stepIndex };
  }

  const fullIndex = FULL_FLOW.indexOf(step);
  return { total: FULL_FLOW.length, current: Math.max(0, fullIndex) };
}

export function nextAfterInsulin(therapy: InsulinTherapy): string {
  return therapy === 'no_insulin' ? '/(onboarding)/units' : '/(onboarding)/pills';
}

export function nextAfterDisclaimer(therapy: InsulinTherapy | null): string {
  return therapy === 'no_insulin' ? '/(onboarding)/goals' : '/(onboarding)/carb-ratio';
}
