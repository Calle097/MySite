import { DICTS, type Lang } from '@/lib/i18n';
import { sectionId } from '@/lib/format';
import { SOURCE_URL } from '@/lib/site';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/SectionHeader';
import { PageLayout } from '@/components/fancy/PageLayout';

/**
 * Plain: the title and source link, then each section's list, the line
 * about how it was built at the end. The fancier version puts that line in
 * the column under the title and shows the lists as rows (data-part="fact").
 * One item differs between the versions (the JavaScript line): it carries
 * one text per version.
 */
export function StackPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const sections = dict.stack.sections.map((s, i) => ({ id: sectionId(DICTS.en.stack.sections[i].title), title: s.title }));

  const hero = (
    <PageHero
      title={dict.stack.title}
      blurb={
        <>
          {dict.stack.sourcePre}{' '}
          <a href={SOURCE_URL} className="underline underline-offset-4 transition-colors hover:text-brand-accent">
            {dict.stack.sourceLabel}
          </a>
          .
        </>
      }
      place={dict.stack.aiLine}
    />
  );

  return (
    <PageLayout lang={lang} hero={hero} sections={sections}>
      {dict.stack.sections.map((s, i) => (
        <section key={s.title} id={sections[i].id} data-section className="mt-14 sm:mt-16">
          <SectionHeader index={i + 1} title={s.title} />
          <ul className="gutter max-w-3xl space-y-2.5 pt-5 leading-relaxed">
            {s.items.map((item) => (
              <li
                key={typeof item === 'string' ? item : item.plain}
                data-entry
                data-part="fact"
                data-reveal="rise"
                className="flex gap-4"
              >
                <span aria-hidden className="text-brand-accent">
                  —
                </span>
                {typeof item === 'string' ? (
                  <span>{item}</span>
                ) : (
                  <>
                    <span className="only-plain">{item.plain}</span>
                    <span className="only-fancy">{item.fancier}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="only-plain gutter mt-16 label text-muted-foreground">{dict.stack.aiLine}</p>
    </PageLayout>
  );
}
