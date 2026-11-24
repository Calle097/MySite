'use client';

import { useEffect, type CSSProperties } from 'react';
import { setCurrentSection, useCurrentSection } from '@/lib/fancy/current-section';
import { twoDigits } from '@/lib/format';
import { SectionList, type IndexItem } from './SectionList';

/**
 * The index at the bottom of the column: its label, a counter that rolls to
 * the current number, and the list. Without `current`, the items are the
 * page's own sections and the current one follows the scroll; with it (a
 * demo page listing every demo), it marks this page.
 */
export function SectionIndex({
  label,
  items,
  current: fixed,
}: {
  label: string;
  items: readonly IndexItem[];
  current?: number;
}) {
  const followed = useCurrentSection();
  useSectionSpy(fixed === undefined ? items : null);
  const current = fixed ?? followed;

  return (
    <nav className="fc-index only-fancy" aria-label={label}>
      <div className="fc-index-head">
        <span className="fc-mono">{label}</span>
        <span className="fc-count" aria-hidden>
          <span className="fc-roll">
            <span className="fc-roll-inner" style={{ '--n': Math.max(current, 0) } as CSSProperties}>
              {items.map((item, i) => (
                <span key={item.href}>{twoDigits(i + 1)}</span>
              ))}
            </span>
          </span>
          <span className="fc-mono">/ {twoDigits(items.length)}</span>
        </span>
      </div>
      <SectionList items={items} current={current} />
    </nav>
  );
}

/**
 * Follows which section is in the middle of the view. The last section may
 * never reach the middle on a short page end, so at the very bottom it is
 * the current one.
 */
function useSectionSpy(items: readonly IndexItem[] | null) {
  useEffect(() => {
    if (!items) return;
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrentSection(sections.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => spy.observe(s));

    const atEnd = () => {
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) setCurrentSection(sections.length - 1);
    };
    addEventListener('scroll', atEnd, { passive: true });

    return () => {
      spy.disconnect();
      removeEventListener('scroll', atEnd);
      setCurrentSection(0);
    };
  }, [items]);
}
