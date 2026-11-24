import type { ResolvingMetadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('en', 'home', parent);
}

export default function Home() {
  return <HomePage lang="en" />;
}
