'use client';

import type { PreMortemState } from '@/lib/types';
import { renderMarkdown } from '@/lib/markdown';

const ORG_LABEL: Record<string, string> = {
  productie: 'Productie / industrie',
  dienstverlening: 'Dienstverlening',
  overheid: 'Overheid / publieke sector',
  zorg: 'Zorg',
  retail: 'Retail',
  tech: 'Tech / scale-up',
};

const AANLEIDING_LABEL: Record<string, string> = {
  reorganisatie: 'Reorganisatie',
  fusie: 'Fusie of overname',
  strategie: 'Strategiewijziging',
  ontslag: 'Ontslagronde',
  beleid: 'Nieuw beleid',
  crisis: 'Crisis',
  cultuur: 'Cultuurverandering',
  leiderschap: 'Leiderschapswissel',
};

const HIST_LABEL: Record<string, string> = {
  eerste: 'Eerste keer',
  tweede_derde: 'Tweede of derde keer',
  zoveelste: 'De zoveelste verandering',
};

export function ReportView({ state }: { state: PreMortemState }) {
  const today = new Date().toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function printReport() {
    window.print();
  }

  async function downloadMarkdown() {
    const md = buildMarkdownReport(state, today);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre-mortem-rapport-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const { context, report, personas, lezerReacties, acties, toneOfVoice } = state;

  return (
    <div>
      <div className="no-print flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-paper-line">
        <h2 className="font-serif text-2xl text-ink flex-1">Rapport</h2>
        <button
          type="button"
          onClick={printReport}
          className="rounded bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Download als PDF
        </button>
        <button
          type="button"
          onClick={downloadMarkdown}
          className="rounded border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
        >
          Download als markdown
        </button>
      </div>
      <p className="no-print text-sm text-ink-muted mb-10 max-w-prose">
        Het rapport hieronder bevat de volledige analyse, de geselecteerde
        doelgroepen met hun lezersreacties, en alle deliverables die je
        gegenereerd hebt. Klik op <em>Download als PDF</em> om het als PDF te
        exporteren (via de printdialoog van je browser: kies "Opslaan als PDF").
      </p>

      <article className="report-doc">
        <header className="mb-10 pb-6 border-b-2 border-ink">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                De Pre-mortem — Studio Inside Out
              </div>
              <h1 className="font-serif text-3xl text-ink mt-1">
                Analyse van intern bericht
              </h1>
            </div>
            <div className="text-right text-xs text-ink-muted">
              <div>{today}</div>
              <div>Rapport v1</div>
            </div>
          </div>
        </header>

        <section className="mb-10 avoid-break">
          <h2 className="font-serif text-xl text-ink mb-3">Context</h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <DlItem label="Type organisatie" value={ORG_LABEL[context.orgType] ?? context.orgType} />
            <DlItem label="Aanleiding" value={AANLEIDING_LABEL[context.aanleiding] ?? context.aanleiding} />
            <DlItem label="Veranderhistorie" value={HIST_LABEL[context.veranderhistorie] ?? context.veranderhistorie} />
            <DlItem label="Tone of voice" value={toneOfVoice.beschrijving ? 'Aangeleverd' : 'Standaard'} />
          </dl>
        </section>

        <section className="mb-10 avoid-break">
          <h2 className="font-serif text-xl text-ink mb-3">Oorspronkelijk bericht</h2>
          <div className="card whitespace-pre-wrap text-[15px] leading-relaxed">
            {context.bericht}
          </div>
        </section>

        <section className="mb-10 avoid-break">
          <h2 className="font-serif text-xl text-ink mb-3">Samenvatting</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <DlItem label="Landingsscore" value={`${report.samenvatting.landingsscore}/10`} emphasis />
            <DlItem label="Bridges-fase" value={report.samenvatting.bridgesFase} />
            <DlItem label="ADKAR-barrière" value={report.samenvatting.adkarBarriere} />
            <DlItem label="Grootste risico" value={report.samenvatting.grootsteRisico} />
          </div>
          <p className="text-[15px] leading-relaxed text-ink">
            <strong>Kernadvies:</strong> {report.samenvatting.kernadvies}
          </p>
        </section>

        <section className="mb-10 avoid-break">
          <h2 className="font-serif text-xl text-ink mb-3">De wandelgangversie</h2>
          <blockquote className="border-l-4 border-accent bg-paper-soft px-5 py-4 font-serif text-lg italic">
            "{report.wandelgangversie}"
          </blockquote>
        </section>

        <section className="mb-10 page-break">
          <h2 className="font-serif text-xl text-ink mb-3">Probleemzinnen</h2>
          <table className="pm">
            <thead>
              <tr>
                <th>Zin</th><th>Mechanisme</th><th>Risico</th><th>Toelichting</th><th>Wie raakt het</th>
              </tr>
            </thead>
            <tbody>
              {report.probleemZinnen.map((p, i) => (
                <tr key={i}>
                  <td className="italic">"{p.zin}"</td>
                  <td>{p.mechanisme}</td>
                  <td className="uppercase text-xs">{p.risico}</td>
                  <td>{p.toelichting}</td>
                  <td className="text-ink-muted">{p.wieRaaktHet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10 avoid-break">
          <h2 className="font-serif text-xl text-ink mb-3">Verwachte vervolgvragen</h2>
          <table className="pm">
            <thead>
              <tr>
                <th>Vraag</th><th>Wie</th><th>Wanneer</th><th>Waarom onbeantwoord</th>
              </tr>
            </thead>
            <tbody>
              {report.vervolgVragen.map((v, i) => (
                <tr key={i}>
                  <td className="font-medium">"{v.vraag}"</td>
                  <td>{v.wie}</td>
                  <td>{v.wanneer}</td>
                  <td className="text-ink-muted">{v.waaromOnbeantwoord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-xl text-ink mb-3">Herschrijfsuggesties</h2>
          {report.herschrijfSuggesties.map((h, i) => (
            <div key={i} className="card mb-3 avoid-break">
              <p className="text-xs uppercase tracking-wide text-ink-muted mb-1">Origineel</p>
              <p className="italic mb-2">"{h.origineel}"</p>
              <p className="text-xs uppercase tracking-wide text-accent mb-1">Suggestie</p>
              <p className="mb-2">{h.suggestie}</p>
              <p className="text-sm text-ink-muted">
                <strong className="text-ink">Waarom:</strong> {h.waarom}
              </p>
            </div>
          ))}
        </section>

        {lezerReacties.length > 0 && (
          <section className="mb-10 page-break">
            <h2 className="font-serif text-xl text-ink mb-3">Lezersreacties per doelgroep</h2>
            {lezerReacties.map((r) => (
              <div key={r.personaId} className="card mb-3 avoid-break">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg text-ink">{r.personaNaam}</h3>
                  <span className="text-[11px] uppercase tracking-wide text-ink-muted">
                    ADKAR: {r.adkarBarriere}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <DlItem label="Leest" value={r.leest} />
                  <DlItem label="Denkt" value={`"${r.denkt}"`} italic />
                  <DlItem label="Voelt" value={r.voelt} />
                  <DlItem label="Doet" value={r.doet} />
                </div>
              </div>
            ))}
            {personas.filter((p) => !lezerReacties.some((r) => r.personaId === p.id)).length > 0 && (
              <p className="text-xs text-ink-muted mt-2">
                Personas zonder gegenereerde reactie zijn niet opgenomen.
              </p>
            )}
          </section>
        )}

        {toneOfVoice.beschrijving && (
          <section className="mb-10 avoid-break">
            <h2 className="font-serif text-xl text-ink mb-3">Gebruikte tone of voice</h2>
            <div className="card text-sm leading-relaxed">
              <p className="whitespace-pre-wrap">{toneOfVoice.beschrijving}</p>
              {toneOfVoice.voorbeeldtekst && (
                <>
                  <p className="mt-3 text-xs uppercase tracking-wide text-ink-muted">
                    Voorbeeldtekst
                  </p>
                  <p className="whitespace-pre-wrap italic">{toneOfVoice.voorbeeldtekst}</p>
                </>
              )}
            </div>
          </section>
        )}

        {acties.length > 0 && (
          <section className="mb-10 page-break">
            <h2 className="font-serif text-2xl text-ink mb-5">Deliverables</h2>
            {acties.map((a) => (
              <div key={a.type} className="mb-10 avoid-break">
                <h3 className="font-serif text-xl text-ink border-b border-paper-line pb-2 mb-4">
                  {a.titel}
                </h3>
                <div
                  className="prose-pm text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(a.markdown) }}
                />
              </div>
            ))}
          </section>
        )}

        <footer className="mt-10 pt-4 border-t border-paper-line text-xs text-ink-muted">
          Rapport gegenereerd op {today} · De Pre-mortem · Studio Inside Out ·
          Analysetool voor gevoelige interne communicatie. Deze voorspelling is
          gebaseerd op gepubliceerd onderzoek uit verandercommunicatie,
          organisatiepsychologie, leesgedrag en message testing. Mensen blijven
          complexer dan modellen — gebruik dit als aanvulling op je oordeel,
          niet als vervanging ervan.
        </footer>
      </article>
    </div>
  );
}

function DlItem({
  label,
  value,
  emphasis,
  italic,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  italic?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">
        {label}
      </div>
      <div
        className={`text-ink ${emphasis ? 'font-serif text-2xl text-accent' : ''} ${italic ? 'italic' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}

function buildMarkdownReport(state: PreMortemState, today: string): string {
  const { context, report, personas, lezerReacties, acties, toneOfVoice } = state;
  const lines: string[] = [];
  lines.push(`# De Pre-mortem — Analyse van intern bericht`);
  lines.push(`*Studio Inside Out · ${today}*`);
  lines.push('');
  lines.push(`## Context`);
  lines.push(`- **Type organisatie:** ${ORG_LABEL[context.orgType] ?? context.orgType}`);
  lines.push(`- **Aanleiding:** ${AANLEIDING_LABEL[context.aanleiding] ?? context.aanleiding}`);
  lines.push(`- **Veranderhistorie:** ${HIST_LABEL[context.veranderhistorie] ?? context.veranderhistorie}`);
  lines.push('');
  lines.push(`## Oorspronkelijk bericht`);
  lines.push('');
  lines.push(context.bericht);
  lines.push('');
  lines.push(`## Samenvatting`);
  lines.push(`- **Landingsscore:** ${report.samenvatting.landingsscore}/10`);
  lines.push(`- **Bridges-fase:** ${report.samenvatting.bridgesFase}`);
  lines.push(`- **ADKAR-barrière:** ${report.samenvatting.adkarBarriere}`);
  lines.push(`- **Grootste risico:** ${report.samenvatting.grootsteRisico}`);
  lines.push(`- **Kernadvies:** ${report.samenvatting.kernadvies}`);
  lines.push('');
  lines.push(`## De wandelgangversie`);
  lines.push(`> "${report.wandelgangversie}"`);
  lines.push('');
  lines.push(`## Probleemzinnen`);
  report.probleemZinnen.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.mechanisme} — risico: ${p.risico}`);
    lines.push(`> "${p.zin}"`);
    lines.push('');
    lines.push(`${p.toelichting}`);
    lines.push(`*Wie raakt het:* ${p.wieRaaktHet}`);
    lines.push('');
  });
  lines.push(`## Verwachte vervolgvragen`);
  report.vervolgVragen.forEach((v) => {
    lines.push(`- **"${v.vraag}"** — ${v.wie}, ${v.wanneer}. ${v.waaromOnbeantwoord}`);
  });
  lines.push('');
  lines.push(`## Herschrijfsuggesties`);
  report.herschrijfSuggesties.forEach((h, i) => {
    lines.push(`### Suggestie ${i + 1}`);
    lines.push(`- **Origineel:** "${h.origineel}"`);
    lines.push(`- **Suggestie:** ${h.suggestie}`);
    lines.push(`- **Waarom:** ${h.waarom}`);
    lines.push('');
  });
  if (lezerReacties.length) {
    lines.push(`## Lezersreacties per doelgroep`);
    lezerReacties.forEach((r) => {
      lines.push(`### ${r.personaNaam}`);
      lines.push(`- **Leest:** ${r.leest}`);
      lines.push(`- **Denkt:** "${r.denkt}"`);
      lines.push(`- **Voelt:** ${r.voelt}`);
      lines.push(`- **Doet:** ${r.doet}`);
      lines.push(`- **ADKAR-barrière:** ${r.adkarBarriere}`);
      lines.push('');
    });
  }
  if (toneOfVoice.beschrijving) {
    lines.push(`## Gebruikte tone of voice`);
    lines.push(toneOfVoice.beschrijving);
    if (toneOfVoice.voorbeeldtekst) {
      lines.push('');
      lines.push('**Voorbeeldtekst:**');
      lines.push(toneOfVoice.voorbeeldtekst);
    }
    lines.push('');
  }
  if (acties.length) {
    lines.push(`## Deliverables`);
    acties.forEach((a) => {
      lines.push(`### ${a.titel}`);
      lines.push('');
      lines.push(a.markdown);
      lines.push('');
    });
  }
  lines.push(`---`);
  lines.push(`*Rapport gegenereerd op ${today} door De Pre-mortem, Studio Inside Out.*`);
  return lines.join('\n');
}
