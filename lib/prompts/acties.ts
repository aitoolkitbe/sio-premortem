import type {
  ActieType,
  AnalysisContext,
  AnalysisReport,
  LezerReactie,
  Persona,
  ToneOfVoice,
} from '../types';
import { KENNISBASIS_PROMPT } from './kennisbasis';

/**
 * Prompts voor de vijf deliverables uit de acties-skill.
 * Elke actie krijgt de tone of voice van de klant meegemoogd (optioneel).
 */

interface ActieInput {
  context: AnalysisContext;
  report: AnalysisReport;
  personas: Persona[];
  reacties: LezerReactie[];
  toneOfVoice: ToneOfVoice;
}

const TOV_BLOCK = (tov: ToneOfVoice): string => {
  const parts: string[] = [];
  if (tov.beschrijving && tov.beschrijving.trim().length > 0) {
    parts.push(`**Beschrijving van de gewenste tone of voice:**\n${tov.beschrijving.trim()}`);
  }
  if (tov.voorbeeldtekst && tov.voorbeeldtekst.trim().length > 0) {
    parts.push(
      `**Voorbeeldtekst van de klant (dezelfde toon aanhouden):**\n"""\n${tov.voorbeeldtekst.trim()}\n"""`,
    );
  }
  if (parts.length === 0) {
    return `Geen specifieke tone of voice opgegeven. Schrijf in een warme, directe Vlaams-Nederlandse registertoon, zoals een menselijke collega dat zou doen.`;
  }
  return parts.join('\n\n');
};

const CONTEXT_BLOCK = (input: ActieInput): string => `## Context

- Type organisatie: ${input.context.orgType}
- Aanleiding: ${input.context.aanleiding}
- Veranderhistorie: ${input.context.veranderhistorie}

## Originele bericht

"""
${input.context.bericht}
"""

## Samenvatting van de Pre-mortem

- Landingsscore: ${input.report.samenvatting.landingsscore}/10
- Bridges-fase: ${input.report.samenvatting.bridgesFase}
- ADKAR-barrière: ${input.report.samenvatting.adkarBarriere}
- Grootste risico: ${input.report.samenvatting.grootsteRisico}
- Kernadvies: ${input.report.samenvatting.kernadvies}
- Wandelgangversie: "${input.report.wandelgangversie}"

## Geselecteerde persona's

${input.personas.map((p) => `- ${p.naam} — ${p.context}`).join('\n')}

${input.reacties.length > 0 ? `## Persona-reacties (samengevat)\n\n${input.reacties.map((r) => `- ${r.personaNaam} denkt: "${r.denkt}" — voelt: ${r.voelt}`).join('\n')}` : ''}

## Tone of voice

${TOV_BLOCK(input.toneOfVoice)}`;

const OUTPUT_REGELS = `## Outputregels

- Lever platte markdown. GEEN JSON, geen codeblokken eromheen, geen toelichting boven of onder.
- Vlaams Nederlands. Direct, warm, concreet.
- Volg de opgegeven tone of voice: registertoon, ritme, woordkeuze.
- Direct kopieerbaar: een IC-professional moet deze tekst morgen kunnen gebruiken zonder aanpassing.
- Onderbouwd door de analyse. Geen generieke adviezen.`;

function buildHerschreven(input: ActieInput) {
  const system = `${KENNISBASIS_PROMPT}\n## Je taak nu\n\nHerschrijf het interne bericht volledig, op basis van de Pre-mortem analyse en in de opgegeven tone of voice.\n\n### Regels voor het herschreven bericht\n\n- Open met wat de lezer herkent, niet met wat de organisatie besloten heeft (serial position: eerste 2 zinnen bepalen de interpretatie).\n- Erken verliezen voordat je over winsten spreekt (Bridges Ending-fase, loss aversion).\n- Vermijd dwingende taal die autonomie bedreigt (reactantie).\n- Beantwoord de WIIFM-vraag per doelgroep.\n- Eindig met een concrete, haalbare actie of uitnodiging (recency effect).\n- Maximaal 250 woorden.\n- Voeg geen kopjes toe tenzij het oorspronkelijke bericht er ook had.\n\n${OUTPUT_REGELS}`;
  const user = `${CONTEXT_BLOCK(input)}\n\nLever nu het herschreven bericht in platte markdown.`;
  return { system, user };
}

function buildTalkingPoints(input: ActieInput) {
  const system = `${KENNISBASIS_PROMPT}\n## Je taak nu\n\nLever talking points voor leidinggevenden. Zij krijgen morgen de vragen en hebben geen analyse nodig — ze hebben zinnen nodig die ze letterlijk kunnen zeggen.\n\n### Structuur (gebruik exact deze koppen)\n\n1. **De kernboodschap in één zin**\n2. **Drie dingen die je kunt zeggen** — concrete, menselijke zinnen. Eerlijk, empathisch, concreet.\n3. **Drie dingen die je moet vermijden** — per zin: de formulering + waarom problematisch.\n4. **Antwoorden op de top 5 vragen** — gebouwd op de verwachte vervolgvragen uit de analyse. Kort, eerlijk. Als het antwoord "dat weet ik nog niet" is, formuleer dat zo dat vertrouwen bewaard blijft.\n5. **Als iemand boos wordt** — één alinea over omgaan met emotionele reacties. Niet sussen, niet negeren, wel erkennen.\n\nLeesbaar in 3 minuten. Geen jargon, geen theorie.\n\n${OUTPUT_REGELS}`;
  const user = `${CONTEXT_BLOCK(input)}\n\nLever nu de talking points in platte markdown.`;
  return { system, user };
}

