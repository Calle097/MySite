import type { Metadata } from 'next';
import { TransitDemoPage } from '@/components/pages/TransitDemoPage';

export const metadata: Metadata = {
  title: 'Transit drag — demo',
  robots: { index: false },
};

export default function TransitDragDemoPage() {
  return <TransitDemoPage lang="en" />;
}
