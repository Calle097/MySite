import Link from 'next/link';

// Root-level so the static export's 404.html uses it. Renders without the
// (site) chrome, so it carries its own minimal frame.
export default function NotFound() {
  return (
    <div className="gutter flex min-h-dvh flex-col justify-center">
      <h1
        className="font-semibold leading-[0.98] tracking-tight"
        style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
      >
        404<span className="text-brand-accent">.</span>
      </h1>
      <p className="mt-6 label text-muted-foreground">
        Page not found —{' '}
        <Link href="/" className="underline underline-offset-4 transition-colors hover:text-brand-accent">
          Back home
        </Link>
      </p>
    </div>
  );
}
