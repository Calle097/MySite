import type { ReactNode } from 'react';
import { DICTS, LANGUAGES, prefix, type Lang } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';
import { LivelyHeader } from './LivelyHeader';
import { SectionIndex } from './SectionIndex';
import type { IndexItem } from './SectionList';
import { VersionSwitch } from './VersionSwitch';

export type Section = { id: string; title: string };

/**
 * Every page's frame. Plain mode doesn't style any of its wrappers, so a
 * page renders exactly as before: its hero, then its sections. Lively mode
 * (app/lively.css) turns them into the split: a column that holds still on
 * the left (header, the hero, the index, the version switch) and the
 * content on the right. The lively-only parts carry `only-lively`.
 *
 * `sections` are the page's own, in order, matching the ids of its
 * <section>s: the index lists them and follows the scroll. A page can bring
 * a different `index` instead (a demo page lists every demo, itself lit).
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
  const p = prefix(lang);
  const items = index?.items ?? sections.map((s) => ({ href: `#${s.id}`, title: s.title }));
  const languageName = LANGUAGES.find((l) => l.lang === lang)?.name ?? lang;

  return (
    <div className="lv-page">
      <div className="lv-stage">
        <LivelyHeader
          lang={lang}
          homeHref={`${p}/`}
          // "home" reads the same in Italian ("Torna alla home").
          homeLabel="Mattia Callegher, home"
          links={[
            { href: `${p}/about/`, label: dict.nav.about },
            { href: `${p}/playground/`, label: dict.nav.playground },
            { href: `${p}/stack/`, label: dict.nav.stack },
            { href: '/cv.pdf', label: dict.nav.cv, file: true },
          ]}
          labels={{
            pages: dict.nav.pages,
            menu: dict.nav.menu,
            close: dict.nav.close,
            language: dict.nav.language,
            languageName,
          }}
        />
        <div className="lv-stage-mid">{hero}</div>
        {items.length > 0 && (
          <SectionIndex
            label={index?.label ?? dict.nav.index}
            items={items}
            follow={!index}
            fixedCurrent={index?.current}
          />
        )}
        <div className="lv-stage-foot only-lively">
          <span className="lv-mono">{dict.mode.version}</span>
          <VersionSwitch label={dict.mode.version} plain={dict.mode.plain} lively={dict.mode.toggle} />
        </div>
      </div>

      <div className="lv-flow">
        {children}
        <footer className="lv-foot only-lively">
          <span className="lv-mono">{dict.footer.location}</span>
          <nav className="lv-foot-links" aria-label={dict.footer.elsewhere}>
            <a href={`mailto:${EMAIL}`}>{dict.footer.email}</a>
            <a href="https://github.com/Calle097">{dict.footer.github}</a>
            <a href="https://github.com/Calle097/MySite">{dict.footer.source}</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
