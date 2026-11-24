import { DICTS, type Lang } from '@/lib/i18n';
import { ChipComposer } from '@/components/demos/ChipComposer';
import { DemoLayout } from '@/components/fancy/DemoLayout';

export function ChipComposerDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <DemoLayout lang={lang} slug="chip-composer">
      <div className="px-6 pt-10">
        <ChipComposer strings={dict.composer} />
      </div>
    </DemoLayout>
  );
}
