"use client";

import { MessageCircleQuestion } from "lucide-react";

import { AssistantPanel } from "@/components/claim/assistant-panel";
import { useAssistant } from "@/components/providers/assistant-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/ui";

export function AssistantDock() {
  const { open, setOpen } = useAssistant();
  const { preferences } = usePreferences();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);

  return (
    <>
      {!open ? (
        <div className="fixed right-3 bottom-3 z-30 lg:hidden">
          <Button type="button" size="xl" onClick={() => setOpen(true)}>
            <MessageCircleQuestion data-icon="inline-start" />
            {copy("openAssistant")}
          </Button>
        </div>
      ) : null}
      <AssistantPanel variant="overlay" />
    </>
  );
}

export function AssistantHeaderButton() {
  const { open, setOpen } = useAssistant();
  const { preferences } = usePreferences();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);

  return (
    <Button
      type="button"
      variant={open ? "secondary" : "outline"}
      size="xl"
      aria-expanded={open}
      aria-controls="assistant-heading"
      onClick={() => setOpen(!open)}
    >
      <MessageCircleQuestion data-icon="inline-start" />
      {open ? copy("closeAssistant") : copy("openAssistant")}
    </Button>
  );
}
