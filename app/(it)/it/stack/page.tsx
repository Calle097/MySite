import type { Metadata } from 'next';
import { StackPage } from '@/components/pages/StackPage';

export const metadata: Metadata = {
  title: 'Stack',
  description: 'Come è fatto e dove è ospitato questo sito.',
};

export default function Stack() {
  return <StackPage lang="it" />;
}
