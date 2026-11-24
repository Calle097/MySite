import { DICTS, type Lang } from '@/lib/i18n';
import { sectionId } from '@/lib/lively/format';
import { SectionHeader } from '@/components/SectionHeader';
import { PageLayout } from '@/components/lively/PageLayout';

/**
 * Plain: the title and the text as one block. The fancier version gives
 * each part its own section under its title (lively only), so the page has
 * an index like the others.
 */
export function AboutPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const parts = dict.about.parts;
  const sections = parts.map((part, i) => ({ id: sectionId(DICTS.en.about.parts[i].title), title: part.title }));

  const hero = (
    <section data-part="hero" className="gutter rise pt-8 sm:pt-12">
      <h1 className="page-title font-semibold tracking-tight">{dict.about.title}</h1>
      <p data-part="place" className="only-lively lv-mono">
        {dict.hero.metaRow.slice(0, 2).join(' · ')}
      </p>
    </section>
  );

  return (
    <PageLayout lang={lang} hero={hero} sections={sections}>
      <div data-part="about-text" className="gutter rise mt-8 max-w-[58ch] space-y-5 leading-relaxed text-muted-foreground">
        {parts.map((part, i) => (
          <section key={part.title} id={sections[i].id} data-section>
            <SectionHeader index={i + 1} title={part.title} className="only-lively" />
            <p data-reveal="rise">{part.text}</p>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
