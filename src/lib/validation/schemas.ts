import { z } from "zod";

import { DOCUMENT_TYPES } from "@/lib/claim/options";

const requiredText = (message: string) =>
  z.string().trim().min(1, message);

const optionalText = z.string().trim();

const dateText = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date");

const amountText = z
  .string()
  .trim()
  .min(1, "Enter an amount")
  .refine((value) => {
    const amount = Number(value.replace(",", "."));
    return Number.isFinite(amount) && amount > 0;
  }, "Enter a number greater than 0");

export const treatmentEntrySchema = z.object({
  providerName: requiredText("Enter the healthcare provider or clinic name"),
  country: requiredText("Enter the country of treatment"),
  location: requiredText("Enter the city or location of treatment"),
  date: dateText("Enter the date of treatment"),
  type: requiredText("Select the type of treatment"),
  urgency: requiredText("Select whether the treatment was emergency or planned"),
  details: optionalText,
});

export const expenseEntrySchema = z.object({
  type: requiredText("Select the type of expense"),
  description: requiredText("Describe the expense"),
  date: dateText("Enter the date of the expense"),
  amount: amountText,
  currency: requiredText("Select a currency"),
  paid: z.enum(["yes", "no"], { error: "Say whether this expense has been paid" }),
});

export const documentEntrySchema = z.object({
  id: z.string(),
  status: z.enum(["available", "later", "unavailable"], {
    error: "Choose a status for this document",
  }),
  fileName: z.string(),
  fileSize: z.number(),
});

export const claimFieldsSchema = z.object({
    policyNumber: requiredText("Enter an insurance policy number"),
    insuranceType: requiredText("Select an insurance type"),
    claimDate: dateText("Enter the claim date"),
    incidentDate: dateText("Enter the date the illness or incident occurred"),
    treatmentCountry: requiredText("Enter the country where treatment took place"),
    firstName: requiredText("Enter a first name"),
    lastName: requiredText("Enter a last name"),
    dateOfBirth: dateText("Enter a date of birth"),
    email: z
      .string()
      .trim()
      .min(1, "Enter an email address")
      .email("Enter an email address in the format name@example.com"),
    phone: z
      .string()
      .trim()
      .min(8, "Enter a phone number with at least 8 characters"),
    address: requiredText("Enter a street address"),
    postalCode: requiredText("Enter a postal code"),
    city: requiredText("Enter a city"),
    relationship: requiredText("Select the relationship to the insured person"),
    incidentType: requiredText("Select the type of illness or incident"),
    symptomDate: dateText("Enter the date symptoms started or the incident happened"),
    incidentDescription: z
      .string()
      .trim()
      .min(20, "Describe what happened in at least a few sentences"),
    medicalAssistance: z.enum(["yes", "no"], {
      error: "Say whether medical assistance was received",
    }),
    additionalIncidentInfo: optionalText,
    treatments: z.array(treatmentEntrySchema).min(1, "Add at least one treatment"),
    expenses: z.array(expenseEntrySchema).min(1, "Add at least one expense"),
    documents: z.array(documentEntrySchema).length(DOCUMENT_TYPES.length),
    accountHolder: requiredText("Enter the account holder name"),
    iban: z
      .string()
      .trim()
      .min(1, "Enter an IBAN")
      .refine((value) => {
        const compact = value.replace(/\s+/g, "").toUpperCase();
        return /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(compact);
      }, "Enter an IBAN starting with a country code, for example FI2112345600000785"),
    bic: z
      .string()
      .trim()
      .refine((value) => {
        if (!value) return true;
        return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(value.replace(/\s+/g, ""));
      }, "Enter a BIC/SWIFT code, or leave this blank"),
    bankCountry: requiredText("Enter the bank country"),
    declarationAccepted: z.boolean(),
  });

export const claimDraftSchema = claimFieldsSchema.superRefine((value, context) => {
  if (value.incidentDate && value.claimDate && value.incidentDate > value.claimDate) {
    context.addIssue({
      code: "custom",
      path: ["incidentDate"],
      message: "The incident date should be on or before the claim date",
    });
  }
});

export type ClaimDraft = z.infer<typeof claimFieldsSchema>;
export type TreatmentEntry = z.infer<typeof treatmentEntrySchema>;
export type ExpenseEntry = z.infer<typeof expenseEntrySchema>;
export type DocumentEntry = z.infer<typeof documentEntrySchema>;

export const emptyTreatment = (): TreatmentEntry => ({
  providerName: "",
  country: "",
  location: "",
  date: "",
  type: "",
  urgency: "",
  details: "",
});

export const emptyExpense = (): ExpenseEntry => ({
  type: "",
  description: "",
  date: "",
  amount: "",
  currency: "EUR",
  paid: "yes",
});

export const defaultDocuments = (): DocumentEntry[] =>
  DOCUMENT_TYPES.map((document) => ({
    id: document.id,
    status: "" as DocumentEntry["status"],
    fileName: "",
    fileSize: 0,
  }));

export const defaultClaimValues: ClaimDraft = {
  policyNumber: "",
  insuranceType: "",
  claimDate: "",
  incidentDate: "",
  treatmentCountry: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  relationship: "",
  incidentType: "",
  symptomDate: "",
  incidentDescription: "",
  medicalAssistance: "" as ClaimDraft["medicalAssistance"],
  additionalIncidentInfo: "",
  treatments: [emptyTreatment()],
  expenses: [emptyExpense()],
  documents: defaultDocuments(),
  accountHolder: "",
  iban: "",
  bic: "",
  bankCountry: "",
  declarationAccepted: false,
};

export const stepSchemas = {
  insurance: claimFieldsSchema
    .pick({
      policyNumber: true,
      insuranceType: true,
      claimDate: true,
      incidentDate: true,
      treatmentCountry: true,
    })
    .superRefine((value, context) => {
      if (value.incidentDate && value.claimDate && value.incidentDate > value.claimDate) {
        context.addIssue({
          code: "custom",
          path: ["incidentDate"],
          message: "The incident date should be on or before the claim date",
        });
      }
    }),
  claimant: claimFieldsSchema.pick({
    firstName: true,
    lastName: true,
    dateOfBirth: true,
    email: true,
    phone: true,
    address: true,
    postalCode: true,
    city: true,
    relationship: true,
  }),
  incident: claimFieldsSchema.pick({
    incidentType: true,
    symptomDate: true,
    incidentDescription: true,
    medicalAssistance: true,
    additionalIncidentInfo: true,
  }),
  treatment: z.object({ treatments: claimFieldsSchema.shape.treatments }),
  expenses: z.object({ expenses: claimFieldsSchema.shape.expenses }),
  documents: z.object({ documents: claimFieldsSchema.shape.documents }),
  reimbursement: claimFieldsSchema.pick({
    accountHolder: true,
    iban: true,
    bic: true,
    bankCountry: true,
  }),
  review: z.object({
    declarationAccepted: z.literal(true, {
      error: "Tick the box to confirm you have reviewed the information",
    }),
  }),
};

