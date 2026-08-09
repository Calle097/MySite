'use client';

import { PenTool, Route } from 'lucide-react';
import { DriveInCards, type DriveInItem } from '@/components/demos/DriveInCards';
import { DICTS, type Lang } from '@/lib/i18n';

const ICONS = [Route, PenTool];

export function DemoCards({ lang }: { lang: Lang }) {
  const items: DriveInItem[] = DICTS[lang].demos.driveIn.items.map((item, i) => ({
    icon: ICONS[i] ?? Route,
    ...item,
  }));
  return <DriveInCards items={items} />;
}
