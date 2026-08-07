import { IBM_Plex_Mono, Wix_Madefor_Text } from 'next/font/google';

// Shared by both root layouts (EN and IT). Self-hosted at build time.
const wix = Wix_Madefor_Text({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-wix',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export const fontVariables = `${wix.variable} ${mono.variable}`;
