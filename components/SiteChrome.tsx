import Link from 'next/link';
import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { LangSwitcher } from './LangSwitcher';

export function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const dict = DICTS[lang];
  const p = prefix(lang);

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="gutter sticky top-0 z-40 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b py-5 backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--background) 55%, transparent)',
          borderColor: 'color-mix(in srgb, var(--foreground) 10%, transparent)',
        }}
      >
        <Link href={`${p}/`} className="font-display text-lg font-semibold tracking-tight">
          Mattia Callegher
        </Link>
        <nav className="flex gap-6 font-mono text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Link href={`${p}/playground/`} className="transition-colors hover:text-(--brand-accent)">
            /playground
          </Link>
          <Link href={`${p}/stack/`} className="transition-colors hover:text-(--brand-accent)">
            /stack
          </Link>
          <a href="/cv.pdf" className="transition-colors hover:text-(--brand-accent)">
            /cv ↓
          </a>
          <LangSwitcher lang={lang} />
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="gutter mt-28 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t py-6 font-mono text-xs uppercase tracking-[0.15em]"
        style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
      >
        <span>{dict.footer.location}</span>
        <span className="flex gap-6">
          <a href="mailto:callegher.mattia00@gmail.com" className="transition-colors hover:text-(--brand-accent)">
            {dict.footer.email}
          </a>
          <a href="https://github.com/Calle097" className="transition-colors hover:text-(--brand-accent)">
            {dict.footer.github}
          </a>
          <a href="https://github.com/Calle097/MySite" className="transition-colors hover:text-(--brand-accent)">
            {dict.footer.source}
          </a>
        </span>
      </footer>
    </div>
  );
}
