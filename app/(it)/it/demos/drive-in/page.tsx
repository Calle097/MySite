import type { Metadata } from 'next';
import { DriveInDemoPage } from '@/components/pages/DriveInDemoPage';

export const metadata: Metadata = {
  title: 'Drive-in cards — demo',
  robots: { index: false },
};

export default function DriveInDemo() {
  return <DriveInDemoPage lang="it" />;
}
