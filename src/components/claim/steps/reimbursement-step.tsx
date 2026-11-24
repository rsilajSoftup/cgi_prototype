"use client";

import { TextField, WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";

export function ReimbursementStep() {
  return (
    <StepForm stageId="reimbursement">
      <WhyNote>
        Bank details would be used to pay a benefit in a real service. Enter
        invented values only. This prototype does not connect to a bank or make
        a payment.
      </WhyNote>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="accountHolder"
          label="Account holder name"
          required
          autoComplete="off"
          className="sm:col-span-2"
        />
        <TextField
          name="iban"
          label="IBAN"
          required
          autoComplete="off"
          placeholder="FI2112345600000785"
          hint="Use a fictional IBAN. Spaces are allowed."
          className="sm:col-span-2"
          explainKey="iban"
        />
        <TextField
          name="bic"
          label="BIC/SWIFT"
          autoComplete="off"
          hint="Include this if the account is outside Finland. Leave blank if you do not have one."
        />
        <TextField
          name="bankCountry"
          label="Bank country"
          required
          placeholder="For example, Finland"
        />
      </div>
    </StepForm>
  );
}
