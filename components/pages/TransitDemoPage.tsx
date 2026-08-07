import type { Lang } from '@/lib/i18n';
import { TransitDragDemo } from '@/components/TransitDragDemo';
import { EmbedMarker } from '@/components/EmbedMarker';

// Rendered bare (no site chrome) — lives inside the playground iframe.
export function TransitDemoPage({ lang }: { lang: Lang }) {
  return (
    <div className="px-6 py-8">
      <EmbedMarker />
      <TransitDragDemo lang={lang} />
    </div>
  );
}
