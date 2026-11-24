import type { Locale } from "@/lib/i18n/config";
import type { FormStageId } from "@/lib/claim/stages";

export type AssistantIntent =
  | "welcome"
  | "explain"
  | "describe-help"
  | "follow-up-answer"
  | "missing"
  | "documents"
  | "chat";

export type AssistantSuggestionStatus = "pending" | "accepted" | "rejected" | "edited";

export type AssistantSuggestion = {
  id: string;
  field: "incidentDescription";
  text: string;
  status: AssistantSuggestionStatus;
};

export type AssistantFollowUp = {
  id: string;
  question: string;
};

export type ClaimSnapshot = {
  stageId: FormStageId | "track" | "";
  incidentType: string;
  symptomDate: string;
  incidentDescription: string;
  medicalAssistance: string;
  treatmentCountry: string;
  treatmentProvider: string;
  treatmentDate: string;
  expenseCount: number;
  expenseMissingDescription: boolean;
  documents: { id: string; status: string; fileName: string }[];
  askedFollowUpIds: string[];
};

export type AssistantRequest = {
  locale: Locale;
  simplified: boolean;
  intent: AssistantIntent;
  fieldId?: string;
  userMessage?: string;
  snapshot: ClaimSnapshot;
};

export type AssistantResponse = {
  source: "simulated";
  text: string;
  followUp?: AssistantFollowUp;
  suggestion?: { id: string; field: "incidentDescription"; text: string };
  disclaimer: string;
};
