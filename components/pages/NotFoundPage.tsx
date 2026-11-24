import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { LiquidBackground } from '@/components/fancy/LiquidBackground';
import { PageLayout } from '@/components/fancy/PageLayout';

/**
 * Rendered by the real routes at /not-found/ and /it/not-found/, which Caddy serves for
 * any unmatched path (see deploy/Caddyfile). It is NOT Next's `not-found.tsx`:
 * with a root layout per language and no `app/layout.tsx`, Next has nothing to
 * wrap `/_not-found` in, so it falls back to its own unstyled page — the
 * previous `app/(en)/not-found.tsx` never rendered on any path.
 *
 * Plain: no site chrome, just "404." and one plain <a> home, so the router
 * starts from a clean URL. The fancier version keeps its column (its links
 * are absolute, so they work under whatever URL was mistyped) and lists
 * where to go on the right, one hint per page. This page has no SiteChrome,
 * so it brings the light itself.
 */
export function NotFoundPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const p = prefix(lang);
  const { hints } = dict.notFound;
  const destinations = [
    { href: `${p}/`, name: 'Home', hint: hints.home },
    { href: `${p}/about/`, name: dict.nav.about, hint: hints.about },
    { href: `${p}/playground/`, name: dict.nav.playground, hint: hints.playground },
    { href: `${p}/stack/`, name: dict.nav.stack, hint: hints.stack },
    { href: '/cv.pdf', name: `${dict.nav.cv} ↓`, hint: hints.cv },
  ];

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
        <a href={`${p}/`} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
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
    </>
  );
}
