const WORK = [
  {
    title: 'Management system for a gym franchise',
    where: '2020 — 2024',
    text: 'React + TypeScript, in production with 500+ users. Handled end to end: requirements, development, Docker deployment.',
  },
  {
    title: 'Smart metering platform, energy sector',
    where: '2020 — 2023',
    text: 'QA engineer, later test manager. Test plans, Playwright automation, coordination with several development teams.',
  },
  {
    title: 'Freelance',
    where: '2024 — now',
    text: 'Web apps with Next.js and React, TypeScript backends, Python automation and bots.',
  },
];

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div
      className="gutter flex items-baseline justify-between border-b pb-3 font-mono text-xs uppercase tracking-[0.15em]"
      style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
    >
      <span>{index}</span>
      <span>{title}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <section className="gutter rise pt-16 sm:pt-24">
        <h1
          className="font-display font-semibold leading-[0.98] tracking-tight"
          style={{ fontSize: 'clamp(3.25rem, 8.5vw, 8.5rem)' }}
        >
          Frontend developer
          <br />
          &amp; QA engineer
          <span style={{ color: 'var(--brand-accent)' }}>.</span>
        </h1>

        <div
          className="mt-12 flex flex-wrap gap-x-10 gap-y-2 font-mono text-xs uppercase tracking-[0.15em] sm:mt-16"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <span>Based in Italy</span>
          <span>Open to work in Japan</span>
          <span>React · Next.js · TypeScript · Playwright</span>
        </div>

        <p
          className="rise-late mt-14 max-w-[52ch] text-lg leading-relaxed sm:text-xl"
          style={{ color: 'var(--muted-foreground)' }}
        >
          I build web apps with React, Next.js and TypeScript. I started in QA,
          so I also test what I build.
        </p>
      </section>

      <section className="mt-28 sm:mt-36">
        <SectionHeader index="01" title="Work" />
        <ul>
          {WORK.map((w) => (
            <li
              key={w.title}
              className="gutter group grid gap-x-10 gap-y-2 border-b py-8 sm:py-10 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1.3fr)]"
              style={{ borderColor: 'var(--secondary-darker)' }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.15em] lg:pt-2" style={{ color: 'var(--muted-foreground)' }}>
                {w.where}
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-3xl">
                {w.title}
              </h3>
              <p className="max-w-[55ch] leading-relaxed lg:pt-1" style={{ color: 'var(--muted-foreground)' }}>
                {w.text}
              </p>
            </li>
          ))}
        </ul>
        <p className="gutter pt-5 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
          Full history —{' '}
          <a href="/cv.pdf" className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)">
            CV (PDF)
          </a>
        </p>
      </section>

      <section className="mt-28 sm:mt-36">
        <SectionHeader index="02" title="Contact" />
        <div className="gutter pt-10 sm:pt-14">
          <a
            href="mailto:callegher.mattia00@gmail.com"
            className="font-display font-semibold tracking-tight underline decoration-transparent underline-offset-8 transition-colors duration-300 hover:decoration-(--brand-accent)"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 4.25rem)', overflowWrap: 'anywhere' }}
          >
            callegher.mattia00@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
