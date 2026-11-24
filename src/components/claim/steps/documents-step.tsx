"use client";

import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { ExplainThis } from "@/components/claim/explain-this";
import { WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";
import { Button } from "@/components/ui/button";
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from "@/lib/claim/options";
import type { ClaimDraft } from "@/lib/validation/schemas";

export function DocumentsStep() {
  const { register, setValue, watch, formState } = useFormContext<ClaimDraft>();
  const documents = watch("documents");

  return (
    <StepForm stageId="documents">
      <WhyNote>
        Which documents are useful depends on the fictional claim. None of these
        files are mandatory because of a real policy. Sample files stay in this
        browser session and are not uploaded to a server.
      </WhyNote>
      <ExplainThis fieldId="documents" />
      <ul className="space-y-6">
        {DOCUMENT_TYPES.map((document, index) => {
          const current = documents?.[index];
          const statusError = formState.errors.documents?.[index]?.status;
          const fieldId = `documents-${index}-status`;

          return (
            <li
              key={document.id}
              className="border-border space-y-4 rounded-xl border p-4 sm:p-5"
            >
              <fieldset
                aria-describedby={`${fieldId}-hint`}
                aria-invalid={statusError ? true : undefined}
              >
                <legend className="text-foreground text-base font-semibold">
                  {document.label}{" "}
                  <span className="text-muted-foreground font-normal">(required status)</span>
                </legend>
                <p id={`${fieldId}-hint`} className="text-muted-foreground mt-2 text-sm">
                  {document.hint}
                </p>
                <div className="mt-4 grid gap-2">
                  {DOCUMENT_STATUSES.map((status) => (
                    <label
                      key={status.value}
                      className="border-border hover:bg-muted/60 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-base"
                    >
                      <input
                        type="radio"
                        value={status.value}
                        className="size-5 accent-primary"
                        {...register(`documents.${index}.status`)}
                      />
                      {status.label}
                    </label>
                  ))}
                </div>
                {statusError ? (
                  <p role="alert" className="text-destructive mt-2 text-sm">
                    {statusError.message}
                  </p>
                ) : null}
              </fieldset>

              {current?.status === "available" ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Sample file (optional)</p>
                  {current.fileName ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2">
                      <p className="text-sm">
                        {current.fileName}
                        {current.fileSize
                          ? ` (${Math.max(1, Math.round(current.fileSize / 1024))} KB)`
                          : null}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="xl"
                        onClick={() => {
                          setValue(`documents.${index}.fileName`, "", {
                            shouldDirty: true,
                          });
                          setValue(`documents.${index}.fileSize`, 0, {
                            shouldDirty: true,
                          });
                        }}
                      >
                        <X data-icon="inline-start" />
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="border-border rounded-lg border border-dashed px-3 py-3">
                      <label htmlFor={`document-file-${index}`} className="text-sm font-medium">
                        Choose a sample file
                      </label>
                      <input
                        id={`document-file-${index}`}
                        type="file"
                        className="mt-2 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-md file:border file:border-border file:bg-secondary file:px-3"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          setValue(`documents.${index}.fileName`, file.name, {
                            shouldDirty: true,
                          });
                          setValue(`documents.${index}.fileSize`, file.size, {
                            shouldDirty: true,
                          });
                          event.target.value = "";
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </StepForm>
  );
}
