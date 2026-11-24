import type { Locale } from "@/lib/i18n/config";

export type Explanation = { meaning: string; why: string; example: string; short: string };

const E = {
  policyNumber: {
    en: {
      meaning: "This is the number on your insurance policy documents.",
      why: "It helps match a claim to the right policy in a real service.",
      example: "For example: HC-FI-12345. Use a fictional number here.",
      short: "The number printed on the policy. Use a made-up example.",
    },
    fi: {
      meaning: "Tämä on vakuutuskirjassa oleva numero.",
      why: "Sillä hakemus voidaan yhdistää oikeaan vakuutukseen.",
      example: "Esimerkki: HC-FI-12345. Käytä tässä keksittyä numeroa.",
      short: "Vakuutuskirjan numero. Käytä keksittyä esimerkkiä.",
    },
    sv: {
      meaning: "Det här är numret på försäkringsbrevet.",
      why: "Det hjälper att koppla ansökan till rätt försäkring.",
      example: "Till exempel: HC-FI-12345. Använd ett påhittat nummer här.",
      short: "Numret på försäkringsbrevet. Använd ett påhittat exempel.",
    },
  },
  insuranceType: {
    en: {
      meaning: "This is the kind of cover, such as health or travel insurance.",
      why: "Different policies ask for slightly different details.",
      example: "Choose Health insurance if this is a medical expense claim.",
      short: "The type of cover, for example health insurance.",
    },
    fi: {
      meaning: "Tämä kertoo vakuutuksen lajin, esimerkiksi sairausvakuutus.",
      why: "Eri vakuutuksissa kysytään hieman eri tietoja.",
      example: "Valitse sairausvakuutus, jos kyse on hoitokuluista.",
      short: "Vakuutuksen laji, esimerkiksi sairausvakuutus.",
    },
    sv: {
      meaning: "Det här är typen av skydd, till exempel sjukförsäkring.",
      why: "Olika försäkringar kan fråga efter olika uppgifter.",
      example: "Välj sjukförsäkring om det gäller vårdkostnader.",
      short: "Typ av skydd, till exempel sjukförsäkring.",
    },
  },
  claimDate: {
    en: {
      meaning: "The date you are making this demonstration claim.",
      why: "A real service uses this as the date the claim was opened.",
      example: "Today's date, for example 20 November 2026.",
      short: "The date you send this demonstration claim.",
    },
    fi: {
      meaning: "Päivä, jona teet tämän harjoitushakemuksen.",
      why: "Oikeassa palvelussa se on hakemuksen avauspäivä.",
      example: "Esimerkiksi tämä päivä, 20.11.2026.",
      short: "Päivä, jona lähetät harjoitushakemuksen.",
    },
    sv: {
      meaning: "Datumet då du gör den här demonstrationsansökan.",
      why: "I en riktig tjänst är det dagen då ärendet öppnas.",
      example: "Till exempel dagens datum, 20 november 2026.",
      short: "Datumet då du skickar demonstrationsansökan.",
    },
  },
  incidentDate: {
    en: {
      meaning: "The day the illness started or the incident happened.",
      why: "It places the event in time next to your policy.",
      example: "If symptoms began on 10 November, enter that date.",
      short: "The day the illness or incident started.",
    },
    fi: {
      meaning: "Päivä, jona oireet alkoivat tai tapahtuma sattui.",
      why: "Se sijoittaa tapahtuman ajallisesti vakuutukseen nähden.",
      example: "Jos oireet alkoivat 10.11., merkitse se päivä.",
      short: "Päivä, jona sairaus tai tapahtuma alkoi.",
    },
    sv: {
      meaning: "Dagen då sjukdomen började eller händelsen inträffade.",
      why: "Det placerar händelsen i tid i förhållande till försäkringen.",
      example: "Om besvären började den 10 november, ange det datumet.",
      short: "Dagen då sjukdomen eller händelsen började.",
    },
  },
  treatmentCountry: {
    en: {
      meaning: "The country where you received care.",
      why: "Care abroad can follow different rules in a real policy.",
      example: "Finland, Sweden, or another country where treatment took place.",
      short: "Country where you received care.",
    },
    fi: {
      meaning: "Maa, jossa sait hoitoa.",
      why: "Ulkomailla annettu hoito voi noudattaa eri sääntöjä.",
      example: "Suomi, Ruotsi tai muu maa, jossa hoito annettiin.",
      short: "Maa, jossa sait hoitoa.",
    },
    sv: {
      meaning: "Landet där du fick vård.",
      why: "Vård utomlands kan följa andra regler i en riktig försäkring.",
      example: "Finland, Sverige eller ett annat land där vården gavs.",
      short: "Landet där du fick vård.",
    },
  },
  incidentDescription: {
    en: {
      meaning: "A short story of what happened, in your own words.",
      why: "It helps a handler understand the situation without medical jargon.",
      example: "I had a high fever and a sore throat, and I visited a clinic the next day.",
      short: "Describe what happened in everyday words.",
    },
    fi: {
      meaning: "Lyhyt kuvaus tapahtuneesta omilla sanoillasi.",
      why: "Se auttaa ymmärtämään tilanteen ilman erikoissanastoa.",
      example: "Minulla oli korkea kuume ja kurkku kipeä, ja kävin klinikalla seuraavana päivänä.",
      short: "Kerro omin sanoin, mitä tapahtui.",
    },
    sv: {
      meaning: "En kort berättelse om vad som hände, med dina egna ord.",
      why: "Det hjälper någon att förstå situationen utan fackspråk.",
      example: "Jag hade hög feber och ont i halsen och besökte en klinik nästa dag.",
      short: "Berätta med vardagliga ord vad som hände.",
    },
  },
  symptomDate: {
    en: {
      meaning: "When the first symptoms began, or when the accident happened.",
      why: "It can differ from the day you visited a clinic.",
      example: "If you felt unwell on Monday and visited on Wednesday, enter Monday.",
      short: "When symptoms or the incident first started.",
    },
    fi: {
      meaning: "Milloin ensimmäiset oireet alkoivat tai tapaturma sattui.",
      why: "Päivä voi olla eri kuin klinikalla käynti.",
      example: "Jos voisit huonosti maanantaina ja kävit keskiviikkona, merkitse maanantai.",
      short: "Milloin oireet tai tapahtuma alkoi.",
    },
    sv: {
      meaning: "När de första besvären började, eller när olyckan hände.",
      why: "Det kan skilja sig från dagen då du besökte vården.",
      example: "Om du mådde dåligt på måndag och gick dit på onsdag, ange måndag.",
      short: "När besvären eller händelsen började.",
    },
  },
  iban: {
    en: {
      meaning: "The international number of a bank account.",
      why: "In a real service it would be used to pay a benefit. Here it is fictional.",
      example: "FI21 1234 5600 0007 85 — use invented digits only.",
      short: "A fictional bank account number for the demonstration.",
    },
    fi: {
      meaning: "Pankkitilin kansainvälinen numero.",
      why: "Oikeassa palvelussa sillä maksettaisiin korvaus. Tässä se on keksitty.",
      example: "FI21 1234 5600 0007 85 — käytä vain keksittyjä numeroita.",
      short: "Keksitty tilinumero tätä harjoitusta varten.",
    },
    sv: {
      meaning: "Det internationella numret för ett bankkonto.",
      why: "I en riktig tjänst skulle ersättning betalas hit. Här är det påhittat.",
      example: "FI21 1234 5600 0007 85 — använd bara påhittade siffror.",
      short: "Ett påhittat kontonummer för demonstrationen.",
    },
  },
  documents: {
    en: {
      meaning: "A list of example files that might support a claim.",
      why: "Real requirements depend on the situation. Nothing here is mandatory by a real policy.",
      example: "You can mark a file as available, add later, or unavailable.",
      short: "Example files only. You choose available, later, or unavailable.",
    },
    fi: {
      meaning: "Esimerkkilista tiedostoista, jotka voivat tukea hakemusta.",
      why: "Oikeat vaatimukset riippuvat tilanteesta. Mikään ei ole pakollinen oikean vakuutuksen perusteella.",
      example: "Voit merkitä tiedoston saatavilla, lisään myöhemmin tai ei ole.",
      short: "Vain esimerkkejä. Valitse saatavilla, myöhemmin tai ei ole.",
    },
    sv: {
      meaning: "En exempelista på filer som kan stödja en ansökan.",
      why: "Riktiga krav beror på situationen. Inget är obligatoriskt enligt en riktig försäkring.",
      example: "Du kan markera en fil som tillgänglig, läggs till senare eller saknas.",
      short: "Bara exempel. Välj tillgänglig, senare eller saknas.",
    },
  },
} satisfies Record<string, Record<Locale, Explanation>>;

