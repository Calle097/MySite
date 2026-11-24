'use client';

import { useEffect, useRef } from 'react';
import { MODE_EVENT } from '@/lib/mode';

/**
 * Lively mode's hover: one band of light for the whole page that glides to
 * whichever [data-band-row] the mouse is over, instead of each row lighting
 * up on its own. It lives in page coordinates, so it scrolls with the
 * content. Mouse only: on touch, a tap is not a hover.
 */
export function LightBand() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = ref.current;
    if (!band) return;
    let current: Element | null = null;

    const hide = () => {
      current = null;
      delete band.dataset.on;
    };

    const show = (row: Element) => {
      const r = row.getBoundingClientRect();
      const appearing = band.dataset.on === undefined;
      // Appearing: jump into place and only fade in, rather than gliding over
      // from wherever it was last seen.
      if (appearing) band.style.transitionProperty = 'opacity';
      band.style.transform = `translate3d(${r.left + scrollX}px, ${r.top + scrollY}px, 0)`;
      band.style.width = `${r.width}px`;
      band.style.height = `${r.height}px`;
      band.dataset.on = '';
      if (appearing) requestAnimationFrame(() => band.style.removeProperty('transition-property'));
      current = row;
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || document.documentElement.dataset.mode !== 'lively') return;
      const row = e.target instanceof Element ? e.target.closest('[data-band-row]') : null;
      if (row === current) return;
      if (row) show(row);
      else hide();
    };

    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('resize', hide);
    window.addEventListener(MODE_EVENT, hide);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('resize', hide);
      window.removeEventListener(MODE_EVENT, hide);
    };
  }, []);

  return <div ref={ref} aria-hidden className="light-band only-lively" />;
}
