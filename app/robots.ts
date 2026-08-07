import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Required with output: export — metadata routes must opt into static.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
