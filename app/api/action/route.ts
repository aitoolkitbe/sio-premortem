import { NextResponse } from 'next/server';
import { textComplete } from '@/lib/anthropic';
import { ACTIE_TITELS, buildActieMessages } from '@/lib/prompts/acties';
import { rateLimit } from '@/lib/rate-limit';
import type {
  ActieType,
  AnalysisContext,
  AnalysisReport,
  LezerReactie,
  Persona,
  ToneOfVoice,
} from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ActionBody {
  type: ActieType;
  context: AnalysisContext;
  report: AnalysisReport;
  personas: Persona[];
  reacties: LezerReactie[];
  toneOfVoice: ToneOfVoice;
}

const VALID_TYPES: ActieType[] = [
  'herschreven_bericht',
  'talking_points',
  'faq',
  'doelgroepversies',
  'communicatieplan',
];

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const rl = rateLimit(`action:${ip}`, 40, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Te veel actie-calls in een uur.' },
      { status: 429 },
    );
  }

  let body: ActionBody;
  try {
    body = (await req.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!VALID_TYPES.includes(body.type)) {
    return NextResponse.json({ error: 'Onbekend actietype.' }, { status: 400 });
  }

  try {
    const { system, user } = buildActieMessages(body.type, {
      context: body.context,
      report: body.report,
      personas: body.personas,
      reacties: body.reacties,
      toneOfVoice: body.toneOfVoice,
    });
    const markdown = await textComplete({
      system,
      user,
      maxTokens: 4096,
      temperature: 0.5,
    });
    return NextResponse.json({
      actie: {
        type: body.type,
        titel: ACTIE_TITELS[body.type],
        markdown,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Onbekende fout';
    console.error('[api/action]', msg);
    return NextResponse.json(
      { error: `Actie mislukt: ${msg}` },
      { status: 500 },
    );
  }
}
