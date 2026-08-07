import { DICTS, type Lang } from '@/lib/i18n';
import '@/components/css-effects.css';

// Rendered bare (no site chrome) — lives inside the playground iframe.
// Everything on this page animates with CSS alone; there is no JavaScript.
export function CssEffectsDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demoCss;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-14 px-6">
      <p className="text-center font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {dict.hint}
      </p>

      <button type="button" className="gel-btn">
        {dict.button}
      </button>

      <div
        className="spin-ring border px-8 py-5 text-sm"
        style={{ borderColor: 'var(--secondary-darker)', background: 'var(--background)' }}
      >
        {dict.card}
      </div>
    </div>
  );
}
