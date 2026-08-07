import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Component experiments, each running in its own frame.',
};

const DEMOS = [
  {
    index: '01',
    title: 'Drive-in cards',
    caption:
      'SVG path morph driven by scroll: items arrive as vans, park as cards. Hover a parked card to wake it. Scroll inside the frame.',
    src: '/demos/drive-in/',
    source: 'https://github.com/Calle097/MySite/blob/main/components/DriveInCards.tsx',
  },
];

export default function Playground() {
  return (
    <div>
      <section className="gutter rise pt-16 sm:pt-24">
        <h1
          className="font-display font-semibold leading-[0.98] tracking-tight"
          style={{ fontSize: 'clamp(2.75rem, 6.5vw, 6rem)' }}
        >
          Playground
        </h1>
        <p
          className="mt-6 font-mono text-xs uppercase tracking-[0.15em]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Component experiments — each demo runs in its own frame
        </p>
      </section>

      {DEMOS.map((demo) => (
        <section key={demo.index} className="mt-20 sm:mt-24">
          <div
            className="gutter flex items-baseline justify-between border-b pb-3 font-mono text-xs uppercase tracking-[0.15em]"
            style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
          >
            <span>{demo.index}</span>
            <span>{demo.title}</span>
          </div>

          <div className="gutter grid gap-x-14 gap-y-8 pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{demo.title}</h2>
              <p className="mt-4 max-w-[48ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {demo.caption}
              </p>
              <p
                className="mt-6 flex gap-6 font-mono text-xs uppercase tracking-[0.15em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <a href={demo.src} className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)">
                  Open ↗
                </a>
                <a href={demo.source} className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)">
                  Source ↗
                </a>
              </p>
            </div>

            <iframe
              src={demo.src}
              title={`${demo.title} demo`}
              loading="lazy"
              className="h-[540px] w-full border"
              style={{ borderColor: 'var(--secondary-darker)', background: 'var(--background)' }}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
