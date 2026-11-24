import { SakuraDemoPage } from '@/components/pages/SakuraDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('en', 'sakura');

export default function SakuraDemo() {
  return <SakuraDemoPage lang="en" />;
}
