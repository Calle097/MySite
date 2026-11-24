import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import { DICTS } from '@/lib/i18n';
import { MODE_SCRIPT } from '@/lib/mode';
import { NAME, SITE_URL } from '@/lib/site';
import '../globals.css';
import '../fancy.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} — Sviluppatore Frontend & QA Engineer`,
    template: `%s — ${NAME}`,
  },
  description: DICTS.it.description,
  openGraph: {
    type: 'website',
    siteName: NAME,
    locale: 'it_IT',
    title: `${NAME} — Sviluppatore Frontend & QA Engineer`,
    description: DICTS.it.description,
  },
};

// A saved 'en' preference (from the switcher) sends visitors back to the
// English tree; otherwise anyone landing on /it stays. /it/demos/ is left
// alone, as in the EN layout: the Italian playground's frames need #embed.
const LOCALE_SCRIPT = `(function(){try{
var path=location.pathname;
if(path.indexOf('/it/demos')===0)return;
if(localStorage.getItem('site-lang')==='en'){
var n=path.replace(/^\\/it(\\/|$)/,'/');
location.replace((n||'/')+location.search+location.hash);}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // See the EN layout: MODE_SCRIPT sets attributes on <html> before React
    // loads, and suppressHydrationWarning covers exactly those.
    <html lang="it" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
