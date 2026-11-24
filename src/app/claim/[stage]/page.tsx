import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { JourneyShell } from "@/components/claim/journey-shell";
import { StageForm } from "@/components/claim/stage-form";
import {
  getClaimStage,
  isFormStageId,
  resolveStageParam,
} from "@/lib/claim/stages";

export function generateStaticParams() {
  return [
    { stage: "insurance" },
    { stage: "claimant" },
    { stage: "incident" },
    { stage: "treatment" },
    { stage: "expenses" },
    { stage: "documents" },
    { stage: "reimbursement" },
    { stage: "review" },
    { stage: "start" },
    { stage: "describe" },
  ];
}

export async function generateMetadata({
  params,
}: PageProps<"/claim/[stage]">) {
  const { stage: stageParam } = await params;
  const resolved = resolveStageParam(stageParam);

  if (!resolved || resolved === "track") {
    return { title: "Claim" };
  }

  return { title: getClaimStage(resolved).title };
}

export default function ClaimStagePage({
  params,
}: PageProps<"/claim/[stage]">) {
  return (
    <Suspense fallback={<JourneyStageFallback />}>
      <ClaimStageContent params={params} />
    </Suspense>
  );
}

async function ClaimStageContent({
  params,
}: {
  params: PageProps<"/claim/[stage]">["params"];
}) {
  const { stage: stageParam } = await params;
  const resolved = resolveStageParam(stageParam);

  if (!resolved || resolved === "track") {
    notFound();
  }

  if (stageParam !== resolved) {
    redirect(`/claim/${resolved}`);
  }

  if (!isFormStageId(resolved)) {
    notFound();
  }

  const stage = getClaimStage(resolved);

  return (
    <JourneyShell
      currentStageId={stage.id}
      heading={stage.heading}
      summary={stage.summary}
    >
      <StageForm key={resolved} stageId={resolved} />
    </JourneyShell>
  );
}

function JourneyStageFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-muted-foreground">Loading this claim stage…</p>
    </div>
  );
}
