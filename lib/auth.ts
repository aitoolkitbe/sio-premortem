import { cookies } from 'next/headers';

/**
 * Lichtgewicht authenticatie:
 * - één gedeeld wachtwoord in env var ACCESS_PASSWORD
 * - na succesvolle check zetten we een ondertekende cookie
 * - middleware en routes controleren die cookie
 *
 * Voldoende voor een interne SIO-tool + klantdemo's.
 * Niet voor publiek high-trust gebruik.
 *
 * Implementatie via Web Crypto (globalThis.crypto.subtle) — werkt in
 * zowel Node.js runtime (API routes) als Edge runtime (middleware).
 */

const COOKIE_NAME = 'pm_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 uur

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ACCESS_PASSWORD ||
    'dev-only-insecure-secret'
  );
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const bytes = new Uint8Array(sigBuf);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ACCESS_PASSWORD || '';
  if (!expected) {
    // Geen wachtwoord geconfigureerd: blokkeren.
    return false;
  }
  return constantTimeEquals(expected, input);
}

export async function buildSessionCookie(): Promise<string> {
  const issued = Math.floor(Date.now() / 1000).toString();
  const payload = `v1.${issued}`;
  const sig = await hmacSha256Hex(getSecret(), payload);
  return `${payload}.${sig}`;
}

export async function isValidSession(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [version, issuedStr, sig] = parts;
  if (version !== 'v1') return false;
  const payload = `${version}.${issuedStr}`;
  const expectedSig = await hmacSha256Hex(getSecret(), payload);
  if (!constantTimeEquals(sig, expectedSig)) return false;
  const issued = parseInt(issuedStr, 10);
  if (Number.isNaN(issued)) return false;
  const ageSec = Math.floor(Date.now() / 1000) - issued;
  return ageSec >= 0 && ageSec <= SESSION_TTL_SECONDS;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}

export async function requireSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return isValidSession(token);
}
