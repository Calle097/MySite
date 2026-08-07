import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight">404</h1>
      <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
        Page not found.{' '}
        <Link href="/" className="underline underline-offset-2" style={{ color: 'var(--brand-accent)' }}>
          Back home
        </Link>
        .
      </p>
    </div>
  );
}
