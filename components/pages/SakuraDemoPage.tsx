import { DICTS, type Lang } from '@/lib/i18n';
import { SakuraBadge } from '@/components/demos/SakuraBadge';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed).
export function SakuraDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <EmbedMarker />
      <SakuraBadge label={dict.demos.sakura.label} />
    </div>
  );
}
