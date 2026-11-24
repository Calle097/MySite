/** A link to one of the site's pages (lib/pages.ts). */
export type PageLink = { href: string; label: string; /** A file, not a route: a plain <a>. */ file?: boolean };

/**
 * The words the column's header and the phone menu need, picked from the
 * dictionary once (PageLayout). Both are client components: handing them
 * the whole dictionary would ship every page's text to the browser.
 */
export type ChromeLabels = {
  home: string;
  menu: string;
  close: string;
  pages: string;
  language: string;
  /** The current language, named in itself ("English"). */
  languageName: string;
  version: string;
  plain: string;
  fancier: string;
};
