import { DICTS, type Lang } from '@/lib/i18n';
import { SakuraBadge } from '@/components/SakuraBadge';

// Rendered bare (no site chrome) — lives inside the playground iframe.
export function SakuraDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <SakuraBadge label={dict.demoSakura.label} />
    </div>
  );
}
