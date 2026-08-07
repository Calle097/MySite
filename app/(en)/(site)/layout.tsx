import { SiteChrome } from '@/components/SiteChrome';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome lang="en">{children}</SiteChrome>;
}
