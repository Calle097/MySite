import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { en: '/', it: '/it/' } },
};

export default function Home() {
  return <HomePage lang="en" />;
}
