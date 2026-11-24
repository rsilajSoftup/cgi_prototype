"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFormContext } from "react-hook-form";
import { usePathname } from "next/navigation";

import { generateAssistantResponse } from "@/lib/ai/engine";
import { toClaimSnapshot } from "@/lib/ai/sanitize";
import type {
  AssistantFollowUp,
  AssistantIntent,
  AssistantSuggestion,
} from "@/lib/ai/types";
import { usePreferences } from "@/components/providers/preferences-provider";
import { FORM_STAGE_IDS, type FormStageId } from "@/lib/claim/stages";
import { t } from "@/lib/i18n/ui";
import type { ClaimDraft } from "@/lib/validation/schemas";

export type ChatItem = {
  id: string;
  role: "user" | "assistant";
  text: string;
  generatedByAi: boolean;
  followUp?: AssistantFollowUp;
  suggestionId?: string;
};

type AssistantContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: ChatItem[];
  suggestions: AssistantSuggestion[];
  approvedNotes: string[];
  activeFollowUp?: AssistantFollowUp;
  loading: boolean;
  send: (intent: AssistantIntent, options?: { fieldId?: string; userMessage?: string }) => Promise<void>;
  skipFollowUp: (label?: string) => void;
  acceptSuggestion: (id: string, editedText?: string) => void;
  rejectSuggestion: (id: string) => void;
  resetAssistant: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

function currentStageFromPath(pathname: string): FormStageId | "track" | "" {
  const part = pathname.split("/").pop() ?? "";
  if (part === "track") return "track";
  if (FORM_STAGE_IDS.includes(part as FormStageId)) return part as FormStageId;
  return "";
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { preferences } = usePreferences();
  const form = useFormContext<ClaimDraft>();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [suggestions, setSuggestions] = useState<AssistantSuggestion[]>([]);
  const [approvedNotes, setApprovedNotes] = useState<string[]>([]);
  const [askedFollowUpIds, setAskedFollowUpIds] = useState<string[]>([]);
  const [activeFollowUp, setActiveFollowUp] = useState<AssistantFollowUp | undefined>();
  const [loading, setLoading] = useState(false);
  const welcomed = useRef(false);

  const send = useCallback(
    async (
      intent: AssistantIntent,
      options?: { fieldId?: string; userMessage?: string },
    ) => {
      if (!preferences.aiEnabled) return;
      setOpen(true);
      const userMessage = options?.userMessage?.trim();
      if (userMessage) {
        setMessages((current) => [
          ...current,
          {
            id: `u-${Date.now()}`,
            role: "user",
            text: userMessage,
            generatedByAi: false,
          },
        ]);
      }

      setLoading(true);
      const snapshot = toClaimSnapshot(
        form.getValues(),
        currentStageFromPath(pathname),
        askedFollowUpIds,
      );
      const payload = {
        locale: preferences.locale,
        simplified: preferences.simplifiedLayout,
        intent,
        fieldId: options?.fieldId,
        userMessage,
        snapshot,
      };

      let response;
      try {
        const result = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        response = result.ok
          ? await result.json()
          : generateAssistantResponse(payload);
      } catch {
        response = generateAssistantResponse(payload);
      }

      if (response.followUp) {
        setAskedFollowUpIds((current) =>
          current.includes(response.followUp.id)
            ? current
            : [...current, response.followUp.id],
        );
        setActiveFollowUp(response.followUp);
      } else {
        setActiveFollowUp(undefined);
      }

      if (response.suggestion) {
        setSuggestions((current) => [
          ...current,
          { ...response.suggestion, status: "pending" },
        ]);
      }

      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: response.text,
          generatedByAi: true,
          followUp: response.followUp,
          suggestionId: response.suggestion?.id,
        },
      ]);
      setLoading(false);
    },
    [askedFollowUpIds, form, pathname, preferences],
  );

  const skipFollowUp = useCallback((label?: string) => {
    setActiveFollowUp(undefined);
    const locale = preferences.locale;
    setMessages((current) => [
      ...current,
      {
        id: `s-${Date.now()}`,
        role: "user",
        text: label ?? t(locale, "skipQuestion"),
        generatedByAi: false,
      },
    ]);
  }, [preferences.locale]);

  const acceptSuggestion = useCallback((id: string, editedText?: string) => {
    setSuggestions((current) => {
      const item = current.find((entry) => entry.id === id);
      const text = (editedText ?? item?.text ?? "").trim();
      if (text) {
        setApprovedNotes((notes) => [...notes, text]);
      }
      return current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              text: editedText ?? entry.text,
              status: editedText ? "edited" : "accepted",
            }
          : entry,
      );
    });
  }, []);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "rejected" } : item,
      ),
    );
  }, []);

  const resetAssistant = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setApprovedNotes([]);
    setAskedFollowUpIds([]);
    setActiveFollowUp(undefined);
    welcomed.current = false;
  }, []);

  useEffect(() => {
    if (!preferences.aiEnabled) welcomed.current = false;
  }, [preferences.aiEnabled]);

  useEffect(() => {
    if (!open || !preferences.aiEnabled || welcomed.current) return;
    welcomed.current = true;
    void send("welcome");
  }, [open, preferences.aiEnabled, send]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      messages,
      suggestions,
      approvedNotes,
      activeFollowUp,
      loading,
      send,
      skipFollowUp,
      acceptSuggestion,
      rejectSuggestion,
      resetAssistant,
    }),
    [
      open,
      messages,
      suggestions,
      approvedNotes,
      activeFollowUp,
      loading,
      send,
      skipFollowUp,
      acceptSuggestion,
      rejectSuggestion,
      resetAssistant,
    ],
  );

  return (
    <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }
  return context;
}
