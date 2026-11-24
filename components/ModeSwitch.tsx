'use client';

import { switchMode } from '@/lib/mode';

/**
 * A button that flips plain / lively, with the circle growing from where it
 * was pressed. Pass `on` to present it as a switch (role="switch") showing
 * that state, as the lively header's toggle does.
 */
export function ModeSwitch({
  className,
  on,
  children,
}: {
  className?: string;
  on?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role={on === undefined ? undefined : 'switch'}
      aria-checked={on}
      className={className}
      onClick={(e) => {
        // A keyboard press reports 0,0, so start the circle from the button.
        const r = e.currentTarget.getBoundingClientRect();
        const keyboard = e.detail === 0;
        void switchMode(keyboard ? r.left + r.width / 2 : e.clientX, keyboard ? r.top + r.height / 2 : e.clientY);
      }}
    >
      {children}
    </button>
  );
}
