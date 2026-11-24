import {
  documentHelp,
  followUps,
  getExplanation,
  laterUnavailable,
  stageHints,
} from "@/lib/ai/content";
import { findGaps, nextFollowUpId } from "@/lib/ai/gaps";
import type { AssistantRequest, AssistantResponse } from "@/lib/ai/types";
import { t } from "@/lib/i18n/ui";

function paragraph(parts: string[], simplified: boolean) {
  const text = parts.filter(Boolean).join(" ");
  if (!simplified) return text;
  return parts[0] ?? text;
}

export function generateAssistantResponse(request: AssistantRequest): AssistantResponse {
  const { locale, simplified, intent, fieldId, snapshot, userMessage } = request;
  const disclaimer = t(locale, "disclaimer");

  if (intent === "welcome") {
    return {
      source: "simulated",
      text: simplified ? t(locale, "welcomeShort") : t(locale, "welcome"),
      disclaimer,
    };
  }

  if (intent === "explain") {
    const key = fieldId || snapshot.stageId || "incidentDescription";
    const explanation = getExplanation(key, locale);
    const stage = stageHints[snapshot.stageId]?.[locale];
    const text = simplified
      ? explanation.short
      : [stage, explanation.meaning, explanation.why, explanation.example]
          .filter(Boolean)
          .join(" ");
    return { source: "simulated", text, disclaimer };
  }

  if (intent === "documents") {
    const lines = Object.entries(documentHelp).map(([id, byLocale]) => {
      const item = byLocale[locale];
      return `${id}: ${item.purpose} ${item.contains}`;
    });
    const text = simplified
      ? laterUnavailable[locale]
      : `${lines.join(" ")} ${laterUnavailable[locale]}`;
    return { source: "simulated", text, disclaimer };
  }

  if (intent === "missing") {
    const gaps = findGaps(snapshot, locale);
    if (gaps.length === 0) {
      const none = {
        en: "I cannot see anything required that is obviously empty. You can still add more detail if you want. Missing items do not make this demonstration invalid.",
        fi: "En näe selvästi tyhjää pakollista tietoa. Voit silti täydentää, jos haluat. Puuttuvat kohdat eivät tee tästä harjoituksesta virheellistä.",
        sv: "Jag ser inget uppenbart tomt som måste fyllas i. Du kan ändå lägga till mer om du vill. Saknade uppgifter gör inte demonstrationen ogiltig.",
      }[locale];
      return { source: "simulated", text: none, disclaimer };
    }
    const listed = gaps
      .slice(0, simplified ? 1 : 4)
      .map((gap) => `${gap.title} ${gap.why} ${gap.next}`)
      .join(" ");
    const prefix = {
      en: "These points may still be useful. They do not decide eligibility or compensation.",
      fi: "Nämä kohdat voivat vielä olla hyödyksi. Ne eivät päätä korvauskelpoisuutta.",
      sv: "De här punkterna kan fortfarande vara till hjälp. De avgör inte rätt till ersättning.",
    }[locale];
    return { source: "simulated", text: paragraph([prefix, listed], simplified), disclaimer };
  }

  if (intent === "describe-help" || intent === "follow-up-answer") {
    const followId = nextFollowUpId(snapshot);
    const thanks = {
      en: userMessage
        ? "Thank you. I have kept that as an AI suggestion. Your original description is unchanged until you accept extra notes."
        : "You can write in your own words. I will ask one short question if something still seems missing.",
      fi: userMessage
        ? "Kiitos. Säilytin sen tekoälyn ehdotuksena. Alkuperäinen kuvauksesi ei muutu, ennen kuin hyväksyt lisätiedot."
        : "Voit kirjoittaa omin sanoin. Kysyn yhden lyhyen kysymyksen, jos jokin näyttää puuttuvan.",
      sv: userMessage
        ? "Tack. Jag har sparat det som ett AI-förslag. Din ursprungliga beskrivning ändras inte förrän du godkänner extra anteckningar."
        : "Du kan skriva med egna ord. Jag ställer en kort fråga om något fortfarande verkar saknas.",
    }[locale];

    const suggestionText = userMessage?.trim()
      ? userMessage.trim()
      : undefined;

    const followUp = followId
      ? { id: followId, question: followUps[followId][locale] }
      : undefined;

    const done = {
      en: "I have no further follow-up just now. You can keep writing, or continue the form.",
      fi: "Minulla ei ole juuri nyt lisää kysymyksiä. Voit jatkaa kirjoittamista tai lomaketta.",
      sv: "Jag har inga fler följdfrågor just nu. Du kan fortsätta skriva eller gå vidare i formuläret.",
    }[locale];

    return {
      source: "simulated",
      text: paragraph([thanks, followUp ? followUp.question : done], simplified),
      followUp,
      suggestion: suggestionText
        ? {
            id: `sug-${Date.now()}`,
            field: "incidentDescription",
            text: suggestionText,
          }
        : undefined,
      disclaimer,
    };
  }

  const lower = (userMessage ?? "").toLowerCase();
  if (lower.includes("document") || lower.includes("liite") || lower.includes("dokument")) {
    return generateAssistantResponse({ ...request, intent: "documents" });
  }
  if (lower.includes("missing") || lower.includes("puuttu") || lower.includes("saknas")) {
    return generateAssistantResponse({ ...request, intent: "missing" });
  }

  const hint = stageHints[snapshot.stageId]?.[locale] ?? t(locale, "welcomeShort");
  return {
    source: "simulated",
    text: paragraph(
      [
        hint,
        {
          en: "I cannot diagnose illness or decide cover. Ask me to explain a field, help describe what happened, or look for missing details.",
          fi: "En tee diagnoosia enkä päätä korvauksesta. Pyydä minua selittämään kenttä, auttamaan kuvauksessa tai etsimään puuttuvia tietoja.",
          sv: "Jag ställer ingen diagnos och beslutar inte om ersättning. Be mig förklara ett fält, hjälpa till med beskrivningen eller leta efter saknade uppgifter.",
        }[locale],
      ],
      simplified,
    ),
    disclaimer,
  };
}
