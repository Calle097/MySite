import { DICTS, type Lang } from '@/lib/i18n';
import { DemoCards } from '@/components/demos/DemoCards';
import { DemoLayout } from '@/components/fancy/DemoLayout';

// Inside the playground's frame, this page's own scrollbar scrubs the animation.
export function DriveInDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos.driveIn;

  return (
    <DemoLayout lang={lang} slug="drive-in">
      <div className="px-6">
        <p className="pt-5 text-center label text-muted-foreground">
          {dict.scroll}
        </p>

        {/* Scroll runway: a full viewport tall, so with the hint above it the
            cards always start beyond the fold — nothing leaks in half-clipped. */}
        <div className="h-screen" aria-hidden />

        <div className="mx-auto max-w-4xl">
          <DemoCards items={dict.items} />
        </div>

        <p className="mt-10 text-center label text-muted-foreground">
          {dict.hover}
        </p>

        {/* Room below so the scrub reaches 100% before the page ends. */}
        <div className="h-[35vh]" aria-hidden />
      </div>
    </DemoLayout>
  );
}
