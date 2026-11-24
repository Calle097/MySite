import { DICTS, type Lang } from '@/lib/i18n';
import { ChipComposer } from '@/components/demos/ChipComposer';
import { DemoLayout } from '@/components/fancy/DemoLayout';

export function ChipComposerDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <DemoLayout lang={lang} slug="chip-composer">
      <div className="px-6 pt-10">
        <noscript>
          <p className="mx-auto mb-8 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            {dict.noscript}
          </p>
        </noscript>
        <ChipComposer strings={dict.composer} />
      </div>
    </DemoLayout>
  );
}
