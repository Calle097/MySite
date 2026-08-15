import { DICTS, prefix, type Lang } from '@/lib/i18n';

/**
 * Rendered by the real routes at /404/ and /it/404/, which Caddy serves for
 * any unmatched path (see deploy/Caddyfile). It is NOT Next's `not-found.tsx`:
 * with a root layout per language and no `app/layout.tsx`, Next has nothing to
 * wrap `/_not-found` in, so it falls back to its own unstyled page — the
 * previous `app/(en)/not-found.tsx` never rendered on any path.
 *
 * No site chrome: the header links are relative to a language tree, and this
 * page is served under whatever URL the visitor mistyped. One link home is
 * enough, and it is a plain <a> so the router starts from a clean URL.
 */
export function NotFoundPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div className="gutter flex min-h-dvh flex-col justify-center">
      <h1
        className="font-semibold leading-[0.98] tracking-tight"
        style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
      >
        404<span className="text-brand-accent">.</span>
      </h1>
      <p className="mt-6 label text-muted-foreground">
        {dict.notFound.text}{' '}
        <a
          href={`${prefix(lang)}/`}
          className="underline underline-offset-4 transition-colors hover:text-brand-accent"
        >
          {dict.notFound.back}
        </a>
      </p>
    </div>
  );
}
