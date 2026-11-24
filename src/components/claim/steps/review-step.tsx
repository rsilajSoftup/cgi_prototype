"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { WhyNote } from "@/components/form/field";
import { useAssistant } from "@/components/providers/assistant-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createClaimReference,
  formatSubmittedOn,
  useClaimFormContext,
} from "@/components/providers/claim-form-provider";
import {
  DOCUMENT_TYPES,
  EXPENSE_TYPES,
  INCIDENT_TYPES,
  INSURANCE_TYPES,
  RELATIONSHIPS,
  TREATMENT_TYPES,
  TREATMENT_URGENCY,
  optionLabel,
} from "@/lib/claim/options";
import { FORM_STAGES, type FormStageId } from "@/lib/claim/stages";
import { formatTotals } from "@/lib/claim/totals";
import { stepSchemas, type ClaimDraft } from "@/lib/validation/schemas";

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-foreground text-base font-medium whitespace-pre-wrap">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function SummarySection({
  stageId,
  title,
  children,
}: {
  stageId: FormStageId;
  title: string;
  children: React.ReactNode;
}) {
  const stage = FORM_STAGES.find((item) => item.id === stageId);

  return (
    <section className="border-border space-y-4 rounded-xl border p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {stage ? (
          <Link
            href={stage.href}
            className="text-primary focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
          >
            Edit {stage.title.toLowerCase()}
          </Link>
        ) : null}
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function incompleteSteps(values: ClaimDraft) {
  return (Object.keys(stepSchemas) as FormStageId[]).filter((id) => {
    if (id === "review") return false;
    return !stepSchemas[id].safeParse(values).success;
  });
}

