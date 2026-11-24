'use client';

import { useEffect, useState } from 'react';

/** Copies the address to the clipboard and confirms for a moment. */
export function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1800);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <button
      type="button"
      className="copy-email"
      onClick={() => {
        navigator.clipboard?.writeText(email).then(
          () => setDone(true),
          () => {
            /* clipboard refused (permissions, old browser): the address is right there to select */
          },
        );
      }}
    >
      <span aria-live="polite">{done ? copied : copy}</span>
    </button>
  );
}
