import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'Chi sono',
  description: 'Prima studi di cinema, poi programmatore da autodidatta.',
  alternates: { canonical: '/it/about/', languages: { en: '/about/', it: '/it/about/' } },
};

export default function About() {
  return <AboutPage lang="it" />;
}
