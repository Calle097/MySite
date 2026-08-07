import { DICTS, type Lang } from '@/lib/i18n';
import { SpiralDots } from '@/components/SpiralDots';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed).
export function SpiralDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <EmbedMarker />
      <noscript>
        <p className="max-w-md text-center text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {dict.demoNoscript}
        </p>
      </noscript>
      <div style={{ color: 'var(--brand-accent)' }}>
        <SpiralDots size={340} totalDots={500} dotRadius={2} duration={3} className="max-w-full" />
      </div>
    </div>
  );
}
