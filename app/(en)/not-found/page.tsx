import { NotFoundPage } from '@/components/pages/NotFoundPage';
import { notFoundMetadata } from '@/lib/metadata';

// A real route (Caddy serves its HTML for every unmatched path). Not at
// /404/: Next writes its own unstyled page there, and the clash dropped this
// route's title.
export const metadata = notFoundMetadata('en');

export default function NotFound() {
  return <NotFoundPage lang="en" />;
}
