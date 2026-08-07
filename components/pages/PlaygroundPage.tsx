import { DICTS, prefix, type Lang } from '@/lib/i18n';

// Repo paths for each demo's "Source ↗" link, keyed by slug.
const SOURCES: Record<string, string> = {
  'drive-in': 'https://github.com/Calle097/MySite/blob/main/components/DriveInCards.tsx',
  spiral: 'https://github.com/Calle097/MySite/blob/main/components/SpiralDots.tsx',
  'css-effects': 'https://github.com/Calle097/MySite/blob/main/components/css-effects.css',
  sakura: 'https://github.com/Calle097/MySite/blob/main/components/SakuraBadge.tsx',
};

export function PlaygroundPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const p = prefix(lang);

  return (
    <div>
      <section className="gutter rise pt-8 sm:pt-12">
        <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}>
          {dict.playground.title}
        </h1>
        <p className="mt-6 max-w-[52ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {dict.playground.intro}
        </p>
      </section>

      {dict.playground.demos.map((demo, i) => {
        const src = `${p}/demos/${demo.slug}/`;
        return (
          <section key={demo.slug} className="mt-20 sm:mt-24">
            <div
              className="gutter flex items-baseline justify-between border-b pb-3 font-mono text-xs uppercase tracking-[0.15em]"
              style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{demo.title}</span>
            </div>

            <div className="gutter grid gap-x-14 gap-y-8 pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{demo.title}</h2>
                <p className="mt-4 max-w-[48ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {demo.caption}
                </p>
                <p className="mt-6 flex gap-6 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
                  <a href={src} className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)">
                    {dict.playground.openLabel}
                  </a>
                  {SOURCES[demo.slug] && (
                    <a
                      href={SOURCES[demo.slug]}
                      className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)"
                    >
                      {dict.playground.sourceLabel}
                    </a>
                  )}
                </p>
              </div>

              <iframe
                src={src}
                title={demo.title}
                loading="lazy"
                className="h-[400px] w-full border sm:h-[540px]"
                style={{ borderColor: 'var(--secondary-darker)', background: 'var(--background)' }}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
