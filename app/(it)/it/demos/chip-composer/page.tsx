import type { Metadata } from 'next';
import { ChipComposerDemoPage } from '@/components/pages/ChipComposerDemoPage';

export const metadata: Metadata = {
  title: 'Composer con chip — demo',
  robots: { index: false },
};

export default function ChipComposerDemo() {
  return <ChipComposerDemoPage lang="it" />;
}
