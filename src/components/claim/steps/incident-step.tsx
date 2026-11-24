"use client";

import { IncidentAssist } from "@/components/claim/incident-assist";
import { RadioField, SelectField, TextAreaField, TextField, WhyNote } from "@/components/form/field";
import { StepForm } from "@/components/form/step-form";
import { INCIDENT_TYPES, YES_NO } from "@/lib/claim/options";

export function IncidentStep() {
  return (
    <StepForm stageId="incident">
      <WhyNote>
        Include what happened, when it started, and how it affected you. Everyday
        words are enough. You do not need a diagnosis.
      </WhyNote>
      <div className="grid gap-6">
        <SelectField
          name="incidentType"
          label="Type of illness or medical incident"
          required
          options={INCIDENT_TYPES}
          explainKey="incidentDescription"
        />
        <TextField
          name="symptomDate"
          label="Date symptoms started or the incident occurred"
          type="date"
          required
          explainKey="symptomDate"
        />
        <TextAreaField
          name="incidentDescription"
          label="Description of the illness or incident"
          required
          placeholder="For example: I had a high fever and a sore throat, and I visited a clinic the next day."
          hint="Say what happened, where you were, and what you did next."
          explainKey="incidentDescription"
        />
        <IncidentAssist />
        <RadioField
          name="medicalAssistance"
          label="Was medical assistance received?"
          required
          options={YES_NO}
          explainKey="incidentDescription"
        />
        <TextAreaField
          name="additionalIncidentInfo"
          label="Any additional relevant information"
          rows={4}
          hint="Add anything else that might help a claims handler understand the situation."
        />
      </div>
    </StepForm>
  );
}
