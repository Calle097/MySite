import { SiteChrome } from '@/components/SiteChrome';

// Demos get the site chrome when visited standalone; inside the playground
// iframes (src="...#embed") CSS hides it via the EmbedMarker :target rule.
export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome lang="en">{children}</SiteChrome>;
}
