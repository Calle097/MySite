import { DICTS, prefix, type Lang } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import { SectionHeader } from '@/components/SectionHeader';

/**
 * The same facts the page already states, in the form search engines read:
 * who the site is about, and that it is this person's site. Every value is
 * derived from the dictionary rather than retyped, so the two languages
 * cannot drift from the copy above them.
 *
 * The email is deliberately absent. Cloudflare obfuscates the address in the
 * markup at the edge; repeating it here in plain text would hand it back to
 * the scrapers that obfuscation exists to stop.
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

export function HomePage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
      />
      <section className="gutter rise pt-8 sm:pt-12">
        <h1
          className="font-semibold leading-[1.04] tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}
        >
          {dict.hero.line1}
          <br />
          {dict.hero.line2}
          <span className="text-brand-accent">.</span>
        </h1>

        <div
          className="mt-9 flex flex-wrap gap-x-10 gap-y-2 label text-muted-foreground">
          {dict.hero.metaRow.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <p className="rise-late mt-10 max-w-[52ch] leading-relaxed sm:text-lg text-muted-foreground">
          {dict.hero.blurb}
        </p>
      </section>

      <section className="mt-20 sm:mt-28">
        <SectionHeader index={1} title={dict.work.header} />
        <ul>
          {dict.work.items.map((w) => (
            <li
              key={w.title}
              className="gutter group row-hover grid gap-x-10 gap-y-2 border-b py-7 sm:py-8 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.3fr)] border-secondary-darker">
              <span className="label lg:pt-1.5 text-muted-foreground">
                {w.where}
              </span>
              <h3 className="text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl">
                {w.title}
              </h3>
              <p className="max-w-[55ch] leading-relaxed lg:pt-0.5 text-muted-foreground">
                {w.text}
              </p>
            </li>
          ))}
        </ul>
        <p className="gutter pt-5 label text-muted-foreground">
          {dict.work.fullHistory}{' '}
          <a href="/cv.pdf" className="underline underline-offset-4 transition-colors hover:text-brand-accent">
            {dict.work.cvLabel}
          </a>
        </p>
      </section>

      <section className="mt-20 sm:mt-28">
        <SectionHeader index={2} title={dict.projects.header} />
        <ul>
          {dict.projects.items.map((project) => (
            <li
              key={project.title}
              className="gutter group row-hover grid gap-x-10 gap-y-2 border-b py-7 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] border-secondary-darker">
              <h3 className="text-xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-2xl">
                {project.title}
              </h3>
              <div className="lg:pt-0.5">
                <p className="max-w-[60ch] leading-relaxed text-muted-foreground">
                  {project.text}
                </p>
                {project.stack && (
                  <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                    {project.stack}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 sm:mt-28">
        <SectionHeader index={3} title={dict.contact.header} />
        <div className="gutter pt-8 sm:pt-10">
          <a
            href="mailto:callegher.mattia00@gmail.com"
            className="group inline-flex items-baseline gap-3 font-semibold tracking-tight underline decoration-transparent underline-offset-8 transition-colors duration-300 hover:decoration-brand-accent"
            style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2.5rem)', overflowWrap: 'anywhere' }}
          >
            callegher.mattia00@gmail.com
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 text-brand-accent">
              ↗
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
