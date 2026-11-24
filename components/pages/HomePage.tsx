import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { revealOrder } from '@/lib/reveal';
import { EMAIL, SITE_URL } from '@/lib/site';
import { CopyEmail } from '@/components/CopyEmail';
import { ModeSwitch } from '@/components/ModeSwitch';
import { SectionHeader } from '@/components/SectionHeader';

/**
 * The same facts the page already states, in the form search engines read:
 * who the site is about, and that it is this person's site. Every value is
 * derived from the dictionary rather than retyped, so the two languages
 * cannot drift from the copy above them.
 */
function structuredData(lang: Lang) {
  const dict = DICTS[lang];
  const home = `${SITE_URL}${prefix(lang)}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        // Stable across both language trees — one person, described twice.
        '@id': `${SITE_URL}/#person`,
        name: 'Mattia Callegher',
        url: home,
        jobTitle: `${dict.hero.line1} ${dict.hero.line2}`,
        description: dict.description,
        address: { '@type': 'PostalAddress', addressCountry: 'IT' },
        sameAs: ['https://github.com/Calle097'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: home,
        name: 'Mattia Callegher',
        inLanguage: lang,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };
}

/**
 * Plain mode renders this as it always has. The data-* attributes are hooks
 * for lively mode only (app/lively.css): data-part names a piece of the
 * layout, data-reveal / revealOrder set up the scroll reveals
 * (lib/reveal.ts).
 */
export function HomePage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
      />

      <section data-part="hero" className="gutter rise pt-8 sm:pt-12">
        {/* One block per line (same layout as a <br>) so lively mode can
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
          style={revealOrder(3)}
          className="mt-9 flex flex-wrap gap-x-10 gap-y-2 label text-muted-foreground"
        >
          {dict.hero.metaRow.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <p
          data-part="blurb"
          data-reveal="rise"
          style={revealOrder(4)}
          className="rise-late mt-10 max-w-[52ch] leading-relaxed sm:text-lg text-muted-foreground"
        >
          {dict.hero.blurb}
        </p>

        {/* Plain only: lively mode has its switch in the header. */}
        <p className="needs-js only-plain label mt-8 text-muted-foreground">
          {dict.mode.plainNote}{' '}
          <ModeSwitch className="cursor-pointer uppercase underline underline-offset-4 text-brand-accent transition-colors hover:text-foreground">
            {dict.mode.showLively}
          </ModeSwitch>
        </p>
      </section>

      <section data-part="work" className="mt-20 sm:mt-28">
        <SectionHeader index={1} title={dict.work.header} />
        <ul>
          {dict.work.items.map((w, i) => (
            <li
              key={w.title}
              data-reveal="rise"
              style={revealOrder(i)}
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
          {dict.work.fullHistory}{' '}
          <a href="/cv.pdf" className="underline underline-offset-4 transition-colors hover:text-brand-accent">
            {dict.work.cvLabel}
          </a>
        </p>
      </section>

      <section data-part="projects" className="mt-20 sm:mt-28">
        <SectionHeader index={2} title={dict.projects.header} />
        <ul>
          {dict.projects.items.map((project, i) => (
            <li
              key={project.title}
              data-reveal="rise"
              style={revealOrder(i)}
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
                  <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">{project.stack}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section data-part="contact" className="mt-20 sm:mt-28">
        <SectionHeader index={3} title={dict.contact.header} />
        <div data-part="email" data-reveal="rise" className="gutter pt-8 sm:pt-10">
          <a
            href={`mailto:${EMAIL}`}
            className="contact-email group inline-flex items-baseline gap-3 font-semibold tracking-tight underline decoration-transparent underline-offset-8 transition-colors duration-300 hover:decoration-brand-accent"
          >
            {EMAIL}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 text-brand-accent"
            >
              ↗
            </span>
          </a>
          <span className="only-lively needs-js">
            <CopyEmail email={EMAIL} copy={dict.contact.copy} copied={dict.contact.copied} />
          </span>
        </div>
      </section>
    </div>
  );
}
