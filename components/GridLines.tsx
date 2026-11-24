import { revealOrder } from '@/lib/reveal';

/**
 * Lively mode's column lines: the grid the page's content is laid out on,
 * drawn as hairlines running the height of the window. 12 columns on wide
 * screens, 6 and 4 on narrower ones (app/lively.css hides the extras). Each
 * line carries its order so the switch can draw them in one after another.
 */
export function GridLines() {
  return (
    <div aria-hidden className="grid-lines only-lively">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} style={revealOrder(i)} />
      ))}
    </div>
  );
}
