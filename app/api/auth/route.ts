import { NextResponse } from 'next/server';
import {
  buildSessionCookie,
  getCookieName,
  getSessionMaxAge,
  verifyPassword,
} from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // Harde rem op brute-force pogingen
  const rl = rateLimit(`auth:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Te veel pogingen. Probeer later opnieuw.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  const password =
    typeof body === 'object' && body !== null && 'password' in body
      ? String((body as Record<string, unknown>).password)
      : '';

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { error: 'Wachtwoord klopt niet.' },
      { status: 401 },
    );
  }

  const token = await buildSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: getCookieName(),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: getSessionMaxAge(),
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: getCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
