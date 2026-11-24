import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { DEMOS, DEMO_SLUGS } from '@/lib/demos';
import { SectionHeader } from '@/components/SectionHeader';
import { PageLayout } from '@/components/fancy/PageLayout';

/**
 * Plain: each demo as a section, its text beside it and the demo's page in
 * a hairline box. The fancier version (app/fancy.css) stacks each one as
 * title, the live demo in a frame of crop marks, then the caption, what it
 * is built with and its links; the index in the column lists the demos.
 */
export function PlaygroundPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const p = prefix(lang);
  const sections = DEMO_SLUGS.map((slug) => ({ id: slug, title: dict.playground.items[slug].title }));

  const hero = (
    <section data-part="hero" className="gutter rise pt-8 sm:pt-12">
      <h1 className="page-title font-semibold tracking-tight">{dict.playground.title}</h1>
      <p data-part="blurb" className="mt-6 max-w-[52ch] leading-relaxed text-muted-foreground">
        {dict.playground.intro}
      </p>
      <p data-part="place" className="only-fancy fc-mono">
        {dict.playground.summary}
      </p>
    </section>
  );

  return (
    <PageLayout lang={lang} hero={hero} sections={sections}>
      <div data-part="demos" className="pb-10">
        {DEMO_SLUGS.map((slug, i) => {
          const { height, source, tech } = DEMOS[slug];
          const { title, caption } = dict.playground.items[slug];
          const src = `${p}/demos/${slug}/`;

          return (
            <section key={slug} id={slug} data-section className="mt-20 sm:mt-24">
              {/* The demo's own <h2> is below, in the body column — the rule
                  stays presentational here so the title is not a heading twice. */}
              <SectionHeader index={i + 1} title={title} as="span" />

              <div
                data-entry
                data-part="demo-entry"
                className="gutter grid gap-x-14 gap-y-8 pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
              >
                <div data-part="demo-text">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
                  <p className="mt-4 max-w-[48ch] leading-relaxed text-muted-foreground">{caption}</p>
                  <span data-part="tech" className="only-fancy fc-mono">
                    {tech}
                  </span>
                  <p data-demo-links className="label mt-6 flex gap-6 text-muted-foreground">
                    <a href={src} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
                      {dict.playground.openLabel}
                    </a>
                    <a href={source} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
                      {dict.playground.sourceLabel}
                    </a>
                  </p>
                </div>

                <div data-frame data-reveal="frame">
                  {/* The iframe stays transparent until its document paints, so a
                      loading label sits behind it and is covered on load.
                      overflow-hidden: children can never paint over the border,
                      regardless of fractional-pixel rounding at any zoom level. */}
                  <div data-frame-view className={`relative w-full overflow-hidden border border-secondary-darker ${height}`}>
                    <span
                      aria-hidden
                      className="label absolute inset-0 flex animate-pulse items-center justify-center text-muted-foreground"
                    >
                      {dict.playground.loading} —
                    </span>
                    <iframe
                      src={`${src}#embed`}
                      title={title}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="relative block h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </PageLayout>
  );
}
