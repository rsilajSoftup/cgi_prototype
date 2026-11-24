export const INSURANCE_TYPES = [
  { value: "health", label: "Health insurance" },
  { value: "travel", label: "Travel insurance" },
  { value: "accident", label: "Accident insurance" },
  { value: "other", label: "Other" },
] as const;

export const RELATIONSHIPS = [
  { value: "self", label: "I am the insured person" },
  { value: "child", label: "The insured person is my child" },
  { value: "spouse", label: "The insured person is my spouse or partner" },
  { value: "other", label: "Another relationship" },
] as const;

export const INCIDENT_TYPES = [
  { value: "illness", label: "Illness" },
  { value: "accident", label: "Accident or injury" },
  { value: "other", label: "Other medical incident" },
] as const;

export const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export const TREATMENT_TYPES = [
  { value: "consultation", label: "Doctor consultation" },
  { value: "examination", label: "Examination or tests" },
  { value: "treatment", label: "Treatment or procedure" },
  { value: "medication", label: "Medication" },
  { value: "other", label: "Other" },
] as const;

export const TREATMENT_URGENCY = [
  { value: "emergency", label: "Emergency" },
  { value: "planned", label: "Planned" },
] as const;

export const EXPENSE_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "examination", label: "Examination" },
  { value: "treatment", label: "Treatment" },
  { value: "medication", label: "Medication" },
  { value: "other", label: "Other" },
] as const;

export const CURRENCIES = [
  { value: "EUR", label: "EUR — euro" },
  { value: "SEK", label: "SEK — Swedish krona" },
  { value: "USD", label: "USD — US dollar" },
  { value: "GBP", label: "GBP — pound sterling" },
] as const;

export const DOCUMENT_TYPES = [
  {
    id: "invoice",
    label: "Medical invoice or receipt",
    hint: "An itemised bill from the clinic, hospital or pharmacy.",
  },
  {
    id: "report",
    label: "Medical report or certificate",
    hint: "Include this if you have a doctor's statement for this incident.",
  },
  {
    id: "prescription",
    label: "Prescription or medication receipt",
    hint: "Include this if medicines are part of the claim.",
  },
  {
    id: "payment",
    label: "Proof of payment",
    hint: "A receipt or bank statement showing that an expense was paid.",
  },
  {
    id: "other",
    label: "Other supporting document",
    hint: "Any other file that helps explain the claim.",
  },
] as const;

export const DOCUMENT_STATUSES = [
  { value: "available", label: "I have this document" },
  { value: "later", label: "I will add it later" },
  { value: "unavailable", label: "I do not have this document" },
] as const;

export function optionLabel<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}
