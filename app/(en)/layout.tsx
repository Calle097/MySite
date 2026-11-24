import { RootDocument } from '@/components/RootDocument';
import { siteMetadata } from '@/lib/metadata';
import '../globals.css';
import '../fancy.css';

export const metadata = siteMetadata('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
