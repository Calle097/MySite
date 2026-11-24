'use client';

import { useEffect, useRef } from 'react';
import { MODE_EVENT } from '@/lib/mode';

/**
 * The canvas for the fancier version's liquid light. The light itself
 * (lib/fancy/liquid-light.ts) is imported only once the fancier version is on, so
 * plain visitors never download it; it stops when the mode goes back to
 * plain. Never inside a frame: the playground embeds each demo's page, and
 * seven copies of the light at once would be heavy.
 */
export function LiquidBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.self !== window.top) return;
    const html = document.documentElement;
    let stop: (() => void) | null = null;
    let starting = false;
    let gone = false;

    const sync = async () => {
      const fancy = html.dataset.mode === 'fancy';
      if (fancy && !stop && !starting && canvas.current) {
        starting = true;
        const { startLiquidLight } = await import('@/lib/fancy/liquid-light');
        starting = false;
        // The mode (or the page) may have changed while it loaded.
        if (!gone && html.dataset.mode === 'fancy' && canvas.current) stop = startLiquidLight(canvas.current);
      } else if (!fancy && stop) {
        stop();
        stop = null;
      }
    };

    void sync();
    window.addEventListener(MODE_EVENT, sync);
    return () => {
      gone = true;
      window.removeEventListener(MODE_EVENT, sync);
      stop?.();
    };
  }, []);

  return <canvas ref={canvas} className="fc-light only-fancy" aria-hidden />;
}
