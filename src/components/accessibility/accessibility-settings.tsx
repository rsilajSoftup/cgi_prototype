"use client";

import { Settings2 } from "lucide-react";
import { useId, useState } from "react";

import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/ui";
import type { ContrastPreference, TextSize } from "@/lib/preferences/types";

export function AccessibilitySettings() {
  const { preferences, updatePreferences } = usePreferences();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="xl"
        aria-expanded={open}
        aria-controls="accessibility-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <Settings2 data-icon="inline-start" />
        {copy("accessibility")}
      </Button>
      {open ? (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-labelledby={titleId}
          className="border-border bg-card fixed top-20 right-4 left-4 z-60 mt-0 max-h-[min(80vh,36rem)] w-auto space-y-4 overflow-y-auto rounded-xl border p-4 shadow-lg sm:left-auto sm:w-[24rem]"
        >
          <h2 id={titleId} className="text-lg font-semibold">
            {copy("accessibilityTitle")}
          </h2>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{copy("language")}</legend>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LOCALES.map((locale) => (
                <Button
                  key={locale}
                  type="button"
                  size="xl"
                  variant={preferences.locale === locale ? "default" : "outline"}
                  aria-pressed={preferences.locale === locale}
                  onClick={() => updatePreferences({ locale })}
                >
                  {LOCALE_LABELS[locale]}
                </Button>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{copy("textSize")}</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["md", "sizeMd"],
                  ["lg", "sizeLg"],
                  ["xl", "sizeXl"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="xl"
                  variant={preferences.textSize === value ? "default" : "outline"}
                  aria-pressed={preferences.textSize === value}
                  onClick={() => updatePreferences({ textSize: value as TextSize })}
                >
                  {copy(label)}
                </Button>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{copy("contrast")}</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["default", "contrastDefault"],
                  ["high", "contrastHigh"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="xl"
                  variant={preferences.contrast === value ? "default" : "outline"}
                  aria-pressed={preferences.contrast === value}
                  onClick={() =>
                    updatePreferences({ contrast: value as ContrastPreference })
                  }
                >
                  {copy(label)}
                </Button>
              ))}
            </div>
          </fieldset>
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-5 accent-primary"
              checked={preferences.simplifiedLayout}
              onChange={(event) =>
                updatePreferences({ simplifiedLayout: event.target.checked })
              }
            />
            <span>
              {copy("simplified")}
              <span className="text-muted-foreground mt-1 block">
                {copy("simplifiedHelp")}
              </span>
            </span>
          </label>
          <Button type="button" variant="outline" size="xl" onClick={() => setOpen(false)}>
            {copy("cancel")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
