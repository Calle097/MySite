import type { Metadata } from 'next';
import { StackPage } from '@/components/pages/StackPage';

export const metadata: Metadata = {
  title: 'Stack',
  description: 'Come è fatto e dove è ospitato questo sito.',
  alternates: { canonical: '/it/stack/', languages: { en: '/stack/', it: '/it/stack/', 'x-default': '/stack/' } },
};

export default function Stack() {
  return <StackPage lang="it" />;
}
