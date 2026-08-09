import { DICTS, type Lang } from '@/lib/i18n';
import { DemoCards } from '@/components/demos/DemoCards';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed). Inside the
// playground iframe this page's own scrollbar scrubs the animation.
export function DriveInDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos.driveIn;

  return (
    <div className="px-6">
      <EmbedMarker />
      <p className="pt-5 text-center label text-muted-foreground">
        {dict.scroll}
      </p>

      <noscript>
        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          {dict.noscript}
        </p>
      </noscript>

      {/* Scroll runway: a full viewport tall, so with the hint above it the
          cards always start beyond the fold — nothing leaks in half-clipped. */}
      <div className="h-screen" aria-hidden />

      <div className="mx-auto max-w-4xl">
        <DemoCards lang={lang} />
      </div>

      <p className="mt-10 text-center label text-muted-foreground">
        {dict.hover}
      </p>

      {/* Room below so the scrub reaches 100% before the page ends. */}
      <div className="h-[35vh]" aria-hidden />
    </div>
  );
}
