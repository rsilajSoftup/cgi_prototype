export const FORM_STAGE_IDS = [
  "insurance",
  "claimant",
  "incident",
  "treatment",
  "expenses",
  "documents",
  "reimbursement",
  "review",
] as const;

export type FormStageId = (typeof FORM_STAGE_IDS)[number];

export type ClaimStageId = FormStageId | "track";

export type ClaimStage = {
  id: ClaimStageId;
  href: string;
  number: number;
  title: string;
  heading: string;
  summary: string;
};

export const FORM_STAGES: ClaimStage[] = [
  {
    id: "insurance",
    href: "/claim/insurance",
    number: 1,
    title: "Insurance",
    heading: "Claim and insurance information",
    summary:
      "These details help match the demonstration claim to a fictional policy and to the time and place of treatment.",
  },
  {
    id: "claimant",
    href: "/claim/claimant",
    number: 2,
    title: "Claimant",
    heading: "Claimant information",
    summary:
      "Contact details are requested so a claims handler could, in a real service, reach the person making the claim. Use fictional information only.",
  },
  {
    id: "incident",
    href: "/claim/incident",
    number: 3,
    title: "Incident",
    heading: "Illness or medical incident",
    summary:
      "Describe what happened in plain language. You do not need medical terms. Include dates, symptoms or events, and what you did next.",
  },
  {
    id: "treatment",
    href: "/claim/treatment",
    number: 4,
    title: "Treatment",
    heading: "Medical treatment information",
    summary:
      "Tell us where and when treatment was received. You can add more than one visit if needed.",
  },
  {
    id: "expenses",
    href: "/claim/expenses",
    number: 5,
    title: "Expenses",
    heading: "Medical expenses",
    summary:
      "Enter the amounts you paid or were billed. The total is a simple sum of your entries. This prototype does not calculate insurance compensation.",
  },
  {
    id: "documents",
    href: "/claim/documents",
    number: 6,
    title: "Documents",
    heading: "Supporting documents",
    summary:
      "Document needs depend on the situation. Nothing here is required because of a real insurance policy. Choose a status for each example type.",
  },
  {
    id: "reimbursement",
    href: "/claim/reimbursement",
    number: 7,
    title: "Reimbursement",
    heading: "Reimbursement details",
    summary:
      "In a real service, bank details would be used to pay a benefit. Here they are fictional demonstration data only. No payment is made.",
  },
  {
    id: "review",
    href: "/claim/review",
    number: 8,
    title: "Review",
    heading: "Review and declaration",
    summary:
      "Check your answers. You can return to any previous step to edit them. Nothing is sent to an insurer.",
  },
];

export const TRACK_STAGE: ClaimStage = {
  id: "track",
  href: "/track",
  number: 9,
  title: "Track the claim",
  heading: "Track your claim",
  summary:
    "See a simulated status after you submit the demonstration claim.",
};

export const CLAIM_STAGES: ClaimStage[] = [...FORM_STAGES, TRACK_STAGE];

const LEGACY_STAGE_MAP: Record<string, FormStageId> = {
  start: "insurance",
  describe: "incident",
};

export function resolveStageParam(value: string): ClaimStageId | undefined {
  if (value in LEGACY_STAGE_MAP) {
    return LEGACY_STAGE_MAP[value];
  }

  if (FORM_STAGE_IDS.includes(value as FormStageId) || value === "track") {
    return value as ClaimStageId;
  }

  return undefined;
}

export function isFormStageId(value: string): value is FormStageId {
  return FORM_STAGE_IDS.includes(value as FormStageId);
}

export function isClaimStageId(value: string): value is ClaimStageId {
  return resolveStageParam(value) !== undefined;
}

export function getClaimStage(id: ClaimStageId) {
  const stage = CLAIM_STAGES.find((item) => item.id === id);

  if (!stage) {
    throw new Error(`Unknown claim stage: ${id}`);
  }

  return stage;
}

export function getFormStage(id: FormStageId) {
  return getClaimStage(id);
}

export function getAdjacentFormStages(id: FormStageId) {
  const index = FORM_STAGES.findIndex((item) => item.id === id);
  return {
    previous: index > 0 ? FORM_STAGES[index - 1] : undefined,
    current: FORM_STAGES[index],
    next: index < FORM_STAGES.length - 1 ? FORM_STAGES[index + 1] : undefined,
  };
}

export function getAdjacentStages(id: ClaimStageId) {
  if (id === "track") {
    return { previous: FORM_STAGES[FORM_STAGES.length - 1], current: TRACK_STAGE, next: undefined };
  }

  return getAdjacentFormStages(id);
}
