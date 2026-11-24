export type SimulatedClaimStatus =
  | "received"
  | "under-review"
  | "information-needed"
  | "decision-pending"
  | "paid";

export type SimulatedTimelineEvent = {
  id: string;
  status: SimulatedClaimStatus;
  title: string;
  description: string;
  dateLabel: string;
  completed: boolean;
};

export type SimulatedClaim = {
  reference: string;
  submittedOn: string;
  claimantName: string;
  claimType: string;
  policyNumber: string;
  currentStatus: SimulatedClaimStatus;
  currentStatusLabel: string;
  amountClaimed: string;
  timeline: SimulatedTimelineEvent[];
};

export const SAMPLE_CLAIM: SimulatedClaim = {
  reference: "HC-2026-00418",
  submittedOn: "12 November 2026",
  claimantName: "Alex Virtanen",
  claimType: "Illness — medical expenses",
  policyNumber: "HC-FI-77821",
  currentStatus: "under-review",
  currentStatusLabel: "Under review",
  amountClaimed: "EUR 186.40",
  timeline: [
    {
      id: "received",
      status: "received",
      title: "Claim received",
      description: "The demonstration claim was registered in this prototype.",
      dateLabel: "12 November 2026",
      completed: true,
    },
    {
      id: "under-review",
      status: "under-review",
      title: "Under review",
      description:
        "A fictional claims handler is checking the description and documents.",
      dateLabel: "14 November 2026",
      completed: true,
    },
    {
      id: "information-needed",
      status: "information-needed",
      title: "Additional information",
      description:
        "This example does not request extra information. In a real service, missing documents would appear here.",
      dateLabel: "Not required",
      completed: false,
    },
    {
      id: "decision-pending",
      status: "decision-pending",
      title: "Decision pending",
      description:
        "No eligibility or compensation decision is made in this prototype.",
      dateLabel: "Not started",
      completed: false,
    },
    {
      id: "paid",
      status: "paid",
      title: "Reimbursement",
      description: "No payment is processed. This status is shown for demonstration only.",
      dateLabel: "Not started",
      completed: false,
    },
  ],
};
