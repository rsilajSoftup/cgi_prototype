import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import type { AppPreferences } from "@/lib/preferences/types";

export const DEFAULT_PREFERENCES: AppPreferences = {
  locale: DEFAULT_LOCALE,
  textSize: "md",
  contrast: "default",
  simplifiedLayout: false,
  aiEnabled: true,
};

export const PREFERENCES_STORAGE_KEY = "health-claim-preferences-v1";
