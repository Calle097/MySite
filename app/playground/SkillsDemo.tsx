'use client';

import { Code2, FlaskConical } from 'lucide-react';
import { DriveInCards, type DriveInItem } from '@/components/DriveInCards';

const ITEMS: DriveInItem[] = [
  {
    icon: Code2,
    title: 'Frontend',
    text: 'React, Next.js, TypeScript, Tailwind.',
  },
  {
    icon: FlaskConical,
    title: 'QA & testing',
    text: 'Playwright, test planning, automation.',
  },
];

export function SkillsDemo() {
  return <DriveInCards items={ITEMS} />;
}
