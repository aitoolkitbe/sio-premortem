'use client';

import { useState } from 'react';
import type {
  AnalysisContext,
  AnalysisReport,
  LezerReactie,
  OrgType,
  Persona,
} from '@/lib/types';
import { PersonaPicker } from './PersonaPicker';
import { LoadingStage } from './LoadingStage';
import { PERSONA_LOADING_MESSAGES } from '@/lib/loading-messages';

export function PersonasView({
  orgType,
  context,
  report,
  selectedPersonas,
  reacties,
  onUpdateSelection,
  onUpdateReacties,
}: {
  orgType: OrgType;
  context: AnalysisContext;
  report: AnalysisReport;
  selectedPersonas: Persona[];
  reacties: LezerReactie[];
  onUpdateSelection: (personas: Persona[]) => void;
  onUpdateReacties: (reacties: LezerReactie[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(p: Persona) {
    const exists = selectedPersonas.some((x) => x.id === p.id);
    const next = exists
      ? selectedPersonas.filter((x) => x.id !== p.id)
      : [...selectedPersonas, p];
    onUpdateSelection(next);
  }
  function addCustom(p: Persona) {
    onUpdateSelection([...selectedPersonas, p]);
  }
  function removeCustom(id: string) {
    onUpdateSelection(selectedPersonas.filter((x) => x.id !== id));
    onUpdateReacties(reacties.filter((r) => r.personaId !== id));
  }

  async function generate() {
    if (selectedPersonas.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          report,
          personas: selectedPersonas,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Fout' }));
        throw new Error(body.error || 'Persona-call mislukt');
      }
      const body = (await res.json()) as { reacties: LezerReactie[] };
      onUpdateReacties(body.reacties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-ink mb-2">Doelgroepen kiezen</h2>
        <p className="text-sm text-ink-muted max-w-prose">
          Selecteer de doelgroepen voor wie je wil weten hoe dit bericht zal
          landen. Je krijgt per persona hoe ze lezen, wat ze denken, wat ze
          voelen en wat ze doen.
        </p>
      </div>

      <PersonaPicker
        orgType={orgType}
        selected={selectedPersonas}
        onToggle={toggle}
        onAddCustom={addCustom}
        onRemoveCustom={removeCustom}
        disabled={busy}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={busy || selectedPersonas.length === 0}
          className="rounded bg-ink text-paper px-5 py-2.5 font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {reacties.length > 0
            ? 'Lezersreacties opnieuw genereren'
            : 'Genereer lezersreacties'}
        </button>
        <span className="text-sm text-ink-muted">
          {selectedPersonas.length} persona
          {selectedPersonas.length === 1 ? '' : "'s"} geselecteerd
        </span>
      </div>
      {error && <p className="text-sm text-signal-risk">{error}</p>}

      {busy && <LoadingStage messages={PERSONA_LOADING_MESSAGES} title="Lezersreacties opbouwen" />}

      {!busy && reacties.length > 0 && (
        <div className="space-y-5">
          <h3 className="font-serif text-xl text-ink">Lezersreacties</h3>
          {reacties.map((r) => (
            <div key={r.personaId} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-serif text-lg text-ink">
                    {r.personaNaam}
                  </div>
                </div>
                <span className="text-[11px] uppercase tracking-wide rounded-full bg-paper-soft border border-paper-line px-2 py-0.5 text-ink-muted">
                  ADKAR: {r.adkarBarriere}
                </span>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <Block label="Leest" text={r.leest} />
                <Block label="Denkt" text={`"${r.denkt}"`} italic />
                <Block label="Voelt" text={r.voelt} />
                <Block label="Doet" text={r.doet} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Block({
  label,
  text,
  italic,
}: {
  label: string;
  text: string;
  italic?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
        {label}
      </div>
      <div className={`text-ink leading-relaxed ${italic ? 'italic' : ''}`}>
        {text}
      </div>
    </div>
  );
}
