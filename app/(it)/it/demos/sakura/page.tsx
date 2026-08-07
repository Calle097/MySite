import type { Metadata } from 'next';
import { SakuraDemoPage } from '@/components/pages/SakuraDemoPage';

export const metadata: Metadata = {
  title: 'Badge sakura — demo',
  robots: { index: false },
};

export default function SakuraDemo() {
  return <SakuraDemoPage lang="it" />;
}
