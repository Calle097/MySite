import { DICTS, type Lang } from '@/lib/i18n';

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

export function HomePage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div>
      <section className="gutter rise pt-14 sm:pt-20">
        <h1
          className="font-semibold leading-[1.04] tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}
        >
          {dict.hero.line1}
          <br />
          {dict.hero.line2}
          <span style={{ color: 'var(--brand-accent)' }}>.</span>
        </h1>

        <div
          className="mt-9 flex flex-wrap gap-x-10 gap-y-2 font-mono text-xs uppercase tracking-[0.15em]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {dict.hero.metaRow.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <p className="rise-late mt-10 max-w-[52ch] leading-relaxed sm:text-lg" style={{ color: 'var(--muted-foreground)' }}>
          {dict.hero.blurb}
        </p>
      </section>

      <section className="mt-20 sm:mt-28">
        <SectionHeader index="01" title={dict.work.header} />
        <ul>
          {dict.work.items.map((w) => (
            <li
              key={w.title}
              className="gutter group row-hover grid gap-x-10 gap-y-2 border-b py-7 sm:py-8 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.3fr)]"
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
          {dict.work.fullHistory}{' '}
          <a href="/cv.pdf" className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)">
            {dict.work.cvLabel}
          </a>
        </p>
      </section>

      <section className="mt-20 sm:mt-28">
        <SectionHeader index="02" title={dict.contact.header} />
        <div className="gutter pt-8 sm:pt-10">
          <a
            href="mailto:callegher.mattia00@gmail.com"
            className="group inline-flex items-baseline gap-3 font-semibold tracking-tight underline decoration-transparent underline-offset-8 transition-colors duration-300 hover:decoration-(--brand-accent)"
            style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2.5rem)', overflowWrap: 'anywhere' }}
          >
            callegher.mattia00@gmail.com
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              style={{ color: 'var(--brand-accent)' }}
            >
              ↗
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
