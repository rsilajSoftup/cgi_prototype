import { DOCUMENT_TYPES } from "@/lib/claim/options";
import type { Locale } from "@/lib/i18n/config";
import type { ClaimSnapshot } from "@/lib/ai/types";
import { followUps } from "@/lib/ai/content";

export type Gap = { id: string; title: string; why: string; next: string };

export function nextFollowUpId(snapshot: ClaimSnapshot): string | undefined {
  const asked = new Set(snapshot.askedFollowUpIds);
  const text = snapshot.incidentDescription.toLowerCase();

  if (!asked.has("when_started") && !snapshot.symptomDate && !/\d{4}-\d{2}-\d{2}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|tammik|helmik|maanantai)\b/i.test(text)) {
    return "when_started";
  }
  if (!asked.has("where_happened") && !snapshot.treatmentCountry && !/\b(finland|suomi|sweden|helsinki|clinic|klinikka)\b/i.test(text)) {
    return "where_happened";
  }
  if (!asked.has("received_treatment") && !snapshot.medicalAssistance) {
    return "received_treatment";
  }
  if (!asked.has("visit_date") && !snapshot.treatmentDate && snapshot.medicalAssistance !== "no") {
    return "visit_date";
  }
  return undefined;
}

export function findGaps(snapshot: ClaimSnapshot, locale: Locale): Gap[] {
  const gaps: Gap[] = [];
  const copy = {
    en: {
      dateTitle: "A treatment date is not filled in yet",
      dateWhy: "A date helps show when care was given. It does not decide cover.",
      dateNext: "You can add it in the Treatment step, or skip if you do not know.",
      providerTitle: "A healthcare provider name is not filled in yet",
      providerWhy: "The clinic or hospital name helps describe where care happened.",
      providerNext: "Add it in the Treatment step if you have it.",
      expenseTitle: "An expense is missing a description",
      expenseWhy: "A short description explains what the amount is for.",
      expenseNext: "Open the Expenses step and complete the description.",
      docsTitle: "Some example documents have no status yet",
      docsWhy: "A status tells whether a file is available, coming later, or not held.",
      docsNext: "Choose a status in the Documents step. None is required by a real policy.",
      descTitle: "The incident description is still short",
      descWhy: "A few sentences about what happened can make the claim easier to follow.",
      descNext: "You can write more in your own words, or ask the assistant a follow-up.",
    },
    fi: {
      dateTitle: "Hoidon päivämäärä puuttuu vielä",
      dateWhy: "Päivä kertoo, milloin hoito annettiin. Se ei päätä korvauksesta.",
      dateNext: "Voit lisätä sen Hoidot-vaiheessa tai ohittaa, jos et tiedä.",
      providerTitle: "Hoitopaikan nimi puuttuu vielä",
      providerWhy: "Klinikan tai sairaalan nimi kuvaa, missä hoito annettiin.",
      providerNext: "Lisää se Hoidot-vaiheessa, jos se on tiedossa.",
      expenseTitle: "Kululta puuttuu kuvaus",
      expenseWhy: "Lyhyt kuvaus kertoo, mistä summasta on kyse.",
      expenseNext: "Avaa Kulut-vaihe ja täydennä kuvaus.",
      docsTitle: "Joillain esimerkkiliitteillä ei ole vielä tilaa",
      docsWhy: "Tila kertoo, onko tiedosto saatavilla, tulossa myöhemmin vai ei ole.",
      docsNext: "Valitse tila Liitteet-vaiheessa. Mikään ei ole pakollinen oikean vakuutuksen perusteella.",
      descTitle: "Tapahtuman kuvaus on vielä lyhyt",
      descWhy: "Muutama lause tapahtuneesta helpottaa hakemuksen ymmärtämistä.",
      descNext: "Voit kirjoittaa lisää omin sanoin tai pyytää avustajalta jatkokysymyksen.",
    },
    sv: {
      dateTitle: "Ett vårddatum saknas ännu",
      dateWhy: "Ett datum visar när vården gavs. Det avgör inte ersättning.",
      dateNext: "Du kan lägga till det i steget Vård, eller hoppa över om du inte vet.",
      providerTitle: "Vårdgivarens namn saknas ännu",
      providerWhy: "Klinikens eller sjukhusets namn beskriver var vården gavs.",
      providerNext: "Lägg till det i steget Vård om du har det.",
      expenseTitle: "En kostnad saknar beskrivning",
      expenseWhy: "En kort beskrivning förklarar vad beloppet avser.",
      expenseNext: "Öppna steget Kostnader och fyll i beskrivningen.",
      docsTitle: "Vissa exempeldokument saknar status",
      docsWhy: "Status visar om filen finns, kommer senare eller saknas.",
      docsNext: "Välj status i steget Dokument. Inget är obligatoriskt enligt en riktig försäkring.",
      descTitle: "Beskrivningen av händelsen är fortfarande kort",
      descWhy: "Några meningar om vad som hände gör ansökan lättare att följa.",
      descNext: "Du kan skriva mer med egna ord, eller be assistenten om en följdfråga.",
    },
  }[locale];

  if (!snapshot.treatmentDate) {
    gaps.push({ id: "treatment-date", title: copy.dateTitle, why: copy.dateWhy, next: copy.dateNext });
  }
  if (!snapshot.treatmentProvider) {
    gaps.push({
      id: "provider",
      title: copy.providerTitle,
      why: copy.providerWhy,
      next: copy.providerNext,
    });
  }
  if (snapshot.expenseMissingDescription) {
    gaps.push({
      id: "expense",
      title: copy.expenseTitle,
      why: copy.expenseWhy,
      next: copy.expenseNext,
    });
  }
  const unsetDocs = snapshot.documents.filter((item) => !item.status);
  if (unsetDocs.length > 0) {
    gaps.push({
      id: "documents",
      title: copy.docsTitle,
      why: copy.docsWhy,
      next: copy.docsNext,
    });
  }
  if (snapshot.incidentDescription.trim().length < 40) {
    gaps.push({
      id: "description",
      title: copy.descTitle,
      why: copy.descWhy,
      next: copy.descNext,
    });
  }

  void DOCUMENT_TYPES;
  void followUps;
  return gaps;
}
