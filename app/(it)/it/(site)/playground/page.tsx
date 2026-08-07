import type { Metadata } from 'next';
import { PlaygroundPage } from '@/components/pages/PlaygroundPage';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Esperimenti con i componenti.',
};

export default function Playground() {
  return <PlaygroundPage lang="it" />;
}
