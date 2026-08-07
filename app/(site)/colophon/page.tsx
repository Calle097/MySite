import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'What this site is made of.',
};

const SECTIONS: { index: string; title: string; items: string[] }[] = [
  {
    index: '01',
    title: 'Built with',
    items: [
      'Next.js 15, static export — the server only ever sees plain files',
      'React 19, TypeScript',
      'Tailwind CSS 4',
      'Framer Motion, playground only',
      'Bricolage Grotesque, Instrument Sans, IBM Plex Mono — self-hosted at build, no third-party requests when you visit',
    ],
  },
  {
    index: '02',
    title: 'Shipped by',
    items: [
      'GitHub Actions on every push to main',
      'rsync over SSH to the server',
      'Dependencies pinned to exact versions, install scripts disabled',
    ],
  },
  {
    index: '03',
    title: 'Served from',
    items: [
      'A small VPS (1 vCPU, 1 GB RAM) running Ubuntu, managed by me',
      'Caddy in Docker, automatic HTTPS',
      'Cloudflare for DNS and caching',
    ],
  },
  {
    index: '04',
    title: 'Privacy',
    items: [
      'No analytics, cookies, or tracking at the moment',
      'If I add analytics later, it will be self-hosted and cookie-free, and listed here',
      'Everything except the playground works without JavaScript',
    ],
  },
];

export default function Colophon() {
  return (
    <div>
      <section className="gutter rise pt-16 sm:pt-24">
        <h1
          className="font-display font-semibold leading-[0.98] tracking-tight"
          style={{ fontSize: 'clamp(2.75rem, 6.5vw, 6rem)' }}
        >
          Colophon
        </h1>
        <p className="mt-6 max-w-[52ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          What this site is made of. The source is{' '}
          <a
            href="https://github.com/Calle097/MySite"
            className="underline underline-offset-4 transition-colors hover:text-(--brand-accent)"
            style={{ color: 'var(--foreground)' }}
          >
            on GitHub
          </a>
          .
        </p>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.index} className="mt-16 sm:mt-20">
          <div
            className="gutter flex items-baseline justify-between border-b pb-3 font-mono text-xs uppercase tracking-[0.15em]"
            style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
          >
            <span>{s.index}</span>
            <span>{s.title}</span>
          </div>
          <ul className="gutter max-w-3xl space-y-3 pt-6 leading-relaxed">
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
        className="gutter mt-20 font-mono text-xs uppercase tracking-[0.15em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Built with help from Claude Code, reviewed line by line
      </p>
    </div>
  );
}
