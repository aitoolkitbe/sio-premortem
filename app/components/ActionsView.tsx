'use client';

import { useState } from 'react';
import type {
  ActieResultaat,
  ActieType,
  AnalysisContext,
  AnalysisReport,
  LezerReactie,
  Persona,
  ToneOfVoice,
} from '@/lib/types';
import { LoadingStage } from './LoadingStage';
import { ACTIE_LOADING_MESSAGES } from '@/lib/loading-messages';
import { renderMarkdown } from '@/lib/markdown';

const ACTIE_META: { type: ActieType; titel: string; omschrijving: string }[] = [
  {
    type: 'herschreven_bericht',
    titel: 'Herschreven bericht',
    omschrijving:
      'Het volledige bericht herschreven op basis van de analyse, direct kopieerbaar.',
  },
  {
    type: 'talking_points',
    titel: 'Talking points voor leidinggevenden',
    omschrijving:
      'Wat ze moeten zeggen, wat ze moeten vermijden, en antwoorden op de top 5 vragen.',
  },
  {
    type: 'faq',
    titel: 'FAQ-document',
    omschrijving:
      'Antwoorden op de vragen die medewerkers daadwerkelijk stellen — inclusief de vragen die ze niet hardop stellen.',
  },
  {
    type: 'doelgroepversies',
    titel: 'Doelgroepversies',
    omschrijving:
      'Hetzelfde bericht herschreven per geselecteerde persona.',
  },
  {
    type: 'communicatieplan',
    titel: 'Communicatieplan',
    omschrijving:
      'Zeven contactmomenten over vier weken, met kanaal, afzender en timing per moment.',
  },
];

export function ActionsView({
  context,
  report,
  personas,
  reacties,
  toneOfVoice,
  acties,
  onUpdateTov,
  onAddActie,
  onRemoveActie,
}: {
  context: AnalysisContext;
  report: AnalysisReport;
  personas: Persona[];
  reacties: LezerReactie[];
  toneOfVoice: ToneOfVoice;
  acties: ActieResultaat[];
  onUpdateTov: (tov: ToneOfVoice) => void;
  onAddActie: (actie: ActieResultaat) => void;
  onRemoveActie: (type: ActieType) => void;
}) {
  const [busyType, setBusyType] = useState<ActieType | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(type: ActieType) {
    setBusyType(type);
    setError(null);
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          context,
          report,
          personas,
          reacties,
          toneOfVoice,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Fout' }));
        throw new Error(body.error || 'Actie mislukt');
      }
      const body = (await res.json()) as { actie: ActieResultaat };
      onAddActie(body.actie);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    } finally {
      setBusyType(null);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-2xl text-ink mb-2">Tone of voice</h2>
        <p className="text-sm text-ink-muted mb-5 max-w-prose">
          Geef de tone of voice van het bedrijf mee. Alle gegenereerde teksten
          hieronder (herschreven bericht, FAQ, talking points enz.) worden in
          die toon geschreven. Je kan een korte beschrijving ingeven en/of een
          voorbeeldtekst van de klant plakken.
        </p>

        <div className="card space-y-4">
          <div>
            <label
              htmlFor="tov-desc"
              className="block text-sm font-medium text-ink mb-1"
            >
              Beschrijving van de tone of voice
            </label>
            <textarea
              id="tov-desc"
              rows={3}
              maxLength={1200}
              value={toneOfVoice.beschrijving ?? ''}
              onChange={(e) =>
                onUpdateTov({ ...toneOfVoice, beschrijving: e.target.value })
              }
              placeholder="bv. Direct, warm, eerlijk. Geen jargon. Zinnen van max 18 woorden. Tutoyeert medewerkers. Past Vlaamse spreektaal toe waar het natuurlijk is."
              className="w-full rounded border border-paper-line bg-white px-3 py-2 text-ink font-sans focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="tov-sample"
              className="block text-sm font-medium text-ink mb-1"
            >
              Voorbeeldtekst (optioneel)
            </label>
            <textarea
              id="tov-sample"
              rows={5}
              maxLength={4000}
              value={toneOfVoice.voorbeeldtekst ?? ''}
              onChange={(e) =>
                onUpdateTov({ ...toneOfVoice, voorbeeldtekst: e.target.value })
              }
              placeholder="Plak hier een bestaand stuk tekst dat de toon goed weergeeft — een eerdere mail, een intranetbericht, een passage uit de stijlgids."
              className="w-full rounded border border-paper-line bg-white px-3 py-2 text-ink font-sans focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink mb-2">Deliverables</h2>
        <p className="text-sm text-ink-muted mb-5 max-w-prose">
          Vijf concrete stukken die je morgen kan inzetten. Kies per item
          wanneer je het wil genereren.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {ACTIE_META.map((meta) => {
            const existing = acties.find((a) => a.type === meta.type);
            const isBusy = busyType === meta.type;
            return (
              <div key={meta.type} className="card flex flex-col">
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-ink mb-1">
                    {meta.titel}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {meta.omschrijving}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => generate(meta.type)}
                    disabled={isBusy || busyType !== null}
                    className="rounded bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isBusy
                      ? 'Bezig…'
                      : existing
                        ? 'Opnieuw genereren'
                        : 'Genereer'}
                  </button>
                  {existing && (
                    <button
                      type="button"
                      onClick={() => onRemoveActie(meta.type)}
                      className="text-sm text-ink-muted hover:text-signal-risk"
                    >
                      Verwijder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-signal-risk">{error}</p>}
      </section>

      {busyType && (
        <LoadingStage
          messages={ACTIE_LOADING_MESSAGES}
          title="Deliverable opbouwen"
        />
      )}

      {acties.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-ink">Gegenereerde teksten</h2>
          {acties.map((a) => (
            <div key={a.type} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-ink">{a.titel}</h3>
                <CopyButton text={a.markdown} />
              </div>
              <div
                className="prose-pm max-w-none text-[15px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(a.markdown) }}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs rounded border border-paper-line px-3 py-1 hover:border-ink-muted"
    >
      {copied ? 'Gekopieerd ✓' : 'Kopieer markdown'}
    </button>
  );
}
