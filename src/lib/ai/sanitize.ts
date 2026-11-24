import type { ClaimDraft } from "@/lib/validation/schemas";
import type { ClaimSnapshot } from "@/lib/ai/types";
import type { FormStageId } from "@/lib/claim/stages";

/** Omits names, contact details and bank data. Safe for a local simulated engine. */
export function toClaimSnapshot(
  values: ClaimDraft,
  stageId: FormStageId | "track" | "",
  askedFollowUpIds: string[],
): ClaimSnapshot {
  const treatment = values.treatments[0];
  return {
    stageId,
    incidentType: values.incidentType,
    symptomDate: values.symptomDate,
    incidentDescription: values.incidentDescription,
    medicalAssistance: values.medicalAssistance,
    treatmentCountry: values.treatmentCountry,
    treatmentProvider: treatment?.providerName ?? "",
    treatmentDate: treatment?.date ?? "",
    expenseCount: values.expenses.length,
    expenseMissingDescription: values.expenses.some((item) => !item.description.trim()),
    documents: values.documents.map((item) => ({
      id: item.id,
      status: item.status,
      fileName: item.fileName ? "attached" : "",
    })),
    askedFollowUpIds,
  };
}
