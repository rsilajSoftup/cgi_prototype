"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { SelectField, TextAreaField, TextField, WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";
import { Button } from "@/components/ui/button";
import { TREATMENT_TYPES, TREATMENT_URGENCY } from "@/lib/claim/options";
import { emptyTreatment, type ClaimDraft } from "@/lib/validation/schemas";

export function TreatmentStep() {
  const { control } = useFormContext<ClaimDraft>();
  const { fields, append, remove } = useFieldArray({ control, name: "treatments" });

  return (
    <StepForm stageId="treatment">
      <WhyNote>
        Treatment details show where care was given. You can add another visit if
        you received care in more than one place. Extra visits can also be added
        later in development.
      </WhyNote>
      <div className="space-y-8">
        {fields.map((field, index) => (
          <fieldset
            key={field.id}
            className="border-border space-y-6 rounded-xl border p-4 sm:p-5"
          >
            <legend className="text-foreground px-1 text-base font-semibold">
              Treatment {index + 1}
            </legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField
                name={`treatments.${index}.providerName`}
                label="Healthcare provider or clinic"
                required
                className="sm:col-span-2"
                explainKey="treatmentCountry"
              />
              <TextField
                name={`treatments.${index}.country`}
                label="Country of treatment"
                required
              />
              <TextField
                name={`treatments.${index}.location`}
                label="City or location"
                required
              />
              <TextField
                name={`treatments.${index}.date`}
                label="Date of treatment"
                type="date"
                required
              />
              <SelectField
                name={`treatments.${index}.type`}
                label="Type of treatment received"
                required
                options={TREATMENT_TYPES}
              />
              <SelectField
                name={`treatments.${index}.urgency`}
                label="Was the treatment emergency or planned?"
                required
                options={TREATMENT_URGENCY}
                className="sm:col-span-2"
              />
              <TextAreaField
                name={`treatments.${index}.details`}
                label="Additional treatment details"
                className="sm:col-span-2"
                rows={3}
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
                Remove treatment {index + 1}
              </Button>
            ) : null}
          </fieldset>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="xl"
          onClick={() => append(emptyTreatment())}
        >
          <Plus data-icon="inline-start" />
          Add another treatment
        </Button>
      </div>
    </StepForm>
  );
}
