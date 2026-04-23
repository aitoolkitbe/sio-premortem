// Shared domain types voor De Pre-mortem.

export type OrgType =
  | 'productie'
  | 'dienstverlening'
  | 'overheid'
  | 'zorg'
  | 'retail'
  | 'tech';

export type Aanleiding =
  | 'reorganisatie'
  | 'fusie'
  | 'strategie'
  | 'ontslag'
  | 'beleid'
  | 'crisis'
  | 'cultuur'
  | 'leiderschap';

export type Veranderhistorie = 'eerste' | 'tweede_derde' | 'zoveelste';

export interface AnalysisContext {
  bericht: string;
  orgType: OrgType;
  aanleiding: Aanleiding;
  veranderhistorie: Veranderhistorie;
}

export type BridgesFase = 'Ending' | 'Neutral Zone' | 'New Beginning';
export type AdkarElement =
  | 'Awareness'
  | 'Desire'
  | 'Knowledge'
  | 'Ability'
  | 'Reinforcement';
export type RiskLevel = 'hoog' | 'middel' | 'laag';

export interface AnalysisSummary {
  landingsscore: number; // 0-10
  bridgesFase: BridgesFase;
  adkarBarriere: AdkarElement;
  grootsteRisico: string;
  kernadvies: string;
}

export interface ProbleemZin {
  zin: string;
  mechanisme: string; // reactantie / loss aversion / contractbreuk / cognitieve overload / framing / urgency fatigue
  risico: RiskLevel;
  toelichting: string;
  wieRaaktHet: string;
}

export interface VervolgVraag {
  vraag: string;
  wie: string;
  wanneer: string;
  waaromOnbeantwoord: string;
}

export interface HerschrijfSuggestie {
  origineel: string;
  suggestie: string;
  waarom: string;
}

export interface AnalysisReport {
  samenvatting: AnalysisSummary;
  wandelgangversie: string;
  probleemZinnen: ProbleemZin[];
  vervolgVragen: VervolgVraag[];
  herschrijfSuggesties: HerschrijfSuggestie[];
}

export interface Persona {
  id: string;           // slug
  naam: string;         // rol, bv. "Productiewerker"
  context: string;      // korte context
  leesmoment?: string;  // hoe/waar ze het bericht lezen
  taalniveau?: string;  // bv. B1
  angsten?: string;     // specifieke zorgen / trigger points
  isCustom?: boolean;
}

export interface LezerReactie {
  personaId: string;
  personaNaam: string;
  leest: string;
  denkt: string;
  voelt: string;
  doet: string;
  adkarBarriere: AdkarElement;
}

export type ActieType =
  | 'herschreven_bericht'
  | 'talking_points'
  | 'faq'
  | 'doelgroepversies'
  | 'communicatieplan';

export interface ToneOfVoice {
  beschrijving?: string;  // korte beschrijving
  voorbeeldtekst?: string; // optioneel: stukje brontekst van de klant
}

export interface ActieResultaat {
  type: ActieType;
  titel: string;
  markdown: string; // het volledige deliverable als markdown
}

export interface PreMortemState {
  context: AnalysisContext;
  report: AnalysisReport;
  personas: Persona[];            // geselecteerde persona's (standaard + custom)
  lezerReacties: LezerReactie[];  // reacties voor geselecteerde persona's
  toneOfVoice: ToneOfVoice;
  acties: ActieResultaat[];       // reeds gegenereerde deliverables
}
