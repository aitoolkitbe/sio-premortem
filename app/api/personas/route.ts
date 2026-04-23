import { NextResponse } from 'next/server';
import { extractJson, textComplete } from '@/lib/anthropic';
import { buildPersonaMessages } from '@/lib/prompts/personas';
import { rateLimit } from '@/lib/rate-limit';
import type {
  AnalysisContext,
  AnalysisReport,
  LezerReactie,
  Persona,
} from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface PersonaBody {
  context: AnalysisContext;
  report: AnalysisReport;
  personas: Persona[];
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const rl = rateLimit(`personas:${ip}`, 30, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Te veel persona-calls in een uur.' },
      { status: 429 },
    );
  }

  let body: PersonaBody;
  try {
    body = (await req.json()) as PersonaBody;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!body?.personas || body.personas.length === 0) {
    return NextResponse.json(
      { error: 'Kies minstens één persona.' },
      { status: 400 },
    );
  }
  if (body.personas.length > 8) {
    return NextResponse.json(
      { error: 'Maximum 8 persona\'s per call.' },
      { status: 400 },
    );
  }

  try {
    const { system, user } = buildPersonaMessages(
      body.context,
      body.report,
      body.personas,
    );
    const raw = await textComplete({ system, user, maxTokens: 4096, temperature: 0.6 });
    const parsed = extractJson<{ reacties: LezerReactie[] }>(raw);
    return NextResponse.json({ reacties: parsed.reacties });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Onbekende fout';
    console.error('[api/personas]', msg);
    return NextResponse.json(
      { error: `Persona-analyse mislukt: ${msg}` },
      { status: 500 },
    );
  }
}
