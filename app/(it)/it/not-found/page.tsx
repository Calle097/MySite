import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/pages/NotFoundPage';

// A real route, so it gets the root layout (fonts, palette, locale script).
// Caddy serves its HTML for every unmatched path under /it/; noindex keeps
// the URL itself out of search results. Not at /it/404/ — see the EN twin.
export const metadata: Metadata = {
  title: 'Pagina non trovata',
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage lang="it" />;
}
