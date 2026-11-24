'use client';

import { useEffect, useRef } from 'react';

/**
 * Mobile nav dropdown on a native <details>, so it stays usable with
 * JavaScript disabled (summary toggles open/closed). JS adds the extras:
 * closing on a tap outside and on Escape. suppressHydrationWarning because
 * the user can toggle it before hydration, which legitimately changes the
 * `open` attribute.
 */
export function MobileMenu({
  label,
  navLabel,
  children,
}: {
  label: React.ReactNode;
  /** The panel is the page's navigation on phones: its accessible name. */
  navLabel: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el?.open && e.target instanceof Node && !el.contains(e.target)) {
        el.open = false;
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const el = ref.current;
      if (e.key === 'Escape' && el?.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <details ref={ref} suppressHydrationWarning className="nav:hidden">
      <summary
        className="cursor-pointer list-none font-mono text-sm select-none [&::-webkit-details-marker]:hidden text-muted-foreground">
        {label}
      </summary>
      {/* Positioned against the sticky header (nearest positioned ancestor),
          so it spans the full width just below the glass. */}
      <nav
        aria-label={navLabel}
        className="menu-panel absolute inset-x-0 top-full z-50 flex flex-col gap-5 border-b p-6 font-mono text-sm"
      >
        {children}
      </nav>
    </details>
  );
}
