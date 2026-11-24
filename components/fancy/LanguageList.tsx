'use client';

import { usePathname } from 'next/navigation';
import type { CSSProperties, Ref } from 'react';
import { LANGUAGES, pathIn, rememberLang, type Lang } from '@/lib/i18n';
import type { ChromeLabels } from './types';

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

/** "EN ▾": opens and closes a LanguageList (the header's, or the phone menu's). */
export function LanguageToggle({
  lang,
  controls,
  open,
  labels,
  onToggle,
  ref,
}: {
  lang: Lang;
  /** The id of the list it opens. */
  controls: string;
  open: boolean;
  labels: Pick<ChromeLabels, 'language' | 'languageName'>;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      className="fc-mono fc-lang-toggle"
      aria-controls={controls}
      aria-expanded={open}
      aria-label={`${labels.language}: ${labels.languageName}`}
      onClick={onToggle}
    >
      {lang.toUpperCase()} <span className="fc-caret" aria-hidden>▾</span>
    </button>
  );
}
