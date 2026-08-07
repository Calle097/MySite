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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Frontend developer &amp; QA engineer
      </h1>

      <p className="mt-6 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
        I build web apps with React, Next.js and TypeScript. I started in QA,
        so I also test what I build. Based in Italy, looking for work in Japan.
      </p>

      <h2 className="mt-14 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
        Work
      </h2>
      <ul className="mt-4">
        {WORK.map((w) => (
          <li key={w.title} className="border-t py-5" style={{ borderColor: 'var(--secondary-darker)' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">{w.title}</h3>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{w.where}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{w.text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm" style={{ color: 'var(--muted-foreground)' }}>
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
    </div>
  );
}
