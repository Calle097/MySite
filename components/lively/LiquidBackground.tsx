'use client';

import { useEffect, useRef } from 'react';
import { MODE_EVENT } from '@/lib/mode';

/**
 * The canvas for lively mode's liquid light. The light itself
 * (lib/lively/liquid-light.ts) is imported only once lively mode is on, so
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
      const lively = html.dataset.mode === 'lively';
      if (lively && !stop && !starting && canvas.current) {
        starting = true;
        const { startLiquidLight } = await import('@/lib/lively/liquid-light');
        starting = false;
        // The mode (or the page) may have changed while it loaded.
        if (!gone && html.dataset.mode === 'lively' && canvas.current) stop = startLiquidLight(canvas.current);
      } else if (!lively && stop) {
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

  return <canvas ref={canvas} className="lv-light only-lively" aria-hidden />;
}
