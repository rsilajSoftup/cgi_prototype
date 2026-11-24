"use client";

import { SelectField, TextField, WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";
import { INSURANCE_TYPES } from "@/lib/claim/options";

export function InsuranceStep() {
  return (
    <StepForm stageId="insurance">
      <WhyNote>
        Policy and date details are requested so a claim can be linked to cover
        and to the time of the incident. This prototype does not check a real
        policy.
      </WhyNote>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="policyNumber"
          label="Insurance policy number"
          required
          autoComplete="off"
          placeholder="For example, HC-FI-12345"
          hint="Use a fictional policy number."
          explainKey="policyNumber"
        />
        <SelectField
          name="insuranceType"
          label="Insurance type"
          required
          options={INSURANCE_TYPES}
          explainKey="insuranceType"
        />
        <TextField
          name="claimDate"
          label="Claim date"
          type="date"
          required
          hint="The date you are making this demonstration claim."
          explainKey="claimDate"
        />
        <TextField
          name="incidentDate"
          label="Date the illness or medical incident occurred"
          type="date"
          required
          explainKey="incidentDate"
        />
        <TextField
          name="treatmentCountry"
          label="Country where the treatment took place"
          required
          className="sm:col-span-2"
          placeholder="For example, Finland"
          explainKey="treatmentCountry"
        />
      </div>
    </StepForm>
  );
}
