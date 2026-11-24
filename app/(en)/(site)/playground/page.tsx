import type { ResolvingMetadata } from 'next';
import { PlaygroundPage } from '@/components/pages/PlaygroundPage';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('en', 'playground', parent);
}

export default function Playground() {
  return <PlaygroundPage lang="en" />;
}
