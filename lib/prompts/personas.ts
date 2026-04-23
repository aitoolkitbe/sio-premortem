import type {
  AnalysisContext,
  AnalysisReport,
  Persona,
} from '../types';
import { KENNISBASIS_PROMPT } from './kennisbasis';

const PERSONA_INSTRUCTIONS = `
## Je taak nu

Voor de geselecteerde persona's lever je per persona hoe ze dit bericht LEZEN, DENKEN, VOELEN en DOEN. Dit zijn geen analyses — dit zijn de gedachten van echte mensen in een echte werksituatie, in eerste persoon, rauw en eerlijk.

Lever één enkel JSON-object met een "reacties" array. Geen inleiding, geen markdown-codeblok. Alleen valide JSON.

### JSON-schema

{
  "reacties": [
    {
      "personaId": string (overneem exact van de input),
      "personaNaam": string (overneem exact van de input),
      "leest": string (HOE deze persoon het bericht fysiek ontvangt: kanaal, tijdstip, omgeving. Concreet.),
      "denkt": string (eerste persoon, rauw, eerlijk. Wat gaat er letterlijk door hun hoofd. 2-4 zinnen. Gebruik spreektaal van deze persoon. GEEN analyses of mechanismen — alleen de stem.),
      "voelt": string (dominante emotie + welk mechanisme uit de kennisbasis actief is, in max 2 zinnen),
      "doet": string (concrete actie na het lezen — praktisch, observeerbaar),
      "adkarBarriere": "Awareness" | "Desire" | "Knowledge" | "Ability" | "Reinforcement"
    }
  ]
}

### Regels

- De "denkt"-sectie klinkt als een echte medewerker, niet als een rapport. Eerste persoon. Geen corporate taal, tenzij de persona die zelf gebruikt.
- Variatie is belangrijk: de verpleegkundige klinkt anders dan de arts. De productiewerker anders dan het middenkader.
- Verwerk de aangegeven context (leesmoment, taalniveau, angsten) expliciet in de reactie.
- Verbind elke reactie aan een mechanisme uit de kennisbasis (reactantie, loss aversion, contractbreuk, cognitieve overload, urgency fatigue, enz.), maar verwoord dat pas in "voelt", niet in "denkt".
`;

export function buildPersonaMessages(
  ctx: AnalysisContext,
  report: AnalysisReport,
  personas: Persona[],
): { system: string; user: string } {
  const system = `${KENNISBASIS_PROMPT}\n${PERSONA_INSTRUCTIONS}`;

  const personaJson = JSON.stringify(personas, null, 2);

  const user = `## Context

- Type organisatie: ${ctx.orgType}
- Aanleiding: ${ctx.aanleiding}
- Veranderhistorie: ${ctx.veranderhistorie}

## Het bericht

"""
${ctx.bericht}
"""

## Samenvatting uit de Pre-mortem analyse

- Landingsscore: ${report.samenvatting.landingsscore}/10
- Bridges-fase doelgroep: ${report.samenvatting.bridgesFase}
- ADKAR-barrière: ${report.samenvatting.adkarBarriere}
- Grootste risico: ${report.samenvatting.grootsteRisico}
- Wandelgangversie: "${report.wandelgangversie}"

## Persona's

${personaJson}

Lever nu het JSON-object met "reacties" voor elke persona. Niets meer, niets minder.`;

  return { system, user };
}
