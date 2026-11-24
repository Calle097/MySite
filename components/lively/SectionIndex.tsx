'use client';

import { useEffect, type CSSProperties } from 'react';
import { setCurrentSection, useCurrentSection } from '@/lib/lively/current-section';
import { twoDigits } from '@/lib/lively/format';
import { SectionList, type IndexItem } from './SectionList';

/**
 * The index at the bottom of the column: its label, a counter that rolls to
 * the current number, and the list. With `follow`, the items are the page's
 * own sections and the current one follows the scroll; otherwise (a demo
 * page listing every demo) `fixedCurrent` marks this page.
 */
export function SectionIndex({
  label,
  items,
  follow,
  fixedCurrent = -1,
}: {
  label: string;
  items: readonly IndexItem[];
  follow: boolean;
  fixedCurrent?: number;
}) {
  const followed = useCurrentSection();
  useSectionSpy(follow ? items : null);
  const current = follow ? followed : fixedCurrent;

  return (
    <nav className="lv-index only-lively" aria-label={label}>
      <div className="lv-index-head">
        <span className="lv-mono">{label}</span>
        <span className="lv-count" aria-hidden>
          <span className="lv-roll">
            <span className="lv-roll-inner" style={{ '--n': Math.max(current, 0) } as CSSProperties}>
              {items.map((item, i) => (
                <span key={item.href}>{twoDigits(i + 1)}</span>
              ))}
            </span>
          </span>
          <span className="lv-mono">/ {twoDigits(items.length)}</span>
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
