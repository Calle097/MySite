import type { Metadata } from 'next';
import { TimePickerDemoPage } from '@/components/pages/TimePickerDemoPage';

export const metadata: Metadata = {
  title: 'Time picker — demo',
  robots: { index: false },
};

export default function TimePickerDemo() {
  return <TimePickerDemoPage lang="en" />;
}
