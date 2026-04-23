import type { OrgType, Persona } from './types';

/**
 * Standaard persona-bibliotheek per organisatietype.
 * Komt rechtstreeks uit sio-premortem-kennisbasis (LAAG 5: Persona-bibliotheek).
 * Vier persona's per organisatietype, inclusief de relevante mechanismen
 * waar ze extra gevoelig voor zijn.
 */
export const STANDARD_PERSONAS: Record<OrgType, Persona[]> = {
  productie: [
    {
      id: 'prod_werker',
      naam: 'Productiewerker',
      context:
        'Ploegendienst. Leest mail zelden, hoort het via de ploegbaas. Taalniveau B1. Lange dienstverbanden. Fysiek werk, weinig schermtijd.',
      leesmoment: 'Via de ploegbaas, aan de koffieautomaat, niet per mail',
      taalniveau: 'B1',
      angsten:
        'Werkzekerheid, ploegensysteem, collega\'s, wat verandert er morgen concreet.',
    },
    {
      id: 'prod_teamleider',
      naam: 'Teamleider productie',
      context:
        'Eerste aanspreekpunt. Krijgt de vragen, heeft zelden de antwoorden. Klem tussen management en team.',
      leesmoment: 'Mail op kantoorpc, net voor de ploegwissel',
      angsten:
        'Als afzender opdraaien voor een boodschap die niet de hare is.',
    },
    {
      id: 'prod_hrbp',
      naam: 'HR business partner',
      context:
        'Vertaalt beleid naar de vloer. Kent individuele situaties. Weet welke vragen komen, mag ze niet altijd beantwoorden.',
      leesmoment: 'Vooraf ingelezen, moet nu mensen bijstaan',
      angsten:
        'Discretieplicht die botst met wat medewerkers van haar verwachten.',
    },
    {
      id: 'prod_middenkader',
      naam: 'Middenkader',
      context:
        'Druk van boven en beneden. Voert uit zonder inspraak. Langere dienstverbanden.',
      angsten:
        'Autonomieverlies, status binnen het bedrijf, relevantie.',
    },
  ],
  dienstverlening: [
    {
      id: 'dienst_consultant',
      naam: 'Consultant in het veld',
      context:
        'Zelden op kantoor. Smartphone. Identificeert zich met het vak, niet de organisatie.',
      leesmoment: 'Op de trein, tussen twee klanten door',
      angsten:
        'Belemmering van vakuitoefening, autonomie, bedrijfsbemoeienis.',
    },
    {
      id: 'dienst_office',
      naam: 'Office manager',
      context:
        'Informele informatiehub. Voelt temperatuur eerder dan management.',
      leesmoment: 'Aan haar bureau, meteen na de mailing',
      angsten:
        'Weet dingen die ze niet mag delen, moet vragen opvangen.',
    },
    {
      id: 'dienst_teamlead',
      naam: 'Teamlead',
      context:
        'Bliksemafleider voor frustratie. Heeft niet alle info.',
      angsten: 'Geloofwaardigheid bij team na eerdere veranderingen.',
    },
    {
      id: 'dienst_partner',
      naam: 'Senior partner',
      context:
        'Strategisch, leest tussen de lijnen. Gevoelig voor autonomieverlies, minder voor loss aversion.',
      angsten: 'Ongewenste controlelagen, interferentie.',
    },
  ],
  overheid: [
    {
      id: 'ov_ambtenaar',
      naam: 'Ambtenaar (statutair)',
      context:
        'Procedures en rechten. Sterk psychologisch contract rond werkzekerheid. Verandering = bedreiging.',
      leesmoment: 'Op kantoorpc, leest aandachtig, bewaart de mail',
      angsten:
        'Uitholling statuut, onrechtmatige procedure, verlies van verworven rechten.',
    },
    {
      id: 'ov_diensthoofd',
      naam: 'Diensthoofd',
      context:
        'Vertaalt beleid zonder gehoord te zijn. Klem tussen politiek en operationeel.',
      angsten:
        'Verantwoordelijk gehouden worden voor iets waar ze niet over beslist.',
    },
    {
      id: 'ov_vakbond',
      naam: 'Vakbondsafgevaardigde',
      context:
        'Zoekt wat er NIET gezegd wordt. Leest vanuit wantrouwen. Deelt interpretatie met achterban.',
      leesmoment: 'Leest heel nauwkeurig, deelt binnen het uur met achterban',
      angsten: 'Gemiste nuances die later tegen medewerkers worden gebruikt.',
    },
    {
      id: 'ov_nieuw',
      naam: 'Nieuwe medewerker (contractueel)',
      context:
        'Letterlijk, geen historische baggage, geen bescherming.',
      angsten: 'Contractverlenging, zichtbaarheid.',
    },
  ],
  zorg: [
    {
      id: 'zorg_verpleegk',
      naam: 'Verpleegkundige',
      context:
        'Geen tijd. Staand. Wil één ding weten: wat verandert er voor mij? Laag geduld voor corporate taal.',
      leesmoment: 'Tijdens overdracht, op telefoon, in 30 seconden',
      taalniveau: 'Direct en concreet',
      angsten: 'Extra administratie, werkdruk, patiëntenzorg in het gedrang.',
    },
    {
      id: 'zorg_afdhoofd',
      naam: 'Afdelingshoofd',
      context:
        'Geruststellen terwijl ze zelf ongerust zijn. Beschermend naar team, kritisch naar boven.',
      angsten: 'Bezetting, wachtlijst, personeelsuitval.',
    },
    {
      id: 'zorg_arts',
      naam: 'Arts',
      context:
        'Autonoom. Sceptisch. Sterk professionele identiteit. Heftig op autonomieverlies.',
      angsten: 'Managementinmenging in medische besluitvorming.',
    },
    {
      id: 'zorg_admin',
      naam: 'Administratief medewerker',
      context:
        'Voelt zich vergeten. Lager in hiërarchie, hoger gevoelig voor loss aversion.',
      angsten: 'Overbodig worden, niet meetellen.',
    },
  ],
  retail: [
    {
      id: 'retail_winkelm',
      naam: 'Winkelmedewerker',
      context:
        'Tussen twee klanten door. Geen laptop. Privé-smartphone of via filiaalmanager.',
      leesmoment: 'Op eigen smartphone of hoort het van de filiaalmanager',
      angsten: 'Uren, rooster, zekerheid.',
    },
    {
      id: 'retail_filiaal',
      naam: 'Filiaalmanager',
      context:
        'Moet morgen antwoorden. Heeft dezelfde vragen maar stelt ze niet.',
      angsten: 'Met een half bericht voor een team van 15 staan.',
    },
    {
      id: 'retail_regio',
      naam: 'Regiomanager',
      context:
        '15 filialen, één boodschap, 15 contexten.',
      angsten: 'Niet-uniforme uitvoering, grootste verschillen tussen filialen.',
    },
    {
      id: 'retail_hq',
      naam: 'Hoofdkantoor',
      context: 'Kent de cijfers, mist de winkelvloer.',
      angsten: 'Afstand tot de realiteit op de werkvloer.',
    },
  ],
  tech: [
    {
      id: 'tech_dev',
      naam: 'Developer',
      context:
        'Direct, sceptisch. Feiten, geen framing. Detecteert oneerlijkheid. Slack, niet mail.',
      leesmoment: 'Slack, scrolled door, reageert met emoji of niet',
      angsten:
        'Framing in plaats van feiten, corporate taal, inmenging in engineering.',
    },
    {
      id: 'tech_pm',
      naam: 'Product manager',
      context: 'Impact op roadmap en team.',
      angsten: 'Roadmap omgooien, team stabiliteit.',
    },
    {
      id: 'tech_people',
      naam: 'People lead',
      context: 'Empathie, mist soms harde feiten.',
      angsten: 'Onduidelijkheid die tot vertrek leidt.',
    },
    {
      id: 'tech_recent',
      naam: 'Recent aangeworven',
      context:
        'Kwam voor de belofte. Hoog gevoel van bedrog als die snel breekt.',
      angsten: 'Vertrouwen in de werkgever, "klopte het verhaal?"',
    },
  ],
};

export function listStandardPersonas(orgType: OrgType): Persona[] {
  return STANDARD_PERSONAS[orgType] ?? [];
}
