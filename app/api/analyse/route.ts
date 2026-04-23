import { NextResponse } from 'next/server';
import { extractJson, textComplete } from '@/lib/anthropic';
import { buildAnalysisMessages } from '@/lib/prompts/analyse';
import { rateLimit } from '@/lib/rate-limit';
import type { AnalysisContext, AnalysisReport } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel: tot 60s voor Pro-accounts

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const rl = rateLimit(`analyse:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Te veel analyses in een uur. Probeer later opnieuw.' },
      { status: 429 },
    );
  }

  let body: AnalysisContext;
  try {
    body = (await req.json()) as AnalysisContext;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!body?.bericht || body.bericht.trim().length < 40) {
    return NextResponse.json(
      { error: 'Geef minstens één volledig bericht op (40 tekens of meer).' },
      { status: 400 },
    );
  }
  if (body.bericht.length > 10_000) {
    return NextResponse.json(
      { error: 'Bericht te lang (max 10 000 tekens).' },
      { status: 400 },
    );
  }

  try {
    const { system, user } = buildAnalysisMessages(body);
    const raw = await textComplete({ system, user, maxTokens: 4096, temperature: 0.4 });
    const report = extractJson<AnalysisReport>(raw);
    return NextResponse.json({ report });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Onbekende fout';
    console.error('[api/analyse]', msg);
    return NextResponse.json(
      { error: `Analyse mislukt: ${msg}` },
      { status: 500 },
    );
  }
}
