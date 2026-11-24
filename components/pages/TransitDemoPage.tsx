import { DICTS, type Lang } from '@/lib/i18n';
import { TransitDragDemo } from '@/components/demos/TransitDragDemo';
import { DemoLayout } from '@/components/fancy/DemoLayout';

export function TransitDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <DemoLayout lang={lang} slug="transit-drag">
      <div className="px-6 py-8">
        <TransitDragDemo strings={dict.transit} />
      </div>
    </DemoLayout>
  );
}
