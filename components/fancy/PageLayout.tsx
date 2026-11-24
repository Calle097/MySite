import type { ReactNode } from 'react';
import { DICTS, LANGUAGES, type Lang } from '@/lib/i18n';
import { PAGES, isFile, pageHref } from '@/lib/pages';
import { EMAIL, GITHUB_URL, SOURCE_URL } from '@/lib/site';
import { FancyHeader } from './FancyHeader';
import { PhoneMenu } from './PhoneMenu';
import { SectionIndex } from './SectionIndex';
import type { IndexItem } from './SectionList';
import type { ChromeLabels } from './types';
import { VersionSwitch } from './VersionSwitch';

type Section = { id: string; title: string };

/**
 * Every page's frame. Plain leaves its wrappers unstyled, so a page reads as
 * its hero, then its sections; the fancier version makes them the split.
 *
 * `sections` are the page's own <section> ids, in order: the index lists
 * them and follows the scroll. A demo page brings its own `index` instead.
 */
export function PageLayout({
  lang,
  hero,
  sections = [],
  index,
  children,
}: {
  lang: Lang;
  hero: ReactNode;
  sections?: readonly Section[];
  index?: { label: string; items: readonly IndexItem[]; current: number };
  children: ReactNode;
}) {
  const dict = DICTS[lang];
  const items = index?.items ?? sections.map((s) => ({ href: `#${s.id}`, title: s.title }));
  const pages = PAGES.map((page) => ({ href: pageHref(lang, page), label: dict.nav[page], file: isFile(page) }));
  const homeHref = pageHref(lang, 'home');
  const labels: ChromeLabels = {
    home: dict.nav.home,
    menu: dict.nav.menu,
    close: dict.nav.close,
    pages: dict.nav.pages,
    language: dict.nav.language,
    languageName: LANGUAGES.find((l) => l.lang === lang)?.name ?? lang,
    version: dict.mode.version,
    plain: dict.mode.plain,
    fancier: dict.mode.fancier,
  };

  return (
    <div className="fc-page">
      <PhoneMenu
        lang={lang}
        homeHref={homeHref}
        pages={pages}
        index={{ label: index?.label ?? dict.nav.onThisPage, items, current: index?.current }}
        labels={labels}
      />
      <div className="fc-stage">
        <FancyHeader lang={lang} homeHref={homeHref} links={pages.filter((p) => p.href !== homeHref)} labels={labels} />
        <div id="content" className="fc-stage-mid">
          {hero}
        </div>
        {items.length > 0 && <SectionIndex label={index?.label ?? dict.nav.index} items={items} current={index?.current} />}
        <div className="fc-stage-foot only-fancy">
          <span className="fc-mono">{dict.mode.version}</span>
          <VersionSwitch labels={labels} />
        </div>
      </div>

      <div className="fc-flow">
        {children}
        <footer className="fc-foot only-fancy">
          <span className="fc-mono">{dict.footer.location}</span>
          <nav className="fc-foot-links" aria-label={dict.footer.elsewhere}>
            <a href={`mailto:${EMAIL}`}>{dict.footer.email}</a>
            <a href={GITHUB_URL}>{dict.footer.github}</a>
            <a href={SOURCE_URL}>{dict.footer.source}</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
