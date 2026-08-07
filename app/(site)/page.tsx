const WORK = [
  {
    title: 'Management system for a gym franchise',
    where: '2020 — 2021',
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
      <section className="gutter rise pt-14 sm:pt-20">
        <h1
          className="font-semibold leading-[1.04] tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}
        >
          Frontend developer
          <br />
          &amp; QA engineer
          <span style={{ color: 'var(--brand-accent)' }}>.</span>
        </h1>

        <div
          className="mt-9 flex flex-wrap gap-x-10 gap-y-2 font-mono text-xs uppercase tracking-[0.15em]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <span>Based in Italy</span>
          <span>Interested in working in Japan</span>
          <span>React · Next.js · TypeScript · Playwright</span>
        </div>

        <p
          className="rise-late mt-10 max-w-[52ch] leading-relaxed sm:text-lg"
          style={{ color: 'var(--muted-foreground)' }}
        >
          I build web apps with React, Next.js and TypeScript. I started in QA,
          so I also test what I build.
        </p>
      </section>

      <section className="mt-20 sm:mt-28">
        <SectionHeader index="01" title="Work" />
        <ul>
          {WORK.map((w) => (
            <li
              key={w.title}
              className="gutter group grid gap-x-10 gap-y-2 border-b py-7 sm:py-8 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.3fr)]"
              style={{ borderColor: 'var(--secondary-darker)' }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.15em] lg:pt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                {w.where}
              </span>
              <h3 className="text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl">
                {w.title}
              </h3>
              <p className="max-w-[55ch] leading-relaxed lg:pt-0.5" style={{ color: 'var(--muted-foreground)' }}>
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

      <section className="mt-20 sm:mt-28">
        <SectionHeader index="02" title="Contact" />
        <div className="gutter pt-8 sm:pt-10">
          <a
            href="mailto:callegher.mattia00@gmail.com"
            className="font-semibold tracking-tight underline decoration-transparent underline-offset-8 transition-colors duration-300 hover:decoration-(--brand-accent)"
            style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2.5rem)', overflowWrap: 'anywhere' }}
          >
            callegher.mattia00@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
