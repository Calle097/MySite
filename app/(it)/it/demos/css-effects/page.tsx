import { CssEffectsDemoPage } from '@/components/pages/CssEffectsDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'css-effects');

export default function CssEffectsDemo() {
  return <CssEffectsDemoPage lang="it" />;
}
