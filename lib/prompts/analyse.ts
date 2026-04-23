import type { AnalysisContext } from '../types';
import { KENNISBASIS_PROMPT } from './kennisbasis';

/**
 * Eerste call: levert een volledige vier-lagen diagnose zonder persona-reacties.
 * Persona-reacties gaan in een tweede call wanneer de gebruiker persona's gekozen heeft.
 */

const ANALYSE_INSTRUCTIONS = `
## Je taak nu

Analyseer het onderstaande interne bericht volgens het vier-lagen kader. Lever één enkel JSON-object in het exacte schema hieronder. Geen inleiding, geen uitleiding, geen markdown-codeblokken. Alleen valide JSON.

### JSON-schema

{
  "samenvatting": {
    "landingsscore": number (0-10, streng: 3-6 is normaal),
    "bridgesFase": "Ending" | "Neutral Zone" | "New Beginning",
    "adkarBarriere": "Awareness" | "Desire" | "Knowledge" | "Ability" | "Reinforcement",
    "grootsteRisico": string (één zin),
    "kernadvies": string (2-3 zinnen)
  },
  "wandelgangversie": string (de koffieautomaat-versie — in spreektaal, kort, mogelijk vervormd, zoals medewerkers het morgen aan elkaar zullen navertellen. Gebruik citaat-achtige spreektaal.),
  "probleemZinnen": [
    {
      "zin": string (exact citaat uit het bericht),
      "mechanisme": "Reactantie" | "Loss aversion" | "Contractbreuk" | "Cognitieve overload" | "Framing" | "Urgency fatigue" | "Afzender-mismatch" | "Serial position",
      "risico": "hoog" | "middel" | "laag",
      "toelichting": string (waarom problematisch, met verwijzing naar mechanisme),
      "wieRaaktHet": string (welke doelgroep(en) het hardst geraakt)
    }
    // MINSTENS 4 items
  ],
  "vervolgVragen": [
    {
      "vraag": string (in spreektaal, zoals echt gesteld),
      "wie": string (welk type medewerker),
      "wanneer": string (direct / de dag erna / bij de koffieautomaat / in teamoverleg / bij de vakbond),
      "waaromOnbeantwoord": string (waarom het bericht deze vraag niet beantwoordt)
    }
    // MINSTENS 5 items
  ],
  "herschrijfSuggesties": [
    {
      "origineel": string (zin uit het bericht),
      "suggestie": string (betere versie),
      "waarom": string (welk probleem opgelost + welk mechanisme)
    }
    // MINSTENS 3 items
  ]
}

### Regels

- Spreektaal waar het past (wandelgangversie, vervolgvragen).
- Gemeten taal waar het past (samenvatting, toelichting).
- Weeg de veranderhistorie zwaar mee: bij "de zoveelste verandering" krijgt urgency fatigue meer gewicht.
- Bij een overheidscontext: vakbondsreflex en procedure-gevoeligheid meenemen.
- Bij zorg/productie: taalniveau en fysiek leesmoment meenemen.
- Geen algemeenheden. Elke diagnose verwijst naar een mechanisme of onderzoeksresultaat.
`;

export function buildAnalysisMessages(ctx: AnalysisContext): {
  system: string;
  user: string;
} {
  const historyLabel: Record<typeof ctx.veranderhistorie, string> = {
    eerste: 'Eerste verandering van dit type in deze organisatie.',
    tweede_derde: 'Tweede of derde verandering van dit type — medewerkers herkennen het patroon.',
    zoveelste:
      'De zoveelste verandering — urgency fatigue en organisatiecynisme spelen zwaar mee.',
  };

  const system = `${KENNISBASIS_PROMPT}\n${ANALYSE_INSTRUCTIONS}`;

  const user = `## Context

- Type organisatie: ${ctx.orgType}
- Aanleiding: ${ctx.aanleiding}
- Veranderhistorie: ${historyLabel[ctx.veranderhistorie]}

## Het bericht

"""
${ctx.bericht}
"""

Lever nu het volledige JSON-object volgens het schema. Niets meer, niets minder.`;

  return { system, user };
}
