import { DICTS, type Lang } from '@/lib/i18n';
import { TransitDragDemo } from '@/components/demos/TransitDragDemo';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed); a
// standalone visit keeps the header and footer.
export function TransitDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <div className="px-6 py-8">
      <EmbedMarker />
      <noscript>
        <p className="mx-auto mb-8 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          {dict.noscript}
        </p>
      </noscript>
      <TransitDragDemo strings={dict.transit} />
    </div>
  );
}
