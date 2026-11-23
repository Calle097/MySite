'use client';

import { useState } from 'react';
import { TimePicker } from '@/components/demos/TimePicker';
import type { Dict } from '@/lib/i18n';

// The client half of the time-picker demo page: it owns the picked value so
// the readout below can echo it. Strings come in as a prop so the
// dictionaries stay out of the client bundle.
export function TimePickerDemo({ strings }: { strings: Dict['demos']['timePicker'] }) {
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 pt-14">
      <TimePicker value={time} onChange={setTime} labels={strings.labels} />
      <p className="label text-muted-foreground">{time ? `${strings.picked} ${time}` : strings.hint}</p>
    </div>
  );
}
