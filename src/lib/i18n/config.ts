export const SUPPORTED_LOCALES = ["en", "fi", "sv"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fi: "Suomi",
  sv: "Svenska",
};

/**
 * Language switching is not implemented yet.
 * Keep UI strings in `copy` modules so Finnish and Swedish
 * catalogues can be added without rewriting pages.
 */
export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}
