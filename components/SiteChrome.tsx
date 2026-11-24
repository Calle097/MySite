import Link from 'next/link';
import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';
import { LangSwitcher } from './LangSwitcher';
import { LightBand } from './LightBand';
import { MobileMenu } from './MobileMenu';
import { ModeSwitch } from './ModeSwitch';
import { NavLink } from './NavLink';
import { RevealObserver } from './RevealObserver';
import { TuneBar } from './lab/TuneBar';

export function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const dict = DICTS[lang];
  const p = prefix(lang);

  // Plain header: file-path labels.
  const pathLinks = [
    { href: `${p}/`, label: '/home' },
    { href: `${p}/about/`, label: '/about' },
    { href: `${p}/playground/`, label: '/playground' },
    { href: `${p}/stack/`, label: '/stack' },
    { href: '/cv.pdf', label: '/cv ↓' },
  ];

  // Lively header: plain words, translated. Home is the name on the left.
  const wordLinks = [
    { href: `${p}/about/`, label: dict.nav.about },
    { href: `${p}/playground/`, label: dict.nav.playground },
    { href: `${p}/stack/`, label: dict.nav.stack },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="site-chrome sr-only font-mono text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 bg-brand-accent text-background"
      >
        {dict.skipToContent}
      </a>

      {/* Both headers are in the page; only-plain / only-lively show the one
          for the current mode, so neither flashes on load. */}
      <header className="site-chrome site-header gutter sticky top-0 z-40 flex items-baseline justify-between gap-x-6 border-b py-5 backdrop-blur-md">
        <Link href={`${p}/`} className="only-plain font-display text-lg font-semibold tracking-tight">
          Mattia Callegher
        </Link>
        <Link href={`${p}/`} className="only-lively wordmark">
          Mattia Callegher
        </Link>

        {/* Desktop nav. The CV is a file, not a route — a Next <Link> would
            prefetch it as an RSC payload (cv.pdf.txt → 404), so it gets a
            plain <a>. */}
        <nav className="only-plain hidden items-baseline gap-6 font-mono text-sm nav:flex text-muted-foreground">
          {pathLinks.map((l) =>
            l.href.endsWith('.pdf') ? (
              <a key={l.href} href={l.href} className="transition-colors hover:text-brand-accent">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-brand-accent">
                {l.label}
              </Link>
            ),
          )}
          <ModeSwitch className="needs-js cursor-pointer transition-colors hover:text-brand-accent">
            {dict.mode.navLively}
          </ModeSwitch>
          <LangSwitcher lang={lang} />
        </nav>

        <nav className="only-lively lively-nav hidden nav:flex">
          {wordLinks.map((l) => (
            <NavLink key={l.href} href={l.href} className="lively-link">
              {l.label}
            </NavLink>
          ))}
          <a href="/cv.pdf" className="lively-link">
            {dict.nav.cv}
          </a>
          <span className="lively-lang">
            <LangSwitcher lang={lang} />
          </span>
          <ModeSwitch on className="lively-mode">
            <span className="lively-mode-track" aria-hidden />
            {dict.mode.toggle}
          </ModeSwitch>
        </nav>

        {/* Mobile nav — plain <a> links so navigation is a document load and
            the menu closes on selection. */}
        <MobileMenu
          label={
            <>
              <span className="only-plain">menu ▾</span>
              <span className="only-lively">{dict.nav.menu}</span>
            </>
          }
        >
          {pathLinks.map((l) => (
            <a key={l.href} href={l.href} className="only-plain transition-colors hover:text-brand-accent">
              {l.label}
            </a>
          ))}
          {[...wordLinks, { href: '/cv.pdf', label: dict.nav.cv }].map((l) => (
            <a key={l.href} href={l.href} className="only-lively lively-link">
              {l.label}
            </a>
          ))}
          <ModeSwitch className="needs-js cursor-pointer text-left transition-colors hover:text-brand-accent">
            <span className="only-plain">{dict.mode.navLively}</span>
            <span className="only-lively">{dict.mode.toPlain}</span>
          </ModeSwitch>
          <LangSwitcher lang={lang} />
        </MobileMenu>
      </header>

      <main id="main" className="flex-1">{children}</main>

      <footer
        className="site-chrome gutter mt-28 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t py-6 label border-secondary-darker text-muted-foreground"
      >
        <span>{dict.footer.location}</span>
        <span className="flex gap-6">
          <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-brand-accent">
            {dict.footer.email}
          </a>
          <a href="https://github.com/Calle097" className="transition-colors hover:text-brand-accent">
            {dict.footer.github}
          </a>
          <a href="https://github.com/Calle097/MySite" className="transition-colors hover:text-brand-accent">
            {dict.footer.source}
          </a>
        </span>
      </footer>

      <RevealObserver />
      <LightBand />
      <TuneBar />
    </div>
  );
}
