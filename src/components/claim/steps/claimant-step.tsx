"use client";

import { SelectField, TextField, WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";
import { RELATIONSHIPS } from "@/lib/claim/options";

export function ClaimantStep() {
  return (
    <StepForm stageId="claimant">
      <WhyNote>
        Name and contact details would be used to identify the claimant and send
        updates. Leave these as invented example details. Do not use real
        personal data.
      </WhyNote>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="firstName" label="First name" required autoComplete="given-name" />
        <TextField name="lastName" label="Last name" required autoComplete="family-name" />
        <TextField
          name="dateOfBirth"
          label="Date of birth"
          type="date"
          required
        />
        <TextField
          name="email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
        />
        <TextField
          name="phone"
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+358 40 000 0000"
        />
        <SelectField
          name="relationship"
          label="Relationship to the insured person"
          required
          options={RELATIONSHIPS}
        />
        <TextField
          name="address"
          label="Address"
          required
          autoComplete="street-address"
          className="sm:col-span-2"
        />
        <TextField
          name="postalCode"
          label="Postal code"
          required
          autoComplete="postal-code"
        />
        <TextField name="city" label="City" required autoComplete="address-level2" />
      </div>
    </StepForm>
  );
}
