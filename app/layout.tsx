import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'De Pre-mortem — Studio Inside Out',
  description:
    'Analysetool voor gevoelige interne communicatie. Voorspelt hoe een bericht landt bij medewerkers, op basis van verandercommunicatie, organisatiepsychologie, leesgedrag en message testing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
