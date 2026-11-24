"use client";

import { useFormContext } from "react-hook-form";

import { VoiceTranscript } from "@/components/claim/voice-transcript";
import { useAssistant } from "@/components/providers/assistant-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/ui";
import type { ClaimDraft } from "@/lib/validation/schemas";

export function IncidentAssist() {
  const { preferences } = usePreferences();
  const { send, setOpen } = useAssistant();
  const { getValues, setValue } = useFormContext<ClaimDraft>();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);

  if (!preferences.aiEnabled) {
    return (
      <VoiceTranscript
        onAccept={(text) => {
          const current = getValues("incidentDescription");
          setValue("incidentDescription", current ? `${current}\n${text}` : text, {
            shouldDirty: true,
          });
        }}
      />
    );
  }

  return (
    <div className="border-border space-y-3 rounded-xl border p-4">
      <Button
        type="button"
        variant="outline"
        size="xl"
        onClick={() => {
          setOpen(true);
          void send("describe-help");
        }}
      >
        {copy("helpDescribe")}
      </Button>
      <VoiceTranscript
        onAccept={(text) => {
          const current = getValues("incidentDescription");
          setValue("incidentDescription", current ? `${current}\n${text}` : text, {
            shouldDirty: true,
          });
        }}
      />
    </div>
  );
}
