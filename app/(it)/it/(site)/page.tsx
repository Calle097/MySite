import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';

export const metadata: Metadata = {
  alternates: { canonical: '/it/', languages: { en: '/', it: '/it/' } },
};

export default function Home() {
  return <HomePage lang="it" />;
}
