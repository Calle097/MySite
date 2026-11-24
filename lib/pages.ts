import type { DemoSlug } from './demos';
import { prefix, type Lang } from './i18n';
import { CV_PATH } from './site';

/**
 * The site's pages in menu order, then the CV. Every list of them (plain's
 * header, the fancier version's header and phone menu, the 404's "where to
 * go") is built from this one, so a new page is added here once.
 */
export const PAGES = ['home', 'about', 'playground', 'stack', 'cv'] as const;
export type Page = (typeof PAGES)[number];

/** The CV is a file: it needs a plain <a>, and a ↓ by its name. */
export const isFile = (page: Page) => page === 'cv';

export function pageHref(lang: Lang, page: Page) {
  if (page === 'cv') return CV_PATH;
  const p = prefix(lang);
  return page === 'home' ? `${p}/` : `${p}/${page}/`;
}

/** A demo's own page (the playground embeds it with #embed). */
export const demoHref = (lang: Lang, slug: DemoSlug) => `${prefix(lang)}/demos/${slug}/`;
