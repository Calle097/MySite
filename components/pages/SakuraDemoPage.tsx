import { DICTS, type Lang } from '@/lib/i18n';
import { SakuraBadge } from '@/components/demos/SakuraBadge';
import { DemoLayout } from '@/components/fancy/DemoLayout';

export function SakuraDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <DemoLayout lang={lang} slug="sakura">
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SakuraBadge label={dict.demos.sakura.label} />
      </div>
    </DemoLayout>
  );
}
