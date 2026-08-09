'use client';

import { usePathname } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

// Saves the choice so the inline locale script in the root layouts keeps
// future visits on the chosen language.
export function LangSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? '/';
  const enPath = pathname.replace(/^\/it(\/|$)/, '/') || '/';
  const itPath = pathname.startsWith('/it') ? pathname : `/it${pathname === '/' ? '' : pathname}` || '/it';

  const save = (l: Lang) => {
    try {
      localStorage.setItem('site-lang', l);
    } catch {
      /* private mode etc. — switching still works, just not sticky */
    }
  };

  const item = (l: Lang, href: string, label: string) =>
    lang === l ? (
      <span aria-current="true" className="text-foreground">
        {label}
      </span>
    ) : (
      <a href={href} onClick={() => save(l)} className="transition-colors hover:text-brand-accent">
        {label}
      </a>
    );

  return (
    <span className="flex gap-1.5">
      {item('en', enPath, 'en')}
      <span aria-hidden>/</span>
      {item('it', itPath, 'it')}
    </span>
  );
}
