'use client';

import { useState } from 'react';
import { TimePicker } from '@/components/demos/TimePicker';
import { EmbedMarker } from '@/components/EmbedMarker';
import { DICTS, type Lang } from '@/lib/i18n';

// The only demo page that needs client state — it owns the picked value so
// the readout below can echo it. Chrome hides itself when embedded (the
// iframe src carries #embed).
export function TimePickerDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos.timePicker;
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="px-6">
      <EmbedMarker />
      <div className="flex flex-col items-center gap-6 pt-14">
        <TimePicker value={time} onChange={setTime} labels={dict.labels} />
        <p className="label text-muted-foreground">{time ? `${dict.picked} ${time}` : dict.hint}</p>
      </div>
    </div>
  );
}
