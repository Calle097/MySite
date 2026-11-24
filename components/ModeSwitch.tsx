'use client';

import { switchMode } from '@/lib/mode';

/**
 * A button that flips plain / fancy, with the circle growing from where it
 * was pressed.
 */
export function ModeSwitch({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
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
