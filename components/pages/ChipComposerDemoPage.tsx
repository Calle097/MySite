import { DICTS, type Lang } from '@/lib/i18n';
import { ChipComposer } from '@/components/demos/ChipComposer';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed); a
// standalone visit keeps the header and footer.
export function ChipComposerDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <div className="px-6 pt-10">
      <EmbedMarker />
      <noscript>
        <p className="mx-auto mb-8 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          {dict.noscript}
        </p>
      </noscript>
      <ChipComposer strings={dict.composer} />
    </div>
  );
}
