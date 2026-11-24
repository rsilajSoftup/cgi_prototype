"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useFormContext, type Path } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useClaimFormContext } from "@/components/providers/claim-form-provider";
import {
  getAdjacentFormStages,
  type FormStageId,
} from "@/lib/claim/stages";
import { stepSchemas, type ClaimDraft } from "@/lib/validation/schemas";

type StepFormProps = {
  stageId: FormStageId;
  children: ReactNode;
};

export function StepForm({ stageId, children }: StepFormProps) {
  const router = useRouter();
  const { getValues, setError, clearErrors, formState } = useFormContext<ClaimDraft>();
  const { markVisited } = useClaimFormContext();
  const { previous, next } = getAdjacentFormStages(stageId);
  const hasErrors = Object.keys(formState.errors).length > 0;

  useEffect(() => {
    markVisited(stageId);
  }, [markVisited, stageId]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = getValues();
    const result = stepSchemas[stageId].safeParse(values);

    if (!result.success) {
      clearErrors();
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") as Path<ClaimDraft>;
        if (!path) continue;
        setError(path, { type: "zod", message: issue.message });
      }
      window.requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>("[aria-invalid='true'], [role='alert']")
          ?.focus?.();
      });
      return;
    }

    if (!next) return;
    markVisited(next.id);
    router.push(next.href);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {hasErrors ? (
        <p role="alert" className="text-destructive text-sm">
          Some information still needs to be completed. Check the messages below.
        </p>
      ) : null}
      {children}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button asChild variant="outline" size="xl">
          <Link href={previous?.href ?? "/"}>
            <ArrowLeft data-icon="inline-start" />
            {previous ? `Back to ${previous.title}` : "Back to home"}
          </Link>
        </Button>
        {next ? (
          <Button type="submit" size="xl">
            Continue to {next.title}
            <ArrowRight data-icon="inline-end" />
          </Button>
        ) : null}
      </div>
    </form>
  );
}
