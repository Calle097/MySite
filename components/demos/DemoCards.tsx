'use client';

import { PenTool, Route } from 'lucide-react';
import { DriveInCards, type DriveInItem } from '@/components/demos/DriveInCards';
import type { Dict } from '@/lib/i18n';

const ICONS = [Route, PenTool];

// The copy comes in as a prop from the server page, so neither dictionary
// ends up in this demo's JavaScript. Icons are attached here: a component is
// not something a server page can hand over to a client one.
export function DemoCards({ items }: { items: Dict['demos']['driveIn']['items'] }) {
  const withIcons: DriveInItem[] = items.map((item, i) => ({ icon: ICONS[i] ?? Route, ...item }));
  return <DriveInCards items={withIcons} />;
}
