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
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { defaultClaimValues, claimDraftSchema, type ClaimDraft } from "@/lib/validation/schemas";

const STORAGE_KEY = "health-claim-draft-v1";

type Submission = {
  reference: string;
  submittedOn: string;
};

type PersistedState = {
  values: ClaimDraft;
  visitedSteps: string[];
  submission: Submission | null;
};

type ClaimFormContextValue = {
  visitedSteps: string[];
  markVisited: (stageId: string) => void;
  submission: Submission | null;
  setSubmission: (submission: Submission | null) => void;
  resetClaim: () => void;
};

const ClaimFormContext = createContext<ClaimFormContextValue | null>(null);

function readPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function ClaimFormProvider({ children }: { children: ReactNode }) {
  const form = useForm<ClaimDraft>({
    resolver: zodResolver(claimDraftSchema),
    defaultValues: defaultClaimValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });
  const [visitedSteps, setVisitedSteps] = useState<string[]>(["insurance"]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const persisted = readPersisted();
    if (!persisted) return;
    form.reset({ ...defaultClaimValues, ...persisted.values });
    setVisitedSteps(persisted.visitedSteps?.length ? persisted.visitedSteps : ["insurance"]);
    setSubmission(persisted.submission);
  }, [form]);

  useEffect(() => {
    const persist = (values: ClaimDraft) => {
      const payload: PersistedState = {
        values,
        visitedSteps,
        submission,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    persist(form.getValues());
    // eslint-disable-next-line react-hooks/incompatible-library -- sessionStorage sync only
    const subscription = form.watch((values) => persist(values as ClaimDraft));
    return () => subscription.unsubscribe();
  }, [form, visitedSteps, submission]);

  const markVisited = useCallback((stageId: string) => {
    setVisitedSteps((current) =>
      current.includes(stageId) ? current : [...current, stageId],
    );
  }, []);

  const resetClaim = useCallback(() => {
    form.reset(defaultClaimValues);
    setVisitedSteps(["insurance"]);
    setSubmission(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, [form]);

  const value = useMemo(
    () => ({ visitedSteps, markVisited, submission, setSubmission, resetClaim }),
    [visitedSteps, markVisited, submission, resetClaim],
  );

  return (
    <ClaimFormContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </ClaimFormContext.Provider>
  );
}

export function useClaimFormContext() {
  const context = useContext(ClaimFormContext);

  if (!context) {
    throw new Error("useClaimFormContext must be used within ClaimFormProvider");
  }

  return context;
}

export function createClaimReference() {
  const year = new Date().getFullYear();
  const serial = String(Math.floor(10000 + Math.random() * 90000));
  return `HC-${year}-${serial}`;
}

export function formatSubmittedOn(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
