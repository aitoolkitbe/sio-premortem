'use client';

import { useMemo, useState } from 'react';
import type { OrgType, Persona } from '@/lib/types';
import { STANDARD_PERSONAS } from '@/lib/personas';

export function PersonaPicker({
  orgType,
  selected,
  onToggle,
  onAddCustom,
  onRemoveCustom,
  disabled,
}: {
  orgType: OrgType;
  selected: Persona[];
  onToggle: (p: Persona) => void;
  onAddCustom: (p: Persona) => void;
  onRemoveCustom: (id: string) => void;
  disabled?: boolean;
}) {
  const standard = useMemo(() => STANDARD_PERSONAS[orgType] ?? [], [orgType]);
  const custom = useMemo(
    () => selected.filter((p) => p.isCustom),
    [selected],
  );

  const selectedIds = useMemo(
    () => new Set(selected.map((p) => p.id)),
    [selected],
  );

  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<{
    naam: string;
    context: string;
    leesmoment: string;
    angsten: string;
  }>({ naam: '', context: '', leesmoment: '', angsten: '' });

  function saveCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.naam.trim() || !draft.context.trim()) return;
    const id = `custom_${Date.now().toString(36)}`;
    const persona: Persona = {
      id,
      naam: draft.naam.trim(),
      context: draft.context.trim(),
      leesmoment: draft.leesmoment.trim() || undefined,
      angsten: draft.angsten.trim() || undefined,
      isCustom: true,
    };
    onAddCustom(persona);
    setDraft({ naam: '', context: '', leesmoment: '', angsten: '' });
    setCreating(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg text-ink mb-1">Standaard persona's</h3>
        <p className="text-sm text-ink-muted mb-4">
          Vier doelgroepen die horen bij het type organisatie dat je koos.
          Selecteer wie je wil meenemen.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {standard.map((p) => (
            <PersonaCard
              key={p.id}
              persona={p}
              active={selectedIds.has(p.id)}
              onToggle={() => onToggle(p)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg text-ink">Eigen persona's</h3>
          {!creating && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              disabled={disabled}
              className="text-sm rounded border border-ink px-3 py-1 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
            >
              + Persona toevoegen
            </button>
          )}
        </div>
        <p className="text-sm text-ink-muted mb-4">
          Mist er een doelgroep die specifiek is voor deze organisatie?
          Voeg ze hier toe — rol, context, leesmoment en specifieke angsten.
        </p>

        {custom.length > 0 && (
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {custom.map((p) => (
              <div key={p.id} className="relative">
                <PersonaCard
                  persona={p}
                  active={selectedIds.has(p.id)}
                  onToggle={() => onToggle(p)}
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={() => onRemoveCustom(p.id)}
                  className="absolute top-2 right-2 text-ink-muted hover:text-signal-risk text-xs"
                  title="Verwijder deze persona"
                  aria-label="Verwijder persona"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {creating && (
          <form
            onSubmit={saveCustom}
            className="card space-y-3"
          >
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Rol / titel
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={draft.naam}
                onChange={(e) => setDraft({ ...draft, naam: e.target.value })}
                placeholder="bv. Kwaliteitscoördinator, Logistiek teamhoofd"
                className="w-full rounded border border-paper-line bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Context (1-2 zinnen)
              </label>
              <textarea
                required
                maxLength={400}
                rows={2}
                value={draft.context}
                onChange={(e) =>
                  setDraft({ ...draft, context: e.target.value })
                }
                placeholder="Wat typeert deze rol? Anciënniteit, positie, verantwoordelijkheden, werkomgeving."
                className="w-full rounded border border-paper-line bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Leesmoment (optioneel)
              </label>
              <input
                type="text"
                maxLength={200}
                value={draft.leesmoment}
                onChange={(e) =>
                  setDraft({ ...draft, leesmoment: e.target.value })
                }
                placeholder="bv. Tijdens ochtendbriefing op de telefoon"
                className="w-full rounded border border-paper-line bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Specifieke angsten of gevoeligheden (optioneel)
              </label>
              <input
                type="text"
                maxLength={300}
                value={draft.angsten}
                onChange={(e) =>
                  setDraft({ ...draft, angsten: e.target.value })
                }
                placeholder="bv. Werkdruk, autonomie, zichtbaarheid, rooster"
                className="w-full rounded border border-paper-line bg-white px-3 py-2"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="rounded bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Persona bewaren
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="rounded border border-paper-line px-4 py-2 text-sm hover:border-ink-muted"
              >
                Annuleren
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function PersonaCard({
  persona,
  active,
  onToggle,
  disabled,
}: {
  persona: Persona;
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`text-left rounded border p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? 'border-accent bg-accent/5'
          : 'border-paper-line bg-white hover:border-ink-muted'
      }`}
      aria-pressed={active}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="font-medium text-ink">{persona.naam}</span>
        <span
          className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${
            active ? 'bg-accent text-white' : 'border border-paper-line text-ink-muted'
          }`}
          aria-hidden
        >
          {active ? '✓' : ''}
        </span>
      </div>
      <p className="text-xs text-ink-muted leading-relaxed">
        {persona.context}
      </p>
      {(persona.leesmoment || persona.angsten) && (
        <div className="mt-2 space-y-1 text-[11px] text-ink-muted/80">
          {persona.leesmoment && <div>🕑 {persona.leesmoment}</div>}
          {persona.angsten && <div>⚠ {persona.angsten}</div>}
        </div>
      )}
    </button>
  );
}
