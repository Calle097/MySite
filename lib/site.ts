// Canonical site origin for absolute URLs (hreflang, sitemap, OpenGraph).
// Set NEXT_PUBLIC_SITE_URL in the deploy workflow once the domain exists;
// the fallback keeps local builds working.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
