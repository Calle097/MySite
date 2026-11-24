import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { stagger } from '@/lib/motion';
import { pageHref } from '@/lib/pages';
import { DEMO_SLUGS } from '@/lib/demos';
import { twoDigits } from '@/lib/format';
import { CV_PATH, EMAIL, GITHUB_URL, NAME, SITE_URL } from '@/lib/site';
import { CopyEmail } from '@/components/CopyEmail';
import { ModeSwitch } from '@/components/ModeSwitch';
import { SectionHeader } from '@/components/SectionHeader';
import { SpiralDots } from '@/components/demos/SpiralDots';
import { PageLayout } from '@/components/fancy/PageLayout';

/** The page's facts for search engines (schema.org), from the dictionary. */
function structuredData(lang: Lang) {
  const dict = DICTS[lang];
  const home = `${SITE_URL}${prefix(lang)}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        // The same id in both languages: one person.
        '@id': `${SITE_URL}/#person`,
        name: NAME,
        url: home,
        jobTitle: `${dict.hero.line1} ${dict.hero.line2}`,
        description: dict.description,
        address: { '@type': 'PostalAddress', addressCountry: 'IT' },
        sameAs: [GITHUB_URL],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: home,
        name: NAME,
        inLanguage: lang,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };
}

/**
 * The home page. The fancier version restyles it through its hooks
 * (data-part, data-entry, data-reveal) and adds two sections of its own:
 * the playground teaser and About.
 */
