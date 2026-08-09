/**
 * The hairline rule that opens every section: a zero-padded index on the
 * left, the section name on the right. Home, playground, stack and the
 * colour lab all use it — extracted so the index formatting has exactly one
 * definition. Callers pass a 1-based number and never format it themselves.
 */
export function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="gutter label flex items-baseline justify-between border-b border-secondary-darker pb-3 text-muted-foreground">
      <span>{String(index).padStart(2, '0')}</span>
      <span>{title}</span>
    </div>
  );
}
