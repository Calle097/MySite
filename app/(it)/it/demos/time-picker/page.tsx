import { TimePickerDemoPage } from '@/components/pages/TimePickerDemoPage';
import { demoMetadata } from '@/lib/metadata';

export const metadata = demoMetadata('it', 'time-picker');

export default function TimePickerDemo() {
  return <TimePickerDemoPage lang="it" />;
}
