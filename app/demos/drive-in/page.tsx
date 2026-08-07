import type { Metadata } from 'next';
import { DemoCards } from './DemoCards';

export const metadata: Metadata = {
  title: 'Drive-in cards — demo',
  robots: { index: false },
};

// Rendered bare (no site chrome) — designed to live inside the playground
// iframe, where this page's own scrollbar scrubs the animation.
export default function DriveInDemo() {
  return (
    <div className="px-6">
      <p
        className="pt-5 text-center font-mono text-xs uppercase tracking-[0.15em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Scroll ↓
      </p>

      <noscript>
        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          This demo needs JavaScript — it animates SVG paths as you scroll.
        </p>
      </noscript>

      {/* Scroll runway: the cards start below this frame's fold so the
          scroll-scrubbed entry has room to play. */}
      <div className="h-[65vh]" aria-hidden />

      <div className="mx-auto max-w-4xl">
        <DemoCards />
      </div>

      <p
        className="mt-10 text-center font-mono text-xs uppercase tracking-[0.15em]"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Hover a parked card
      </p>

      {/* Room below so the scrub reaches 100% before the page ends. */}
      <div className="h-[45vh]" aria-hidden />
    </div>
  );
}
