import { SpiralDemoPage } from '@/components/pages/SpiralDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('en', 'spiral');

export default function SpiralDemo() {
  return <SpiralDemoPage lang="en" />;
}
