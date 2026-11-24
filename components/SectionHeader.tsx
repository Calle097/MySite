import { twoDigits } from '@/lib/format';

/**
 * The rule that opens a section: its number on the left, its name on the
 * right. The name is the section's <h2> (preflight makes it render like any
 * text); the playground passes `as="span"` because its body repeats the
 * title as the real heading.
 */
export function SectionHeader({
  index,
  title,
  as: Title = 'h2',
  className = '',
}: {
  /** Plain's number; the fancier version counts its sections in CSS. */
  index: number;
  title: string;
  as?: 'h2' | 'span';
  className?: string;
}) {
  return (
    <div
      data-rule
      data-reveal="rule"
      className={`gutter label flex items-baseline justify-between border-b border-secondary-darker pb-3 text-muted-foreground ${className}`}
    >
      <span>{twoDigits(index)}</span>
      <Title>{title}</Title>
    </div>
  );
}
