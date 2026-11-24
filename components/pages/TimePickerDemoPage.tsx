import { DICTS, type Lang } from '@/lib/i18n';
import { TimePickerDemo } from '@/components/demos/TimePickerDemo';
import { DemoLayout } from '@/components/fancy/DemoLayout';

export function TimePickerDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <DemoLayout lang={lang} slug="time-picker">
      <div className="px-6">
        <TimePickerDemo strings={dict.timePicker} />
      </div>
    </DemoLayout>
  );
}
