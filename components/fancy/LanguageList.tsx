'use client';

import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { LANGUAGES, pathIn, rememberLang, type Lang } from '@/lib/i18n';

/**
 * Every language, each named in itself, linking to this same page in it.
 * The current one carries the accent dash; `onPick` closes whatever list
 * holds this one when the current language is picked again.
 */
export function LanguageList({ lang, onPick }: { lang: Lang; onPick?: () => void }) {
  const pathname = usePathname() ?? '/';

  return (
    <ul className="fc-langs">
      {LANGUAGES.map(({ lang: l, name }, i) => (
        <li key={l} style={{ '--i': i } as CSSProperties}>
          <a
            href={pathIn(l, pathname)}
            lang={l}
            hrefLang={l}
            aria-current={l === lang ? 'true' : undefined}
            onClick={(e) => {
              if (l === lang) {
                e.preventDefault();
                onPick?.();
              } else {
                rememberLang(l);
              }
            }}
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
}
