import type { ReactNode } from 'react';
import { fontVariables } from '@/lib/fonts';
import type { Lang } from '@/lib/i18n';
import { LOCALE_SCRIPT } from '@/lib/i18n/locale-script';
import { MODE_SCRIPT } from '@/lib/mode';

/**
 * The document both root layouts render, one per language tree. Two inline
 * scripts run in <head> before anything paints: MODE_SCRIPT sets data-mode
 * and data-js on <html>, so the page never shows the wrong version first,
 * and the language redirect. suppressHydrationWarning tells React those
 * extra attributes on <html> are expected; it covers this element's own
 * attributes only, nothing inside.
 */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT[lang] }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
