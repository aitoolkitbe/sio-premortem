'use client';

import { useState } from 'react';
import type {
  Aanleiding,
  AnalysisContext,
  OrgType,
  Veranderhistorie,
} from '@/lib/types';

const ORG_TYPES: { value: OrgType; label: string }[] = [
  { value: 'productie', label: 'Productie / industrie' },
  { value: 'dienstverlening', label: 'Dienstverlening' },
  { value: 'overheid', label: 'Overheid / publieke sector' },
  { value: 'zorg', label: 'Zorg' },
  { value: 'retail', label: 'Retail' },
  { value: 'tech', label: 'Tech / scale-up' },
];

const AANLEIDINGEN: { value: Aanleiding; label: string }[] = [
  { value: 'reorganisatie', label: 'Reorganisatie' },
  { value: 'fusie', label: 'Fusie of overname' },
  { value: 'strategie', label: 'Strategiewijziging' },
  { value: 'ontslag', label: 'Ontslagronde' },
  { value: 'beleid', label: 'Nieuw beleid' },
  { value: 'crisis', label: 'Crisis' },
  { value: 'cultuur', label: 'Cultuurverandering' },
  { value: 'leiderschap', label: 'Leiderschapswissel' },
];

const HISTORIEN: { value: Veranderhistorie; label: string; hint: string }[] = [
  {
    value: 'eerste',
    label: 'Eerste keer',
    hint: 'Medewerkers zijn dit type verandering niet gewend.',
  },
  {
    value: 'tweede_derde',
    label: 'Tweede of derde keer',
    hint: 'Medewerkers herkennen het patroon.',
  },
  {
    value: 'zoveelste',
    label: 'De zoveelste',
    hint: 'Urgency fatigue en cynisme spelen zwaar mee.',
  },
];

export function LandingForm({
  onSubmit,
  busy,
}: {
  onSubmit: (ctx: AnalysisContext) => void;
  busy: boolean;
}) {
  const [bericht, setBericht] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('productie');
  const [aanleiding, setAanleiding] = useState<Aanleiding>('reorganisatie');
  const [veranderhistorie, setVeranderhistorie] =
    useState<Veranderhistorie>('tweede_derde');

  const canSubmit = bericht.trim().length >= 40;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ bericht: bericht.trim(), orgType, aanleiding, veranderhistorie });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label
          htmlFor="bericht"
          className="block text-sm font-medium text-ink mb-2"
        >
          Het bericht
        </label>
        <textarea
          id="bericht"
          rows={14}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          placeholder="Plak hier het interne bericht dat je wil testen. Een mail, een intranet-post, een aankondiging…"
          className="w-full rounded border border-paper-line bg-white px-4 py-3 text-ink font-sans focus:outline-none focus:border-accent"
          required
          minLength={40}
          maxLength={10000}
        />
        <p className="mt-1 text-xs text-ink-muted">
          {bericht.length} tekens · min. 40 · max. 10 000
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="org"
            className="block text-sm font-medium text-ink mb-2"
          >
            Type organisatie
          </label>
          <select
            id="org"
            value={orgType}
            onChange={(e) => setOrgType(e.target.value as OrgType)}
            className="w-full rounded border border-paper-line bg-white px-3 py-2"
          >
            {ORG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="aan"
            className="block text-sm font-medium text-ink mb-2"
          >
            Aanleiding
          </label>
          <select
            id="aan"
            value={aanleiding}
            onChange={(e) => setAanleiding(e.target.value as Aanleiding)}
            className="w-full rounded border border-paper-line bg-white px-3 py-2"
          >
            {AANLEIDINGEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Veranderhistorie
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          {HISTORIEN.map((h) => {
            const active = veranderhistorie === h.value;
            return (
              <button
                key={h.value}
                type="button"
                onClick={() => setVeranderhistorie(h.value)}
                className={`text-left rounded border px-4 py-3 transition-colors ${
                  active
                    ? 'border-accent bg-accent/5'
                    : 'border-paper-line hover:border-ink-muted'
                }`}
              >
                <div className="font-medium text-sm text-ink">{h.label}</div>
                <div className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {h.hint}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit || busy}
          className="rounded bg-ink text-paper px-6 py-3 font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {busy ? 'Analyse loopt…' : 'Start de Pre-mortem'}
        </button>
        <p className="mt-3 text-xs text-ink-muted">
          De analyse duurt doorgaans 20 tot 45 seconden.
        </p>
      </div>
    </form>
  );
}