export function ReviewStep() {
  const { getValues, setValue, setError, clearErrors, watch, formState } =
    useFormContext<ClaimDraft>();
  const { submission, setSubmission, markVisited } = useClaimFormContext();
  const { suggestions, approvedNotes } = useAssistant();
  const [missing, setMissing] = useState<FormStageId[]>([]);
  const values = watch();
  const pendingSuggestions = suggestions.filter((item) => item.status === "pending");
  const declarationError = formState.errors.declarationAccepted;

  if (submission) {
    return (
      <div className="space-y-6">
        <p
          role="status"
          className="bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-base leading-relaxed"
        >
          The demonstration claim has been recorded in this prototype. No insurer
          received it, and no payment will be made.
        </p>
        <dl className="grid gap-4 sm:grid-cols-2">
          <SummaryItem label="Claim reference" value={submission.reference} />
          <SummaryItem label="Submitted" value={submission.submittedOn} />
        </dl>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button asChild variant="outline" size="xl">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild size="xl">
            <Link href="/track">Track this demonstration claim</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = getValues();
    const unfinished = incompleteSteps(current);
    setMissing(unfinished);
    if (!current.declarationAccepted) {
      setError("declarationAccepted", {
        type: "manual",
        message: "Tick the box to confirm you have reviewed the information",
      });
    } else {
      clearErrors("declarationAccepted");
    }
    if (unfinished.length > 0 || !current.declarationAccepted) return;

    markVisited("review");
    setSubmission({
      reference: createClaimReference(),
      submittedOn: formatSubmittedOn(),
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <WhyNote>
        Review everything below. You can edit a section and come back. Confirming
        only stores this demonstration in the browser.
      </WhyNote>
      {missing.length > 0 ? (
        <div role="alert" className="border-destructive text-destructive rounded-lg border px-4 py-3 text-sm">
          <p className="font-medium">Some sections still need information:</p>
          <ul className="mt-2 list-disc pl-5">
            {missing.map((id) => {
              const stage = FORM_STAGES.find((item) => item.id === id);
              return (
                <li key={id}>
                  <Link href={stage?.href ?? "/"} className="underline">
                    {stage?.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <SummarySection stageId="insurance" title="Claim information">
        <SummaryItem label="Policy number" value={values.policyNumber} />
        <SummaryItem
          label="Insurance type"
          value={optionLabel(INSURANCE_TYPES, values.insuranceType)}
        />
        <SummaryItem label="Claim date" value={values.claimDate} />
        <SummaryItem label="Incident date" value={values.incidentDate} />
        <SummaryItem label="Treatment country" value={values.treatmentCountry} />
      </SummarySection>

      <SummarySection stageId="claimant" title="Claimant information">
        <SummaryItem label="Name" value={`${values.firstName} ${values.lastName}`.trim()} />
        <SummaryItem label="Date of birth" value={values.dateOfBirth} />
        <SummaryItem label="Email" value={values.email} />
        <SummaryItem label="Phone" value={values.phone} />
        <SummaryItem
          label="Address"
          value={[values.address, values.postalCode, values.city].filter(Boolean).join(", ")}
        />
        <SummaryItem
          label="Relationship"
          value={optionLabel(RELATIONSHIPS, values.relationship)}
        />
      </SummarySection>

      <SummarySection stageId="incident" title="Illness or incident description">
        <SummaryItem
          label="Type"
          value={optionLabel(INCIDENT_TYPES, values.incidentType)}
        />
        <SummaryItem label="Date symptoms started" value={values.symptomDate} />
        <SummaryItem
          label="Medical assistance received"
          value={values.medicalAssistance === "yes" ? "Yes" : values.medicalAssistance === "no" ? "No" : ""}
        />
        <div className="sm:col-span-2 space-y-4">
          <SummaryItem label="Your original answer (unchanged)" value={values.incidentDescription} />
          {approvedNotes.length > 0 ? (
            <SummaryItem
              label="Extra notes you approved"
              value={approvedNotes.join("\n")}
            />
          ) : null}
          {pendingSuggestions.length > 0 ? (
            <SummaryItem
              label="AI suggestions not added to the claim"
              value={pendingSuggestions.map((item) => item.text).join("\n")}
            />
          ) : null}
          <SummaryItem
            label="Additional information"
            value={values.additionalIncidentInfo}
          />
        </div>
      </SummarySection>

      <SummarySection stageId="treatment" title="Medical treatment">
        {values.treatments.map((treatment, index) => (
          <div key={`treatment-${index}`} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
            <SummaryItem
              label={`Provider ${index + 1}`}
              value={treatment.providerName}
            />
            <SummaryItem
              label="Location"
              value={[treatment.location, treatment.country].filter(Boolean).join(", ")}
            />
            <SummaryItem label="Date" value={treatment.date} />
            <SummaryItem
              label="Type"
              value={optionLabel(TREATMENT_TYPES, treatment.type)}
            />
            <SummaryItem
              label="Urgency"
              value={optionLabel(TREATMENT_URGENCY, treatment.urgency)}
            />
            <SummaryItem label="Details" value={treatment.details} />
          </div>
        ))}
      </SummarySection>

      <SummarySection stageId="expenses" title="Medical expenses">
        {values.expenses.map((expense, index) => (
          <div key={`expense-${index}`} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
            <SummaryItem
              label={`Expense ${index + 1}`}
              value={optionLabel(EXPENSE_TYPES, expense.type)}
            />
            <SummaryItem label="Date" value={expense.date} />
            <SummaryItem label="Description" value={expense.description} />
            <SummaryItem
              label="Amount"
              value={`${expense.amount} ${expense.currency}`.trim()}
            />
            <SummaryItem
              label="Already paid"
              value={expense.paid === "yes" ? "Yes" : expense.paid === "no" ? "No" : ""}
            />
          </div>
        ))}
        <SummaryItem label="Total claimed amount" value={formatTotals(values.expenses)} />
      </SummarySection>

      <SummarySection stageId="documents" title="Document checklist">
        {values.documents.map((document) => {
          const meta = DOCUMENT_TYPES.find((item) => item.id === document.id);
          const status =
            document.status === "available"
              ? document.fileName
                ? `Available — ${document.fileName}`
                : "Available — no file selected"
              : document.status === "later"
                ? "Will be added later"
                : document.status === "unavailable"
                  ? "Unavailable"
                  : "Not chosen";
          return (
            <SummaryItem
              key={document.id}
              label={meta?.label ?? document.id}
              value={status}
            />
          );
        })}
      </SummarySection>

      <SummarySection stageId="reimbursement" title="Reimbursement details">
        <SummaryItem label="Account holder" value={values.accountHolder} />
        <SummaryItem label="IBAN" value={values.iban} />
        <SummaryItem label="BIC/SWIFT" value={values.bic} />
        <SummaryItem label="Bank country" value={values.bankCountry} />
      </SummarySection>

      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-lg border px-4 py-3 text-base leading-relaxed">
          <Checkbox
            className="mt-1 size-5"
            checked={values.declarationAccepted}
            onCheckedChange={(checked) =>
              setValue("declarationAccepted", checked === true, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            aria-invalid={declarationError ? true : undefined}
          />
          <span>
            I have reviewed this demonstration information and confirm it is
            fictional example data, not a real insurance claim.{" "}
            <span className="text-muted-foreground">(required)</span>
          </span>
        </label>
        {declarationError ? (
          <p role="alert" className="text-destructive text-sm">
            {declarationError.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button asChild variant="outline" size="xl">
          <Link href="/claim/reimbursement">
            <ArrowLeft data-icon="inline-start" />
            Back to Reimbursement
          </Link>
        </Button>
        <Button type="submit" size="xl">
          Confirm and submit demonstration claim
        </Button>
      </div>
    </form>
  );
}
