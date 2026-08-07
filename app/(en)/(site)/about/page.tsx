import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Film studies first, self-taught programmer after.',
};

export default function About() {
  return <AboutPage lang="en" />;
}