function buildFaq(input: ActieInput) {
  const system = `${KENNISBASIS_PROMPT}\n## Je taak nu\n\nMaak een FAQ-document met de vragen die medewerkers daadwerkelijk stellen — niet de vragen die management wíl beantwoorden.\n\n### Regels\n\n- 8 tot 10 vragen in spreektaal.\n- Op volgorde van urgentie: de vraag die het eerst komt, staat eerst.\n- Antwoorden: 2-4 zinnen, eerlijk, concreet.\n- Als het antwoord "dat weten we nog niet" is, zeg dat — maar geef aan wanneer er meer info komt.\n- Voeg 2-3 vragen toe die medewerkers niet hardop stellen maar wel denken. Beantwoord die ook expliciet.\n- Sluit af met één regel: waar medewerkers terecht kunnen met vragen.\n\nFormat: vraag als H3 (### ), antwoord daaronder als gewone alinea. Geen nummering.\n\n${OUTPUT_REGELS}`;
  const user = `${CONTEXT_BLOCK(input)}\n\nLever nu het FAQ-document in platte markdown.`;
  return { system, user };
}

function buildDoelgroepversies(input: ActieInput) {
  const system = `${KENNISBASIS_PROMPT}\n## Je taak nu\n\nHerschrijf het bericht per geselecteerde persona. De verpleegkundige leest anders dan de arts. De productiewerker anders dan het middenkader.\n\n### Regels per versie\n\n- Naam van de doelgroep als H2 (## ).\n- Maximaal 150 woorden per versie.\n- Afgestemd op: leesmoment, ADKAR-barrière, taalniveau, specifieke angsten, en specifieke vragen van deze persona.\n- De kernboodschap blijft identiek. De framing, het taalniveau, de voorbeelden en de WIIFM-beantwoording veranderen.\n- Elke versie moet aanvoelen alsof het persoonlijk voor die doelgroep geschreven is.\n\n${OUTPUT_REGELS}`;
  const user = `${CONTEXT_BLOCK(input)}\n\nLever nu alle doelgroepversies in platte markdown, per persona één H2-sectie.`;
  return { system, user };
}

function buildCommunicatieplan(input: ActieInput) {
  const system = `${KENNISBASIS_PROMPT}\n## Je taak nu\n\nMaak een communicatieplan gebaseerd op de Rule of 7. Het bericht is geen eenmalige actie maar de start van een reeks.\n\n### Structuur (gebruik exact deze koppen)\n\n## Voorbereiding\n\n- **Tone of voice** — één zin over de gewenste toon\n- **Kernboodschappen per doelgroep** — in spreektaal, max 2 zinnen per doelgroep\n- **Checklist voor moment 1** — minstens 5 items die klaar moeten staan\n\n## Zeven communicatiemomenten (verspreid over 4 weken)\n\nPer moment een H3 met nummer + naam (bv. "### Moment 1 — De Aankondiging"). Onder elk moment:\n\n- **Wanneer** (week, dag, tijdstip)\n- **Kanaal** (varieer: meeting, mail, video, poster, teamoverleg, brief, individueel gesprek, intranet, werkplekbezoek)\n- **Afzender** (varieer volgens Prosci: business van senior leiders, persoonlijke impact van directe leidinggevende)\n- **Doel** (1 zin)\n- **Boodschap** (2-3 zinnen)\n- **Acties** (concrete vervolgacties)\n\nMoment 1 is ALTIJD face-to-face. Nooit per mail.\n\n## Risico's en mitigatie (minstens 4)\n\nPer risico:\n- Het risico (kort en concreet)\n- De mitigatie (concrete tegenmaatregel)\n- Prioriteit: hoog / middel\n\nOverzichtelijk, scanbaar, direct bruikbaar als werkdocument.\n\n${OUTPUT_REGELS}`;
  const user = `${CONTEXT_BLOCK(input)}\n\nLever nu het volledige communicatieplan in platte markdown.`;
  return { system, user };
}

export const ACTIE_TITELS: Record<ActieType, string> = {
  herschreven_bericht: 'Herschreven bericht',
  talking_points: 'Talking points voor leidinggevenden',
  faq: 'FAQ-document',
  doelgroepversies: 'Doelgroepversies',
  communicatieplan: 'Communicatieplan',
};

export function buildActieMessages(
  type: ActieType,
  input: ActieInput,
): { system: string; user: string } {
  switch (type) {
    case 'herschreven_bericht':
      return buildHerschreven(input);
    case 'talking_points':
      return buildTalkingPoints(input);
    case 'faq':
      return buildFaq(input);
    case 'doelgroepversies':
      return buildDoelgroepversies(input);
    case 'communicatieplan':
      return buildCommunicatieplan(input);
  }
}
