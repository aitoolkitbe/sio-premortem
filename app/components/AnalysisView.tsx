'use client';

import type { AnalysisReport, RiskLevel } from '@/lib/types';

function riskColor(r: RiskLevel): string {
  if (r === 'hoog') return 'bg-signal-risk text-white';
  if (r === 'middel') return 'bg-signal-warn text-white';
  return 'bg-signal-ok text-white';
}

export function AnalysisView({ report }: { report: AnalysisReport }) {
  const { samenvatting, wandelgangversie, probleemZinnen, vervolgVragen, herschrijfSuggesties } =
    report;

  return (
    <div className="space-y-12">
      <section>
        <SectionHeader
          title="Samenvatting"
          lead="De vier ankerpunten van deze analyse."
        />
        <div className="card">
          <div className="grid md:grid-cols-4 gap-6">
            <Scorecard
              label="Landingsscore"
              value={`${samenvatting.landingsscore}/10`}
              emphasis
            />
            <Scorecard label="Bridges-fase" value={samenvatting.bridgesFase} />
            <Scorecard label="ADKAR-barrière" value={samenvatting.adkarBarriere} />
            <Scorecard label="Grootste risico" value={samenvatting.grootsteRisico} compact />
          </div>
          <div className="mt-6 border-t border-paper-line pt-4">
            <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
              Kernadvies
            </div>
            <p className="text-[15px] leading-relaxed text-ink">
              {samenvatting.kernadvies}
            </p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          title="De wandelgangversie"
          lead="Hoe dit bericht morgen wordt doorverteld bij de koffieautomaat."
        />
        <blockquote className="border-l-4 border-accent bg-paper-soft px-5 py-4 font-serif text-lg italic text-ink">
          "{wandelgangversie}"
        </blockquote>
      </section>

      <section>
        <SectionHeader
          title="Probleemzinnen"
          lead={`${probleemZinnen.length} passages met verhoogd risico.`}
        />
        <div className="grid md:grid-cols-2 gap-3">
          {probleemZinnen.map((p, i) => (
            <article
              key={i}
              className="card flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold rounded px-2 py-0.5 ${riskColor(p.risico)}`}
                >
                  {p.risico}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-ink-muted">
                  {p.mechanisme}
                </span>
              </div>
              <p className="text-sm italic text-ink-muted leading-snug border-l-2 border-paper-line pl-3">
                "{p.zin}"
              </p>
              <p className="text-[15px] leading-relaxed text-ink">
                {p.toelichting}
              </p>
              <p className="text-xs text-ink-muted">
                Raakt: {p.wieRaaktHet}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Verwachte vervolgvragen"
          lead="Wat morgen door de organisatie gaat reizen."
        />
        <ol className="space-y-3">
          {vervolgVragen.map((v, i) => (
            <li
              key={i}
              className="card flex flex-col md:flex-row md:items-start gap-3 md:gap-6"
            >
              <div className="md:w-10 flex-shrink-0 font-serif text-2xl text-accent leading-none">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink text-[15px] mb-1">
                  "{v.vraag}"
                </p>
                <p className="text-xs text-ink-muted mb-2">
                  {v.wie} · {v.wanneer}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {v.waaromOnbeantwoord}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionHeader
          title="Herschrijfsuggesties"
          lead="Per probleemzin een alternatief dat het mechanisme ontmantelt."
        />
        <div className="space-y-3">
          {herschrijfSuggesties.map((h, i) => (
            <article key={i} className="card">
              <div className="grid md:grid-cols-2 gap-5 mb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-muted mb-1">
                    Origineel
                  </div>
                  <p className="italic text-sm text-ink-muted leading-snug">
                    "{h.origineel}"
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
                    Suggestie
                  </div>
                  <p className="text-[15px] text-ink leading-relaxed">
                    {h.suggestie}
                  </p>
                </div>
              </div>
              <div className="border-t border-paper-line pt-3 text-xs text-ink-muted">
                <strong className="text-ink">Waarom: </strong>
                {h.waarom}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      {lead && <p className="text-sm text-ink-muted mt-1">{lead}</p>}
    </div>
  );
}

function Scorecard({
  label,
  value,
  emphasis,
  compact,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
        {label}
      </div>
      <div
        className={
          emphasis
            ? 'font-serif text-3xl text-accent'
            : compact
              ? 'text-sm text-ink leading-snug'
              : 'font-serif text-xl text-ink'
        }
      >
        {value}
      </div>
    </div>
  );
}