const fallback: Explanation = {
  meaning: "This field collects information for the demonstration claim.",
  why: "It helps practise a clear digital claim. It is not used to decide cover.",
  example: "Use short, fictional details.",
  short: "A demonstration field. Use short, fictional details.",
};

const fallbackFi: Explanation = {
  meaning: "Tähän kerätään tietoja harjoitushakemusta varten.",
  why: "Se auttaa harjoittelemaan selkeää digitaalista hakemusta. Sillä ei päätetä korvauksesta.",
  example: "Käytä lyhyitä, keksittyjä tietoja.",
  short: "Harjoituskenttä. Käytä lyhyitä, keksittyjä tietoja.",
};

const fallbackSv: Explanation = {
  meaning: "Det här fältet samlar uppgifter för demonstrationsansökan.",
  why: "Det hjälper att öva en tydlig digital ansökan. Det avgör inte ersättning.",
  example: "Använd korta, påhittade uppgifter.",
  short: "Ett demonstrationsfält. Använd korta, påhittade uppgifter.",
};

export function getExplanation(fieldId: string, locale: Locale): Explanation {
  const entry = (E as Record<string, Record<Locale, Explanation>>)[fieldId];
  if (entry?.[locale]) return entry[locale];
  if (locale === "fi") return fallbackFi;
  if (locale === "sv") return fallbackSv;
  return fallback;
}

