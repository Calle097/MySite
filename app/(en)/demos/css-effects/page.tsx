import { CssEffectsDemoPage } from '@/components/pages/CssEffectsDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('en', 'css-effects');

export default function CssEffectsDemo() {
  return <CssEffectsDemoPage lang="en" />;
}
