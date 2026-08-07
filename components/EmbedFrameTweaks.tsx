'use client';

import { useEffect } from 'react';

// When a demo page runs inside the playground iframe, hide its scrollbar
// rail (scrolling still works). Standalone visits keep the scrollbar.
export function EmbedFrameTweaks() {
  useEffect(() => {
    if (window.self !== window.top) {
      document.documentElement.classList.add('embedded');
    }
  }, []);
  return null;
}
