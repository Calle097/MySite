import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import './globals.css';

// All three are self-hosted by next/font at build time — visitors never
// contact Google. Chrome (header/footer) lives in the (site) group so that
// /demos/* pages can render bare inside iframes.
const sans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
});

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Mattia Callegher — Frontend Developer & QA Engineer',
    template: '%s — Mattia Callegher',
  },
  description:
    'Frontend developer & QA engineer. React, Next.js, TypeScript, Playwright. Based in Italy, looking towards Japan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
