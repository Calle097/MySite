const WORK = [
  {
    title: 'Management system for a gym franchise',
    where: '2020–2024',
    text: 'React + TypeScript, in production with 500+ users. I handled it end to end: requirements, development, Docker deployment.',
  },
  {
    title: 'Smart metering platform, energy sector',
    where: '2020–2023',
    text: 'QA engineer, later test manager. Test plans, Playwright automation, coordination with several development teams.',
  },
  {
    title: 'Freelance',
    where: '2024–present',
    text: 'Web apps with Next.js and React, TypeScript backends, Python automation and bots.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="max-w-3xl">
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Frontend developer
          <br />
          &amp; QA engineer
          <span style={{ color: 'var(--brand-accent)' }}>.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          I build web apps with React, Next.js and TypeScript. I started in QA,
          so I also test what I build. Based in Italy, looking for work in Japan.
        </p>
      </section>

      <section className="mt-24 grid gap-x-16 gap-y-6 lg:grid-cols-[180px_1fr]">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
          Work
        </h2>
        <ul className="max-w-2xl">
          {WORK.map((w) => (
            <li key={w.title} className="border-t py-6 first:border-t-0 first:pt-0 lg:first:pt-1" style={{ borderColor: 'var(--secondary-darker)' }}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{w.where}</span>
              </div>
              <p className="mt-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{w.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 grid gap-x-16 gap-y-6 lg:grid-cols-[180px_1fr]">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
          Contact
        </h2>
        <p className="max-w-2xl leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          More detail in the{' '}
          <a href="/cv.pdf" className="underline underline-offset-2" style={{ color: 'var(--brand-accent)' }}>
            CV
          </a>
          , or write to{' '}
          <a href="mailto:callegher.mattia00@gmail.com" className="underline underline-offset-2" style={{ color: 'var(--brand-accent)' }}>
            callegher.mattia00@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
