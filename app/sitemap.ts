import type { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/i18n';
import { PAGES, isFile, pageHref } from '@/lib/pages';
import { SITE_URL } from '@/lib/site';

// Required with output: export — metadata routes must opt into static.
export const dynamic = 'force-static';

// Every page in every language. The CV is a file, and demos are
// deliberately absent — they carry robots noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.filter((page) => !isFile(page)).flatMap((page) =>
    LANGUAGES.map(({ lang }) => ({ url: `${SITE_URL}${pageHref(lang, page)}` })),
  );
}
