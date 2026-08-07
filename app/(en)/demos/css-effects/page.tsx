import type { Metadata } from 'next';
import { CssEffectsDemoPage } from '@/components/pages/CssEffectsDemoPage';

export const metadata: Metadata = {
  title: 'CSS-only effects — demo',
  robots: { index: false },
};

export default function CssEffectsDemo() {
  return <CssEffectsDemoPage lang="en" />;
}
