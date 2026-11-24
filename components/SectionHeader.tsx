/**
 * The hairline rule that opens every section: a zero-padded index on the
 * left, the section name on the right. Home, playground and stack all use it
 * — extracted so the index formatting has exactly one definition. Callers
 * pass a 1-based number and never format it themselves.
 *
 * The title is the section's <h2>, so the heading structure matches the one
 * these rules already draw on screen. Without it the home page jumps from its
 * <h1> straight to the <h3> of each entry, and the section names exist only as
 * unlabelled text. Purely semantic: Tailwind's preflight resets heading
 * font-size and weight to inherit, so the tag renders identically to the span
 * it replaced.
 *
 * Playground passes `as="span"` — it repeats the same title as a real heading
 * in the section body, and two identical headings in a row are just noise to
 * a screen reader.
 *
 * (Watch the wording here: Tailwind v4 harvests class candidates from every
 * source file, comments included, so a stray utility name in this block ends
 * up as a real rule in the stylesheet.)
 */
export function SectionHeader({
  index,
  title,
  as: Title = 'h2',
  className = '',
}: {
  index: number;
  title: string;
  as?: 'h2' | 'span';
  /** Extra classes, e.g. only-fancy for a title only the fancier version shows. */
  className?: string;
}) {
  return (
    // data-rule: a styling hook for the fancier version (app/fancy.css), where the
    // label also reveals as a "rule" (lib/reveal.ts).
    <div
      data-rule
      data-reveal="rule"
      className={`gutter label flex items-baseline justify-between border-b border-secondary-darker pb-3 text-muted-foreground ${className}`}
    >
      <span>{String(index).padStart(2, '0')}</span>
      <Title>{title}</Title>
    </div>
  );
}
