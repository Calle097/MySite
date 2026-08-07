import type { Metadata } from 'next';
import { PlaygroundPage } from '@/components/pages/PlaygroundPage';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Component experiments.',
};

export default function Playground() {
  return <PlaygroundPage lang="en" />;
}
