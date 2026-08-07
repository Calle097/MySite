export type Lang = 'en' | 'it';

/** URL prefix for a language ('' for en, '/it' for it). */
export const prefix = (lang: Lang) => (lang === 'it' ? '/it' : '');

export interface Dict {
  description: string;
  hero: {
    line1: string;
    line2: string;
    metaRow: string[];
    blurb: string;
  };
  work: {
    header: string;
    items: { title: string; where: string; text: string }[];
    fullHistory: string;
    cvLabel: string;
  };
  contact: { header: string };
  playground: {
    title: string;
    intro: string;
    demo: { title: string; caption: string; open: string; source: string };
  };
  stack: {
    title: string;
    sourcePre: string;
    sourceLabel: string;
    sections: { index: string; title: string; items: string[] }[];
    aiLine: string;
  };
  footer: { location: string; email: string; github: string; source: string };
}

export const DICTS: Record<Lang, Dict> = {
  en: {
    description:
      'Frontend developer & QA engineer. React, Next.js, TypeScript, Playwright. Based in Italy, interested in working in Japan.',
    hero: {
      line1: 'Frontend developer',
      line2: '& QA engineer',
      metaRow: ['Based in Italy', 'Interested in working in Japan', 'React · Next.js · TypeScript · Playwright'],
      blurb:
        'I build web apps with React, Next.js and TypeScript. I started in QA, so I also test what I build.',
    },
    work: {
      header: 'Work',
      items: [
        {
          title: 'Management system for a gym franchise',
          where: '2020 — 2021',
          text: 'React + TypeScript, in production with 500+ users. Handled end to end: requirements, development, Docker deployment.',
        },
        {
          title: 'Smart metering platform, energy sector',
          where: '2020 — 2023',
          text: 'QA engineer, later test manager. Test plans, Playwright automation, coordination with several development teams.',
        },
        {
          title: 'Freelance',
          where: '2024 — now',
          text: 'Web apps with Next.js and React, TypeScript backends, Python automation and bots.',
        },
      ],
      fullHistory: 'Full history —',
      cvLabel: 'CV (PDF)',
    },
    contact: { header: 'Contact' },
    playground: {
      title: 'Playground',
      intro:
        'Things I built and found too interesting — or too silly — to throw away. Some shipped, some never left the sketchbook.',
      demo: {
        title: 'Drive-in cards',
        caption:
          'SVG path morph driven by scroll: items arrive as vans, park as cards. Hover a parked card to wake it. Scroll inside the frame.',
        open: 'Open ↗',
        source: 'Source ↗',
      },
    },
    stack: {
      title: 'How this site is built',
      sourcePre: 'The source is',
      sourceLabel: 'on GitHub',
      sections: [
        {
          index: '01',
          title: 'Stack',
          items: [
            'Next.js 15, static export — served as plain files',
            'React 19, TypeScript, Tailwind CSS 4',
            'Framer Motion, playground only',
            'Onest + IBM Plex Mono, self-hosted — no third-party requests',
          ],
        },
        {
          index: '02',
          title: 'Hosting',
          items: [
            'A small VPS I manage myself, Caddy in Docker, Cloudflare DNS',
            'Built and deployed by GitHub Actions on every push',
          ],
        },
        {
          index: '03',
          title: 'Privacy',
          items: ['No analytics, cookies, or tracking', 'Works without JavaScript, except the playground'],
        },
      ],
      aiLine: 'Built with help from Claude Code, reviewed line by line',
    },
    footer: { location: 'Mattia Callegher — Italy', email: 'Email', github: 'GitHub', source: 'Source' },
  },
  it: {
    description:
      'Sviluppatore frontend & QA engineer. React, Next.js, TypeScript, Playwright. Vivo in Italia, interessato a lavorare in Giappone.',
    hero: {
      line1: 'Sviluppatore frontend',
      line2: '& QA engineer',
      metaRow: ['Vivo in Italia', 'Interessato a lavorare in Giappone', 'React · Next.js · TypeScript · Playwright'],
      blurb:
        'Costruisco web app con React, Next.js e TypeScript. Ho anche lavorato in QA, quindi testo anche quello che costruisco.',
    },
    work: {
      header: 'Esperienza',
      items: [
        {
          title: 'Gestionale per una catena di palestre',
          where: '2020 — 2021',
          text: 'React + TypeScript, in produzione con oltre 500 utenti. Seguito dall’inizio alla fine: requisiti, sviluppo, deploy con Docker.',
        },
        {
          title: 'Piattaforma di smart metering, settore energia',
          where: '2020 — 2023',
          text: 'QA engineer, poi test manager. Piani di test, automazione con Playwright, coordinamento con diversi team di sviluppo.',
        },
        {
          title: 'Freelance',
          where: '2024 — oggi',
          text: 'Web app con Next.js e React, backend in TypeScript, automazioni e bot in Python.',
        },
      ],
      fullHistory: 'Storia completa —',
      cvLabel: 'CV (PDF)',
    },
    contact: { header: 'Contatti' },
    playground: {
      title: 'Playground',
      intro:
        'Cose che ho costruito e che trovavo troppo interessanti — o troppo stupide — per buttarle via. Alcune sono andate in produzione, altre non sono mai uscite dal quaderno.',
      demo: {
        title: 'Drive-in cards',
        caption:
          'Morphing di path SVG guidato dallo scroll: gli elementi arrivano come furgoncini e parcheggiano diventando card. Passa il mouse su una card parcheggiata per svegliarla. Scrolla dentro il riquadro.',
        open: 'Apri ↗',
        source: 'Codice ↗',
      },
    },
    stack: {
      title: 'Come è fatto questo sito',
      sourcePre: 'Il sorgente è',
      sourceLabel: 'su GitHub',
      sections: [
        {
          index: '01',
          title: 'Stack',
          items: [
            'Next.js 15, export statico — servito come semplici file',
            'React 19, TypeScript, Tailwind CSS 4',
            'Framer Motion, solo nel playground',
            'Onest + IBM Plex Mono, self-hosted — nessuna richiesta a terze parti',
          ],
        },
        {
          index: '02',
          title: 'Hosting',
          items: [
            'Un piccolo VPS che gestisco io, Caddy in Docker, DNS su Cloudflare',
            'Build e deploy con GitHub Actions a ogni push',
          ],
        },
        {
          index: '03',
          title: 'Privacy',
          items: ['Niente analytics, cookie o tracciamento', 'Funziona anche senza JavaScript, tranne il playground'],
        },
      ],
      aiLine: 'Fatto con l’aiuto di Claude Code, riletto riga per riga',
    },
    footer: { location: 'Mattia Callegher — Italia', email: 'Email', github: 'GitHub', source: 'Sorgente' },
  },
};
