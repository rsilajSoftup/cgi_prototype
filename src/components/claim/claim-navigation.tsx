"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useClaimFormContext } from "@/components/providers/claim-form-provider";
import { Button } from "@/components/ui/button";
import type { ClaimStageId } from "@/lib/claim/stages";

type ClaimNavigationProps = {
  currentStageId: ClaimStageId;
};

export function ClaimNavigation({ currentStageId }: ClaimNavigationProps) {
  const { resetClaim } = useClaimFormContext();

  if (currentStageId !== "track") {
    return null;
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <Button asChild variant="outline" size="xl">
        <Link href="/">
          <ArrowLeft data-icon="inline-start" />
          Back to home
        </Link>
      </Button>
      <Button asChild size="xl">
        <Link href="/claim/insurance" onClick={() => resetClaim()}>
          Start another demonstration claim
        </Link>
      </Button>
    </div>
  );
}
