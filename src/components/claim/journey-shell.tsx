import type { ReactNode } from "react";

import { AssistantPanel } from "@/components/claim/assistant-panel";
import { ClaimNavigation } from "@/components/claim/claim-navigation";
import { ClaimProgress } from "@/components/claim/claim-progress";
import { DemoNotice } from "@/components/layout/demo-notice";
import type { ClaimStageId } from "@/lib/claim/stages";

type JourneyShellProps = {
  currentStageId: ClaimStageId;
  heading: string;
  summary: string;
  children: ReactNode;
  showNavigation?: boolean;
};

export function JourneyShell({
  currentStageId,
  heading,
  summary,
  children,
  showNavigation = false,
}: JourneyShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <DemoNotice compact />
      <ClaimProgress currentStageId={currentStageId} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section
          aria-labelledby="stage-heading"
          className="border-border bg-card space-y-8 rounded-2xl border p-6 sm:p-8"
        >
          <div className="space-y-3">
            <h1
              id="stage-heading"
              className="text-foreground text-3xl font-semibold tracking-tight"
            >
              {heading}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {summary}
            </p>
          </div>
          <div>{children}</div>
          {showNavigation ? (
            <ClaimNavigation currentStageId={currentStageId} />
          ) : null}
        </section>
        <div className="hidden lg:block">
          <AssistantPanel variant="sidebar" />
        </div>
      </div>
    </div>
  );
}
