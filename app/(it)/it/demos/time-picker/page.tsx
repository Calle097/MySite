import type { Metadata } from 'next';
import { TimePickerDemo } from '@/components/pages/TimePickerDemo';
import { EmbedMarker } from '@/components/EmbedMarker';

export const metadata: Metadata = {
  title: 'Time picker — demo',
  robots: { index: false },
};

export default function TimePickerDemoPage() {
  return (
    <div className="px-6">
      <EmbedMarker />
      <TimePickerDemo lang="it" />
    </div>
  );
}
