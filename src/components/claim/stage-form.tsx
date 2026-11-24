"use client";

import { ClaimantStep } from "@/components/claim/steps/claimant-step";
import { DocumentsStep } from "@/components/claim/steps/documents-step";
import { ExpensesStep } from "@/components/claim/steps/expenses-step";
import { IncidentStep } from "@/components/claim/steps/incident-step";
import { InsuranceStep } from "@/components/claim/steps/insurance-step";
import { ReimbursementStep } from "@/components/claim/steps/reimbursement-step";
import { ReviewStep } from "@/components/claim/steps/review-step";
import { TreatmentStep } from "@/components/claim/steps/treatment-step";
import type { FormStageId } from "@/lib/claim/stages";

const STEP_COMPONENTS: Record<FormStageId, () => React.JSX.Element> = {
  insurance: InsuranceStep,
  claimant: ClaimantStep,
  incident: IncidentStep,
  treatment: TreatmentStep,
  expenses: ExpensesStep,
  documents: DocumentsStep,
  reimbursement: ReimbursementStep,
  review: ReviewStep,
};

export function StageForm({ stageId }: { stageId: FormStageId }) {
  const Step = STEP_COMPONENTS[stageId];
  return <Step />;
}
