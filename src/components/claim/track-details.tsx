"use client";

import { Badge } from "@/components/ui/badge";
import { useClaimFormContext } from "@/components/providers/claim-form-provider";
import { SAMPLE_CLAIM } from "@/lib/data/sample-claim";
import { optionLabel, INCIDENT_TYPES } from "@/lib/claim/options";
import { formatTotals } from "@/lib/claim/totals";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import type { ClaimDraft } from "@/lib/validation/schemas";

export function TrackDetails() {
  const { submission } = useClaimFormContext();
  const { getValues } = useFormContext<ClaimDraft>();
  const values = getValues();
  const usingSubmission = Boolean(submission);

  const reference = submission?.reference ?? SAMPLE_CLAIM.reference;
  const submittedOn = submission?.submittedOn ?? SAMPLE_CLAIM.submittedOn;
  const claimantName = usingSubmission
    ? `${values.firstName} ${values.lastName}`.trim() || "Demonstration claimant"
    : SAMPLE_CLAIM.claimantName;
  const policyNumber = usingSubmission
    ? values.policyNumber || "Not provided"
    : SAMPLE_CLAIM.policyNumber;
  const claimType = usingSubmission
    ? optionLabel(INCIDENT_TYPES, values.incidentType) || "Health insurance claim"
    : SAMPLE_CLAIM.claimType;
  const amountClaimed = usingSubmission
    ? formatTotals(values.expenses)
    : SAMPLE_CLAIM.amountClaimed;

  return (
    <div className="space-y-8">
      <p role="note" className="bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-sm">
        {usingSubmission
          ? "This tracking view uses the demonstration claim you just confirmed. Status updates are still simulated."
          : "Simulated information only. Names, policy numbers and amounts are invented for this prototype."}
      </p>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground text-sm">Claim reference</dt>
          <dd className="text-foreground text-base font-medium">{reference}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">Submitted</dt>
          <dd className="text-foreground text-base font-medium">{submittedOn}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">Claimant</dt>
          <dd className="text-foreground text-base font-medium">{claimantName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">Policy number</dt>
          <dd className="text-foreground text-base font-medium">{policyNumber}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">Claim type</dt>
          <dd className="text-foreground text-base font-medium">{claimType}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">Amount claimed</dt>
          <dd className="text-foreground text-base font-medium">{amountClaimed}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium">Current status</p>
        <Badge className="h-7 px-3 text-sm">{SAMPLE_CLAIM.currentStatusLabel}</Badge>
      </div>
      <ol className="space-y-4" aria-label="Simulated claim timeline">
        {SAMPLE_CLAIM.timeline.map((event, index) => {
          const isCurrent = event.status === SAMPLE_CLAIM.currentStatus;

          return (
            <li
              key={event.id}
              className={cn(
                "border-border rounded-xl border p-4",
                isCurrent && "border-primary bg-accent/60",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold">
                  {index + 1}. {event.title}
                </h2>
                <p className="text-muted-foreground text-sm">{event.dateLabel}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{event.description}</p>
              {isCurrent ? (
                <p className="text-primary mt-2 text-sm font-medium">
                  Current simulated status
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
