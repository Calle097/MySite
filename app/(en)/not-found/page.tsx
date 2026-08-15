import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/pages/NotFoundPage';

// A real route, so it gets the root layout (fonts, palette, locale script).
// Caddy serves its HTML for every unmatched path; noindex keeps the URL
// itself out of search results.
//
// Deliberately not at /404/: that path is the export slot Next writes its own
// unstyled not-found page to, and the collision silently dropped this route's
// title in favour of the layout default.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage lang="en" />;
}
