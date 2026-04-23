'use client';

import { useState } from 'react';
import type {
  ActieResultaat,
  ActieType,
  AnalysisContext,
  AnalysisReport,
  LezerReactie,
  Persona,
  PreMortemState,
  ToneOfVoice,
} from '@/lib/types';
import { LandingForm } from './LandingForm';
import { LoadingStage } from './LoadingStage';
import { AnalysisView } from './AnalysisView';
import { PersonasView } from './PersonasView';
import { ActionsView } from './ActionsView';
import { ReportView } from './ReportView';
import { BrandFooter, BrandMark } from './Brand';
import { ANALYSIS_LOADING_MESSAGES } from '@/lib/loading-messages';

type Tab = 'analyse' | 'personas' | 'acties' | 'rapport';

const TABS: { id: Tab; label: string }[] = [
  { id: 'analyse', label: 'Analyse' },
  { id: 'personas', label: "Persona's" },
  { id: 'acties', label: 'Acties' },
  { id: 'rapport', label: 'Rapport' },
];

export function Workbench() {
  const [context, setContext] = useState<AnalysisContext | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [reacties, setReacties] = useState<LezerReactie[]>([]);
  const [toneOfVoice, setToneOfVoice] = useState<ToneOfVoice>({});
  const [acties, setActies] = useState<ActieResultaat[]>([]);

  const [activeTab, setActiveTab] = useState<Tab>('analyse');

  async function runAnalysis(ctx: AnalysisContext) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Fout' }));
        throw new Error(body.error || 'Analyse mislukt');
      }
      const body = (await res.json()) as { report: AnalysisReport };
      setContext(ctx);
      setReport(body.report);
      setPersonas([]);
      setReacties([]);
      setActies([]);
      setActiveTab('analyse');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    } finally {
      setBusy(false);
    }
  }

  function resetAll() {
    setContext(null);
    setReport(null);
    setPersonas([]);
    setReacties([]);
    setActies([]);
    setToneOfVoice({});
    setError(null);
  }

  function addActie(actie: ActieResultaat) {
    setActies((prev) => {
      const without = prev.filter((a) => a.type !== actie.type);
      return [...without, actie];
    });
  }
  function removeActie(type: ActieType) {
    setActies((prev) => prev.filter((a) => a.type !== type));
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.reload();
  }

  const state: PreMortemState | null = context && report ? {
    context,
    report,
    personas,
    lezerReacties: reacties,
    toneOfVoice,
    acties,
  } : null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print border-b border-paper-line bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-3">
            {state && (
              <button
                type="button"
                onClick={resetAll}
                className="text-sm rounded border border-paper-line px-3 py-1.5 hover:border-ink-muted"
              >
                Nieuwe analyse
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="text-sm text-ink-muted hover:text-ink"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {!state && !busy && (
          <>
            <div className="mb-8 max-w-prose">
              <h1 className="font-serif text-3xl text-ink mb-3">
                Een Pre-mortem starten
              </h1>
              <p className="text-ink-muted leading-relaxed">
                Plak een intern bericht, kies de context, en krijg een diagnose
                van hoe het zal landen. Inclusief de wandelgangversie, de
                vragen die morgen komen, en vijf concrete deliverables die je
                meteen kan inzetten.
              </p>
            </div>
            <LandingForm onSubmit={runAnalysis} busy={busy} />
            {error && (
              <p className="mt-4 text-sm text-signal-risk">{error}</p>
            )}
          </>
        )}

        {busy && (
          <LoadingStage messages={ANALYSIS_LOADING_MESSAGES} title="Bezig met analyseren" />
        )}

        {state && !busy && (
          <div>
            <nav className="no-print flex gap-1 border-b border-paper-line mb-8">
              {TABS.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      active
                        ? 'text-ink border-accent'
                        : 'text-ink-muted border-transparent hover:text-ink'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </nav>

            {activeTab === 'analyse' && <AnalysisView report={state.report} />}
            {activeTab === 'personas' && (
              <PersonasView
                orgType={state.context.orgType}
                context={state.context}
                report={state.report}
                selectedPersonas={personas}
                reacties={reacties}
                onUpdateSelection={setPersonas}
                onUpdateReacties={setReacties}
              />
            )}
            {activeTab === 'acties' && (
              <ActionsView
                context={state.context}
                report={state.report}
                personas={personas}
                reacties={reacties}
                toneOfVoice={toneOfVoice}
                acties={acties}
                onUpdateTov={setToneOfVoice}
                onAddActie={addActie}
                onRemoveActie={removeActie}
              />
            )}
            {activeTab === 'rapport' && <ReportView state={state} />}
          </div>
        )}
      </main>

      <div className="no-print">
        <BrandFooter />
      </div>
    </div>
  );
}
