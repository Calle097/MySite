import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'Chi sono',
  description: 'Prima studi di cinema, poi programmatore da autodidatta.',
};

export default function About() {
  return <AboutPage lang="it" />;
}
