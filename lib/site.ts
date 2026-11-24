// Canonical site origin for absolute URLs (hreflang, sitemap, OpenGraph).
// The deploy workflow sets NEXT_PUBLIC_SITE_URL from the SITE_URL repository
// variable (and warns if it's missing); the fallback keeps local builds working.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const NAME = 'Mattia Callegher';

// Public on purpose: the contact section and the footer both show it.
export const EMAIL = 'callegher.mattia00@gmail.com';

export const GITHUB_URL = 'https://github.com/Calle097';
/** This site's own repository. */
export const SOURCE_URL = `${GITHUB_URL}/MySite`;

/** A file, not a route: link it with a plain <a>. A Next <Link> would
    prefetch it as an RSC payload (cv.pdf.txt → 404). */
export const CV_PATH = '/cv.pdf';
