'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MODE_EVENT } from '@/lib/mode';

/**
 * The fancier version's scroll reveals (see lib/reveal.ts for the markup side).
 * Watches every [data-reveal] element on the page and marks it data-shown
 * once it scrolls into view; app/fancy.css animates that change. Each
 * element reveals once.
 *
 * Active only in the fancier version. While active it sets data-observing on <html>:
 * the stylesheet's failsafe shows everything after a moment if that never
 * happens (a script error), so content can never stay hidden.
 *
 * Restarts on every navigation (new elements) and on every switch to fancy,
 * clearing data-shown first so whatever is on screen plays its entrance.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    let observer: IntersectionObserver | null = null;

    const stop = () => {
      observer?.disconnect();
      observer = null;
      delete html.dataset.observing;
    };

    const start = () => {
      stop();
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.shown = '';
            io.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        delete el.dataset.shown;
        io.observe(el);
      });
      observer = io;
      html.dataset.observing = '';
    };

    const sync = () => (html.dataset.mode === 'fancy' ? start() : stop());

    sync();
    window.addEventListener(MODE_EVENT, sync);
    return () => {
      window.removeEventListener(MODE_EVENT, sync);
      stop();
    };
  }, [pathname]);

  return null;
}
