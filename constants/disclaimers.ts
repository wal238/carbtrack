// CarbTrack Disclaimer Text — PRD Section 11

export const DISCLAIMERS = {
  onboarding: {
    heading: 'Important Disclaimer',
    body: 'CarbTrack is a mathematical calculator tool only. It is NOT a medical device and does not provide medical advice.',
    bullets: [
      'Insulin dose calculations are based solely on the carb ratio YOU provide',
      'Always verify calculations with your healthcare provider',
      'Food carb estimates from camera scanning are approximations only',
      'Never adjust your insulin regimen without consulting your doctor',
      'This app is not a substitute for professional medical advice',
    ],
    checkbox:
      'I understand that CarbTrack is a calculator tool and does not provide medical advice.',
  },

  calculatorBanner:
    'Not medical advice. This is a mathematical calculator only. Always consult your healthcare provider.',

  calculatorFooter:
    'This calculation is based on the carb ratio you provided. CarbTrack is a calculator tool \u2014 it does not account for correction doses, insulin on board, activity level, or other factors. Always follow your healthcare provider\u2019s guidance.',

  scanDisclaimer:
    'Estimates are approximate. Verify with nutrition labels when available. Not medical advice.',

  carbRatioBanner:
    'This is used for calculation purposes only \u2014 not medical advice. Consult your healthcare provider.',
} as const;
