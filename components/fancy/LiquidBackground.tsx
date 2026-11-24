'use client';

import { useEffect, useRef } from 'react';
import { MODE_EVENT } from '@/lib/mode';

/**
 * The canvas for the fancier version's light. The light's code loads only
 * once that version is on, and stops when it goes back to plain. Never in a
 * frame: the playground shows seven demo pages at once.
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
        let light: typeof import('@/lib/fancy/liquid-light');
        try {
          light = await import('@/lib/fancy/liquid-light');
        } catch {
          return; // Offline or a missing chunk: no light, and the next switch tries again.
        } finally {
          starting = false;
        }
        // The mode (or the page) may have changed while it loaded.
        if (!gone && html.dataset.mode === 'fancy' && canvas.current) stop = light.startLiquidLight(canvas.current);
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
