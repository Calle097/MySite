import { IBM_Plex_Mono, Wix_Madefor_Display, Wix_Madefor_Text } from 'next/font/google';

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

// The same family's cut for large sizes, used by lively mode's headings.
// preload: false — the @font-face is on every page, but a browser fetches a
// font only once some visible text uses it, so plain visitors never download
// this one.
const wixDisplay = Wix_Madefor_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-wix-display',
  preload: false,
});

export const fontVariables = `${wix.variable} ${mono.variable} ${wixDisplay.variable}`;
