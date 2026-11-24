import type { Locale } from "@/lib/i18n/config";

export type TextSize = "md" | "lg" | "xl";
export type ContrastPreference = "default" | "high";

export type AppPreferences = {
  locale: Locale;
  textSize: TextSize;
  contrast: ContrastPreference;
  simplifiedLayout: boolean;
  aiEnabled: boolean;
};
