import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stack',
  description: 'How this site is built and hosted.',
};

const SECTIONS: { index: string; title: string; items: string[] }[] = [
  {
    index: '01',
    title: 'Stack',
    items: [
      'Next.js 15, static export — served as plain files',
      'React 19, TypeScript, Tailwind CSS 4',
      'Framer Motion, playground only',
      'Archivo + IBM Plex Mono, self-hosted — no third-party requests',
    ],
  },
  {
    index: '02',
    title: 'Hosting',
    items: [
      'A small VPS I manage myself, Caddy in Docker, Cloudflare DNS',
      'Built and deployed by GitHub Actions on every push',
    ],
  },
  {
    index: '03',
    title: 'Privacy',
    items: [
      'No analytics, cookies, or tracking',
      'Works without JavaScript, except the playground',
    ],
  },
];

export default function Stack() {
  return (
    <div>
      <section className="gutter rise pt-14 sm:pt-20">
        <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}>
          How this site is built
        </h1>
        <p className="mt-5 max-w-[52ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          The source is{' '}
          <a
            href="https://github.com/Calle097/MySite"
            className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)"
          >
            on GitHub
          </a>
          .
        </p>
      </section>

      {SECTIONS.map((s) => (
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

      <p
        className="gutter mt-16 font-mono text-xs uppercase tracking-[0.15em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Built with help from Claude Code, reviewed line by line
      </p>
    </div>
  );
}
