import type { Metadata } from 'next';
import { PlaygroundPage } from '@/components/pages/PlaygroundPage';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Component experiments.',
  alternates: { canonical: '/playground/', languages: { en: '/playground/', it: '/it/playground/', 'x-default': '/playground/' } },
};

export default function Playground() {
  return <PlaygroundPage lang="en" />;
}
