import { DICTS, type Lang } from '@/lib/i18n';
import { ChipComposer } from '@/components/ChipComposer';
import { EmbedMarker } from '@/components/EmbedMarker';

// Rendered bare (no site chrome) — lives inside the playground iframe.
export function ChipComposerDemoPage({ lang }: { lang: Lang }) {
  return (
    <div className="px-6 pt-10">
      <EmbedMarker />
      <ChipComposer strings={DICTS[lang].demoComposer} />
    </div>
  );
}
