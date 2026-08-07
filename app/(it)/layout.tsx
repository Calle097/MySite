import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import { DICTS } from '@/lib/i18n';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mattia Callegher — Sviluppatore Frontend & QA Engineer',
    template: '%s — Mattia Callegher',
  },
  description: DICTS.it.description,
};

// A saved 'en' preference (from the switcher) sends visitors back to the
// English tree; otherwise anyone landing on /it stays.
const LOCALE_SCRIPT = `(function(){try{
if(localStorage.getItem('site-lang')==='en'){
var n=location.pathname.replace(/^\\/it(\\/|$)/,'/');
location.replace((n||'/')+location.search);}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
