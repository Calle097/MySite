import { DriveInDemoPage } from '@/components/pages/DriveInDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'drive-in');

export default function DriveInDemo() {
  return <DriveInDemoPage lang="it" />;
}
