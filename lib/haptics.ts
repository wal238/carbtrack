import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const haptic = {
  /** Primary action buttons (Log Dose, Save Entry) */
  heavy: () => {
    if (isIOS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }
  },

  /** Tab switches, toggle changes, chip/radio selection */
  medium: () => {
    if (isIOS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  },

  /** Minor interactions, header buttons, close */
  light: () => {
    if (isIOS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  },

  /** RulerPicker tick snaps during scroll */
  selection: () => {
    if (isIOS) {
      Haptics.selectionAsync().catch(() => {});
    }
  },

  /** Successful log entries */
  success: () => {
    if (isIOS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  },

  /** Correction dose warnings */
  warning: () => {
    if (isIOS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
  },

  /** Validation failures */
  error: () => {
    if (isIOS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  },
};
