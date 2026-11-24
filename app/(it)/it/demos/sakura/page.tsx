import { SakuraDemoPage } from '@/components/pages/SakuraDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'sakura');

export default function SakuraDemo() {
  return <SakuraDemoPage lang="it" />;
}
