# De Pre-mortem — Studio Inside Out

Analysetool voor gevoelige interne communicatie. Voorspelt hoe een bericht zal landen bij medewerkers op basis van vier wetenschappelijk onderbouwde lagen: verandercommunicatie, organisatiepsychologie, leesgedrag en message testing.

Deze repository bevat de web-app (Next.js 14 + Vercel). De skills-versie voor Claude.ai staat los van deze repo.

## Wat de tool doet

1. Je plakt een intern bericht en geeft context (organisatietype, aanleiding, veranderhistorie).
2. De tool levert een diagnose: landingsscore, Bridges-fase, ADKAR-barrière, probleemzinnen met mechanisme, wandelgangversie, verwachte vervolgvragen, herschrijfsuggesties.
3. Je kiest welke doelgroepen je wil meenemen. Standaard vier per sector, eigen persona's kan je toevoegen.
4. Per persona krijg je een lezersreactie: leest, denkt, voelt, doet.
5. Je geeft een tone of voice op en genereert vijf deliverables: herschreven bericht, talking points, FAQ, doelgroepversies, communicatieplan.
6. Alles samen is downloadbaar als PDF of markdown.

## Stack

- Next.js 14 (App Router) op Node.js runtime
- TypeScript, Tailwind CSS
- Anthropic Claude via `@anthropic-ai/sdk` (server-side)
- Geen database — alles leeft in de browser-state. Niets wordt opgeslagen.
- Auth: één gedeeld wachtwoord + ondertekende cookie. Voldoende voor interne + klantdemo's.

## Lokaal draaien

```bash
cp .env.example .env.local
# Vul ANTHROPIC_API_KEY, ACCESS_PASSWORD, SESSION_SECRET in

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy naar Vercel

Zie [DEPLOY.md](./DEPLOY.md) voor de stap-voor-stap walkthrough.

## Omgevingsvariabelen

| Naam | Verplicht | Wat het doet |
|------|-----------|--------------|
| `ANTHROPIC_API_KEY` | ja | API-key voor Claude. Wordt nooit naar de client gestuurd. |
| `ACCESS_PASSWORD` | ja | Het wachtwoord waarmee gebruikers de tool openen. |
| `SESSION_SECRET` | aanbevolen | Random string om sessie-cookies te ondertekenen. Default valt terug op `ACCESS_PASSWORD`, wat werkt maar minder proper is. |
| `ANTHROPIC_MODEL` | nee | Default `claude-sonnet-4-6`. Zet op `claude-opus-4-6` voor hoogste kwaliteit (duurder + trager). |

## Waarom server-side key?

Omdat SIO (of een klant) de factuur draagt en gebruikers niet met eigen keys willen werken. Dat betekent wel dat iedereen met de URL Claude-calls kan doen op jouw factuur — vandaar het wachtwoord. Zonder `ACCESS_PASSWORD` werkt de tool niet.

Rate limiting zit op IP-niveau (per route). Het is een dempfilter, geen harde grens — voor échte productie zou je beter `@upstash/ratelimit` met Redis gebruiken. Voor de huidige scope (intern SIO-team + uitgenodigde klanten) is het ruim voldoende.

## Structuur

```
app/
  api/
    analyse/         diagnose op 4 lagen
    personas/        lezersreacties per geselecteerde persona
    action/          genereer 1 van 5 deliverables
    auth/            login / logout
  components/        UI-componenten
  workbench/         de tabbed werkomgeving (na login)
  page.tsx           gate / landing
  layout.tsx
  globals.css
lib/
  prompts/           system prompts per call
  anthropic.ts       SDK-wrapper
  auth.ts            cookie + HMAC
  personas.ts        standaard persona-bibliotheek per sector
  rate-limit.ts      in-memory per-IP rate limiter
  markdown.ts        simpele md→html voor weergave + rapport
  types.ts           shared domain types
  loading-messages.ts  positieve laadberichten
middleware.ts        beschermt /workbench en /api
```

## Licentie

Intern eigendom van Studio Inside Out. Niet publiek distribueren.