export const stageHints: Record<string, Record<Locale, string>> = {
  insurance: {
    en: "This step asks which policy the demonstration claim belongs to, and when and where care took place.",
    fi: "Tässä vaiheessa kysytään, mihin vakuutukseen harjoitushakemus liittyy sekä milloin ja missä hoito annettiin.",
    sv: "Det här steget frågar vilken försäkring ansökan gäller samt när och var vården gavs.",
  },
  claimant: {
    en: "This step asks who is making the claim and how they could be contacted. Use invented details.",
    fi: "Tässä kysytään, kuka tekee hakemuksen ja miten häneen voisi ottaa yhteyttä. Käytä keksittyjä tietoja.",
    sv: "Här frågas vem som gör ansökan och hur personen kan nås. Använd påhittade uppgifter.",
  },
  incident: {
    en: "Describe what happened in everyday words. You can ask me follow-up questions one at a time.",
    fi: "Kerro omin sanoin, mitä tapahtui. Voin esittää yhden jatkokysymyksen kerrallaan.",
    sv: "Berätta med vardagliga ord vad som hände. Jag kan ställa en följdfråga i taget.",
  },
  treatment: {
    en: "Say where and when you received care. You can add more than one visit.",
    fi: "Kerro, missä ja milloin sait hoitoa. Voit lisätä useita käyntejä.",
    sv: "Berätta var och när du fick vård. Du kan lägga till flera besök.",
  },
  expenses: {
    en: "List amounts you paid or were billed. The total is only a sum, not compensation.",
    fi: "Luettele maksamasi tai laskutetut summat. Yhteensä on vain summa, ei korvaus.",
    sv: "Lista belopp du betalat eller fakturerats. Totalsumman är bara en summa, inte ersättning.",
  },
  documents: {
    en: "Choose a status for each example file. Nothing is required by a real policy.",
    fi: "Valitse tila jokaiselle esimerkkitiedostolle. Mikään ei ole pakollinen oikean vakuutuksen perusteella.",
    sv: "Välj status för varje exempelfil. Inget är obligatoriskt enligt en riktig försäkring.",
  },
  reimbursement: {
    en: "Bank details are fictional here. No payment is made.",
    fi: "Pankkitiedot ovat tässä keksittyjä. Maksua ei tehdä.",
    sv: "Bankuppgifterna är påhittade här. Ingen utbetalning görs.",
  },
  review: {
    en: "Check your answers. AI suggestions appear only if you accepted them.",
    fi: "Tarkista vastauksesi. Tekoälyn ehdotukset näkyvät vain, jos hyväksyit ne.",
    sv: "Kontrollera dina svar. AI-förslag syns bara om du har godkänt dem.",
  },
};

