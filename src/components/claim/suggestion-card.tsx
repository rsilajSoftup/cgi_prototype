"use client";

import { useState } from "react";

import { usePreferences } from "@/components/providers/preferences-provider";
import { useAssistant } from "@/components/providers/assistant-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AssistantSuggestion } from "@/lib/ai/types";
import { t } from "@/lib/i18n/ui";

export function SuggestionCard({ suggestion }: { suggestion: AssistantSuggestion }) {
  const { preferences } = usePreferences();
  const { acceptSuggestion, rejectSuggestion } = useAssistant();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(suggestion.text);

  if (suggestion.status === "rejected") return null;

  if (suggestion.status === "accepted" || suggestion.status === "edited") {
    return (
      <p className="text-muted-foreground text-sm">
        {copy("approvedNotes")}: {suggestion.text}
      </p>
    );
  }

  return (
    <div className="border-border bg-background space-y-3 rounded-lg border p-3">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {copy("generatedByAi")}
      </p>
      {editing ? (
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="text-base"
        />
      ) : (
        <p className="text-sm leading-relaxed">{suggestion.text}</p>
      )}
      <div className="flex flex-col gap-2">
        {editing ? (
          <Button
            type="button"
            size="xl"
            onClick={() => {
              acceptSuggestion(suggestion.id, draft);
              setEditing(false);
            }}
          >
            {copy("saveEdit")}
          </Button>
        ) : (
          <Button type="button" size="xl" onClick={() => acceptSuggestion(suggestion.id)}>
            {copy("acceptSuggestion")}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="xl"
          onClick={() => {
            setEditing(true);
            setDraft(suggestion.text);
          }}
        >
          {copy("editSuggestion")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xl"
          onClick={() => rejectSuggestion(suggestion.id)}
        >
          {copy("rejectSuggestion")}
        </Button>
      </div>
    </div>
  );
}
