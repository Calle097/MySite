import type { ReactNode } from 'react';
import { DEMOS, DEMO_SLUGS, type DemoSlug } from '@/lib/demos';
import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { PageLayout } from './PageLayout';

/**
 * Every demo page's frame. Plain: the demo as it always was (the column's
 * text is fancier-only). The fancier version keeps its column, with the way
 * back to the playground, the demo's title, caption, what it is built with
 * and its source, and an index of every demo with this one lit; the demo
 * sits on the right in the same crop-mark frame as in the playground.
 *
 * Embedded in the playground (#embed, see components/EmbedMarker.tsx) the
 * column steps aside and only the demo shows (app/lively.css).
 */
export function DemoLayout({ lang, slug, children }: { lang: Lang; slug: DemoSlug; children: ReactNode }) {
  const dict = DICTS[lang];
  const p = prefix(lang);
  const { title, caption } = dict.playground.items[slug];
  const { tech, source } = DEMOS[slug];

  const hero = (
    <div data-part="hero" className="only-lively">
      <a href={`${p}/playground/#${slug}`} className="lv-mono lv-back">
        ← {dict.nav.playground}
      </a>
      <h1 className="page-title">{title}</h1>
      <p data-part="blurb">{caption}</p>
      <p data-part="demo-meta">
        <span className="lv-mono">{tech}</span>
        <a href={source} className="lv-mono">
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
        items: DEMO_SLUGS.map((s) => ({ href: `${p}/demos/${s}/`, title: dict.playground.items[s].title })),
        current: DEMO_SLUGS.indexOf(slug),
      }}
    >
      <div data-frame data-reveal="frame" data-part="demo">
        <div data-frame-view>{children}</div>
      </div>
    </PageLayout>
  );
}
