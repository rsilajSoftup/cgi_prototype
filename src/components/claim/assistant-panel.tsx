"use client";

import { MessageCircleQuestion, Minimize2, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { SuggestionCard } from "@/components/claim/suggestion-card";
import { VoiceTranscript } from "@/components/claim/voice-transcript";
import { useAssistant } from "@/components/providers/assistant-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/ui";
import { speak, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

type AssistantPanelProps = {
  variant?: "sidebar" | "overlay";
  className?: string;
};

export function AssistantPanel({ variant = "sidebar", className }: AssistantPanelProps) {
  const titleId = useId();
  const liveId = useId();
  const { preferences, updatePreferences } = usePreferences();
  const {
    open,
    setOpen,
    messages,
    suggestions,
    loading,
    send,
    skipFollowUp,
    activeFollowUp,
  } = useAssistant();
  const copy = (key: Parameters<typeof t>[1]) => t(preferences.locale, key);
  const [draft, setDraft] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const simplified = preferences.simplifiedLayout;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open && variant === "overlay") {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, setOpen, variant]);

  if (!open && variant === "overlay") return null;

  if (!open && variant === "sidebar") {
    return (
      <aside
        aria-labelledby={titleId}
        className={cn(
          "border-border bg-accent text-accent-foreground hidden h-fit space-y-3 rounded-2xl border p-6 lg:block",
          className,
        )}
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {copy("aiAssistant")}
        </h2>
        <p className="text-sm leading-relaxed">{copy("aiOptional")}</p>
        <Button type="button" size="xl" onClick={() => setOpen(true)}>
          {copy("openAssistant")}
        </Button>
      </aside>
    );
  }

  if (!preferences.aiEnabled) {
    return (
      <aside
        aria-labelledby={titleId}
        className={cn(
          "border-border bg-accent text-accent-foreground h-fit space-y-4 rounded-2xl border p-6",
          variant === "overlay" &&
            "fixed inset-x-3 bottom-3 z-30 max-h-[45vh] overflow-y-auto shadow-lg lg:hidden",
          className,
        )}
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {copy("aiOffTitle")}
        </h2>
        <p className="text-sm leading-relaxed">{copy("aiOffBody")}</p>
        <Button type="button" size="xl" onClick={() => updatePreferences({ aiEnabled: true })}>
          {copy("turnOnAi")}
        </Button>
        {variant === "overlay" ? (
          <Button type="button" variant="outline" size="xl" onClick={() => setOpen(false)}>
            {copy("closeAssistant")}
          </Button>
        ) : null}
      </aside>
    );
  }

  const pending = suggestions.filter((item) => item.status === "pending");
  const chips = [
    { intent: "explain" as const, label: copy("suggestedExplain") },
    { intent: "describe-help" as const, label: copy("suggestedDescribe") },
    { intent: "missing" as const, label: copy("suggestedMissing") },
    { intent: "documents" as const, label: copy("suggestedDocuments") },
  ].slice(0, simplified ? 2 : 4);

  return (
    <aside
      aria-labelledby={titleId}
      className={cn(
        "border-border bg-accent text-accent-foreground flex h-fit flex-col rounded-2xl border",
        variant === "sidebar" && "lg:sticky lg:top-24",
        variant === "overlay" &&
          "fixed inset-x-3 bottom-3 z-30 max-h-[45vh] shadow-lg lg:hidden",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/70 p-4">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="size-5 shrink-0" aria-hidden="true" />
          <h2 id={titleId} className="text-lg font-semibold">
            {copy("aiAssistant")}
          </h2>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={copy("minimiseAssistant")}
            onClick={() => setOpen(false)}
          >
            <Minimize2 />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={copy("closeAssistant")}
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto p-4" ref={listRef}>
        <p className="text-sm leading-relaxed">{copy("aiOptional")}</p>
        <div className="space-y-3" aria-live="polite" aria-relevant="additions" id={liveId}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-xl px-3 py-2 text-sm leading-relaxed",
                message.role === "assistant"
                  ? "bg-background text-foreground"
                  : "bg-primary text-primary-foreground ml-6",
              )}
            >
              {message.role === "assistant" ? (
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  {copy("generatedByAi")}
                </p>
              ) : null}
              <p>{message.text}</p>
              {message.role === "assistant" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 min-h-11"
                  onClick={() => {
                    if (speakingId === message.id) {
                      stopSpeaking();
                      setSpeakingId(null);
                    } else {
                      speak(message.text, preferences.locale);
                      setSpeakingId(message.id);
                    }
                  }}
                >
                  {speakingId === message.id ? (
                    <VolumeX data-icon="inline-start" />
                  ) : (
                    <Volume2 data-icon="inline-start" />
                  )}
                  {speakingId === message.id ? copy("stopListening") : copy("listen")}
                </Button>
              ) : null}
              {message.suggestionId
                ? suggestions
                    .filter((item) => item.id === message.suggestionId)
                    .map((item) => <SuggestionCard key={item.id} suggestion={item} />)
                : null}
            </div>
          ))}
          {loading ? (
            <p className="text-sm" role="status">
              …
            </p>
          ) : null}
        </div>

        {activeFollowUp && !simplified ? (
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="xl" onClick={() => skipFollowUp()}>
              {copy("skipQuestion")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xl"
              onClick={() => skipFollowUp(copy("notSure"))}
            >
              {copy("notSure")}
            </Button>
          </div>
        ) : null}

        {simplified && activeFollowUp ? (
          <Button type="button" variant="outline" size="xl" onClick={() => skipFollowUp()}>
            {copy("skipQuestion")}
          </Button>
        ) : null}

        {pending.length > 0 && !messages.some((item) => item.suggestionId) ? (
          <div className="space-y-2">
            {pending.map((item) => (
              <SuggestionCard key={item.id} suggestion={item} />
            ))}
          </div>
        ) : null}

        {!simplified ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Button
                key={chip.intent}
                type="button"
                variant="outline"
                size="xl"
                onClick={() => void send(chip.intent)}
              >
                {chip.label}
              </Button>
            ))}
          </div>
        ) : (
          <Button type="button" variant="outline" size="xl" onClick={() => void send("explain")}>
            {copy("suggestedExplain")}
          </Button>
        )}

        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            const text = draft.trim();
            if (!text) return;
            const intent = activeFollowUp ? "follow-up-answer" : "chat";
            void send(intent, { userMessage: text });
            setDraft("");
          }}
        >
          <label className="sr-only" htmlFor={`${titleId}-ask`}>
            {copy("askPlaceholder")}
          </label>
          <textarea
            id={`${titleId}-ask`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy("askPlaceholder")}
            rows={simplified ? 2 : 3}
            className="border-input bg-background min-h-16 w-full rounded-lg border px-3 py-2 text-base"
          />
          <Button type="submit" size="xl" disabled={loading}>
            {copy("send")}
          </Button>
        </form>

        <VoiceTranscript
          onAccept={(text) => {
            setDraft((current) => (current ? `${current} ${text}` : text));
          }}
        />

        <p className="text-muted-foreground text-xs leading-relaxed">{copy("disclaimer")}</p>
        <Button
          type="button"
          variant="ghost"
          size="xl"
          onClick={() => {
            stopSpeaking();
            updatePreferences({ aiEnabled: false });
            setOpen(false);
          }}
        >
          {copy("turnOffAi")}
        </Button>
      </div>
    </aside>
  );
}
