'use client';

import { usePathname } from 'next/navigation';
import { pathIn, rememberLang, type Lang } from '@/lib/i18n';

// Plain mode's "en / it". Saves the choice so the inline locale script in the
// root layouts keeps future visits on the chosen language.
export function LangSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? '/';

  const item = (l: Lang, label: string) =>
    lang === l ? (
      <span aria-current="true" lang={l} className="text-foreground">
        {label}
      </span>
    ) : (
      <a
        href={pathIn(l, pathname)}
        lang={l}
        hrefLang={l}
        onClick={() => rememberLang(l)}
        className="transition-colors hover:text-brand-accent"
      >
        {label}
      </a>
    );

  return (
    <span className="flex gap-1.5">
      {item('en', 'en')}
      <span aria-hidden>/</span>
      {item('it', 'it')}
    </span>
  );
}
