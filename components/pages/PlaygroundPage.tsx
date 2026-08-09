import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { DEMOS, DEMO_SLUGS } from '@/lib/demos';
import { SectionHeader } from '@/components/SectionHeader';

export function PlaygroundPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const p = prefix(lang);

  return (
    <div className="pb-10">
      <section className="gutter rise pt-8 sm:pt-12">
        <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}>
          {dict.playground.title}
        </h1>
        <p className="mt-6 max-w-[52ch] leading-relaxed text-muted-foreground">{dict.playground.intro}</p>
      </section>

      {DEMO_SLUGS.map((slug, i) => {
        const { height, source } = DEMOS[slug];
        const { title, caption } = dict.playground.items[slug];
        const src = `${p}/demos/${slug}/`;

        return (
          <section key={slug} className="mt-20 sm:mt-24">
            <SectionHeader index={i + 1} title={title} />

            <div className="gutter grid gap-x-14 gap-y-8 pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
                <p className="mt-4 max-w-[48ch] leading-relaxed text-muted-foreground">{caption}</p>
                <p className="label mt-6 flex gap-6 text-muted-foreground">
                  <a href={src} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
                    {dict.playground.openLabel}
                  </a>
                  <a href={source} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
                    {dict.playground.sourceLabel}
                  </a>
                </p>
              </div>

              {/* The iframe stays transparent until its document paints, so a
                  loading label sits behind it and is covered on load. */}
              {/* overflow-hidden: children can never paint over the border,
                  regardless of fractional-pixel rounding at any zoom level. */}
              <div className={`relative w-full overflow-hidden border border-secondary-darker ${height}`}>
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
          </section>
        );
      })}
    </div>
  );
}
