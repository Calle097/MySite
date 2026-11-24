import type { Lang } from '@/lib/i18n';
import { SpiralDots } from '@/components/demos/SpiralDots';
import { DemoLayout } from '@/components/fancy/DemoLayout';

export function SpiralDemoPage({ lang }: { lang: Lang }) {
  return (
    <DemoLayout lang={lang} slug="spiral">
      <div className="flex min-h-dvh items-center justify-center px-6">
        <div className="text-brand-accent">
          <SpiralDots size={340} dotRadius={2} className="max-w-full" />
        </div>
      </div>
    </DemoLayout>
  );
}
