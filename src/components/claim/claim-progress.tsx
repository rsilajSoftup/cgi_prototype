"use client";

import Link from "next/link";

import { useClaimFormContext } from "@/components/providers/claim-form-provider";
import { Progress } from "@/components/ui/progress";
import { FORM_STAGES, type ClaimStageId } from "@/lib/claim/stages";
import { cn } from "@/lib/utils";

type ClaimProgressProps = {
  currentStageId: ClaimStageId;
};

export function ClaimProgress({ currentStageId }: ClaimProgressProps) {
  const { visitedSteps, submission } = useClaimFormContext();
  const currentIndex =
    currentStageId === "track"
      ? FORM_STAGES.length
      : FORM_STAGES.findIndex((stage) => stage.id === currentStageId);
  const safeIndex = Math.max(0, currentIndex);
  const currentStage =
    currentStageId === "track"
      ? { number: FORM_STAGES.length, title: "Submitted" }
      : FORM_STAGES[safeIndex];
  const percent = Math.round(
    ((Math.min(safeIndex + 1, FORM_STAGES.length)) / FORM_STAGES.length) * 100,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="text-foreground text-sm font-medium">
          {currentStageId === "track"
            ? "Demonstration claim submitted"
            : `Step ${currentStage.number} of ${FORM_STAGES.length}: ${currentStage.title}`}
        </p>
        <p className="text-muted-foreground text-sm">{percent}% through</p>
      </div>
      <Progress value={percent} aria-hidden="true" className="h-2" />
      <ol className="grid grid-cols-4 gap-1 xl:grid-cols-8 sm:gap-2">
        {FORM_STAGES.map((stage, index) => {
          const isCurrent = stage.id === currentStageId;
          const isComplete =
            index < safeIndex || Boolean(submission) || visitedSteps.includes(stage.id);
          const canOpen =
            visitedSteps.includes(stage.id) || index <= safeIndex || Boolean(submission);
          const content = (
            <>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isCurrent && isComplete && "bg-primary/15 text-primary",
                  !isCurrent && !isComplete && "bg-muted text-muted-foreground",
                )}
              >
                {stage.number}
              </span>
              <span className="hidden leading-snug lg:inline">{stage.title}</span>
              <span className="sr-only lg:hidden">{stage.title}</span>
            </>
          );

          return (
            <li key={stage.id}>
              {canOpen && !isCurrent ? (
                <Link
                  href={stage.href}
                  className="hover:bg-muted focus-visible:ring-ring flex min-h-11 flex-col items-center gap-1 rounded-md p-1 text-center text-sm font-medium xl:flex-row xl:items-center xl:gap-2 xl:p-2 xl:text-left focus-visible:ring-3 focus-visible:outline-none"
                >
                  {content}
                </Link>
              ) : (
                <div
                  className="flex min-h-11 flex-col items-center gap-1 rounded-md p-1 text-center text-sm xl:flex-row xl:items-center xl:gap-2 xl:p-2 xl:text-left"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
