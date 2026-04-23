'use client';

import { useEffect, useState } from 'react';

/**
 * Laadscherm met positieve/neutrale terminologie.
 * Cycelt door een lijst berichten terwijl de API-call draait.
 * Vervangt eerdere "wandelgangen afluisteren"-achtige formuleringen.
 */
export function LoadingStage({
  messages,
  title = 'Bezig met analyseren',
}: {
  messages: readonly string[];
  title?: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length);
    }, 2800);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-paper-line" />
        <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
      <h2 className="font-serif text-xl text-ink mb-2">{title}</h2>
      <p className="text-sm text-ink-muted min-h-[1.5rem] transition-opacity">
        {messages[idx]}…
      </p>
      <ul className="mt-8 space-y-1.5 text-xs text-ink-muted/70">
        {messages.map((m, i) => (
          <li
            key={m}
            className={
              i <= idx
                ? 'opacity-100 transition-opacity'
                : 'opacity-30 transition-opacity'
            }
          >
            {i <= idx ? '✓' : '·'} {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
