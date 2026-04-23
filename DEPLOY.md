# Deploy naar GitHub + Vercel

Stap-voor-stap walkthrough voor een eerste deploy. Reken op 15-20 minuten als alles klopt.

## 0. Benodigdheden

- GitHub-account (of een organisatie-account waar SIO onder draait)
- Vercel-account ([vercel.com](https://vercel.com) — gratis Hobby-tier werkt, Pro aanbevolen voor langere analyses)
- Een Anthropic API-key met credits ([console.anthropic.com](https://console.anthropic.com))
- Node.js 20+ en `git` lokaal geïnstalleerd (alleen voor stap 2)

---

## 1. GitHub-repo aanmaken

### Via de website

1. Ga naar [github.com/new](https://github.com/new).
2. Naam: `sio-premortem` (of iets anders — maakt voor de tool niets uit).
3. Zichtbaarheid: **Private**. Deze tool is niet bedoeld om publiek te staan.
4. Vink *Add a README file* en *Add .gitignore* NIET aan — we pushen de bestaande code.
5. Klik **Create repository**.

Je krijgt een pagina met de URL, bv. `git@github.com:jouworganisatie/sio-premortem.git`.

---

## 2. Lokaal de code naar GitHub pushen

In een terminal, vanuit de map waar deze code staat (`sio-premortem/`):

```bash
# één keer
git init
git add .
git commit -m "Initial commit: De Pre-mortem web-app v1"

# koppel aan je nieuwe GitHub-repo
git branch -M main
git remote add origin git@github.com:JOUWORG/sio-premortem.git
git push -u origin main
```

Als je HTTPS liever hebt dan SSH: vervang de `git@github.com:...` URL door `https://github.com/JOUWORG/sio-premortem.git` en geef je credentials / personal access token op wanneer Git erom vraagt.

Check op GitHub dat alle bestanden er staan.

---

## 3. Vercel-project aanmaken

1. Ga naar [vercel.com/new](https://vercel.com/new).
2. Klik **Import Git Repository**. De eerste keer moet je Vercel toegang geven tot je GitHub-account of je organisatie.
3. Zoek `sio-premortem` in de lijst en klik **Import**.
4. Op het configuratiescherm:
   - **Framework Preset:** Next.js (wordt automatisch gedetecteerd).
   - **Root Directory:** `./` (laat staan).
   - **Build Command:** `next build` (laat staan).
   - **Output Directory:** `.next` (laat staan).
   - **Install Command:** `npm install` (laat staan).

Nog **niet** op Deploy klikken — eerst env vars toevoegen.

---

## 4. Omgevingsvariabelen toevoegen

Scroll op hetzelfde configuratiescherm naar **Environment Variables** en voeg deze drie toe:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` — je key van console.anthropic.com |
| `ACCESS_PASSWORD` | Een lang wachtwoord dat je deelt met het SIO-team (bv. 24+ tekens, geen dictionary-woord). Dit is wat gebruikers moeten invullen op de openingspagina. |
| `SESSION_SECRET` | Een random string. Genereer met `openssl rand -hex 32` of gebruik [1password.com/password-generator](https://1password.com/password-generator/). |

Optioneel:

| Name | Value |
|------|-------|
| `ANTHROPIC_MODEL` | Default is `claude-sonnet-4-6`. Zet op `claude-opus-4-6` voor hoogste kwaliteit (duurder + trager). |

Klik na het invullen op **Deploy**.

De eerste build duurt 1-2 minuten. Als hij klaar is krijg je een URL zoals `sio-premortem.vercel.app`.

---

## 5. Eerste test

1. Open de Vercel-URL in je browser.
2. Je krijgt het wachtwoordscherm. Voer `ACCESS_PASSWORD` in.
3. Plak een test-bericht (min. 40 tekens) en klik **Start de Pre-mortem**.
4. De analyse duurt 20-45 seconden. Je landt op de Analyse-tab.
5. Klik door de tabs: **Persona's** → **Acties** (vul tone of voice in) → **Rapport** (klik **Download als PDF** en controleer dat de printdialoog opent met een mooi opgemaakte versie).

Als er iets misgaat, check de **Logs**-tab in Vercel — foutmeldingen uit de API-routes staan daar.

---

## 6. Eigen domein koppelen (optioneel)

Als je `pre-mortem.studioinsideout.be` (of iets anders) wil gebruiken:

1. In Vercel → je project → **Settings** → **Domains**.
2. Klik **Add** en voer het domein in.
3. Vercel geeft je een CNAME- of A-record. Zet die bij je DNS-provider.
4. Binnen enkele minuten staat de site op het eigen domein + een automatisch TLS-certificaat.

---

## 7. Onderhoud

### Code updaten

Lokaal wijzigen, committen, pushen. Vercel detecteert de push en deployt automatisch.

```bash
git add .
git commit -m "beschrijving van de wijziging"
git push
```

### Wachtwoord roteren

In Vercel → project → **Settings** → **Environment Variables** → `ACCESS_PASSWORD` → **Edit**. Daarna **Redeploy** klikken (anders blijft de oude waarde actief voor draaiende instances).

### Kostenbewaking

- Elke analyse: 1 Claude-call (~$0.02 tot $0.15 afhankelijk van model en tekstlengte).
- Elke persona-set: 1 call.
- Elke deliverable: 1 call.
- Een gemiddelde sessie: 5-10 calls.
- Zet bij Anthropic een **usage limit** in je console om runaway-kosten te voorkomen.

### Logs checken

Vercel → **Logs** toont real-time wat er gebeurt. Foutmeldingen uit `console.error('[api/...]', ...)` zie je daar.

---

## 8. Wat niet in deze tool zit

- **Geen database.** Alles verdwijnt als de browser-tab sluit. Gebruikers moeten het rapport downloaden om iets te bewaren.
- **Geen multi-user analytics.** Je ziet niet wie wat heeft gedaan.
- **Geen teambeheer.** Iedereen met het wachtwoord is gelijkwaardig.

Dat zijn bewuste keuzes voor v1. Als je ze wil toevoegen: [Supabase](https://supabase.com/) voor database + auth is de snelste upgrade.

---

## Hulp nodig?

Bij build-fouten: kopieer de eerste foutregel uit de Vercel-logs en zoek in de repo. De meeste problemen komen van:

- Ontbrekende env var → "ANTHROPIC_API_KEY is niet ingesteld"
- Verkeerde key → 401 van Anthropic
- Tekst te lang → de analyse faalt bij berichten > 10 000 tekens (designed limit)
- Timeout → analyses > 60s timen out op Hobby-tier. Upgrade naar Pro of verkort het bericht.
