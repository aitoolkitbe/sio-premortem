'use client';

import { useState } from 'react';
import { BrandMark } from './Brand';

export function Gate({ onUnlocked }: { onUnlocked: () => void }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Fout' }));
        setError(body.error || 'Wachtwoord klopt niet.');
        return;
      }
      onUnlocked();
    } catch {
      setError('Netwerkfout. Probeer opnieuw.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <BrandMark size="lg" />
        </div>
        <form onSubmit={submit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1" htmlFor="pw">
              Wachtwoord
            </label>
            <input
              id="pw"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-paper-line bg-paper px-3 py-2 text-ink focus:outline-none focus:border-accent"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-signal-risk" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded bg-ink text-paper py-2.5 font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? 'Controleren…' : 'Open de tool'}
          </button>
        </form>
        <p className="mt-6 text-xs text-ink-muted text-center leading-relaxed">
          Toegang tot De Pre-mortem is beperkt tot leden van Studio Inside Out
          en uitgenodigde klanten. Vraag het wachtwoord bij je SIO-contact.
        </p>
      </div>
    </div>
  );
}