export const documentHelp: Record<string, Record<Locale, { purpose: string; contains: string }>> = {
  invoice: {
    en: {
      purpose: "Shows what was charged and when.",
      contains: "Clinic name, date, items and the amount paid or billed.",
    },
    fi: {
      purpose: "Kertoo, mistä veloitettiin ja milloin.",
      contains: "Klinikan nimi, päivä, rivit ja maksettu tai laskutettu summa.",
    },
    sv: {
      purpose: "Visar vad som debiterats och när.",
      contains: "Klinikens namn, datum, rader och belopp.",
    },
  },
  report: {
    en: {
      purpose: "A doctor's note can describe the visit in simple terms.",
      contains: "Date of visit and a short reason for care — not a diagnosis from this assistant.",
    },
    fi: {
      purpose: "Lääkärin lausunto voi kuvata käynnin lyhyesti.",
      contains: "Käynnin päivä ja lyhyt syy — tämä avustaja ei tee diagnoosia.",
    },
    sv: {
      purpose: "Ett läkarintyg kan beskriva besöket enkelt.",
      contains: "Besöksdatum och en kort orsak — den här assistenten ställer ingen diagnos.",
    },
  },
  prescription: {
    en: {
      purpose: "Useful if medicines are part of the example claim.",
      contains: "Medicine name, date and pharmacy receipt if you have one.",
    },
    fi: {
      purpose: "Hyödyllinen, jos lääkkeet kuuluvat esimerkkihakemukseen.",
      contains: "Lääkkeen nimi, päivä ja apteekin kuitti, jos se on olemassa.",
    },
    sv: {
      purpose: "Användbart om läkemedel ingår i exempelansökan.",
      contains: "Läkemedlets namn, datum och apotekskvitto om du har ett.",
    },
  },
  payment: {
    en: {
      purpose: "Shows that a bill was paid.",
      contains: "Date, amount and how it was paid.",
    },
    fi: {
      purpose: "Osoittaa, että lasku on maksettu.",
      contains: "Päivä, summa ja maksutapa.",
    },
    sv: {
      purpose: "Visar att en räkning har betalats.",
      contains: "Datum, belopp och hur det betalades.",
    },
  },
  other: {
    en: {
      purpose: "Any other file that helps explain the situation.",
      contains: "Only what you choose to add. Nothing is checked automatically.",
    },
    fi: {
      purpose: "Muu tiedosto, joka auttaa selittämään tilannetta.",
      contains: "Vain se, minkä itse lisäät. Mitään ei tarkisteta automaattisesti.",
    },
    sv: {
      purpose: "En annan fil som hjälper att förklara situationen.",
      contains: "Bara det du själv lägger till. Ingenting kontrolleras automatiskt.",
    },
  },
};

export const followUps: Record<
  string,
  Record<Locale, string>
> = {
  when_started: {
    en: "When did your symptoms start?",
    fi: "Milloin oireet alkoivat?",
    sv: "När började besvären?",
  },
  where_happened: {
    en: "Where did the incident happen?",
    fi: "Missä tapahtuma sattui?",
    sv: "Var hände det?",
  },
  received_treatment: {
    en: "Did you receive medical treatment?",
    fi: "Saitko lääketieteellistä hoitoa?",
    sv: "Fick du medicinsk vård?",
  },
  visit_date: {
    en: "When did you visit the healthcare provider?",
    fi: "Milloin kävit terveydenhuollossa?",
    sv: "När besökte du vårdgivaren?",
  },
};

export const laterUnavailable = {
  en: '"Add later" means you will attach a file in a future step of a real service. "Unavailable" means you do not have that file. Neither option is judged here.',
  fi: '"Lisään myöhemmin" tarkoittaa, että liittäisit tiedoston myöhemmin. "Ei ole" tarkoittaa, ettei tiedostoa ole. Kumpaakaan ei arvioida tässä.',
  sv: '"Lägg till senare" betyder att du skulle bifoga filen senare. "Saknas" betyder att du inte har filen. Ingen av dem bedöms här.',
};
