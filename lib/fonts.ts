import { Albert_Sans, IBM_Plex_Mono, Wix_Madefor_Text } from 'next/font/google';

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

// Lively mode's typeface: light for display, regular and medium for text.
// Open Font License, so it can be self-hosted from the repo (Satoshi, the
// first choice, may not sit in a public repository). preload: false — the
// @font-face is on every page, but a browser fetches a font only once some
// visible text uses it, so plain visitors never download it.
const albert = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lively',
  preload: false,
});

export const fontVariables = `${wix.variable} ${mono.variable} ${albert.variable}`;
