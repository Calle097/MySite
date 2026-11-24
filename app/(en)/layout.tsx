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
    default: `${NAME} — Frontend Developer & QA Engineer`,
    template: `%s — ${NAME}`,
  },
  description: DICTS.en.description,
  openGraph: {
    type: 'website',
    siteName: NAME,
    locale: 'en',
    title: `${NAME} — Frontend Developer & QA Engineer`,
    description: DICTS.en.description,
  },
};

// First visit with an Italian browser (and no saved choice) → /it mirror.
// A saved 'it' preference from the switcher also redirects. /demos/ is left
// alone: each playground already embeds its own language's demos, and a
// redirect here would drop the #embed fragment those iframes rely on.
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
location.replace('/it'+(path==='/'?'/':path)+location.search+location.hash);}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // MODE_SCRIPT sets data-mode and data-js on <html>
    // before React loads, on purpose, so the page never paints in the wrong
    // mode. suppressHydrationWarning tells React those extra attributes are
    // expected; it covers this element's own attributes only, nothing inside.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
