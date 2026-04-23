import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookieName, isValidSession } from './lib/auth';

/**
 * Middleware: alleen ingelogde sessies mogen /workbench en /api/* gebruiken.
 * /api/auth is uitgezonderd — dat is de login-endpoint zelf.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = req.cookies.get(getCookieName())?.value;
  if (await isValidSession(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Niet geautoriseerd. Log eerst in.' },
      { status: 401 },
    );
  }

  // Voor pagina's: terug naar de login (homepage).
  const loginUrl = new URL('/', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/workbench/:path*',
    '/api/analyse',
    '/api/personas',
    '/api/action',
  ],
};
