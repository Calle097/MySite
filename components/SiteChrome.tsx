import Link from 'next/link';
import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { PAGES, isFile, pageHref } from '@/lib/pages';
import { EMAIL, GITHUB_URL, SOURCE_URL } from '@/lib/site';
import { LangSwitcher } from './LangSwitcher';
import { MobileMenu } from './MobileMenu';
import { ModeSwitch } from './ModeSwitch';
import { RevealObserver } from './RevealObserver';
import { LiquidBackground } from './fancy/LiquidBackground';

/**
 * The site's frame around every page: the skip link, and plain mode's
 * header and footer. The fancier version has its own header, index and footer
 * inside each page's layout (components/fancy/PageLayout.tsx), so the two
 * here are plain only.
 */
export function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const dict = DICTS[lang];
  const p = prefix(lang);

  // File-path labels, plain mode's look.
  const pathLinks = PAGES.map((page) => ({
    href: pageHref(lang, page),
    label: `/${page}${isFile(page) ? ' ↓' : ''}`,
    file: isFile(page),
  }));

  return (
    <div className="flex min-h-dvh flex-col">
      <LiquidBackground />
      <a
        href="#main"
        className="site-chrome sr-only font-mono text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 bg-brand-accent text-background"
      >
        {dict.skipToContent}
      </a>

      <header className="site-chrome site-header only-plain gutter sticky top-0 z-40 flex items-baseline justify-between gap-x-6 border-b py-5 backdrop-blur-md">
        {/* The way into the fancier version sits by the name instead of
            among the pages. Below 360px it would push the header to two
            lines, so it steps aside there; the hero's line still offers it. */}
        <span className="flex items-baseline gap-4">
          <Link href={`${p}/`} className="font-display text-lg font-semibold tracking-tight">
            Mattia Callegher
          </Link>
          <ModeSwitch className="needs-js label cursor-pointer whitespace-nowrap text-muted-foreground transition-colors hover:text-brand-accent max-[22.5rem]:hidden">
            {dict.mode.getFancy}
          </ModeSwitch>
        </span>

        {/* Desktop nav. The CV is a file, not a route — a Next <Link> would
            prefetch it as an RSC payload (cv.pdf.txt → 404), so it gets a
            plain <a>. */}
        <nav className="hidden items-baseline gap-6 font-mono text-sm nav:flex text-muted-foreground">
          {pathLinks.map((l) =>
            l.file ? (
              <a key={l.href} href={l.href} className="transition-colors hover:text-brand-accent">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-brand-accent">
                {l.label}
              </Link>
            ),
          )}
          <LangSwitcher lang={lang} />
        </nav>

        {/* Mobile nav — plain <a> links so navigation is a document load and
            the menu closes on selection. */}
        <MobileMenu label="menu ▾">
          {pathLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-brand-accent">
              {l.label}
            </a>
          ))}
          <LangSwitcher lang={lang} />
        </MobileMenu>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="site-chrome only-plain gutter mt-28 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t py-6 label border-secondary-darker text-muted-foreground">
        <span>{dict.footer.location}</span>
        <span className="flex gap-6">
          <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-brand-accent">
            {dict.footer.email}
          </a>
          <a href={GITHUB_URL} className="transition-colors hover:text-brand-accent">
            {dict.footer.github}
          </a>
          <a href={SOURCE_URL} className="transition-colors hover:text-brand-accent">
            {dict.footer.source}
          </a>
        </span>
      </footer>

      <RevealObserver />
    </div>
  );
}
