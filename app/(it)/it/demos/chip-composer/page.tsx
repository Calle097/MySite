import { ChipComposerDemoPage } from '@/components/pages/ChipComposerDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'chip-composer');

export default function ChipComposerDemo() {
  return <ChipComposerDemoPage lang="it" />;
}
