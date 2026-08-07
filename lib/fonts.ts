import { IBM_Plex_Mono, Onest } from 'next/font/google';

// Shared by both root layouts (EN and IT). Self-hosted at build time.
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

export const fontVariables = `${onest.variable} ${mono.variable}`;
