import { ChipComposerDemoPage } from '@/components/pages/ChipComposerDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('en', 'chip-composer');

export default function ChipComposerDemo() {
  return <ChipComposerDemoPage lang="en" />;
}
