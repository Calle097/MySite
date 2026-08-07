'use client';

import { useState } from 'react';
import { TimePicker } from '@/components/TimePicker';
import { DICTS, type Lang } from '@/lib/i18n';

export function TimePickerDemo({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demoTimePicker;
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 pt-14">
      <TimePicker value={time} onChange={setTime} labels={dict.labels} />
      <p className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {time ? `${dict.picked} ${time}` : dict.hint}
      </p>
    </div>
  );
}
