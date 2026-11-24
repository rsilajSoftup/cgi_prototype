"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { RadioField, SelectField, TextField, WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";
import { Button } from "@/components/ui/button";
import { CURRENCIES, EXPENSE_TYPES, YES_NO } from "@/lib/claim/options";
import { formatTotals } from "@/lib/claim/totals";
import { emptyExpense, type ClaimDraft } from "@/lib/validation/schemas";

function ExpenseTotal() {
  const expenses = useWatch<ClaimDraft, "expenses">({ name: "expenses" });
  return (
    <div className="border-border bg-muted/40 rounded-xl border px-4 py-4">
      <p className="text-sm font-medium">Total claimed amount</p>
      <p className="text-foreground mt-1 text-2xl font-semibold">
        {formatTotals(expenses ?? [])}
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        This is a sum of the amounts you entered. It is not an insurance
        compensation calculation, and no payment is made.
      </p>
    </div>
  );
}

export function ExpensesStep() {
  const { control } = useFormContext<ClaimDraft>();
  const { fields, append, remove } = useFieldArray({ control, name: "expenses" });

  return (
    <StepForm stageId="expenses">
      <WhyNote>
        Expense amounts are examples for this demonstration. The running total
        updates as you type. A real insurer would apply policy rules before any
        reimbursement.
      </WhyNote>
      <div className="space-y-8">
        {fields.map((field, index) => (
          <fieldset
            key={field.id}
            className="border-border space-y-6 rounded-xl border p-4 sm:p-5"
          >
            <legend className="text-foreground px-1 text-base font-semibold">
              Expense {index + 1}
            </legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                name={`expenses.${index}.type`}
                label="Type of expense"
                required
                options={EXPENSE_TYPES}
              />
              <TextField
                name={`expenses.${index}.date`}
                label="Date of expense"
                type="date"
                required
              />
              <TextField
                name={`expenses.${index}.description`}
                label="Description of the expense"
                required
                className="sm:col-span-2"
                explainKey="incidentDescription"
              />
              <TextField
                name={`expenses.${index}.amount`}
                label="Amount"
                required
                inputMode="decimal"
                placeholder="0.00"
              />
              <SelectField
                name={`expenses.${index}.currency`}
                label="Currency"
                required
                options={CURRENCIES}
              />
              <RadioField
                name={`expenses.${index}.paid`}
                label="Has this expense already been paid?"
                required
                options={YES_NO}
                className="sm:col-span-2"
              />
            </div>
            {fields.length > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="xl"
                onClick={() => remove(index)}
              >
                <Trash2 data-icon="inline-start" />
                Remove expense {index + 1}
              </Button>
            ) : null}
          </fieldset>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="xl"
          onClick={() => append(emptyExpense())}
        >
          <Plus data-icon="inline-start" />
          Add another expense
        </Button>
        <ExpenseTotal />
      </div>
    </StepForm>
  );
}
