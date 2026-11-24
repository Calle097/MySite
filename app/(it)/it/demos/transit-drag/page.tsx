import { TransitDemoPage } from '@/components/pages/TransitDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'transit-drag');

export default function TransitDragDemoPage() {
  return <TransitDemoPage lang="it" />;
}
