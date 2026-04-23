'use client';

import type { AnalysisReport, RiskLevel } from '@/lib/types';

function riskClass(r: RiskLevel): string {
  if (r === 'hoog') return 'bg-signal-risk/10 text-signal-risk';
  if (r === 'middel') return 'bg-signal-warn/10 text-signal-warn';
  return 'bg-signal-ok/10 text-signal-ok';
}

export function AnalysisView({ report }: { report: AnalysisReport }) {
  const { samenvatting, wandelgangversie, probleemZinnen, vervolgVragen, herschrijfSuggesties } =
    report;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-2xl text-ink mb-4">Samenvatting</h2>
        <div className="card">
          <div className="grid md:grid-cols-4 gap-6">
            <Scorecard
              label="Landingsscore"
              value={`${samenvatting.landingsscore}/10`}
              emphasis
            />
            <Scorecard label="Bridges-fase" value={samenvatting.bridgesFase} />
            <Scorecard label="ADKAR-barrière" value={samenvatting.adkarBarriere} />
            <Scorecard label="Risico" value={shortRisk(samenvatting.grootsteRisico)} />
          </div>
          <div className="mt-6 border-t border-paper-line pt-4 prose-pm">
            <p>
              <strong>Grootste risico:</strong> {samenvatting.grootsteRisico}
            </p>
            <p>
              <strong>Kernadvies:</strong> {samenvatting.kernadvies}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink mb-3">De wandelgangversie</h2>
        <p className="text-sm text-ink-muted mb-4 max-w-prose">
          Hoe dit bericht morgen wordt doorverteld bij de koffieautomaat.
          Als deze versie schadelijk is, is het bericht problematisch — ongeacht
          hoe zorgvuldig het geschreven is.
        </p>
        <blockquote className="border-l-4 border-accent bg-paper-soft px-5 py-4 font-serif text-lg italic text-ink">
          "{wandelgangversie}"
        </blockquote>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink mb-4">Probleemzinnen</h2>
        <div className="overflow-x-auto">
          <table className="pm">
            <thead>
              <tr>
                <th>Zin</th>
                <th>Mechanisme</th>
                <th>Risico</th>
                <th>Toelichting</th>
                <th>Wie raakt het</th>
              </tr>
            </thead>
            <tbody>
              {probleemZinnen.map((p, i) => (
                <tr key={i}>
                  <td className="italic max-w-[28ch]">"{p.zin}"</td>
                  <td>{p.mechanisme}</td>
                  <td>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs uppercase tracking-wide ${riskClass(
                        p.risico,
                      )}`}
                    >
                      {p.risico}
                    </span>
                  </td>
                  <td>{p.toelichting}</td>
                  <td className="text-ink-muted">{p.wieRaaktHet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink mb-4">Verwachte vervolgvragen</h2>
        <div className="overflow-x-auto">
          <table className="pm">
            <thead>
              <tr>
                <th>Vraag</th>
                <th>Wie</th>
                <th>Wanneer</th>
                <th>Waarom onbeantwoord</th>
              </tr>
            </thead>
            <tbody>
              {vervolgVragen.map((v, i) => (
                <tr key={i}>
                  <td className="font-medium max-w-[32ch]">"{v.vraag}"</td>
                  <td>{v.wie}</td>
                  <td>{v.wanneer}</td>
                  <td className="text-ink-muted">{v.waaromOnbeantwoord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink mb-4">Herschrijfsuggesties</h2>
        <div className="space-y-4">
          {herschrijfSuggesties.map((h, i) => (
            <div key={i} className="card">
              <p className="text-xs uppercase tracking-wide text-ink-muted mb-1">
                Origineel
              </p>
              <p className="italic mb-3">"{h.origineel}"</p>
              <p className="text-xs uppercase tracking-wide text-accent mb-1">
                Suggestie
              </p>
              <p className="mb-3">{h.suggestie}</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                <strong className="text-ink">Waarom:</strong> {h.waarom}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Scorecard({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
        {label}
      </div>
      <div
        className={`font-serif ${emphasis ? 'text-3xl text-accent' : 'text-xl text-ink'}`}
      >
        {value}
      </div>
    </div>
  );
}

function shortRisk(s: string): string {
  const first = s.split(/[.!?]/)[0];
  if (first.length <= 28) return first;
  return first.slice(0, 26) + '…';
}
