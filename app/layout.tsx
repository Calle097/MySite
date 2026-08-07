import type { Metadata } from 'next';
import { IBM_Plex_Mono, Onest } from 'next/font/google';
import './globals.css';

// Both self-hosted by next/font at build time — visitors never contact
// Google. Chrome (header/footer) lives in the (site) group so that /demos/*
// pages can render bare inside iframes.
const onest = Onest({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-onest',
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
    'Frontend developer & QA engineer. React, Next.js, TypeScript, Playwright. Based in Italy, interested in working in Japan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${onest.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
