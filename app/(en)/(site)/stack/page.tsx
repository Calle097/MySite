import type { Metadata } from 'next';
import { StackPage } from '@/components/pages/StackPage';

export const metadata: Metadata = {
  title: 'Stack',
  description: 'How this site is built and hosted.',
  alternates: { canonical: '/stack/', languages: { en: '/stack/', it: '/it/stack/' } },
};

export default function Stack() {
  return <StackPage lang="en" />;
}
