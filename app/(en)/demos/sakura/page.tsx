import type { Metadata } from 'next';
import { SakuraDemoPage } from '@/components/pages/SakuraDemoPage';

export const metadata: Metadata = {
  title: 'Sakura badge — demo',
  robots: { index: false },
};

export default function SakuraDemo() {
  return <SakuraDemoPage lang="en" />;
}
