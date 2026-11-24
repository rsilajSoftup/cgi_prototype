"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { get, useFormContext, type FieldError } from "react-hook-form";

import { ExplainThis } from "@/components/claim/explain-this";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ClaimDraft } from "@/lib/validation/schemas";

const controlClass =
  "h-11 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base";

type FieldOption = { value: string; label: string };

type CommonProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  why?: string;
  explainKey?: string;
  className?: string;
};

function FieldShell({
  id,
  label,
  required,
  hint,
  why,
  explainKey,
  error,
  className,
  children,
}: Omit<CommonProps, "name"> & { id: string; error?: FieldError; children: ReactNode }) {
  const hintId = hint || why ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id} className="text-foreground text-base font-medium">
          {label}
          {required ? (
            <span className="text-muted-foreground font-normal"> (required)</span>
          ) : (
            <span className="text-muted-foreground font-normal"> (optional)</span>
          )}
        </Label>
        {explainKey ? <ExplainThis fieldId={explainKey} /> : null}
      </div>
      {hint || why ? (
        <p id={hintId} className="text-muted-foreground text-sm leading-relaxed">
          {hint}
          {why ? ` ${why}` : null}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(hintId?: string, errorId?: string) {
  return [hintId, errorId].filter(Boolean).join(" ") || undefined;
}

export function TextField({
  name,
  type = "text",
  autoComplete,
  placeholder,
  inputMode,
  ...props
}: CommonProps & {
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const { register, formState } = useFormContext<ClaimDraft>();
  const error = get(formState.errors, name) as FieldError | undefined;
  const id = name.replaceAll(".", "-");
  const hintId = props.hint || props.why ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <FieldShell id={id} error={error} {...props}>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId)}
        className={controlClass}
        {...register(name as never)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  rows = 5,
  placeholder,
  ...props
}: CommonProps & { rows?: number; placeholder?: string }) {
  const { register, formState } = useFormContext<ClaimDraft>();
  const error = get(formState.errors, name) as FieldError | undefined;
  const id = name.replaceAll(".", "-");
  const hintId = props.hint || props.why ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <FieldShell id={id} error={error} {...props}>
      <Textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId)}
        className="min-h-32 w-full text-base"
        {...register(name as never)}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  options,
  placeholder = "Select an option",
  ...props
}: CommonProps & { options: readonly FieldOption[]; placeholder?: string }) {
  const { register, formState } = useFormContext<ClaimDraft>();
  const error = get(formState.errors, name) as FieldError | undefined;
  const id = name.replaceAll(".", "-");
  const hintId = props.hint || props.why ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <FieldShell id={id} error={error} {...props}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId)}
        className={cn(controlClass, "bg-background")}
        {...register(name as never)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function RadioField({
  name,
  options,
  ...props
}: CommonProps & { options: readonly FieldOption[] }) {
  const { register, formState } = useFormContext<ClaimDraft>();
  const error = get(formState.errors, name) as FieldError | undefined;
  const id = name.replaceAll(".", "-");
  const hintId = props.hint || props.why ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const registration = register(name as never);

  return (
    <fieldset
      className={cn("space-y-2", props.className)}
      aria-describedby={describedBy(hintId, errorId)}
      aria-invalid={error ? true : undefined}
    >
      <legend className="text-foreground text-base font-medium">
        {props.label}
        {props.required ? (
          <span className="text-muted-foreground font-normal"> (required)</span>
        ) : (
          <span className="text-muted-foreground font-normal"> (optional)</span>
        )}
      </legend>
      {props.explainKey ? <ExplainThis fieldId={props.explainKey} /> : null}
      {props.hint || props.why ? (
        <p id={hintId} className="text-muted-foreground text-sm leading-relaxed">
          {props.hint}
          {props.why ? ` ${props.why}` : null}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="border-border hover:bg-muted/60 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-base"
          >
            <input
              type="radio"
              value={option.value}
              className="size-5 accent-primary"
              {...registration}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error.message}
        </p>
      ) : null}
    </fieldset>
  );
}

export function WhyNote({ children }: { children: ReactNode }) {
  return (
    <p role="note" className="bg-secondary text-secondary-foreground rounded-lg px-4 py-3 text-sm leading-relaxed">
      {children}
    </p>
  );
}
