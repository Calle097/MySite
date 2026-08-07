import type { Metadata } from 'next';
import { CssEffectsDemoPage } from '@/components/pages/CssEffectsDemoPage';

export const metadata: Metadata = {
  title: 'Effetti solo CSS — demo',
  robots: { index: false },
};

export default function CssEffectsDemo() {
  return <CssEffectsDemoPage lang="it" />;
}
