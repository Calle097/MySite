import { DICTS, type Lang } from '@/lib/i18n';
import { PAGES, isFile, pageHref } from '@/lib/pages';
import { SkipLink } from '@/components/SkipLink';
import { LiquidBackground } from '@/components/fancy/LiquidBackground';
import { PageLayout } from '@/components/fancy/PageLayout';

/**
 * The 404: real routes at /not-found/ and /it/not-found/, which Caddy serves
 * for any unmatched path. Not Next's not-found.tsx, which renders unstyled
 * with one root layout per language.
 *
 * It has no SiteChrome. Plain shows "404." and a link home; the fancier
 * version keeps its column and lists where to go. Every link is absolute,
 * so it works under whatever path was mistyped.
 */
export function NotFoundPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const destinations = PAGES.map((page) => ({
    href: pageHref(lang, page),
    name: `${dict.nav[page]}${isFile(page) ? ' ↓' : ''}`,
    hint: dict.notFound.hints[page],
  }));

  const hero = (
    <div data-part="hero" className="gutter flex min-h-dvh flex-col justify-center">
      <h1 className="notfound-title font-semibold leading-[0.98] tracking-tight">
        404
        <span data-part="dot" className="text-brand-accent">
          .
        </span>
      </h1>
      <p className="only-plain mt-6 label text-muted-foreground">
        {dict.notFound.text}{' '}
        <a href={pageHref(lang, 'home')} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
          {dict.notFound.back}
        </a>
      </p>
      <p data-part="blurb" className="only-fancy">
        {dict.notFound.title}
      </p>
    </div>
  );

  return (
    <>
      <LiquidBackground />
      {/* SiteChrome holds these on every other page. */}
      <SkipLink label={dict.skipToContent} />
      <main>
        <PageLayout lang={lang} hero={hero}>
          <section data-part="where" className="only-fancy" aria-labelledby="where-to-go">
            <h2 id="where-to-go" className="fc-mono">
              {dict.notFound.where}
            </h2>
            <ul className="fc-where">
              {destinations.map((d) => (
                <li key={d.href}>
                  <a href={d.href}>
                    <span className="fc-where-name">{d.name}</span>
                    <span className="fc-where-hint">{d.hint}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </PageLayout>
      </main>
    </>
  );
}
