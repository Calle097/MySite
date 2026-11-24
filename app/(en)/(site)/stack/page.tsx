import type { ResolvingMetadata } from 'next';
import { StackPage } from '@/components/pages/StackPage';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('en', 'stack', parent);
}

export default function Stack() {
  return <StackPage lang="en" />;
}
