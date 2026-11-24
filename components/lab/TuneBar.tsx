'use client';

import { useEffect, useState } from 'react';
import { TUNE_DEFAULTS, TUNE_KEY, TUNE_OPTIONS, type Tune, type TuneKey } from '@/lib/mode';

/**
 * BRANCH-ONLY. Live controls for choosing the lively design. Each choice is
 * an attribute on <html> (data-palette, data-hero, data-grid) that
 * app/lively.css reads. It is saved, so it survives reloads and reaches
 * the playground's iframes through the storage event.
 *
 * Delete this file, its line in SiteChrome, the "Tuning bar" block in
 * app/lively.css and the TUNE_* parts of lib/mode.ts once decided.
 */

const KEYS = Object.keys(TUNE_OPTIONS) as TuneKey[];
const LABELS: Record<TuneKey, string> = { palette: 'Palette', hero: 'Hero', grid: 'Grid' };

export function TuneBar() {
  const [tune, setTune] = useState<Tune | null>(null);
  const [open, setOpen] = useState(false);

  // The pre-paint script has already applied the saved choice to <html>; start
  // from there. Open by default only where there is room for it.
  useEffect(() => {
    const html = document.documentElement;
    setTune(Object.fromEntries(KEYS.map((k) => [k, html.getAttribute(`data-${k}`) ?? TUNE_DEFAULTS[k]])) as Tune);
    setOpen(window.innerWidth >= 768);
  }, []);

  if (!tune) return null;

  const choose = (key: TuneKey, value: string) => {
    const next = { ...tune, [key]: value } as Tune;
    setTune(next);
    document.documentElement.setAttribute(`data-${key}`, value);
    try {
      localStorage.setItem(TUNE_KEY, JSON.stringify(next));
    } catch {
      /* not remembered, still applied */
    }
  };

  return (
    <div className="site-chrome only-lively tune-bar">
      <button type="button" className="tune-option" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Tuning {open ? '▾' : '▴'}
      </button>
      {open &&
        KEYS.map((key) => (
          <div key={key} role="group" aria-label={LABELS[key]} className="tune-group">
            <span className="tune-label">{LABELS[key]}</span>
            {TUNE_OPTIONS[key].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={tune[key] === value}
                onClick={() => choose(key, value)}
                className="tune-option"
              >
                {value}
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}
