import type { AnalysisContext } from '../types';
import { KENNISBASIS_PROMPT } from './kennisbasis';

/**
 * Eerste call: levert een volledige vier-lagen diagnose zonder persona-reacties.
 * Persona-reacties gaan in een tweede call wanneer de gebruiker persona's gekozen heeft.
 */

const ANALYSE_INSTRUCTIONS = `
## Je taak nu

Analyseer het onderstaande interne bericht volgens het vier-lagen kader. Lever één enkel JSON-object in het exacte schema hieronder. Geen inleiding, geen uitleiding, geen markdown-codeblokken. Alleen valide JSON.

### JSON-schema met STRIKTE lengtelimieten

{
  "samenvatting": {
    "landingsscore": number (0-10, streng: 3-6 is normaal),
    "bridgesFase": "Ending" | "Neutral Zone" | "New Beginning",
    "adkarBarriere": "Awareness" | "Desire" | "Knowledge" | "Ability" | "Reinforcement",
    "grootsteRisico": string (MAX 18 woorden, ÉÉN zin, concreet benoemd niet in metafoor),
    "kernadvies": string (MAX 30 woorden, MAX 2 zinnen, praktisch en uitvoerbaar)
  },
  "wandelgangversie": string (MAX 60 woorden. Spreektaal van een medewerker die het doorvertelt. Mag vervormd zijn.),
  "probleemZinnen": [
    {
      "zin": string (EXACT citaat uit het bericht, max 25 woorden — kort indien nodig),
      "mechanisme": "Reactantie" | "Loss aversion" | "Contractbreuk" | "Cognitieve overload" | "Framing" | "Urgency fatigue" | "Afzender-mismatch" | "Serial position",
      "risico": "hoog" | "middel" | "laag",
      "toelichting": string (MAX 20 woorden, ÉÉN zin. Benoem het probleem direct. Geen metafoor.),
      "wieRaaktHet": string (MAX 10 woorden, rolbenaming van doelgroep)
    }
    // 4 tot 5 items
  ],
  "vervolgVragen": [
    {
      "vraag": string (spreektaal, MAX 15 woorden, zoals echt gesteld),
      "wie": string (rolbenaming, MAX 8 woorden),
      "wanneer": string (MAX 8 woorden: bv. 'direct', 'morgen bij koffie', 'bij volgende vakbondsoverleg'),
      "waaromOnbeantwoord": string (MAX 18 woorden, ÉÉN zin, direct)
    }
    // 5 items exact
  ],
  "herschrijfSuggesties": [
    {
      "origineel": string (EXACTE zin uit het bericht),
      "suggestie": string (MAX 45 woorden, behoud registertoon van originele bericht),
      "waarom": string (MAX 20 woorden, ÉÉN zin. Benoem welk mechanisme opgelost wordt.)
    }
    // 3 items exact
  ]
}

### Regels

- De lengtelimieten zijn HARD. Overschrijding = herschrijf.
- Spreektaal waar het past (wandelgangversie, vervolgvragen).
- Gemeten taal waar het past (samenvatting, toelichting, waarom-velden).
- Pas de ANTI-SLOP REGELS uit de kennisbasis consequent toe. Elke toelichting scannen op verboden patronen voor je ze oplevert.
- Weeg de veranderhistorie zwaar mee: bij "de zoveelste verandering" krijgt urgency fatigue meer gewicht.
- Bij een overheidscontext: vakbondsreflex en procedure-gevoeligheid meenemen.
- Bij zorg/productie: taalniveau en fysiek leesmoment meenemen.
- Geen algemeenheden. Elke diagnose verwijst naar een mechanisme.

### Goede voorbeelden (zo wel)

- grootsteRisico: "Langdienstverbanders zien geen signaal dat hun rol na de transitie zekerheid krijgt."
- toelichting: "Het woord 'vastbesloten' sluit elke dialoog af voor ze begint."
- kernadvies: "Voeg één zin toe waarin Luc persoonlijk het team bedankt. Verplaats de 100-dagen-actielijst naar de openingsalinea."

### Slechte voorbeelden (NIET zo)

- grootsteRisico: "Medewerkers voelen zich buitengesloten — niet als deelnemers maar als toeschouwers." ← em-dash + contrast-formule verboden
- toelichting: "Het bericht zwijgt over continuïteit voor medewerkers. Dit triggert onbewust de vraag: 'Waarom worden partners genoemd en wij niet?' Het zwijgen is luider dan het zeggen." ← 'Het bericht' opening + vraag-in-citaat + proverbe = triple slop
- kernadvies: "Het bericht is technisch solide maar emotioneel afstandelijk." ← parallellisme verboden
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
