import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'What this site is made of.',
};

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: 'Built with',
    items: [
      'Next.js 15, static export — the server only ever sees plain files',
      'React 19, TypeScript',
      'Tailwind CSS 4',
      'Framer Motion, playground only',
      'Instrument Sans, self-hosted at build time — no third-party requests when you visit',
    ],
  },
  {
    title: 'Shipped by',
    items: [
      'GitHub Actions on every push to main',
      'rsync over SSH to the server',
      'Dependencies pinned to exact versions, install scripts disabled',
    ],
  },
  {
    title: 'Served from',
    items: [
      'A small VPS (1 vCPU, 1 GB RAM) running Ubuntu, managed by me',
      'Caddy in Docker, automatic HTTPS',
      'Cloudflare for DNS and caching',
    ],
  },
  {
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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">Colophon</h1>
      <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
        What this site is made of. The source is{' '}
        <a
          href="https://github.com/Calle097/MySite"
          className="underline underline-offset-2"
          style={{ color: 'var(--brand-accent)' }}
        >
          on GitHub
        </a>
        .
      </p>

      {SECTIONS.map((s) => (
        <section key={s.title} className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
            {s.title}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            {s.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden style={{ color: 'var(--brand-accent)' }}>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-12 border-t pt-6 text-sm leading-relaxed" style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}>
        Built with help from Claude Code, reviewed line by line.
      </p>
    </div>
  );
}
