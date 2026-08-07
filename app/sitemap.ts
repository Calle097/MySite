import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Required with output: export — metadata routes must opt into static.
export const dynamic = 'force-static';

// Demos are deliberately absent — they carry robots noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', 'about/', 'playground/', 'stack/'];
  return paths.flatMap((p) => [
    { url: `${SITE_URL}/${p}` },
    { url: `${SITE_URL}/it/${p}` },
  ]);
}
