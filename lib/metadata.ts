import type { Metadata } from 'next';
import { DICTS, type Lang } from './i18n';
import { NAME, SITE_URL } from './site';

/** OpenGraph's locale for each language. */
const OG_LOCALE: Record<Lang, string> = { en: 'en', it: 'it_IT' };

/**
 * The root layouts' metadata, from the dictionaries: the name and role as
 * the default title (each page puts its own title in front, by the
 * template), the description, and the same for link previews.
 */
export function siteMetadata(lang: Lang): Metadata {
  const { role, description } = DICTS[lang];
  const title = `${NAME} — ${role}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${NAME}` },
    description,
    openGraph: { type: 'website', siteName: NAME, locale: OG_LOCALE[lang], title, description },
  };
}
