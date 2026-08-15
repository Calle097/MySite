import type { Metadata } from 'next';
import { PlaygroundPage } from '@/components/pages/PlaygroundPage';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Esperimenti con i componenti.',
  alternates: { canonical: '/it/playground/', languages: { en: '/playground/', it: '/it/playground/', 'x-default': '/playground/' } },
};

export default function Playground() {
  return <PlaygroundPage lang="it" />;
}
