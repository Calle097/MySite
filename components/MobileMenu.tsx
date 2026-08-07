'use client';

import { useEffect, useRef } from 'react';

/**
 * Mobile nav dropdown on a native <details>, so it stays usable with
 * JavaScript disabled (summary toggles open/closed). JS adds the extras:
 * closing on a tap outside. suppressHydrationWarning because the user can
 * toggle it before hydration, which legitimately changes the `open` attribute.
 */
export function MobileMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el?.open && e.target instanceof Node && !el.contains(e.target)) {
        el.open = false;
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <details ref={ref} suppressHydrationWarning className="sm:hidden">
      <summary
        className="cursor-pointer list-none font-mono text-sm select-none [&::-webkit-details-marker]:hidden"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {label}
      </summary>
      {/* Positioned against the sticky header (nearest positioned ancestor),
          so it spans the full width just below the glass. */}
      <div
        className="menu-panel absolute inset-x-0 top-full z-50 flex flex-col gap-5 border-b p-6 font-mono text-sm"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--secondary-darker)',
          color: 'var(--muted-foreground)',
          boxShadow: '0 18px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        {children}
      </div>
    </details>
  );
}
