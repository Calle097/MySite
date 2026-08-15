import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import { DICTS } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mattia Callegher — Frontend Developer & QA Engineer',
    template: '%s — Mattia Callegher',
  },
  description: DICTS.en.description,
  openGraph: {
    type: 'website',
    siteName: 'Mattia Callegher',
    locale: 'en',
    title: 'Mattia Callegher — Frontend Developer & QA Engineer',
    description: DICTS.en.description,
  },
};

// First visit with an Italian browser (and no saved choice) → /it mirror.
// A saved 'it' preference from the switcher also redirects. Demos stay
// language-neutral and shared.
//
// The `/it` guard is load-bearing, not defensive: this layout also renders the
// 404 page, which Caddy serves under the path the visitor actually asked for.
// Without it, an Italian visitor hitting /it/typo/ would be sent to
// /it/it/typo/ — another 404, another redirect, forever.
const LOCALE_SCRIPT = `(function(){try{
var path=location.pathname;
if(path.indexOf('/demos')===0||path==='/it'||path.indexOf('/it/')===0)return;
var p=localStorage.getItem('site-lang');
if(p==='it'||(!p&&(navigator.language||'').toLowerCase().indexOf('it')===0)){
location.replace('/it'+(path==='/'?'/':path)+location.search);}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
