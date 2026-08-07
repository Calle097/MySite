import { DICTS, type Lang } from '@/lib/i18n';

export function StackPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div>
      <section className="gutter rise pt-8 sm:pt-12">
        <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}>
          {dict.stack.title}
        </h1>
        <p className="mt-5 max-w-[52ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {dict.stack.sourcePre}{' '}
          <a
            href="https://github.com/Calle097/MySite"
            className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)"
          >
            {dict.stack.sourceLabel}
          </a>
          .
        </p>
      </section>

      {dict.stack.sections.map((s) => (
        <section key={s.index} className="mt-14 sm:mt-16">
          <div
            className="gutter flex items-baseline justify-between border-b pb-3 font-mono text-xs uppercase tracking-[0.15em]"
            style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
          >
            <span>{s.index}</span>
            <span>{s.title}</span>
          </div>
          <ul className="gutter max-w-3xl space-y-2.5 pt-5 leading-relaxed">
            {s.items.map((item) => (
              <li key={item} className="flex gap-4">
                <span aria-hidden style={{ color: 'var(--brand-accent)' }}>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="gutter mt-16 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {dict.stack.aiLine}
      </p>
    </div>
  );
}
