import { DICTS, type Lang } from '@/lib/i18n';
import { DemoLayout } from '@/components/fancy/DemoLayout';
import '@/components/demos/css-effects.css';

// Everything on this page animates with CSS alone; there is no JavaScript.
export function CssEffectsDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos.css;

  return (
    <DemoLayout lang={lang} slug="css-effects">
      <div className="flex min-h-dvh flex-col items-center justify-center gap-14 px-6">
        <p className="text-center label text-muted-foreground">
          {dict.hint}
        </p>

        <button type="button" className="gel-btn">
          {dict.button}
        </button>

        <div className="spin-ring border px-8 py-5 text-sm border-secondary-darker bg-background">
          {dict.card}
        </div>
      </div>
    </DemoLayout>
  );
}
