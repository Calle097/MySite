import Link from 'next/link';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="gutter flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b pb-5 pt-6"
        style={{ borderColor: 'var(--secondary-darker)' }}
      >
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Mattia Callegher
        </Link>
        <nav className="flex gap-6 font-mono text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Link href="/playground/" className="transition-colors hover:text-(--brand-accent)">
            /playground
          </Link>
          <Link href="/stack/" className="transition-colors hover:text-(--brand-accent)">
            /stack
          </Link>
          <a href="/cv.pdf" className="transition-colors hover:text-(--brand-accent)">
            /cv ↓
          </a>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="gutter mt-28 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t py-6 font-mono text-xs uppercase tracking-[0.15em]"
        style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
      >
        <span>Mattia Callegher — Italy</span>
        <span className="flex gap-6">
          <a href="mailto:callegher.mattia00@gmail.com" className="transition-colors hover:text-(--brand-accent)">
            Email
          </a>
          <a href="https://github.com/Calle097" className="transition-colors hover:text-(--brand-accent)">
            GitHub
          </a>
          <a href="https://github.com/Calle097/MySite" className="transition-colors hover:text-(--brand-accent)">
            Source
          </a>
        </span>
      </footer>
    </div>
  );
}
