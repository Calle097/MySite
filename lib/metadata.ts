import type { Metadata, ResolvingMetadata } from 'next';
import type { DemoSlug } from './demos';
import { DICTS, LANGUAGES, type Lang } from './i18n';
import { pageHref, type Page } from './pages';
import { NAME, SITE_URL } from './site';

/** OpenGraph's locale for each language. */
const OG_LOCALE: Record<Lang, string> = { en: 'en', it: 'it_IT' };

const openGraph = (lang: Lang) => ({ type: 'website' as const, siteName: NAME, locale: OG_LOCALE[lang] });

/**
 * The root layouts': the name and role as the default title (a page's own
 * title goes in front, by the template), and the site's description.
 */
export function siteMetadata(lang: Lang): Metadata {
  const { role, description } = DICTS[lang];
  const title = `${NAME} — ${role}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${NAME}` },
    description,
    openGraph: { ...openGraph(lang), title, description },
  };
}

/**
 * A page of the site: its title (its menu name; home keeps the site's), its
 * description, its canonical URL and its address in every language, and
 * the same for link previews. A page's openGraph replaces the layout's
 * whole, so it carries over the card opengraph-image.tsx made.
 */
export async function pageMetadata(lang: Lang, page: Exclude<Page, 'cv'>, parent: ResolvingMetadata): Promise<Metadata> {
  const { images } = (await parent).openGraph ?? {};
  const dict = DICTS[lang];
  const name = page === 'home' ? undefined : dict.nav[page];
  const description = page === 'home' ? dict.description : dict.pageDescriptions[page];
  const url = pageHref(lang, page);
  return {
    ...(name && { title: name }),
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LANGUAGES.map((l) => [l.lang, pageHref(l.lang, page)])),
        'x-default': pageHref('en', page),
      },
    },
    openGraph: { ...openGraph(lang), url, title: name ? `${name} — ${NAME}` : `${NAME} — ${dict.role}`, description, images },
  };
}

/** A demo's own page: reached from the playground, kept out of search. */
export function demoMetadata(lang: Lang, slug: DemoSlug): Metadata {
  return { title: `${DICTS[lang].playground.items[slug].title} — demo`, robots: { index: false } };
}

/** The 404, kept out of search: Caddy serves it for any unmatched path. */
export function notFoundMetadata(lang: Lang): Metadata {
  return { title: DICTS[lang].notFound.pageTitle, robots: { index: false } };
}
