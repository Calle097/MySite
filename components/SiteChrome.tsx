import Link from 'next/link';
import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { LangSwitcher } from './LangSwitcher';

export function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const dict = DICTS[lang];
  const p = prefix(lang);

  const links = [
    { href: `${p}/about/`, label: '/about' },
    { href: `${p}/playground/`, label: '/playground' },
    { href: `${p}/stack/`, label: '/stack' },
    { href: '/cv.pdf', label: '/cv ↓' },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="gutter sticky top-0 z-40 flex items-baseline justify-between gap-x-6 border-b py-5 backdrop-blur-md"
        style={{
          background:
            'linear-gradient(color-mix(in srgb, var(--foreground) 9%, transparent), color-mix(in srgb, var(--foreground) 5%, transparent))',
          borderColor: 'color-mix(in srgb, var(--foreground) 14%, transparent)',
          boxShadow: '0 1px 0 color-mix(in srgb, var(--foreground) 7%, transparent) inset',
        }}
      >
        <Link href={`${p}/`} className="font-display text-lg font-semibold tracking-tight">
          Mattia Callegher
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-baseline gap-6 font-mono text-sm sm:flex" style={{ color: 'var(--muted-foreground)' }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-(--brand-accent)">
              {l.label}
            </Link>
          ))}
          <LangSwitcher lang={lang} />
        </nav>

        {/* Mobile nav: <details> dropdown — works without JavaScript. Plain
            <a> links so navigation is a document load and the menu closes. */}
        <details className="relative sm:hidden">
          <summary
            className="cursor-pointer list-none font-mono text-sm select-none [&::-webkit-details-marker]:hidden"
            style={{ color: 'var(--muted-foreground)' }}
          >
            menu ▾
          </summary>
          <div
            className="absolute right-0 top-full z-50 mt-3 flex min-w-44 flex-col gap-4 border p-5 font-mono text-sm"
            style={{ background: 'var(--background)', borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-(--brand-accent)">
                {l.label}
              </a>
            ))}
            <LangSwitcher lang={lang} />
          </div>
        </details>
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
