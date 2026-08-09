import { DICTS, type Lang } from '@/lib/i18n';
import { ChipComposer } from '@/components/demos/ChipComposer';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed); a
// standalone visit keeps the header and footer.
export function ChipComposerDemoPage({ lang }: { lang: Lang }) {
  return (
    <div className="px-6 pt-10">
      <EmbedMarker />
      <ChipComposer strings={DICTS[lang].demos.composer} />
    </div>
  );
}
