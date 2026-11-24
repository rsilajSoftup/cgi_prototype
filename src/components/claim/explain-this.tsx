"use client";

import { usePreferences } from "@/components/providers/preferences-provider";
import { useAssistant } from "@/components/providers/assistant-provider";
import { t } from "@/lib/i18n/ui";

export function ExplainThis({ fieldId }: { fieldId: string }) {
  const { preferences } = usePreferences();
  const { send, setOpen } = useAssistant();

  if (!preferences.aiEnabled) return null;

  return (
    <button
      type="button"
      className="text-primary focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-1 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      onClick={() => {
        setOpen(true);
        void send("explain", { fieldId });
      }}
    >
      {t(preferences.locale, "explainThis")}
    </button>
  );
}
