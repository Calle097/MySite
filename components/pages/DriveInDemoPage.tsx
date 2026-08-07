import { DICTS, type Lang } from '@/lib/i18n';
import { DemoCards } from '@/components/DemoCards';
import { EmbedMarker } from '@/components/EmbedMarker';

// Rendered bare (no site chrome) — designed to live inside the playground
// iframe, where this page's own scrollbar scrubs the animation.
export function DriveInDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demoDriveIn;

  return (
    <div className="px-6">
      <EmbedMarker />
      <p className="pt-5 text-center font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {dict.scroll}
      </p>

      <noscript>
        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {dict.noscript}
        </p>
      </noscript>

      {/* Scroll runway: the cards start below this frame's fold so the
          scroll-scrubbed entry has room to play. */}
      <div className="h-[55vh]" aria-hidden />

      <div className="mx-auto max-w-4xl">
        <DemoCards lang={lang} />
      </div>

      <p className="mt-10 text-center font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {dict.hover}
      </p>

      {/* Room below so the scrub reaches 100% before the page ends. */}
      <div className="h-[35vh]" aria-hidden />
    </div>
  );
}
