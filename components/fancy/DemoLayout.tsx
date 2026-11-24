import type { ReactNode } from 'react';
import { DEMOS, DEMO_SLUGS, type DemoSlug } from '@/lib/demos';
import { DICTS, type Lang } from '@/lib/i18n';
import { demoHref, pageHref } from '@/lib/pages';
import { EmbedMarker } from '../EmbedMarker';
import { PageLayout } from './PageLayout';

/**
 * Every demo page. Plain shows the demo alone; the fancier version adds its
 * column (back to the playground, title, caption, what it's built with, an
 * index of every demo) and frames the demo with crop marks. In the
 * playground's frames (#embed) only the demo shows.
 */
export function DemoLayout({ lang, slug, children }: { lang: Lang; slug: DemoSlug; children: ReactNode }) {
  const dict = DICTS[lang];
  const { title, caption } = dict.playground.items[slug];
  const { tech, source, needsJs } = DEMOS[slug];

  const hero = (
    <div data-part="hero" className="only-fancy">
      <a href={`${pageHref(lang, 'playground')}#${slug}`} className="fc-mono fc-back">
        ← {dict.nav.playground}
      </a>
      <h1 className="page-title">{title}</h1>
      <p data-part="blurb">{caption}</p>
      <p data-part="demo-meta">
        <span className="fc-mono">{tech}</span>
        <a href={source} className="fc-mono">
          {dict.playground.sourceLabel}
        </a>
      </p>
    </div>
  );

  return (
    <PageLayout
      lang={lang}
      hero={hero}
      index={{
        label: dict.nav.demos,
        items: DEMO_SLUGS.map((s) => ({ href: demoHref(lang, s), title: dict.playground.items[s].title })),
        current: DEMO_SLUGS.indexOf(slug),
      }}
    >
      <EmbedMarker />
      {/* Plain shows no column, so the page's heading is for screen readers. */}
      <h1 className="only-plain sr-only">{title}</h1>
      <div data-frame data-reveal="frame" data-part="demo">
        <div data-frame-view>
          {needsJs && (
            <noscript>
              <p className="mx-auto max-w-md px-6 pt-10 text-center text-sm leading-relaxed text-muted-foreground">
                {dict.demos.noscript}
              </p>
            </noscript>
          )}
          {children}
        </div>
      </div>
    </PageLayout>
  );
}
