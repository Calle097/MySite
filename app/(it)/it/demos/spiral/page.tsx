import { SpiralDemoPage } from '@/components/pages/SpiralDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'spiral');

export default function SpiralDemo() {
  return <SpiralDemoPage lang="it" />;
}
