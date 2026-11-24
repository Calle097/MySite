import type { ResolvingMetadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('en', 'about', parent);
}

export default function About() {
  return <AboutPage lang="en" />;
}