export function HomePage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];
  const [place, wish] = dict.hero.metaRow;

  // In page order: the index lists these, and the ids are the anchors.
  const sections = [
    { id: 'work', title: dict.work.header },
    { id: 'projects', title: dict.projects.header },
    { id: 'playground', title: dict.playground.title },
    { id: 'about', title: dict.about.title },
    { id: 'contact', title: dict.contact.header },
  ];

  const hero = (
    <section data-part="hero" className="gutter rise pt-8 sm:pt-12">
      {/* One block per line (same layout as a <br>) so the fancier version can
          raise each line from behind its own edge. */}
      <h1 data-reveal="mask" className="hero-title font-semibold leading-[1.04] tracking-tight">
        <span data-line className="block">
          <span>{dict.hero.line1}</span>
        </span>
        <span data-line className="block">
          <span>
            {dict.hero.line2}
            <span data-part="dot" className="text-brand-accent">
              .
            </span>
          </span>
        </span>
      </h1>

      <div
        data-part="meta"
        data-reveal="rise"
        style={stagger(3)}
        className="only-plain mt-9 flex flex-wrap gap-x-10 gap-y-2 label text-muted-foreground"
      >
        {dict.hero.metaRow.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <p
        data-part="blurb"
        data-reveal="rise"
        style={stagger(4)}
        className="rise-late mt-10 max-w-[52ch] leading-relaxed sm:text-lg text-muted-foreground"
      >
        {dict.hero.blurb}
      </p>

      {/* Fancier: where, under the blurb (the meta row's first two facts). */}
      <p data-part="place" data-reveal="rise" style={stagger(5)} className="only-fancy fc-mono">
        {place} · {wish}
      </p>

      {/* Plain only: the fancier version has its switch in the column. */}
      <p className="needs-js only-plain label mt-8 text-muted-foreground">
        {dict.mode.plainNote}{' '}
        <ModeSwitch className="uppercase underline underline-offset-4 text-brand-accent transition-colors hover:text-foreground">
          {dict.mode.showFancier}
        </ModeSwitch>
      </p>
    </section>
  );

  return (
    <PageLayout lang={lang} hero={hero} sections={sections}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
      />

      <section id="work" data-section data-part="work" className="mt-20 sm:mt-28">
        <SectionHeader index={1} title={dict.work.header} />
        <ul>
          {dict.work.items.map((w, i) => (
            <li
              key={w.title}
              data-entry
              data-reveal="rise"
              style={stagger(i)}
              className="gutter group row-hover grid gap-x-10 gap-y-2 border-b py-7 sm:py-8 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.3fr)] border-secondary-darker"
            >
              <span data-part="when" className="label lg:pt-1.5 text-muted-foreground">
                {w.where}
              </span>
              <h3
                data-part="title"
                className="text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl"
              >
                {w.title}
              </h3>
              <p data-part="text" className="max-w-[55ch] leading-relaxed lg:pt-0.5 text-muted-foreground">
                {w.text}
              </p>
            </li>
          ))}
        </ul>
        <p data-part="aside" data-reveal="rise" className="gutter pt-5 label text-muted-foreground">
          <a href={CV_PATH} className="transition-colors hover:text-brand-accent">
            {dict.work.fullHistory} <span className="underline underline-offset-4">{dict.work.cvLabel}</span> ↓
          </a>
        </p>
      </section>

      <section id="projects" data-section data-part="projects" className="mt-20 sm:mt-28">
        <SectionHeader index={2} title={dict.projects.header} />
        <ul>
          {dict.projects.items.map((project, i) => (
            <li
              key={project.title}
              data-entry
              data-reveal="rise"
              style={stagger(i)}
              className="gutter group row-hover grid gap-x-10 gap-y-2 border-b py-7 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] border-secondary-darker"
            >
              <h3
                data-part="title"
                className="text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl"
              >
                {project.title}
              </h3>
              <div data-part="text" className="lg:pt-0.5">
                <p className="max-w-[60ch] leading-relaxed text-muted-foreground">{project.text}</p>
                {project.stack && (
                  <p data-part="stack" className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                    {project.stack}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Fancier only: two ways on, each a whole entry that links (its arrow
          line is the link, stretched over the entry). The playground, with
          the spiral beside it; */}
      <section id="playground" data-section data-part="playground" className="only-fancy">
        <SectionHeader index={3} title={dict.playground.title} />
        <div data-entry data-part="teaser" data-reveal="rise">
          <span data-part="text">
            <span className="fc-teaser-text">{dict.playground.intro}</span>
            <a href={pageHref(lang, 'playground')} className="fc-mono fc-teaser-link">
              {dict.playground.open} · {twoDigits(DEMO_SLUGS.length)} →
            </a>
          </span>
          <span data-part="spiral" aria-hidden>
            <SpiralDots totalDots={150} size={150} dotRadius={1.8} className="fc-teaser-spiral" />
          </span>
        </div>
      </section>

      {/* and the About page, in short. */}
      <section id="about" data-section data-part="about" className="only-fancy">
        <SectionHeader index={4} title={dict.about.title} />
        <div data-entry data-reveal="rise">
          {dict.about.parts.map((part, i) => (
            <p key={part.title} className={i === 0 ? 'fc-lead' : 'fc-para'}>
              {part.text}
            </p>
          ))}
          <a href={pageHref(lang, 'about')} className="fc-mono fc-teaser-link">
            {dict.about.open} →
          </a>
        </div>
      </section>

      <section id="contact" data-section data-part="contact" className="mt-20 sm:mt-28">
        {/* Third in plain, which has no playground or About section here. */}
        <SectionHeader index={3} title={dict.contact.header} />
        <div data-part="email" data-reveal="rise" className="gutter pt-8 sm:pt-10">
          <a
            href={`mailto:${EMAIL}`}
            className="contact-email group inline-flex items-baseline gap-3 font-semibold tracking-tight underline decoration-transparent underline-offset-8 transition-colors duration-300 hover:decoration-brand-accent"
          >
            {EMAIL}
            <span
              aria-hidden
              className="only-plain transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 text-brand-accent"
            >
              ↗
            </span>
          </a>
          <span className="fc-actions fc-mono only-fancy">
            <CopyEmail email={EMAIL} copy={dict.contact.copy} copied={dict.contact.copied} />
            <a href={`mailto:${EMAIL}`}>{dict.contact.write}</a>
            <a href={GITHUB_URL}>{dict.footer.github} ↗</a>
            <a href={CV_PATH}>{dict.nav.cv} ↓</a>
          </span>
        </div>
      </section>
    </PageLayout>
  );
}
