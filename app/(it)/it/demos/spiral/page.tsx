import type { Metadata } from 'next';
import { SpiralDemoPage } from '@/components/pages/SpiralDemoPage';

export const metadata: Metadata = {
  title: 'Spirale aurea — demo',
  robots: { index: false },
};

export default function SpiralDemo() {
  return <SpiralDemoPage lang="it" />;
}
