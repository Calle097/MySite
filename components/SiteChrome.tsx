import Link from 'next/link';
import { DICTS, type Lang } from '@/lib/i18n';
import { PAGES, isFile, pageHref } from '@/lib/pages';
import { EMAIL, GITHUB_URL, NAME, SOURCE_URL } from '@/lib/site';
import { LangSwitcher } from './LangSwitcher';
import { MobileMenu } from './MobileMenu';
import { ModeSwitch } from './ModeSwitch';
import { RevealObserver } from './RevealObserver';
import { SkipLink } from './SkipLink';
import { LiquidBackground } from './fancy/LiquidBackground';

/**
 * Around every page: the skip link and plain's header and footer (the
 * fancier version brings its own, in PageLayout).
 */
export function SiteChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const dict = DICTS[lang];

  // Plain labels its pages as paths.
  const pathLinks = PAGES.map((page) => ({
    href: pageHref(lang, page),
    label: `/${page}${isFile(page) ? ' ↓' : ''}`,
    file: isFile(page),
  }));

  return (
    <div className="flex min-h-dvh flex-col">
      <LiquidBackground />
      <SkipLink label={dict.skipToContent} />

      <header className="site-chrome site-header only-plain gutter sticky top-0 z-40 flex items-baseline justify-between gap-x-6 border-b py-5 backdrop-blur-md">
        {/* The way into the fancier version, by the name. Below 360px it
            would wrap the header; the hero's line still offers it there. */}
        <span className="flex items-baseline gap-4">
          <Link href={pageHref(lang, 'home')} className="font-display text-lg font-semibold tracking-tight">
            {NAME}
          </Link>
          <ModeSwitch className="needs-js label cursor-pointer whitespace-nowrap text-muted-foreground transition-colors hover:text-brand-accent max-[22.5rem]:hidden">
            {dict.mode.getFancy}
          </ModeSwitch>
        </span>

        {/* The CV is a file: a plain <a> (see CV_PATH). */}
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

        {/* Plain <a>s: a full page load closes the menu. */}
        <MobileMenu label="menu ▾" navLabel={dict.nav.pages}>
          {pathLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-brand-accent">
              {l.label}
            </a>
          ))}
          <LangSwitcher lang={lang} />
        </MobileMenu>
      </header>

      <main className="flex-1">
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
