'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MODE_EVENT } from '@/lib/mode';

/**
 * The fancier version's scroll reveals. Markup opts in with data-reveal:
 * "rise" (fades up), "mask" (a heading's [data-line] children rise from
 * behind an edge), "rule" (a section title rises out of its own edge) or
 * "frame" (a demo frame's crop marks draw in); elements that reveal together
 * carry stagger(). Each is marked data-shown once it scrolls into view, and
 * app/fancy/motion.css animates that.
 *
 * Content is hidden only while data-observing is on <html>, which this sets
 * once it runs: if the script never starts, nothing stays hidden. It
 * restarts on every navigation and every switch to fancy, so what is on
 * screen plays its entrance again.
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
