import type { Lang } from '@/lib/i18n';
import { TransitDragDemo } from '@/components/demos/TransitDragDemo';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed); a
// standalone visit keeps the header and footer.
export function TransitDemoPage({ lang }: { lang: Lang }) {
  return (
    <div className="px-6 py-8">
      <EmbedMarker />
      <TransitDragDemo lang={lang} />
    </div>
  );
}
