import type { ReactNode } from 'react';

/**
 * The top of a page with a plain title: About, Stack, Playground. Plain
 * shows the title and the blurb; the fancier version puts all of it in its
 * column, with `place` (fancier only) as the small line under it.
 */
export function PageHero({ title, blurb, place }: { title: string; blurb?: ReactNode; place: ReactNode }) {
  return (
    <section data-part="hero" className="gutter rise pt-8 sm:pt-12">
      <h1 className="page-title font-semibold tracking-tight">{title}</h1>
      {blurb && (
        <p data-part="blurb" className="mt-6 max-w-[52ch] leading-relaxed text-muted-foreground">
          {blurb}
        </p>
      )}
      <p data-part="place" className="only-fancy fc-mono">
        {place}
      </p>
    </section>
  );
}
