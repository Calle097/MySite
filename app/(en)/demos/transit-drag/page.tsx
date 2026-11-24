import { TransitDemoPage } from '@/components/pages/TransitDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('en', 'transit-drag');

export default function TransitDragDemoPage() {
  return <TransitDemoPage lang="en" />;
}
