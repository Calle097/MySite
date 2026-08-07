'use client';

import { PenTool, Route } from 'lucide-react';
import { DriveInCards, type DriveInItem } from '@/components/DriveInCards';

// Self-describing demo content — the demo explains itself, nothing more.
const ITEMS: DriveInItem[] = [
  {
    icon: Route,
    title: 'Scroll-scrubbed',
    text: 'Entry follows the scroll position of this frame.',
  },
  {
    icon: PenTool,
    title: 'Path morphing',
    text: 'One SVG skeleton tweens between van and card.',
  },
];

export function DemoCards() {
  return <DriveInCards items={ITEMS} />;
}
