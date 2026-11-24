'use client';

import type { MouseEvent } from 'react';
import { twoDigits } from '@/lib/format';
import { stagger } from '@/lib/motion';

export type IndexItem = { href: string; title: string };

/**
 * A numbered list of the page's sections (or of other pages, on a demo
 * page), the current one marked. Used by the column's index and the phone
 * menu, so both look and number the same.
 */
export function SectionList({
  items,
  current,
  onGo,
}: {
  items: readonly IndexItem[];
  current: number;
  onGo?: (i: number, e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <ol className="fc-sections">
      {items.map((item, i) => (
        <li key={item.href} style={stagger(i)}>
          <a
            href={item.href}
            aria-current={i === current ? 'true' : undefined}
            data-focus
            onClick={onGo ? (e) => onGo(i, e) : undefined}
          >
            <span className="fc-mono">{twoDigits(i + 1)}</span>
            <span className="fc-sections-title">{item.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
